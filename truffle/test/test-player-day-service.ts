import { PlayerDayService } from '../../js/services/player-day-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/util/file-service';
import { PlayerDay } from '../../js/dto/player-day';
import { PlayerService } from '../../js/services/player-service';
import moment = require('moment');
import { GamedayService } from '../../js/services/gameday-service';
import { Boxscore, GamedayPlayer, Person } from '../../js/dto/gameday/gameday-boxscore';
import { TranslateService } from '../../js/services/util/translate-service';
import { PlayerBoxscoreMapService } from '../../js/services/playerboxscoremap-service';
import { read } from 'fs';
const TableStore = require('orbit-db-tablestore')
import { PlayerSchema, PlayerBoxscoreMapSchema, BoxscoreSchema, ScoreboardSchema } from '../../js/schemas'

//@ts-ignore
PlayerSchema.create = true
//@ts-ignore
PlayerBoxscoreMapSchema.create = true
//@ts-ignore
BoxscoreSchema.create = true
//@ts-ignore
ScoreboardSchema.create = true


const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PlayerDayService', async (accounts) => {

    let gamedayService: GamedayService
    let playerDayService: PlayerDayService
    let playerService: PlayerService 
    let translateService: TranslateService
    let mapService: PlayerBoxscoreMapService

    
    //@ts-ignore
    before('Main setup', async () => {

            //@ts-ignore
            PlayerSchema.create = true
            //@ts-ignore
            PlayerBoxscoreMapSchema.create = true
            //@ts-ignore
            BoxscoreSchema.create = true
            //@ts-ignore
            ScoreboardSchema.create = true

        if (!OrbitDB.isValidType(TableStore.type)) {
            OrbitDB.addDatabaseType(TableStore.type, TableStore)
        }


        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        let scoreboardDb = await orbitdb.open("test-scoreboard", {create: true, type: 'table'})
        await scoreboardDb.createIndexes(ScoreboardSchema.indexes)
    
        let boxscoreDb = await orbitdb.open("test-boxscore", {create: true, type: 'table'})
        await boxscoreDb.createIndexes(BoxscoreSchema.indexes)
    
        let playerDb = await orbitdb.open("test-player", {create: true, type: 'table'})
        await playerDb.createIndexes(PlayerSchema.indexes)
    
        let playerBoxscoreMapDb = await orbitdb.open("test-playerboxscoremap", {create: true, type: 'table'})
        await playerBoxscoreMapDb.createIndexes(PlayerBoxscoreMapSchema.indexes)


        translateService = new TranslateService()
        playerService = new PlayerService(playerDb, translateService)
        mapService = new PlayerBoxscoreMapService(playerBoxscoreMapDb, translateService)

        gamedayService = new GamedayService(scoreboardDb, boxscoreDb, mapService,playerService, translateService)
        playerDayService = new PlayerDayService( mapService, gamedayService, translateService)


    })
    


    //@ts-ignore
    it("Test read", async () => {

        //Arrange
        await gamedayService.downloadDate(moment("2018-05-26").toDate())
        
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
    // it("Test listByDate", async () => {

    //     //Arrange
    //     // let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-07-06")
    //     // let playerDay2 = createTestPlayerDay(createTestPlayer2(), "2018-07-06")
    //     // let playerDay3 = createTestPlayerDay(createTestPlayer3(), "2018-07-07")
    //     // let playerDay4 = createTestPlayerDay(createTestPlayer4(), "2018-07-08")

    //     // await playerDayService.save(playerDay1)
    //     // await playerDayService.save(playerDay2)
    //     // await playerDayService.save(playerDay3)
    //     // await playerDayService.save(playerDay4)

        
    //     //Act
    //     let list1: PlayerDay[] = await playerDayService.listByDate(moment("2018-07-06").toDate())
    //     let list2: PlayerDay[] = await playerDayService.listByDate(moment("2018-07-07").toDate())
    //     let list3: PlayerDay[] = await playerDayService.listByDate(moment("2018-07-08").toDate())


    //     //Assert

    //     //Check the first day
    //     assert.equal(list1[0].player.id, 1)
    //     assert.equal(list1[0].date, "2018-07-06")

    //     assert.equal(list1[1].player.id, 2)
    //     assert.equal(list1[1].date, "2018-07-06")


    //     //Check the second day
    //     assert.equal(list2[0].player.id, 3)
    //     assert.equal(list2[0].date, "2018-07-07")


    //     //Check the third day
    //     assert.equal(list3[0].player.id, 4)
    //     assert.equal(list3[0].date, "2018-07-08")



    // })


    // //@ts-ignore
    // it("Test listByPlayer", async () => {

    //     //Arrange
    //     let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-08-05")
    //     let playerDay2 = createTestPlayerDay(createTestPlayer(), "2018-08-06")
    //     let playerDay3 = createTestPlayerDay(createTestPlayer(), "2018-08-07")
    //     let playerDay4 = createTestPlayerDay(createTestPlayer2(), "2018-08-08")

    //     await playerDayService.save(playerDay1)
    //     await playerDayService.save(playerDay2)
    //     await playerDayService.save(playerDay3)
    //     await playerDayService.save(playerDay4)

        
    //     //Act
    //     let list1: PlayerDay[] = await playerDayService.listByPlayer(playerDay1.player.id)
    //     let list2: PlayerDay[] = await playerDayService.listByPlayer(playerDay4.player.id)


    //     //Assert
    //     assert.equal(list1.length, 3)

    //     for (let playerDay of list1) {
    //         assert.equal(playerDay.player.id, playerDay1.player.id)
    //     }

    //     assert.equal(list2.length, 1)

    //     assert.equal(list2[0].player.id, playerDay4.player.id)



    // })


    //@ts-ignore
    it("Test read", async () => {
        
        //Arrange

        await gamedayService.downloadDate(moment("2018-05-26").toDate())



        //Act
        let adamDuvall = await playerDayService.read(594807, moment("2018-05-26").toDate())
        let jaredHughes = await playerDayService.read(453172, moment("2018-05-26").toDate())


        //Assert

        assert.deepEqual(adamDuvall.player.stats.batting, {
            gamesPlayed: 1,
            flyOuts: 2,
            groundOuts: 1,
            runs: 0,
            doubles: 0,
            triples: 0,
            homeRuns: 0,
            strikeOuts: 1,
            baseOnBalls: 0,
            intentionalWalks: 0,
            hits: 0,
            hitByPitch: 0,
            atBats: 4,
            caughtStealing: 0,
            stolenBases: 0,
            groundIntoDoublePlay: 0,
            groundIntoTriplePlay: 0,
            totalBases: 0,
            rbi: 0,
            leftOnBase: 4,
            sacBunts: 0,
            sacFlies: 0,
            catchersInterference: 0,
            pickoffs: 0
        })


        assert.deepEqual(jaredHughes.player.stats.pitching, {
            gamesPlayed: 1,
            gamesStarted: 0,
            groundOuts: 1,
            runs: 0,
            doubles: 1,
            triples: 0,
            homeRuns: 0,
            strikeOuts: 0,
            baseOnBalls: 1,
            intentionalWalks: 0,
            hits: 2,
            atBats: 4,
            caughtStealing: 0,
            stolenBases: 0,
            numberOfPitches: 11,
            inningsPitched: "1.0",
            wins: 0,
            losses : 0,
            saves : 1,
            saveOpportunities : 1,
            holds : 0,
            blownSaves : 0,
            earnedRuns : 0,
            battersFaced : 5,
            outs : 3,
            gamesPitched : 1,
            completeGames : 0,
            shutouts : 0,
            pitchesThrown : 11,
            balls : 5,
            strikes : 6,
            hitBatsmen : 0,
            wildPitches : 0,
            pickoffs : 0,
            airOuts : 1,
            rbi : 0,
            gamesFinished : 1,
            inheritedRunners : 0,
            inheritedRunnersScored : 0,
            catchersInterference : 0,
            sacBunts : 0,
            sacFlies : 0,
            note: "(S, 3)"
        })



    })



})







function createTestPlayer() {
    let player: GamedayPlayer = new GamedayPlayer()
    player.person = new Person()

    player.person.id = 1
    player.person.fullName = "Andrew McCutchen"
    return player
}

function createTestPlayer2() {
    let player: GamedayPlayer = new GamedayPlayer()
    player.person = new Person()
    player.person.id = 2
    player.person.fullName = "Pedro Alvarez"
    return player
}

function createTestPlayer3() {
    let player: GamedayPlayer = new GamedayPlayer()
    player.person = new Person()
    player.person.id = 3
    player.person.fullName = "Jordy Mercer"
    return player
}

function createTestPlayer4() {
    let player: GamedayPlayer = new GamedayPlayer()
    player.person = new Person()
    player.person.id = 4
    player.person.fullName = "Gerrit Cole"
    return player
}



function createTestPlayerDay(player: GamedayPlayer, date: string) {

    let playerDay: PlayerDay = new PlayerDay()
    playerDay.player = player 
    playerDay.date = date
    
    return playerDay
}
