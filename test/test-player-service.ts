import assert = require('assert')
const OrbitDB = require('orbit-db')

import { getIPFS } from './ipfs'
import { Global } from '../src/global'
import { SchemaService } from '../src/services/util/schema-service'
import { TranslateService } from '../src/services/util/translate-service';
import { PlayerService } from '../src/services/player-service'
import { Player } from '../src/dto/player'


//@ts-ignore
describe('PlayerService', async (accounts) => {    

    let playerService: PlayerService 
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


        playerService = new PlayerService(Global.translateService, Global.schemaService)

        mainStore = await Global.schemaService.getMainStoreByWalletAddress(address)
        await mainStore.load()

        await Global.schemaService.generateSchema(Global.orbitDb, Global.orbitAccessControl, mainStore, address)

        await playerService.loadStoreForWallet(address)

    })



    //@ts-ignore
    it("Test create & read", async () => {

        // //Arrange

        let player: Player = new Player()
        player._id = "1"
        player.firstName = "Andrew"
        player.lastName = "McCutchen"


        // //Act
        let hash = await playerService.put(player)


        // // //Assert
        let fetched: Player = await playerService.get(player._id)

        assert.equal(fetched.firstName, "Andrew")
        assert.equal(fetched.lastName, "McCutchen")

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let player: Player = new Player()
        player._id = "2"
        player.firstName = "Andrew"
        player.lastName = "McCutchen"

        await playerService.put(player)

        //Verify it's cutch
        let cutch: Player = await playerService.get(player._id)

        assert.equal(cutch.firstName, "Andrew")
        assert.equal(cutch.lastName, "McCutchen")


        //Change info 
        player.firstName = "Bo"
        player.lastName = "Jackson"

        //Act
        await playerService.put(player)

        //Assert
        let read: Player = await playerService.get(player._id)

        assert.equal(read.firstName, "Bo")
        assert.equal(read.lastName, "Jackson")

    }) 

    // //@ts-ignore
    // it("Test read: invalid key", async ()  => {

    //     try {
    //         let player: Player = await playerService.read(45)
    //         assert.equal(player == undefined, true)
    //     } catch(ex) {
    //         assert.fail(ex)
    //     }
        

    // })



    //@ts-ignore
    it("Test list", async () => {

        //Arrange
        let player1: Player = new Player()
        player1._id = "3"
        player1.firstName = "John"
        player1.lastName = "Johnson"

        let player2: Player = new Player()
        player2._id = "4"
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"

        let player3: Player = new Player()
        player3._id = "5"
        player3.firstName = "Pedro"
        player3.lastName = "Alvarez"


        await playerService.put(player1)
        await playerService.put(player2)
        await playerService.put(player3)


        //Act
        let list: Player[] = await playerService.list(0,100)


        //Assert 
        assert.equal(list.length, 5)

        assert.equal(list[0].firstName, "Andrew")
        assert.equal(list[0].lastName, "McCutchen")

        assert.equal(list[1].firstName, "Bo")
        assert.equal(list[1].lastName, "Jackson")

        assert.equal(list[2].firstName, "John")
        assert.equal(list[2].lastName, "Johnson")

        assert.equal(list[3].firstName, "Jordy")
        assert.equal(list[3].lastName, "Mercer")

        assert.equal(list[4].firstName, "Pedro")
        assert.equal(list[4].lastName, "Alvarez")

    })




    //@ts-ignore
    it('Test listByLastName', async () => {
        
        //Arrange
        let player1: Player = new Player()
        player1._id = "6"
        player1.firstName = "Pedro"
        player1.lastName = "Alvarez"


        let player2: Player = new Player()
        player2._id = "7"
        player2.firstName = "Andrew"
        player2.lastName = "McCutchen"

       

        let player3: Player = new Player()
        player3._id = "8"
        player3.firstName = "Dino"
        player3.lastName = "Jenkins"


        let player4: Player = new Player()
        player4._id = "9"
        player4.firstName = "Rube"
        player4.lastName = "Waddell"

        let player5: Player = new Player()
        player5._id = "10"
        player5.firstName = "Rube"
        player5.lastName = "Waddell"

        let player6: Player = new Player()
        player6._id = "11"
        player6.firstName = "Rube"
        player6.lastName = "Waddell"

        let player7: Player = new Player()
        player7._id = "12"
        player7.firstName = "Rube"
        player7.lastName = "Waddell"

        let player8: Player = new Player()
        player8._id = "13"
        player8.firstName = "Rube"
        player8.lastName = "Waddell"

        
        await playerService.put(player1)
        await playerService.put(player2)
        await playerService.put(player3)
        await playerService.put(player4)
        await playerService.put(player5)
        await playerService.put(player6)
        await playerService.put(player7)
        await playerService.put(player8)

        //Act
        let jenkins:Player[] = await playerService.listByLastName("Jenkins", 100, 0)
        let cutch:Player[] = await playerService.listByLastName("McCutchen", 100, 0)
        let waddell:Player[] = await playerService.listByLastName("Waddell", 100, 0)


        //Assert
        assert.equal(jenkins.length, 1)
        assert.equal(cutch.length, 2)
        assert.equal(waddell.length, 5)



    })
    
    

})


