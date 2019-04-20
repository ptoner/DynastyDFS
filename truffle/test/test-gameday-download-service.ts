import { GamedayDownloadService } from '../../js/services/gameday/gameday-download-service'
import assert = require('assert')
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/util/file-service'
import moment = require('moment')
import { Boxscore, GamedayFullPlayer } from '../../js/dto/gameday/gameday-boxscore';
import { Player } from '../../js/dto/player';

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
    beforeEach('Setup', async () => {
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

        //Assert
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530170/boxscore.json"), true)


    })
    
 //@ts-ignore
    it("Test downloadDate", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()

        //Act
        await downloadService.downloadDate(date)

        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530170/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530169/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530175/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530182/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530181/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530171/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530172/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530178/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530183/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530174/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530176/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530180/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530173/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530177/boxscore.json"), true)
        assert.equal(await fileService.fileExists("/fbtest/gameday/games/530179/boxscore.json"), true)


    })





    //@ts-ignore
    it("Test parseBoxScore", async () => {
       
        //Act
        await downloadService.downloadBoxScore(529913)


        let boxscore: Boxscore = await downloadService.readBoxScore(529913)

        assert.equal(boxscore.awayTeam.teamInfo.id, 112)
        assert.equal(boxscore.awayTeam.teamInfo.name, "Chicago Cubs")
        assert.equal(boxscore.awayTeam.teamInfo.link, "/api/v1/teams/112")
        assert.equal(boxscore.awayTeam.teamInfo.season, 2018)
        assert.equal(boxscore.awayTeam.teamInfo.venue.id, 17)
        assert.equal(boxscore.awayTeam.teamInfo.venue.name, "Wrigley Field")

        assert.equal(boxscore.awayTeam.players[0].person.id, 453344)
        assert.equal(boxscore.awayTeam.players[0].person.fullName, "Brandon Morrow")

        assert.equal(boxscore.awayTeam.players[0].stats.pitching.gamesPlayed, 1)
        assert.equal(boxscore.awayTeam.players[0].stats.pitching.numberOfPitches, 14)


        //TODO: Actually finish this

    })



    //@ts-ignore
    it("Test downloadPlayers", async () => {
       
        //Act
        await downloadService.downloadPlayers(529913)


        let players: GamedayFullPlayer[] = await downloadService.readPlayers(529913)

        assert.equal(players.length, 49)

    })





})
