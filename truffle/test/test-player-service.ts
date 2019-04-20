import { PlayerService } from '../../js/services/player-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import OrbitDB = require('orbit-db');
import { FileService } from '../../js/services/util/file-service';

// import * as IPFS from "typestub-ipfs";
// import IPFS from 'ipfs'

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PlayerService', async (accounts) => {



    // ipfs.on('ready', async () => {
    //     const orbitdb = await OrbitDB.createInstance(ipfs)
    //     const db = await orbitdb.keyvalue('first-database')
    //     console.log(db)
    //   })


    let rootFolder = "/fbtest"
    let fileService: FileService = new FileService(ipfs)
    let playerService: PlayerService = new PlayerService(ipfs,fileService, rootFolder)



    //@ts-ignore

    //@ts-ignore
    beforeEach('Setup', async () => {
        await playerService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {

        //Arrange
        let player: Player = new Player(undefined)
        player.id = 1
        player.firstName = "Andrew"
        player.lastName = "McCutchen"


        //Act
        await playerService.create(player)

        //Assert
        let fetched: Player = await playerService.read(player.id)

        assert.equal(fetched.firstName, "Andrew")
        assert.equal(fetched.lastName, "McCutchen")

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let player: Player = new Player(undefined)
        player.id = 1
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

    //@ts-ignore
    it("Test read: invalid key", async ()  => {

        //Act
        let player: Player = await playerService.read(45)

        //Assert
        assert.equal(player == undefined, true)

    })



    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let player: Player = new Player(undefined)

        player.id = 1
        player.firstName = "Andrew"
        player.lastName = "McCutchen"

        await playerService.create(player)

        //Act
        await playerService.delete(player)

        //Assert
        let read: Player = await playerService.read(player.id)

        //Make sure we get nothing back
        assert.equal(read, undefined)

    })

    //@ts-ignore
    it("Test list", async () => {

        //Arrange
        let player1: Player = new Player(undefined)
        player1.id = 1
        player1.firstName = "Andrew"
        player1.lastName = "McCutchen"

        let player2: Player = new Player(undefined)
        player2.id = 2
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"

        let player3: Player = new Player(undefined)
        player3.id = 3
        player3.firstName = "Pedro"
        player3.lastName = "Alvarez"


        await playerService.create(player1)
        await playerService.create(player2)
        await playerService.create(player3)


        //Act
        let list: Player[] = await playerService.list(0,100)


        //Assert
        assert.equal(list[0].firstName, "Andrew")
        assert.equal(list[0].lastName, "McCutchen")


        assert.equal(list[1].firstName, "Jordy")
        assert.equal(list[1].lastName, "Mercer")


        assert.equal(list[2].firstName, "Pedro")
        assert.equal(list[2].lastName, "Alvarez")

    })



        //@ts-ignore
    it("Test delete record and check list", async () => {

        //Arrange
        let player1: Player = new Player(undefined)
        player1.id = 1
        player1.firstName = "Andrew"
        player1.lastName = "McCutchen"

        let player2: Player = new Player(undefined)
        player2.id = 2
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"

        let player3: Player = new Player(undefined)
        player3.id = 3
        player3.firstName = "Pedro"
        player3.lastName = "Alvarez"


        await playerService.create(player1)
        await playerService.create(player2)
        await playerService.create(player3)


        //Act
        await playerService.delete(player2)


        let list: Player[] = await playerService.list(0, 100)


        //Assert
        assert.equal(list[0].firstName, "Andrew")
        assert.equal(list[0].lastName, "McCutchen")

        assert.equal(list[1].firstName, "Pedro")
        assert.equal(list[1].lastName, "Alvarez")

    })


    
    

})


