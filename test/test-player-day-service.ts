
import assert = require('assert')
const OrbitDB = require('orbit-db')

import { getIPFS } from './ipfs'
import { Global } from '../src/global'
import { SchemaService } from '../src/services/util/schema-service'
import { TranslateService } from '../src/services/util/translate-service';
import { PlayerDayService } from '../src/services/player-day-service';
import { PlayerBoxscoreMapService } from '../src/services/playerboxscoremap-service';
import { PlayerService } from '../src/services/player-service';
import { GamedayService } from '../src/services/gameday-service';
import moment = require('moment')
import { PlayerDay } from '../src/dto/player-day';



//@ts-ignore
describe('PlayerDayService', async (accounts) => {

    let playerDayService: PlayerDayService


    let mainStore
    let ipfs 
    let address
    
    //@ts-ignore
    before('Main setup', async () => {
        ipfs = await getIPFS()

        const orbitdb = await OrbitDB.createInstance(ipfs, {
            directory: "./test/orbitdb/" + Math.random().toString()
        })

        address = Math.random().toString()

        Global.ipfs = ipfs 
        Global.orbitDb = orbitdb
        Global.schemaService = new SchemaService()

        Global.translateService = new TranslateService()
        Global.playerBoxscoreMapService  = new PlayerBoxscoreMapService(Global.translateService, Global.schemaService)
        Global.playerService = new PlayerService(Global.translateService, Global.schemaService)

        Global.gamedayService = new GamedayService(Global.playerBoxscoreMapService, Global.playerService, Global.translateService, Global.schemaService)
        playerDayService = new PlayerDayService( Global.playerBoxscoreMapService, Global.gamedayService, Global.translateService)

        
        mainStore = await Global.schemaService.getMainStoreByWalletAddress(address)
        await mainStore.load()

        await Global.schemaService.generateSchema(Global.orbitDb, Global.orbitAccessControl, mainStore, address)

        await Global.playerBoxscoreMapService.loadStoreForWallet(address.toString())
        await Global.playerService.loadStoreForWallet(address.toString())
        await Global.gamedayService.loadStoreForWallet(address.toString())

    })
    


    //@ts-ignore
    it("Test read", async () => {

        //Arrange
        await Global.gamedayService.downloadDate(moment("2018-05-26").toDate())
        
        //Act
        let readPlayer1: PlayerDay = await playerDayService.read(112526, moment("2018-05-26").toDate())
        let readPlayer2: PlayerDay = await playerDayService.read(282332, moment("2018-05-26").toDate())

        //Assert

        assert.equal(readPlayer1.date, "2018-05-26")
        assert.equal(readPlayer1.player.id, 112526)
        assert.equal(readPlayer1.player.stats.pitching != undefined, true)

        assert.equal(readPlayer2.date, "2018-05-26")
        assert.equal(readPlayer2.player.id, 282332)
        assert.equal(readPlayer2.player.stats.pitching != undefined, true)


        //Get it by player/date
        // assert.equal(readPlayer.date, playerDay.date)
        // assert.equal(readPlayer.player.id, player.id)

        //Check the list for this player
        // let playerList: PlayerDay[] = await playerDayService.listByPlayer(player.id)



        // assert.equal(playerList[0].date, playerDay.date)
        // assert.equal(playerList[0].player.id, player.id)


        // //Check the list for this date
        // let dateList: PlayerDay[] = await playerDayService.listByDate(moment(playerDay.date).toDate())
        // assert.equal(dateList[0].date, playerDay.date)
        // assert.equal(dateList[0].player.id, player.id)


    })


    //@ts-ignore
    it("Test read", async () => {
        
        //Arrange

        await Global.gamedayService.downloadDate(moment("2018-05-26").toDate())



        //Act
        let adamDuvall = await playerDayService.read(594807, moment("2018-05-26").toDate())
        let jaredHughes = await playerDayService.read(453172, moment("2018-05-26").toDate())


        //Assert

        // assert.deepEqual(adamDuvall.player.stats.batting, {
        //     gamesPlayed: 1,
        //     flyOuts: 2,
        //     groundOuts: 1,
        //     runs: 0,
        //     doubles: 0,
        //     triples: 0,
        //     homeRuns: 0,
        //     strikeOuts: 1,
        //     baseOnBalls: 0,
        //     intentionalWalks: 0,
        //     hits: 0,
        //     hitByPitch: 0,
        //     atBats: 4,
        //     caughtStealing: 0,
        //     stolenBases: 0,
        //     groundIntoDoublePlay: 0,
        //     groundIntoTriplePlay: 0,
        //     totalBases: 0,
        //     rbi: 0,
        //     leftOnBase: 4,
        //     sacBunts: 0,
        //     sacFlies: 0,
        //     catchersInterference: 0,
        //     pickoffs: 0
        // })


        // assert.deepEqual(jaredHughes.player.stats.pitching, {
        //     gamesPlayed: 1,
        //     gamesStarted: 0,
        //     groundOuts: 1,
        //     runs: 0,
        //     doubles: 1,
        //     triples: 0,
        //     homeRuns: 0,
        //     strikeOuts: 0,
        //     baseOnBalls: 1,
        //     intentionalWalks: 0,
        //     hits: 2,
        //     atBats: 4,
        //     caughtStealing: 0,
        //     stolenBases: 0,
        //     numberOfPitches: 11,
        //     inningsPitched: "1.0",
        //     wins: 0,
        //     losses : 0,
        //     saves : 1,
        //     saveOpportunities : 1,
        //     holds : 0,
        //     blownSaves : 0,
        //     earnedRuns : 0,
        //     battersFaced : 5,
        //     outs : 3,
        //     gamesPitched : 1,
        //     completeGames : 0,
        //     shutouts : 0,
        //     pitchesThrown : 11,
        //     balls : 5,
        //     strikes : 6,
        //     hitBatsmen : 0,
        //     wildPitches : 0,
        //     pickoffs : 0,
        //     airOuts : 1,
        //     rbi : 0,
        //     gamesFinished : 1,
        //     inheritedRunners : 0,
        //     inheritedRunnersScored : 0,
        //     catchersInterference : 0,
        //     sacBunts : 0,
        //     sacFlies : 0,
        //     note: "(S, 3)"
        // })



    })



})


