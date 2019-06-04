import { PlayerService } from '../../js/services/player-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { PlayerSchema } from '../../js/schemas'

//@ts-ignore
PlayerSchema.create = true

import { TranslateService } from '../../js/services/util/translate-service';
const TableStore = require('orbit-db-tablestore')


const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })




//@ts-ignore
contract('PlayerService', async (accounts) => {    

    let playerService: PlayerService 
    let translateService: TranslateService


    //@ts-ignore
    before('Main setup', async () => {

        //@ts-ignore
        PlayerSchema.create = true

        if (!OrbitDB.isValidType(TableStore.type)) {
            OrbitDB.addDatabaseType(TableStore.type, TableStore)
        }

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        let playerDb = await orbitdb.open("test-player", {create: true, type: 'table'})
        await playerDb.createIndexes(PlayerSchema.indexes)

        translateService = new TranslateService()
        playerService = new PlayerService(playerDb, translateService)

    })



    //@ts-ignore
    it("Test create & read", async () => {

        // //Arrange

        let player: Player = new Player()
        player.id = 1
        player.firstName = "Andrew"
        player.lastName = "McCutchen"


        // //Act
        let hash = await playerService.create(player)


        // // //Assert
        let fetched: Player = await playerService.read(player.id)

        assert.equal(fetched.firstName, "Andrew")
        assert.equal(fetched.lastName, "McCutchen")

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let player: Player = new Player()
        player.id = 2
        player.firstName = "Andrew"
        player.lastName = "McCutchen"

        await playerService.create(player)

        //Verify it's cutch
        let cutch: Player = await playerService.read(player.id)

        assert.equal(cutch.firstName, "Andrew")
        assert.equal(cutch.lastName, "McCutchen")


        //Change info 
        player.firstName = "Bo"
        player.lastName = "Jackson"

        //Act
        await playerService.update(player)

        //Assert
        let read: Player = await playerService.read(player.id)

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
        player1.id = 3
        player1.firstName = "John"
        player1.lastName = "Johnson"

        let player2: Player = new Player()
        player2.id = 4
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"

        let player3: Player = new Player()
        player3.id = 5
        player3.firstName = "Pedro"
        player3.lastName = "Alvarez"


        await playerService.create(player1)
        await playerService.create(player2)
        await playerService.create(player3)


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
        player1.id = 6
        player1.firstName = "Pedro"
        player1.lastName = "Alvarez"


        let player2: Player = new Player()
        player2.id = 7
        player2.firstName = "Andrew"
        player2.lastName = "McCutchen"

       

        let player3: Player = new Player()
        player3.id = 8
        player3.firstName = "Dino"
        player3.lastName = "Jenkins"


        let player4: Player = new Player()
        player4.id = 9
        player4.firstName = "Rube"
        player4.lastName = "Waddell"

        let player5: Player = new Player()
        player5.id = 10
        player5.firstName = "Rube"
        player5.lastName = "Waddell"

        let player6: Player = new Player()
        player6.id = 11
        player6.firstName = "Rube"
        player6.lastName = "Waddell"

        let player7: Player = new Player()
        player7.id = 12
        player7.firstName = "Rube"
        player7.lastName = "Waddell"

        let player8: Player = new Player()
        player8.id = 13
        player8.firstName = "Rube"
        player8.lastName = "Waddell"

        
        await playerService.create(player1)
        await playerService.create(player2)
        await playerService.create(player3)
        await playerService.create(player4)
        await playerService.create(player5)
        await playerService.create(player6)
        await playerService.create(player7)
        await playerService.create(player8)

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


