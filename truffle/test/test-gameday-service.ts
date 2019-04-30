import { GamedayService } from '../../js/services/gameday/gameday-service'
import assert = require('assert')
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/util/file-service'
import moment = require('moment')
import { Boxscore, GamedayFullPlayer } from '../../js/dto/gameday/gameday-boxscore';
import { Player } from '../../js/dto/player';
import { PlayerDayService } from '../../js/services/player-day-service';
import { PlayerService } from '../../js/services/player-service';
import { TranslateService } from '../../js/services/util/translate-service';
import { PlayerBoxscoreMapService } from '../../js/services/gameday/playerboxscoremap-service';
import { PlayerBoxscoreMap } from '../../js/dto/gameday/player-boxscore-map';


const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })



//@ts-ignore
contract('GamedayService', async (accounts) => {

    let gamedayService: GamedayService
    let playerDayService: PlayerDayService
    let playerService: PlayerService 
    let mapService: PlayerBoxscoreMapService
    let translateService: TranslateService
    
    //@ts-ignore
    before('Main setup', async () => {

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        const scoreboardDb = await orbitdb.docs('test-scoreboard', { indexBy: 'id' })
        const boxscoreDb = await orbitdb.docs('test-boxscore', { indexBy: 'id' })
        const playerDb = await orbitdb.docs('test-player', { indexBy: 'id' })
        const playerDayDb = await orbitdb.docs('test-player-day', { indexBy: 'id' })
        const playerBoxscoreMapDb = await orbitdb.docs('test-playerboxscoremap', { indexBy: 'id' })
        translateService = new TranslateService()

        mapService = new PlayerBoxscoreMapService(playerBoxscoreMapDb, translateService)

        gamedayService = new GamedayService(scoreboardDb, boxscoreDb, mapService, translateService)

    })    

    //@ts-ignore
    it("Test downloadMiniScoreboard & readMiniScoreboard", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()
       
        //Act
        await gamedayService.downloadSchedule(date)

        //Assert
        let games = await gamedayService.readSchedule(date)

        assert.equal(games.length, 15)

    })

    //@ts-ignore
    it("Test downloadBoxScore", async () => {


        //Act
        await gamedayService.downloadBoxScore(530170)


        let boxscore: Boxscore = await gamedayService.readBoxScore(530170)

        //Assert
        assert.equal(boxscore != undefined, true)


    })
    
    //@ts-ignore
    it("Test downloadDate", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()

        //Act
        await gamedayService.downloadDate(date)

        let boxscore1: Boxscore = await gamedayService.readBoxScore(530170)
        let boxscore2: Boxscore = await gamedayService.readBoxScore(530169)
        let boxscore3: Boxscore = await gamedayService.readBoxScore(530175)
        let boxscore4: Boxscore = await gamedayService.readBoxScore(530182)
        let boxscore5: Boxscore = await gamedayService.readBoxScore(530181)
        let boxscore6: Boxscore = await gamedayService.readBoxScore(530171)
        let boxscore7: Boxscore = await gamedayService.readBoxScore(530172)
        let boxscore8: Boxscore = await gamedayService.readBoxScore(530178)
        let boxscore9: Boxscore = await gamedayService.readBoxScore(530183)
        let boxscore10: Boxscore = await gamedayService.readBoxScore(530174)
        let boxscore11: Boxscore = await gamedayService.readBoxScore(530176)
        let boxscore12: Boxscore = await gamedayService.readBoxScore(530180)
        let boxscore13: Boxscore = await gamedayService.readBoxScore(530170)
        let boxscore14: Boxscore = await gamedayService.readBoxScore(530173)
        let boxscore15: Boxscore = await gamedayService.readBoxScore(530177)
        let boxscore16: Boxscore = await gamedayService.readBoxScore(530179)


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


        let map: PlayerBoxscoreMap = await mapService.read(date)
        assert.equal(Object.keys(map.playerBoxscore).length, 746)

    })

    //@ts-ignore
    it("Test parseBoxScore", async () => {
       
        //Act
        await gamedayService.downloadBoxScore(529913)


        let boxscore: Boxscore = await gamedayService.readBoxScore(529913)

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
    // it("Test downloadPlayers", async () => {
       
    //     //Act
    //     await downloadService.downloadBoxScore(529913)
        // await downloadService.downloadPlayers(529913)


    //     let boxscore:Boxscore = await downloadService.readBoxScore(529913)



    //     assert.equal(boxscore.fullPlayers.length, 49)

    // })


})
