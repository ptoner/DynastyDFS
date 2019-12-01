import assert = require('assert')
const OrbitDB = require('orbit-db')

import { getIPFS } from './ipfs'
import { Global } from '../src/global'
import { SchemaService } from '../src/services/util/schema-service'
import { TranslateService } from '../src/services/util/translate-service';
import { PlayerService } from '../src/services/player-service'
import { Player } from '../src/dto/player'
import { TeamService } from '../src/services/team-service'


//@ts-ignore
describe('TeamService', async (accounts) => {    

    let teamService: TeamService 

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


        teamService = new TeamService(Global.schemaService)

        mainStore = await Global.schemaService.getMainStoreByWalletAddress(address)
        await mainStore.load()

        await Global.schemaService.generateSchema(Global.orbitDb, Global.orbitAccessControl, mainStore, address)

        await teamService.loadStoreForWallet(address)

    })



    //@ts-ignore
    it("Test create & read", async () => {

        //Act
        await teamService.put({
            name: "Pirates",
            _id: "Bob"
        })


        //Assert
        let fetched: Team = await teamService.get("Bob")

        assert.equal(fetched._id, "Bob")
        assert.equal(fetched.name, "Pirates")

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        await teamService.put({
            _id: "Bill",
            name: "Cardinals"
        })

        //Verify it's Cards
        let cards: Team = await teamService.get("Bill")

        assert.equal(cards._id, "Bill")
        assert.equal(cards.name, "Cardinals")


        //Change info 
        await teamService.put({
            _id: "Bill",
            name: "Raiders"
        })

        //Assert
        let read: Team = await teamService.get("Bill")

        assert.equal(read._id, "Bill")
        assert.equal(read.name, "Raiders")

    })



    //@ts-ignore
    it("Test list", async () => {

        //Arrange
        await teamService.put({
            _id: "Jerry",
            name: "Cowboys"
        })
        await teamService.put({
            _id: "Paul",
            name: "Seahawks"
        })
        await teamService.put({
            _id: "Mark",
            name: "Mavericks"
        })


        //Act
        let list: Team[] = await teamService.list(0,100)


        //Assert 
        assert.equal(list.length, 5)

        assert.equal(list[0]._id, "Bob")
        assert.equal(list[0].name, "Pirates")

        assert.equal(list[1]._id, "Bill")
        assert.equal(list[1].name, "Raiders")

        assert.equal(list[2]._id, "Jerry")
        assert.equal(list[2].name, "Cowboys")

        assert.equal(list[3]._id, "Paul")
        assert.equal(list[3].name, "Seahawks")

        assert.equal(list[4]._id, "Mark")
        assert.equal(list[4].name, "Mavericks")

    })

})


