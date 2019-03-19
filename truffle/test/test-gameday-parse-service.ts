import { GamedayParseService } from '../../js/services/gameday-parse-service'
import assert = require('assert')
import { GamedayPlayers } from '../../js/dto/gameday/gameday-players'
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/file-service'

import moment = require('moment')
import { GamedayBoxScore, BattingAppearance, PitchingAppearance } from '../../js/dto/gameday/gameday-boxscore';
import { GamedayAtbats } from '../../js/dto/gameday/gameday-atbats';
import { GameSummary } from '../../js/dto/gameday/game-summary';

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('GamedayDownloadService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let gamedayParseService: GamedayParseService = new GamedayParseService(ipfs, fileService)
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test parseBoxScore", async () => {
       
        //Act
        let gamedayBoxScore: GamedayBoxScore = await gamedayParseService.parseBoxScore("/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1")

        assertGamedayBoxScore(gamedayBoxScore)


    })

    it("Test parseGameEvents", async () => {
       
        //Act
        let gamedayAtbats: GamedayAtbats = await gamedayParseService.parseGameAtbats("/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1")

        assertGamedayAtbats(gamedayAtbats)

    })

    it("Test parsePlayers", async () => {
       
        //Act
        let gamedayPlayers: GamedayPlayers = await gamedayParseService.parsePlayers("/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1")

        //Assert
        assert.equal(gamedayPlayers.playerList.length, 51)

    })


    it("Test parseGame", async () => {

        //Act
        let gameSummary: GameSummary = await gamedayParseService.parseGame("/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1")

        //Assert
        assertGamedayBoxScore(gameSummary.boxScore)
        assertGamedayAtbats(gameSummary.atBats)
        assert.equal(gameSummary.players.playerList.length, 51)


    })


    function assertGamedayBoxScore(gamedayBoxScore: GamedayBoxScore) {

        //Assert
        assert.equal(gamedayBoxScore.gameId, '2018/05/06/chnmlb-slnmlb-1')
        assert.equal(gamedayBoxScore.gamePk, '529913')
        assert.equal(gamedayBoxScore.date, 'May 6, 2018')
        assert.equal(gamedayBoxScore.status, 'F')
        assert.equal(gamedayBoxScore.venueName, 'Busch Stadium')
        assert.equal(gamedayBoxScore.awayId, 112)
        assert.equal(gamedayBoxScore.awayTeamCode, 'chn')
        assert.equal(gamedayBoxScore.awayFullName, 'Chicago Cubs')
        assert.equal(gamedayBoxScore.awayTeamRuns, 3)
        assert.equal(gamedayBoxScore.homeTeamRuns, 4)
        assert.equal(gamedayBoxScore.awayTeamHits, 9)
        assert.equal(gamedayBoxScore.homeTeamHits, 10)
        assert.equal(gamedayBoxScore.awayTeamErrors, 0)
        assert.equal(gamedayBoxScore.homeTeamErrors, 1)


        let ba: BattingAppearance = gamedayBoxScore.batting[0].appearances[0]

        assert.equal(ba.playerId, '664056')
        assert.equal(ba.playerName, 'Bader')
        assert.equal(ba.displayName, 'Harrison Bader')
        assert.equal(ba.position, 'CF')
        assert.equal(ba.battingOrder, 100)
        assert.equal(ba.atBats, 7)
        assert.equal(ba.avg, 0.261)
        assert.equal(ba.hits, 2)
        assert.equal(ba.bb, 0)
        assert.equal(ba.hbp, 0)
        assert.equal(ba.so, 3)
        assert.equal(ba.runs, 1)
        assert.equal(ba.rbi, 0)
        assert.equal(ba.lob, 1)
        assert.equal(ba.doubles, 0)
        assert.equal(ba.triples, 0)
        assert.equal(ba.hr, 0)
        assert.equal(ba.sacBunts, 0)
        assert.equal(ba.sacFlys, 0)
        assert.equal(ba.groundOuts, 1)
        assert.equal(ba.flyOuts, 1)
        assert.equal(ba.gidp, undefined)
        assert.equal(ba.sb, 0)
        assert.equal(ba.cs, 1)
        assert.equal(ba.po, 5)
        assert.equal(ba.assists, 0)
        assert.equal(ba.errors, 0)
        assert.equal(ba.fieldingPercentage, 1.000)
        assert.equal(ba.seasonHits, 12)
        assert.equal(ba.seasonWalks, 7)
        assert.equal(ba.seasonStrikeouts,13)
        assert.equal(ba.seasonRuns, 10)
        assert.equal(ba.seasonRbi, 2)
        assert.equal(ba.seasonHr, 1)

        let pa: PitchingAppearance = gamedayBoxScore.pitching[0].appearances[0]

        assert.equal(pa.playerId, '452657')
        assert.equal(pa.playerName, 'Lester')
        assert.equal(pa.displayName, 'Jon Lester')
        assert.equal(pa.position, 'P')
        assert.equal(pa.battersFace, 23)
        assert.equal(pa.numberOfPitches, 87)
        assert.equal(pa.strikes, 54)
        assert.equal(pa.hits, 6)
        assert.equal(pa.runs, 2)
        assert.equal(pa.hr, 1)
        assert.equal(pa.so, 4)
        assert.equal(pa.bb, 4)
        assert.equal(pa.outs, 16)
        assert.equal(pa.earnedRuns, 2)
        assert.equal(pa.won, false)
        assert.equal(pa.lost, false)
        assert.equal(pa.saved, false)
        assert.equal(pa.blewSave, false)
        assert.equal(pa.seasonEra, 2.82)
        assert.equal(pa.seasonWins, 2)
        assert.equal(pa.seasonLosses, 1)
        assert.equal(pa.seasonHolds, 0)
        assert.equal(pa.seasonSaves, 0)
        assert.equal(pa.seasonBlownSaves, 0)
        assert.equal(pa.seasonInningsPitched, 38.1)
        assert.equal(pa.seasonHits, 34)
        assert.equal(pa.seasonRuns, 16)
        assert.equal(pa.seasonWalks, 17)
        assert.equal(pa.seasonStrikeouts, 31)
        assert.equal(pa.seasonEarnedRuns, 12)
    }

    function assertGamedayAtbats(gamedayAtbats: GamedayAtbats) {

        let atBat  = gamedayAtbats.atBats[0]

        assert.equal(atBat.pitches.length, 2)
        assert.equal(atBat.batterId, 575929)
        assert.equal(atBat.pitcherId, 608379)
        assert.equal(atBat.startTimeUtc, '000833')
        assert.equal(atBat.num, 1)
        assert.equal(atBat.balls, 0)
        assert.equal(atBat.strikes, 1)
        assert.equal(atBat.outs, 0)
        assert.equal(atBat.eventName, 'Single')
        assert.equal(atBat.score, false)
        assert.equal(atBat.awayTeamRuns, 0)
        assert.equal(atBat.homeTeamRuns, 0)
        assert.equal(atBat.eventNum, 6)
        assert.equal(atBat.rbi, 0)
        assert.equal(atBat.inningNum, 1)
        assert.equal(atBat.inningTop, true)
    }




})
