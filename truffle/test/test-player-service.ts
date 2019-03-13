import TestServiceFactory from './test-service-factory'
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

    let playerService: PlayerService = new PlayerService(ipfs)

    playerService.clearAll()


    //@ts-ignore
    beforeEach('Setup', async () => {
        playerService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {

        //Arrange
        let player: Player = new Player()
        player.name = "Andrew McCutchen"
        player.positions = ["CF"]


        //Act
        let created: Player = playerService.create(player)

        //Assert
        assert.equal(created.id, 1)

        let fetched: Player = playerService.read(created.id)

        assert.equal(fetched.name, "Andrew McCutchen")
        assert.equal(fetched.positions.length, 1)
        assert.equal(fetched.positions[0], "CF")

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let player: Player = new Player()
        player.name = "Andrew McCutchen"
        player.positions = ["CF"]

        let created: Player = playerService.create(player)

        created.name = "Bo Jackson"

        //Act
        await playerService.update(created)

        //Assert
        let read: Player = playerService.read(created.id)

        assert.equal(read.name, "Bo Jackson")

    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let player: Player = new Player()
        player.name = "Andrew McCutchen"
        player.positions = ["CF"]

        let created: Player = playerService.create(player)

        //Act
        await playerService.delete(created)

        //Assert
        let read: Player = playerService.read(created.id)

        //Make sure we get nothing back
        assert.equal(read, undefined)

    })

    //@ts-ignore
    it("Test list", async () => {

        //Arrange
        let player1: Player = new Player()
        player1.name = "Andrew McCutchen"
        player1.positions = ["CF"]

        let player2: Player = new Player()
        player2.name = "Jordy Mercer"
        player2.positions = ["SS"]

        let player3: Player = new Player()
        player3.name = "Pedro Alvarez"
        player3.positions = ["3B"]


        playerService.create(player1)
        playerService.create(player2)
        playerService.create(player3)


        //Act
        let list: Player[] = playerService.list()


        //Assert
        assert.equal(list[0].name, "Andrew McCutchen")
        assert.equal(list[0].positions[0], "CF")

        assert.equal(list[1].name, "Jordy Mercer")
        assert.equal(list[1].positions[0], "SS")

        assert.equal(list[2].name, "Pedro Alvarez")
        assert.equal(list[2].positions[0], "3B")

    })

    

})


