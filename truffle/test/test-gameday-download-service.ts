import { GamedayDownloadService } from '../../js/services/gameday-download-service'
import assert = require('assert')
import { Player } from '../../js/dto/player'
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/file-service'
import { PlayerDay } from '../../js/dto/player-day'
import { PlayerService } from '../../js/services/player-service'
import moment = require('moment')
import { PlayerDayService } from '../../js/services/player-day-service'

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('GamedayDownloadService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let playerService: PlayerService = new PlayerService(ipfs)
    let playerDayService: PlayerDayService = new PlayerDayService(ipfs, fileService)
    let downloadService: GamedayDownloadService = new GamedayDownloadService(playerDayService, playerService, fileService)
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test fetchGamesOnDate", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()
       
        //Act
        let games = await downloadService.fetchGameDirectoriesOnDate(date)

        //Assert
        assert.equal(games.length, 15)

    })

    //@ts-ignore
    it("Test downloadGameFiles", async () => {

        let directory = "/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1"

        //Act
        await downloadService.downloadGameFiles(directory)

        //Assert
        assert.equal(
            await fileService.fileExists("/fantasybaseball/gameday/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1/boxscore.json"), 
            true
        )

        assert.equal(
            await fileService.fileExists("/fantasybaseball/gameday/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1/linescore.json"), 
            true
        )

        assert.equal(
            await fileService.fileExists("/fantasybaseball/gameday/components/game/mlb/year_2018/month_05/day_06/gid_2018_05_06_chnmlb_slnmlb_1/game_events.json"), 
            true
        )
    })




    //@ts-ignore
    // it("Test downloadDate", async () => {

    //     //Act
    //     await downloadService.downloadDate(moment("2018-05-26").toDate())

    //     //Assert
    //     //todo: something
    // })


})
