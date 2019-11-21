import assert = require('assert');
const OrbitDB = require('orbit-db')
import moment = require('moment')


import { getIPFS } from './ipfs'
import { Global } from '../src/global'
import { SchemaService } from '../src/services/util/schema-service'
import { PlayerBoxscoreMapService } from '../src/services/playerboxscoremap-service';
import { TranslateService } from '../src/services/util/translate-service';
import { PlayerBoxscoreMap } from '../src/dto/gameday/player-boxscore-map';


//@ts-ignore
describe('PlayerBoxscoreMapService', async (accounts) => {    

    let mapService: PlayerBoxscoreMapService 
    let translateService: TranslateService

    let mainStore
    let ipfs 
    let address

    //@ts-ignore
    before('Main setup', async () => {

        ipfs = await getIPFS()

        const orbitdb = await OrbitDB.createInstance(ipfs, {
            directory: "./test/orbitdb/" + Math.random().toString()
        })

        address = Math.random().toString()

        Global.ipfs = ipfs 
        Global.orbitDb = orbitdb
        Global.schemaService = new SchemaService()
        Global.translateService = new TranslateService()

        mainStore = await Global.schemaService.getMainStoreByWalletAddress(address)
        await mainStore.load()

        await Global.schemaService.generateSchema(Global.orbitDb, Global.orbitAccessControl, mainStore, address)

        mapService = new PlayerBoxscoreMapService(Global.translateService, Global.schemaService)


        await mapService.loadStoreForWallet(address)
        await mapService.load()



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


