import { GamedayProcessService } from '../../js/services/gameday-process-service'
import assert = require('assert')
import { GamedayPlayers } from '../../js/dto/gameday/gameday-players'
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/file-service'

import moment = require('moment')
import { GamedayBoxScore, BattingAppearance, PitchingAppearance } from '../../js/dto/gameday/gameday-boxscore';
import { GamedayAtbats } from '../../js/dto/gameday/gameday-atbats';
import { GameSummary } from '../../js/dto/gameday/game-summary';
import { GamedayParseService } from '../../js/services/gameday-parse-service';
import { GamedayDownloadService } from '../../js/services/gameday-download-service';
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

    let fileService: FileService = new FileService(ipfs)
    let gamedayParseService: GamedayParseService = new GamedayParseService(ipfs, fileService)
    let gamedayDownloadService: GamedayDownloadService = new GamedayDownloadService(fileService)
    let hitterDayService: HitterDayService = new HitterDayService(ipfs, fileService)
    let pitcherDayService: PitcherDayService = new PitcherDayService(ipfs, fileService)
    let playerService: PlayerService = new PlayerService(ipfs)
    let gamedayProcessService: GamedayProcessService = new GamedayProcessService(gamedayParseService, gamedayDownloadService, playerService, hitterDayService, pitcherDayService)
    
    
    before('Setup', async () => {
        await playerService.load()
    })

    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test gamedayProcessService", async () => {
       
        //Act
        await gamedayProcessService.createPlayerDaysForDate(moment("2018-05-26").toDate())




    })


})
