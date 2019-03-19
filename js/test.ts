import { FileService } from "./services/file-service";
import { PlayerService } from "./services/player-service";
import { PlayerDayService } from "./services/player-day-service";
import { GamedayDownloadService } from "./services/gameday-download-service";
import moment = require('moment');

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })

let fileService: FileService = new FileService(ipfs)
let playerService: PlayerService = new PlayerService(ipfs)
let playerDayService: PlayerDayService = new PlayerDayService(ipfs, fileService)
let downloadService: GamedayDownloadService = new GamedayDownloadService(playerDayService, playerService, fileService)

let start: Date = moment(`2018-03-01`).toDate()
let end: Date = moment(`2018-11-07`).toDate()

downloadService.downloadRange(start, end)