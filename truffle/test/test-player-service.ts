// import TestServiceFactory from './test-service-factory'
// import { PlayerService } from '../../js/services/player-service';
// import assert = require('assert');
// import { Player } from '../../js/dto/player';

// const ipfsClient = require('ipfs-http-client')

// const ipfs = ipfsClient({
//     host: "localhost",
//     port: 5001,
//     protocol: 'http'
//   })


// //@ts-ignore
// contract('PlayerService', async (accounts) => {


//     //@ts-ignore
//     let contract = artifacts.require("RecordService")

//     let playerService: PlayerService

//     //@ts-ignore
//     before('Setup', async () => {
        
//         //@ts-ignore
//         let serviceFactory = new TestServiceFactory(ipfs, await contract.deployed())

//         await serviceFactory.init()

//         playerService = serviceFactory.playerService
//     });

//     //@ts-ignore
//     it("Test create & get", async () => {

//         //Arrange
//         let player: Player = new Player()
//         player.name = "Andrew McCutchen"
//         player.positions = ["CF"]


//         //Act
//         let created: Player = playerService.create(player)

//         //Assert
//         assert.equal(created.id, 1)

//         let fetched: Player = playerService.read(created.id)

//         assert.equal(fetched.name, "Andrew McCutchen")
//         assert.equal(fetched.positions, ["CF"])

//     })

    

// })


