import { GamedayDownloadService } from '../../js/services/gameday/gameday-download-service'
import assert = require('assert')
import { isMainThread } from 'worker_threads'
import { FileService } from '../../js/services/util/file-service'
import moment = require('moment')

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('GamedayDownloadService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)

    let downloadService: GamedayDownloadService = new GamedayDownloadService(fileService, "/fbtest")
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test downloadMiniScoreboard & readMiniScoreboard", async () => {

        //Arrange
        let date: Date = moment("2018-05-26").toDate()
       
        //Act
        await downloadService.downloadMiniScoreboard(date)

        //Assert
        let games = await downloadService.readMiniScoreboard(date)

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
