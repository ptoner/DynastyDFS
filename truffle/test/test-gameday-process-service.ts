import { GamedayProcessService } from '../../js/services/gameday/gameday-process-service'
import assert = require('assert')
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/util/file-service'

import moment = require('moment')
import { Boxscore, GamedayFullPlayer } from '../../js/dto/gameday/gameday-boxscore';

import { GamedayDownloadService } from '../../js/services/gameday/gameday-download-service';
import { HitterDayService } from '../../js/services/hitter-day-service';
import { PitcherDayService } from '../../js/services/pitcher-day-service';
import { PlayerService } from '../../js/services/player-service';

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('GamedayProcessService', async (accounts) => {

    let rootFolder = "/fbtest"
    let fileService: FileService = new FileService(ipfs)
    let gamedayDownloadService: GamedayDownloadService = new GamedayDownloadService(fileService, rootFolder)
    let hitterDayService: HitterDayService = new HitterDayService(ipfs, fileService, rootFolder)

    let pitcherDayService: PitcherDayService = new PitcherDayService(ipfs, fileService, rootFolder)
    let playerService: PlayerService = new PlayerService(ipfs,fileService, rootFolder)
    let gamedayProcessService: GamedayProcessService = new GamedayProcessService(gamedayDownloadService, playerService, hitterDayService, pitcherDayService)
    

    //@ts-ignore
    beforeEach('Setup', async () => {
    })



    //@ts-ignore
    it("Test insertNewPlayersForGame", async () => {
       
        //Arrange
        await gamedayDownloadService.downloadGameFiles(530173)
        let players: GamedayFullPlayer[] = await gamedayDownloadService.readPlayers(530173)


        //Act
        await gamedayProcessService.insertNewPlayersForGame(players)

        //Assert

        //Read the players for the game and m


    })




    //@ts-ignore
    it("Test gamedayProcessService", async () => {
       
        //Arrange
        await gamedayProcessService.createPlayerDaysForGame(530173, moment("2018-05-26").toDate())

        //Act
        let adamDuvall = await hitterDayService.read(594807, "2018-05-26")
        let jaredHughes = await pitcherDayService.read(453172, '2018-05-26')


        //Assert

        assert.deepEqual(adamDuvall.dayStats, {
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


        assert.deepEqual(jaredHughes.dayStats, {
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
