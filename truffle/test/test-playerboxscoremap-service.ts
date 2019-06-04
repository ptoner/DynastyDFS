import assert = require('assert');
import { isMainThread } from 'worker_threads';

import { FileService } from '../../js/services/util/file-service';
import { TranslateService } from '../../js/services/util/translate-service';
import { PlayerBoxscoreMapService } from '../../js/services/playerboxscoremap-service';

import { PlayerBoxscoreMap } from '../../js/dto/gameday/player-boxscore-map';
import moment = require('moment')
import { PlayerBoxscoreMapSchema } from '../../js/schemas';
const TableStore = require('orbit-db-tablestore')



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

        //@ts-ignore
        PlayerBoxscoreMapSchema.create = true

        if (!OrbitDB.isValidType(TableStore.type)) {
            OrbitDB.addDatabaseType(TableStore.type, TableStore)
        }

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        let playerBoxscoreMapDb = await orbitdb.open("test-playerboxscoremap", {create: true, type: 'table'})
        await playerBoxscoreMapDb.createIndexes(PlayerBoxscoreMapSchema.indexes)

        translateService = new TranslateService()
        mapService = new PlayerBoxscoreMapService(playerBoxscoreMapDb, translateService)

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
        let hash = await mapService.put(map.getDate(), map)

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

        await mapService.put(map.getDate(), map)

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
        let hash = await mapService.put(fetched.getDate(), fetched)


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
        let date: Date = moment("2040-05-27").toDate()
        let map: PlayerBoxscoreMap = await mapService.read(date)

        //Assert
        assert.equal(map == null, true)

    })




})


