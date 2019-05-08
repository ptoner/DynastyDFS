import { FileService } from "./services/util/file-service";
import { PlayerService } from "./services/player-service";
import { GamedayService } from "./services/gameday/gameday-service";
import moment = require('moment');
import { runInContext } from "vm";
import { PlayerDayService } from "./services/player-day-service";
import { TranslateService } from "./services/util/translate-service";
import { PlayerBoxscoreMapService } from "./services/gameday/playerboxscoremap-service";

const LazyKvStore = require('orbit-db-lazykv')

const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


  let gamedayService: GamedayService
  let playerService: PlayerService
  let translateService: TranslateService
  let mapService: PlayerBoxscoreMapService


let start: Date = moment(`2018-03-01`).toDate()
let end: Date = moment(`2018-11-07`).toDate()

async function run() {

  OrbitDB.addDatabaseType(LazyKvStore.type, LazyKvStore)

  const orbitdb = await OrbitDB.createInstance(ipfs);

  const scoreboardDb = await orbitdb.docs('scoreboard', { indexBy: 'id', overwrite: false })
  await scoreboardDb.load()

  const boxscoreDb = await orbitdb.open("boxscore", {create: true, type: "lazykv"})
  // await boxscoreDb.load()

  const playerDb = await orbitdb.docs('player', { indexBy: 'id', overwrite: false })
  await playerDb.load()

  const playerBoxscoreMapDb = await orbitdb.docs('playerboxscoremap', { indexBy: 'id', overwrite: false })
  await playerBoxscoreMapDb.load()

  translateService = new TranslateService()

  mapService = new PlayerBoxscoreMapService(playerBoxscoreMapDb, translateService)
  playerService = new PlayerService(playerDb, translateService)
  gamedayService = new GamedayService(scoreboardDb, boxscoreDb, mapService, playerService, translateService)






  // await gamedayProcessService.processDateRange(start, end)
  // await gamedayDownloadService.downloadRange(start, end)

  // await gamedayService.downloadGameFiles(530173,  moment("2018-05-26").toDate())

  await gamedayService.downloadSeason(2013)
  // await gamedayDownloadService.downloadSeason(2011)
  // await gamedayDownloadService.downloadSeason(2012)
  // await gamedayDownloadService.downloadSeason(2013)
  // await gamedayDownloadService.downloadSeason(2014)
  // await gamedayDownloadService.downloadSeason(2015)
  // await gamedayDownloadService.downloadSeason(2016)
  // await gamedayDownloadService.downloadSeason(2017)
  // await gamedayDownloadService.downloadSeason(2018)

  // await gamedayProcessService.processSeason(2010)

}

run()




// let fileService: FileService = new FileService(ipfs)
// let downloadService: GamedayDownloadService = new GamedayDownloadService(fileService)

// let start: Date = moment(`2018-03-01`).toDate()
// let end: Date = moment(`2018-11-07`).toDate()

// downloadService.downloadRange(start, end)