import { FileService } from "./services/util/file-service";
import { PlayerService } from "./services/player-service";
import {  HitterDayService } from "./services/hitter-day-service";
import { GamedayDownloadService } from "./services/gameday/gameday-download-service";
import moment = require('moment');
import { GamedayParseService } from "./services/gameday/gameday-parse-service";
import { PitcherDayService } from "./services/pitcher-day-service";
import { GamedayProcessService } from "./services/gameday/gameday-process-service";
import { runInContext } from "vm";
import { HitterSeasonService } from "./services/hitter-season-service";

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })




let fileService: FileService = new FileService(ipfs)
let gamedayParseService: GamedayParseService = new GamedayParseService(ipfs, fileService, "/fantasybaseball")
let gamedayDownloadService: GamedayDownloadService = new GamedayDownloadService(fileService, "/fantasybaseball")
let hitterDayService: HitterDayService = new HitterDayService(ipfs, fileService, "/fantasybaseball")
let pitcherDayService: PitcherDayService = new PitcherDayService(ipfs, fileService, "/fantasybaseball")
let playerService: PlayerService = new PlayerService(ipfs, "/fantasybaseball")
let hitterSeasonService: HitterSeasonService = new HitterSeasonService(ipfs, fileService, "/fantasybaseball")
let gamedayProcessService: GamedayProcessService = new GamedayProcessService(gamedayParseService, gamedayDownloadService, playerService, hitterDayService, pitcherDayService, hitterSeasonService)

let start: Date = moment(`2018-03-01`).toDate()
let end: Date = moment(`2018-11-07`).toDate()

async function run() {
  await gamedayProcessService.processDateRange(start, end)
}

run()




// let fileService: FileService = new FileService(ipfs)
// let downloadService: GamedayDownloadService = new GamedayDownloadService(fileService)

// let start: Date = moment(`2018-03-01`).toDate()
// let end: Date = moment(`2018-11-07`).toDate()

// downloadService.downloadRange(start, end)