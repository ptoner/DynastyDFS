import { PitcherSeasonService } from '../../js/services/pitcher-season-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/util/file-service';
import moment = require('moment');
import { PitcherSeason } from '../../js/dto/pitcher-season';

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PitcherSeasonService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let pitcherSeasonService: PitcherSeasonService = new PitcherSeasonService(ipfs, fileService, "/fbtest")
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
       await pitcherSeasonService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {

        //Arrange
        let player = createTestPlayer()
        let pitcherSeason: PitcherSeason = createTestPitcherSeason(player, 2018)

        
        //Act
        await pitcherSeasonService.create(pitcherSeason)

        //Assert
        
        //Get it by player/date
        let readSeason = await pitcherSeasonService.read(player.id, 2018)

        assert.equal(readSeason.year, pitcherSeason.year)
        assert.equal(readSeason.player.id, player.id)

        //Check the list for this player
        let playerList: PitcherSeason[] = await pitcherSeasonService.listByPlayer(player.id)



        assert.equal(playerList[0].year, pitcherSeason.year)
        assert.equal(playerList[0].player.id, player.id)


        // //Check the list for this year
        let dateList: PitcherSeason[] = await pitcherSeasonService.listByYear(2018)
        assert.equal(dateList[0].year, pitcherSeason.year)
        assert.equal(dateList[0].player.id, player.id)


    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let pitcherSeason = createTestPitcherSeason(createTestPlayer(), 2017)

        await pitcherSeasonService.create(pitcherSeason)

        let read: PitcherSeason = await pitcherSeasonService.read(pitcherSeason.player.id, pitcherSeason.year)

        read.hits = 4

        //Act
        await pitcherSeasonService.update(read)

        //Assert
        let readAgain: PitcherSeason = await pitcherSeasonService.read(pitcherSeason.player.id, pitcherSeason.year)

        assert.equal(readAgain.hits, 4)


    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let pitcherSeason = createTestPitcherSeason(createTestPlayer(), 2016)

        await pitcherSeasonService.create(pitcherSeason)

        let read: PitcherSeason = await pitcherSeasonService.read(pitcherSeason.player.id,2016)

        //Act
        await pitcherSeasonService.delete(read)

        //Assert
        let readAgain: PitcherSeason = await pitcherSeasonService.read(pitcherSeason.player.id, pitcherSeason.year)

        //Make sure we get nothing back
        assert.equal(readAgain, undefined)

        let dateList: PitcherSeason[] = await pitcherSeasonService.listByYear(2016)
        assert.equal(dateList.length, 0)

        let playerList: PitcherSeason[] = await pitcherSeasonService.listByPlayer(pitcherSeason.player.id)
        assert.equal(playerList.length, 0)

    })

    //@ts-ignore
    it("Test listByYear", async () => {

        //Arrange
        let playerDay1 = createTestPitcherSeason(createTestPlayer(), 2016)
        let playerDay2 = createTestPitcherSeason(createTestPlayer2(), 2016)
        let playerDay3 = createTestPitcherSeason(createTestPlayer3(), 2017)
        let playerDay4 = createTestPitcherSeason(createTestPlayer4(), 2018)

        await pitcherSeasonService.create(playerDay1)
        await pitcherSeasonService.create(playerDay2)
        await pitcherSeasonService.create(playerDay3)
        await pitcherSeasonService.create(playerDay4)

        
        //Act
        let list1: PitcherSeason[] = await pitcherSeasonService.listByYear(2016)
        let list2: PitcherSeason[] = await pitcherSeasonService.listByYear(2017)
        let list3: PitcherSeason[] = await pitcherSeasonService.listByYear(2018)


        //Assert

        //Check the first day
        assert.equal(list1[0].player.id, 1)
        assert.equal(list1[0].year, 2016)

        assert.equal(list1[1].player.id, 2)
        assert.equal(list1[1].year, 2016)


        //Check the second day
        assert.equal(list2[0].player.id, 3)
        assert.equal(list2[0].year, 2017)


        //Check the third day
        assert.equal(list3[0].player.id, 4)
        assert.equal(list3[0].year, 2018)



    })


    //@ts-ignore
    it("Test listByPlayer", async () => {

        //Arrange
        let playerDay1 = createTestPitcherSeason(createTestPlayer(), 2016)
        let playerDay2 = createTestPitcherSeason(createTestPlayer(), 2017)
        let playerDay3 = createTestPitcherSeason(createTestPlayer(), 2018)
        let playerDay4 = createTestPitcherSeason(createTestPlayer2(), 2018)

        await pitcherSeasonService.create(playerDay1)
        await pitcherSeasonService.create(playerDay2)
        await pitcherSeasonService.create(playerDay3)
        await pitcherSeasonService.create(playerDay4)

        
        //Act
        let list1: PitcherSeason[] = await pitcherSeasonService.listByPlayer(playerDay1.player.id)
        let list2: PitcherSeason[] = await pitcherSeasonService.listByPlayer(playerDay4.player.id)


        //Assert
        assert.equal(list1.length, 3)

        for (let playerDay of list1) {
            assert.equal(playerDay.player.id, playerDay1.player.id)
        }

        assert.equal(list2.length, 1)

        assert.equal(list2[0].player.id, playerDay4.player.id)



    })


})


function createTestPlayer() {
    let player: Player = new Player()
    player.id = 1
    player.firstName = "Andrew"
    player.lastName = "McCutchen"
    player.positions = ["CF"]
    return player
}

function createTestPlayer2() {
    let player: Player = new Player()
    player.id = 2
    player.firstName = "Pedro"
    player.lastName = "Alvarez"
    player.positions = ["3B"]
    return player
}

function createTestPlayer3() {
    let player: Player = new Player()
    player.id = 3
    player.firstName = "Jordy"
    player.lastName = "Mercer"
    player.positions = ["SS"]
    return player
}

function createTestPlayer4() {
    let player: Player = new Player()
    player.id = 4
    player.firstName = "Gerrit"
    player.lastName = "Cole"
    player.positions = ["P"]
    return player
}



function createTestPitcherSeason(player: Player, year: number) {

    let pitcherSeason: PitcherSeason = new PitcherSeason(year)
    pitcherSeason.player = player 
    
    return pitcherSeason
}
