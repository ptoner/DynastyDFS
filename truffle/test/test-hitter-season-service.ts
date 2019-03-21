import { HitterSeasonService } from '../../js/services/hitter-season-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/file-service';
import { HitterDay } from '../../js/dto/hitter-day';
import { PlayerService } from '../../js/services/player-service';
import moment = require('moment');
import { HitterSeason } from '../../js/dto/hitter-season';

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('HitterSeasonService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let hitterSeasonService: HitterSeasonService = new HitterSeasonService(ipfs, fileService, "/fbtest")
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
       await hitterSeasonService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {
        //Arrange
        let player = createTestPlayer()
        let hitterSeason: HitterSeason = createTestHitterSeason(player, 2018)

        
        //Act
        await hitterSeasonService.create(hitterSeason)

        //Assert
        
        //Get it by player/date
        let readSeason = await hitterSeasonService.read(player.id, 2018)

        assert.equal(readSeason.year, hitterSeason.year)
        assert.equal(readSeason.player.id, player.id)

        //Check the list for this player
        let playerList: HitterSeason[] = await hitterSeasonService.listByPlayer(player.id)



        assert.equal(playerList[0].year, hitterSeason.year)
        assert.equal(playerList[0].player.id, player.id)


        // //Check the list for this year
        let dateList: HitterSeason[] = await hitterSeasonService.listByYear(2018)
        assert.equal(dateList[0].year, hitterSeason.year)
        assert.equal(dateList[0].player.id, player.id)


    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let hitterSeason = createTestHitterSeason(createTestPlayer(), 2017)

        await hitterSeasonService.create(hitterSeason)

        let read: HitterSeason = await hitterSeasonService.read(hitterSeason.player.id, hitterSeason.year)

        read.hits = 4

        //Act
        await hitterSeasonService.update(read)

        //Assert
        let readAgain: HitterSeason = await hitterSeasonService.read(hitterSeason.player.id, hitterSeason.year)

        assert.equal(readAgain.hits, 4)


    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let hitterSeason = createTestHitterSeason(createTestPlayer(), 2016)

        await hitterSeasonService.create(hitterSeason)

        let read: HitterSeason = await hitterSeasonService.read(hitterSeason.player.id,2016)

        //Act
        await hitterSeasonService.delete(read)

        //Assert
        let readAgain: HitterSeason = await hitterSeasonService.read(hitterSeason.player.id, hitterSeason.year)

        //Make sure we get nothing back
        assert.equal(readAgain, undefined)

        let dateList: HitterSeason[] = await hitterSeasonService.listByYear(2016)
        assert.equal(dateList.length, 0)

        let playerList: HitterSeason[] = await hitterSeasonService.listByPlayer(hitterSeason.player.id)
        assert.equal(playerList.length, 0)

    })

    //@ts-ignore
    it("Test listByYear", async () => {

        //Arrange
        let playerDay1 = createTestHitterSeason(createTestPlayer(), 2016)
        let playerDay2 = createTestHitterSeason(createTestPlayer2(), 2016)
        let playerDay3 = createTestHitterSeason(createTestPlayer3(), 2017)
        let playerDay4 = createTestHitterSeason(createTestPlayer4(), 2018)

        await hitterSeasonService.create(playerDay1)
        await hitterSeasonService.create(playerDay2)
        await hitterSeasonService.create(playerDay3)
        await hitterSeasonService.create(playerDay4)

        
        //Act
        let list1: HitterSeason[] = await hitterSeasonService.listByYear(2016)
        let list2: HitterSeason[] = await hitterSeasonService.listByYear(2017)
        let list3: HitterSeason[] = await hitterSeasonService.listByYear(2018)


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
        let playerDay1 = createTestHitterSeason(createTestPlayer(), 2016)
        let playerDay2 = createTestHitterSeason(createTestPlayer(), 2017)
        let playerDay3 = createTestHitterSeason(createTestPlayer(), 2018)
        let playerDay4 = createTestHitterSeason(createTestPlayer2(), 2018)

        await hitterSeasonService.create(playerDay1)
        await hitterSeasonService.create(playerDay2)
        await hitterSeasonService.create(playerDay3)
        await hitterSeasonService.create(playerDay4)

        
        //Act
        let list1: HitterSeason[] = await hitterSeasonService.listByPlayer(playerDay1.player.id)
        let list2: HitterSeason[] = await hitterSeasonService.listByPlayer(playerDay4.player.id)


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



function createTestHitterSeason(player: Player, year: number) {

    let hitterSeason: HitterSeason = new HitterSeason(year)
    hitterSeason.player = player 
    
    return hitterSeason
}
