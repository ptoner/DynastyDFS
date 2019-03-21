import { PlayerService } from '../../js/services/player-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PlayerService', async (accounts) => {


    let playerService: PlayerService = new PlayerService(ipfs, "/fbtest")
    
    // await playerService._load()


    //@ts-ignore
    before('Setup', async () => {
        await playerService.load()
    })

    //@ts-ignore
    beforeEach('Setup', async () => {
        playerService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {

        //Arrange
        let player: Player = new Player()
        player.id = 1
        player.firstName = "Andrew"
        player.lastName = "McCutchen"
        player.positions = ["CF"]


        //Act
        let created: Player = await playerService.create(player)

        //Assert
        assert.equal(created.id, 1)

        let fetched: Player = await playerService.read(created.id)

        assert.equal(fetched.firstName, "Andrew")
        assert.equal(fetched.lastName, "McCutchen")
        assert.equal(fetched.positions.length, 1)
        assert.equal(fetched.positions[0], "CF")

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let player: Player = new Player()
        player.id = 1
        player.firstName = "Andrew"
        player.lastName = "McCutchen"
        player.positions = ["CF"]

        let created: Player = await playerService.create(player)

        created.firstName = "Bo"
        created.lastName = "Jackson"

        //Act
        await playerService.update(created)

        //Assert
        let read: Player = await playerService.read(created.id)

        assert.equal(read.firstName, "Bo")
        assert.equal(read.lastName, "Jackson")

    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let player: Player = new Player()
        player.id = 1
        player.firstName = "Andrew"
        player.lastName = "McCutchen"
        player.positions = ["CF"]

        let created: Player = await playerService.create(player)

        //Act
        await playerService.delete(created)

        //Assert
        let read: Player = await playerService.read(created.id)

        //Make sure we get nothing back
        assert.equal(read, undefined)

    })

    //@ts-ignore
    it("Test list", async () => {

        //Arrange
        let player1: Player = new Player()
        player1.id = 1
        player1.firstName = "Andrew"
        player1.lastName = "McCutchen"
        player1.positions = ["CF"]

        let player2: Player = new Player()
        player2.id = 2
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"
        player2.positions = ["SS"]

        let player3: Player = new Player()
        player3.id = 3
        player3.firstName = "Pedro"
        player3.lastName = "Alvarez"
        player3.positions = ["3B"]


        playerService.create(player1)
        playerService.create(player2)
        playerService.create(player3)


        //Act
        let list: Player[] = await playerService.list(0,100)


        //Assert
        assert.equal(list[0].firstName, "Andrew")
        assert.equal(list[0].lastName, "McCutchen")

        assert.equal(list[0].positions[0], "CF")

        assert.equal(list[1].firstName, "Jordy")
        assert.equal(list[1].lastName, "Mercer")

        assert.equal(list[1].positions[0], "SS")

        assert.equal(list[2].firstName, "Pedro")
        assert.equal(list[2].lastName, "Alvarez")
        assert.equal(list[2].positions[0], "3B")

    })



        //@ts-ignore
    it("Test delete record and check list", async () => {

        //Arrange
        let player1: Player = new Player()
        player1.id = 1
        player1.firstName = "Andrew"
        player1.lastName = "McCutchen"
        player1.positions = ["CF"]

        let player2: Player = new Player()
        player2.id = 2
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"
        player2.positions = ["SS"]

        let player3: Player = new Player()
        player3.id = 3
        player3.firstName = "Pedro"
        player3.lastName = "Alvarez"
        player3.positions = ["3B"]


        playerService.create(player1)
        playerService.create(player2)
        playerService.create(player3)


        //Act
        await playerService.delete(player2)


        let list: Player[] = await playerService.list(0, 100)


        //Assert
        assert.equal(list[0].firstName, "Andrew")
        assert.equal(list[0].lastName, "McCutchen")
        assert.equal(list[0].positions[0], "CF")

        // assert.equal(list[1].name, "Jordy Mercer")
        // assert.equal(list[1].positions[0], "SS")
        assert.equal(list[1].firstName, "Pedro")
        assert.equal(list[1].lastName, "Alvarez")
        assert.equal(list[1].positions[0], "3B")

    })


    
    

})


