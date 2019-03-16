import { DownloadService } from '../../js/services/download-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/file-service';
import { PlayerDay } from '../../js/dto/player-day';
import { PlayerService } from '../../js/services/player-service';
import moment = require('moment');
import { PlayerDayService } from '../../js/services/player-day-service';

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('DownlodService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let playerService: PlayerService = new PlayerService(ipfs)
    let playerDayService: PlayerDayService = new PlayerDayService(ipfs, fileService)
    let downloadService: DownloadService = new DownloadService(playerDayService, playerService)
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test fetchGamesOnDate", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()
       
        //Act
        let games = await downloadService.fetchGamesOnDate(date)

        //Assert
        assert.equal(games.length, 15)

    })

    //@ts-ignore
    it("Test getBoxscoreForGame", async () => {

        //Act
        let boxscore = await downloadService.getBoxscoreForGame("http://gd2.mlb.com/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1/")

        //Assert
        console.log(boxscore)

    })


})
