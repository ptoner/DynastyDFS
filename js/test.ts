import { FileService } from "./services/util/file-service";
import { PlayerService } from "./services/player-service";
import {  HitterDayService } from "./services/hitter-day-service";
import { GamedayDownloadService } from "./services/gameday/gameday-download-service";
import moment = require('moment');
import { PitcherDayService } from "./services/pitcher-day-service";
import { GamedayProcessService } from "./services/gameday/gameday-process-service";
import { runInContext } from "vm";

const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


let fileService: FileService = new FileService(ipfs)
let gamedayDownloadService: GamedayDownloadService = new GamedayDownloadService(fileService, "/fantasybaseball")
let hitterDayService: HitterDayService = new HitterDayService(ipfs, fileService, "/fantasybaseball")
let pitcherDayService: PitcherDayService = new PitcherDayService(ipfs, fileService, "/fantasybaseball")
let playerService: PlayerService = new PlayerService(ipfs, fileService, "/fantasybaseball")
let gamedayProcessService: GamedayProcessService = new GamedayProcessService(gamedayDownloadService, playerService, hitterDayService, pitcherDayService)

let start: Date = moment(`2018-03-01`).toDate()
let end: Date = moment(`2018-11-07`).toDate()

async function run() {
  // await gamedayProcessService.processDateRange(start, end)
  // await gamedayDownloadService.downloadRange(start, end)

  // await gamedayDownloadService.downloadSeason(2010)
  // await gamedayDownloadService.downloadSeason(2011)
  // await gamedayDownloadService.downloadSeason(2012)
  // await gamedayDownloadService.downloadSeason(2013)
  // await gamedayDownloadService.downloadSeason(2014)
  // await gamedayDownloadService.downloadSeason(2015)
  // await gamedayDownloadService.downloadSeason(2016)
  // await gamedayDownloadService.downloadSeason(2017)
  // await gamedayDownloadService.downloadSeason(2018)

  // await gamedayProcessService.processSeason(2010)


  const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");
  let db = await orbitdb.keyvalue("test")                       
  await db.load()
  await db.set("key", "value")




}

run()




// let fileService: FileService = new FileService(ipfs)
// let downloadService: GamedayDownloadService = new GamedayDownloadService(fileService)

// let start: Date = moment(`2018-03-01`).toDate()
// let end: Date = moment(`2018-11-07`).toDate()

// downloadService.downloadRange(start, end)