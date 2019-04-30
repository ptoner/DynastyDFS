import assert = require('assert');
import { isMainThread } from 'worker_threads';

import { FileService } from '../../js/services/util/file-service';
import { TranslateService } from '../../js/services/util/translate-service';
import { PlayerBoxscoreMapService } from '../../js/services/gameday/playerboxscoremap-service';

import { PlayerBoxscoreMap } from '../../js/dto/gameday/player-boxscore-map';
import moment = require('moment');


const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })




//@ts-ignore
contract('PlayerBoxscoreMapService', async (accounts) => {    

    let mapService: PlayerBoxscoreMapService 
    let translateService: TranslateService


    //@ts-ignore
    before('Main setup', async () => {

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        const db = await orbitdb.docs('test-playerboxscoremap', { indexBy: 'id' })

        translateService = new TranslateService()
        mapService = new PlayerBoxscoreMapService(db, translateService)

    })



    //@ts-ignore
    it("Test create & read", async () => {

        // //Arrange
        let map: PlayerBoxscoreMap = new PlayerBoxscoreMap()
        map.setDate(moment("2018-05-26").toDate())
        map.playerBoxscore = {}
        map.playerBoxscore[5] = 2500
        map.playerBoxscore[40]= 1000


        // //Act
        let hash = await mapService.save(map)

        //Assert
        let fetched: PlayerBoxscoreMap = await mapService.read(moment("2018-05-26").toDate())

        assert.equal(fetched.date, map.date)
        assert.equal(fetched.playerBoxscore[5], 2500)
        assert.equal(fetched.playerBoxscore[40], 1000)




    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let map: PlayerBoxscoreMap = new PlayerBoxscoreMap()
        map.setDate(moment("2018-05-26").toDate())
        map.playerBoxscore = {}
        map.playerBoxscore[5] = 2500
        map.playerBoxscore[40]= 1000

        await mapService.save(map)

        //Verify it's right
        let fetched: PlayerBoxscoreMap = await mapService.read(moment("2018-05-26").toDate())

        assert.equal(fetched.date, map.date)
        assert.equal(fetched.playerBoxscore[5], 2500)
        assert.equal(fetched.playerBoxscore[40], 1000)


        //Change info 
        fetched.playerBoxscore[5] = 3500
        fetched.playerBoxscore[40]= 3000
        fetched.playerBoxscore[50] = 9000

        //Act
        await mapService.save(fetched)

        //Assert
        let read: PlayerBoxscoreMap = await mapService.read(moment("2018-05-26").toDate())

        assert.equal(read.date, map.date)
        assert.equal(read.playerBoxscore[5], 3500)
        assert.equal(read.playerBoxscore[40], 3000)
        assert.equal(read.playerBoxscore[50], 9000)

    }) 

    //@ts-ignore
    it("Test read: invalid key", async ()  => {

        //Act
        let map: PlayerBoxscoreMap = await mapService.read(moment("2018-05-27").toDate())

        //Assert
        assert.equal(map == undefined, true)

    })




})


