import { GamedayDownloadService } from '../../js/services/gameday/gameday-download-service'
import assert = require('assert')
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/util/file-service'
import moment = require('moment')
import { Boxscore, GamedayFullPlayer } from '../../js/dto/gameday/gameday-boxscore';
import { Player } from '../../js/dto/player';


const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })



//@ts-ignore
contract('GamedayDownloadService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)

    let downloadService: GamedayDownloadService = new GamedayDownloadService(fileService, "/fbtest")
    
    //@ts-ignore
    before('Main setup', async () => {

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        const scoreboardDb = await orbitdb.docs('test-scoreboard', { indexBy: 'id' })
        const boxscoreDb = await orbitdb.docs('test-boxscore', { indexBy: 'id' })

        downloadService = new GamedayDownloadService(scoreboardDb, boxscoreDb)

    })    

    //@ts-ignore
    it("Test downloadMiniScoreboard & readMiniScoreboard", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()
       
        //Act
        await downloadService.downloadSchedule(date)

        //Assert
        let games = await downloadService.readSchedule(date)

        assert.equal(games.length, 15)

    })

    //@ts-ignore
    it("Test downloadGameFiles", async () => {


        //Act
        await downloadService.downloadGameFiles(530170)


        let boxscore: Boxscore = await downloadService.readBoxScore(530170)

        //Assert
        assert.equal(boxscore != undefined, true)


    })
    
    //@ts-ignore
    it("Test downloadDate", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()

        //Act
        await downloadService.downloadDate(date)

        let boxscore1: Boxscore = await downloadService.readBoxScore(530170)
        let boxscore2: Boxscore = await downloadService.readBoxScore(530169)
        let boxscore3: Boxscore = await downloadService.readBoxScore(530175)
        let boxscore4: Boxscore = await downloadService.readBoxScore(530182)
        let boxscore5: Boxscore = await downloadService.readBoxScore(530181)
        let boxscore6: Boxscore = await downloadService.readBoxScore(530171)
        let boxscore7: Boxscore = await downloadService.readBoxScore(530172)
        let boxscore8: Boxscore = await downloadService.readBoxScore(530178)
        let boxscore9: Boxscore = await downloadService.readBoxScore(530183)
        let boxscore10: Boxscore = await downloadService.readBoxScore(530174)
        let boxscore11: Boxscore = await downloadService.readBoxScore(530176)
        let boxscore12: Boxscore = await downloadService.readBoxScore(530180)
        let boxscore13: Boxscore = await downloadService.readBoxScore(530170)
        let boxscore14: Boxscore = await downloadService.readBoxScore(530173)
        let boxscore15: Boxscore = await downloadService.readBoxScore(530177)
        let boxscore16: Boxscore = await downloadService.readBoxScore(530179)


        assert.equal(boxscore1 != undefined, true)
        assert.equal(boxscore2 != undefined, true)
        assert.equal(boxscore3 != undefined, true)
        assert.equal(boxscore4 != undefined, true)
        assert.equal(boxscore5 != undefined, true)
        assert.equal(boxscore6 != undefined, true)
        assert.equal(boxscore7 != undefined, true)
        assert.equal(boxscore8 != undefined, true)
        assert.equal(boxscore9 != undefined, true)
        assert.equal(boxscore10 != undefined, true)
        assert.equal(boxscore11 != undefined, true)
        assert.equal(boxscore12 != undefined, true)
        assert.equal(boxscore13 != undefined, true)
        assert.equal(boxscore14 != undefined, true)
        assert.equal(boxscore15 != undefined, true)
        assert.equal(boxscore16 != undefined, true)





    })

    //@ts-ignore
    it("Test parseBoxScore", async () => {
       
        //Act
        await downloadService.downloadBoxScore(529913)


        let boxscore: Boxscore = await downloadService.readBoxScore(529913)

        assert.equal(boxscore.teams.away.teamInfo.id, 112)
        assert.equal(boxscore.teams.away.teamInfo.name, "Chicago Cubs")
        assert.equal(boxscore.teams.away.teamInfo.link, "/api/v1/teams/112")
        assert.equal(boxscore.teams.away.teamInfo.season, 2018)
        assert.equal(boxscore.teams.away.teamInfo.venue.id, 17)
        assert.equal(boxscore.teams.away.teamInfo.venue.name, "Wrigley Field")

        assert.equal(boxscore.teams.away.players[0].person.id, 453344)
        assert.equal(boxscore.teams.away.players[0].person.fullName, "Brandon Morrow")

        assert.equal(boxscore.teams.away.players[0].stats.pitching.gamesPlayed, 1)
        assert.equal(boxscore.teams.away.players[0].stats.pitching.numberOfPitches, 14)


        //TODO: Actually finish this

    })

    //@ts-ignore
    it("Test downloadPlayers", async () => {
       
        //Act
        await downloadService.downloadBoxScore(529913)
        await downloadService.downloadPlayers(529913)


        let boxscore:Boxscore = await downloadService.readBoxScore(529913)



        assert.equal(boxscore.fullPlayers.length, 49)

    })


})
