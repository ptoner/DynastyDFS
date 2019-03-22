import { GamedayProcessService } from '../../js/services/gameday/gameday-process-service'
import assert = require('assert')
import { GamedayPlayers } from '../../js/dto/gameday/gameday-players'
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/util/file-service'

import moment = require('moment')
import { GamedayBoxScore, BattingAppearance, PitchingAppearance } from '../../js/dto/gameday/gameday-boxscore';
import { GamedayAtbats } from '../../js/dto/gameday/gameday-atbats';
import { GameSummary } from '../../js/dto/gameday/game-summary';
import { GamedayParseService } from '../../js/services/gameday/gameday-parse-service';
import { GamedayDownloadService } from '../../js/services/gameday/gameday-download-service';
import { HitterDayService } from '../../js/services/hitter-day-service';
import { PitcherDayService } from '../../js/services/pitcher-day-service';
import { PlayerService } from '../../js/services/player-service';
import { HitterSeasonService } from '../../js/services/hitter-season-service';

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
    let gamedayParseService: GamedayParseService = new GamedayParseService(ipfs, fileService, rootFolder)
    let gamedayDownloadService: GamedayDownloadService = new GamedayDownloadService(fileService, rootFolder)
    let hitterDayService: HitterDayService = new HitterDayService(ipfs, fileService, rootFolder)
    let hitterSeasonService: HitterSeasonService = new HitterSeasonService(ipfs, fileService, rootFolder)

    let pitcherDayService: PitcherDayService = new PitcherDayService(ipfs, fileService, rootFolder)
    let playerService: PlayerService = new PlayerService(ipfs, rootFolder)
    let gamedayProcessService: GamedayProcessService = new GamedayProcessService(gamedayParseService, gamedayDownloadService, playerService, hitterDayService, pitcherDayService, hitterSeasonService)
    
    //@ts-ignore 
    before('Setup', async () => {
        await playerService.load()
    })

    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test gamedayProcessService", async () => {
       
        //Arrange
        // await gamedayDownloadService.downloadDate(moment("2018-05-26").toDate())

        //Act
        await gamedayProcessService.createPlayerDaysForDate(moment("2018-05-26").toDate())

        //Assert

        let devinMesoraco = await hitterDayService.read(519023, "2018-05-26")

        assert.equal(devinMesoraco.hits, 2)
        assert.equal(devinMesoraco.runsScored, 0)
        assert.equal(devinMesoraco.singles, 2)
        assert.equal(devinMesoraco.doubles, 0)
        assert.equal(devinMesoraco.triples, 0)
        assert.equal(devinMesoraco.homeRuns, 0)
        assert.equal(devinMesoraco.rbi, 1)
        assert.equal(devinMesoraco.bb, 0)
        assert.equal(devinMesoraco.ibb, 0)
        assert.equal(devinMesoraco.k, 2)
        assert.equal(devinMesoraco.hbp, 0)
        assert.equal(devinMesoraco.sb, 0)
        assert.equal(devinMesoraco.cs,0)
        assert.equal(devinMesoraco.player.firstName, 'Devin')

        let artieLweicki = await pitcherDayService.read(592499, '2018-05-26')

        assert.equal(artieLweicki.battersFace, 13)
        assert.equal(artieLweicki.numberOfPitches, 46)
        assert.equal(artieLweicki.strikes, 32)
        assert.equal(artieLweicki.hits, 4)
        assert.equal(artieLweicki.runs, 1)
        assert.equal(artieLweicki.hr, 0)
        assert.equal(artieLweicki.so, 3)
        assert.equal(artieLweicki.bb, 0)
        assert.equal(artieLweicki.outs, 9)
        assert.equal(artieLweicki.earnedRuns, 1)
        assert.equal(artieLweicki.won, false)
        assert.equal(artieLweicki.lost, false)
        assert.equal(artieLweicki.saved, false)
        assert.equal(artieLweicki.blewSave, false)



    })






})
