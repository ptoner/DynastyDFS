import { PlayerService } from '../../js/services/player-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';

import { FileService } from '../../js/services/util/file-service';
import { TranslateService } from '../../js/services/util/translate-service';


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

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        const db = await orbitdb.docs('test-player', { indexBy: 'id' })

        translateService = new TranslateService()
        playerService = new PlayerService(db, translateService)

    })

    //@ts-ignore
    beforeEach('Before each', async () => {
        await playerService.clearAll()
    })

    //@ts-ignore
    it("Test create & read", async () => {

        // //Arrange

        let player: Player = new Player()
        player.id = 3
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
        let player: Player = new Player()

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
        let player1: Player = new Player()
        player1.id = 1
        player1.firstName = "Andrew"
        player1.lastName = "McCutchen"

        let player2: Player = new Player()
        player2.id = 2
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"

        let player3: Player = new Player()
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
        let player1: Player = new Player()
        player1.id = 1
        player1.firstName = "Andrew"
        player1.lastName = "McCutchen"

        let player2: Player = new Player()
        player2.id = 2
        player2.firstName = "Jordy"
        player2.lastName = "Mercer"

        let player3: Player = new Player()
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

    //@ts-ignore
    it('Test listBySeason', async () => {
        
        //Arrange
        let player1: Player = new Player()
        player1.id = 1
        player1.firstName = "Pedro"
        player1.lastName = "Alvarez"
        player1.seasons.push(2018)
        player1.seasons.push(2019)

        let player2: Player = new Player()
        player2.id = 2
        player2.firstName = "Andrew"
        player2.lastName = "McCutchen"
        player2.seasons.push(2018)
        player2.seasons.push(2020)

        let player3: Player = new Player()
        player3.id = 3
        player3.firstName = "Dino"
        player3.lastName = "Jenkins"
        player3.seasons.push(2018)

        let player4: Player = new Player()
        player4.id = 4
        player4.firstName = "Rube"
        player4.lastName = "Waddell"
        player4.seasons.push(2018)
        player4.seasons.push(2019)


        await playerService.create(player1)
        await playerService.create(player2)
        await playerService.create(player3)
        await playerService.create(player4)


        //Act
        let players2018:Player[] = await playerService.listBySeason(2018)
        let players2019:Player[] = await playerService.listBySeason(2019)
        let players2020:Player[] = await playerService.listBySeason(2020)


        //Assert
        assert.equal(players2018.length, 4)
        assert.equal(players2019.length, 2)
        assert.equal(players2020.length, 1)



    })
    
    

})


