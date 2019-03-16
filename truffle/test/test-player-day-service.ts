import { PlayerDayService } from '../../js/services/player-day-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/file-service';
import { PlayerDay } from '../../js/dto/player-day';
import { PlayerService } from '../../js/services/player-service';
import moment = require('moment');

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PlayerDayService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let playerDayService: PlayerDayService = new PlayerDayService(ipfs, fileService)
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
       await playerDayService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {
        //Arrange
        let player: Player = createTestPlayer();

        let playerDay: PlayerDay = new PlayerDay()
        playerDay.player = player 
        playerDay.date = "2018-05-26"

        
        //Act
        await playerDayService.create(playerDay)

        //Assert
        
        //Get it by player/date
        let readPlayer = await playerDayService.read(player.id, playerDay.date)
        assert.equal(readPlayer.date, playerDay.date)
        assert.equal(readPlayer.player.id, player.id)

        //Check the list for this player
        let playerList: PlayerDay[] = await playerDayService.listByPlayer(player.id)
        assert.equal(playerList[0].date, playerDay.date)
        assert.equal(playerList[0].player.id, player.id)


        // //Check the list for this date
        let dateList: PlayerDay[] = await playerDayService.listByDate(playerDay.date)
        assert.equal(dateList[0].date, playerDay.date)
        assert.equal(dateList[0].player.id, player.id)

    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let playerDay = createTestPlayerDay(createTestPlayer(), "2018-05-06")

        await playerDayService.create(playerDay)

        let read: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)

        read.salary = 40

        //Act
        await playerDayService.update(read)

        //Assert
        let readAgain: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)

        assert.equal(readAgain.salary, 40)

    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let playerDay = createTestPlayerDay(createTestPlayer(), "2018-05-06")

        await playerDayService.create(playerDay)

        let read: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)


        //Act
        await playerDayService.delete(read)

        //Assert
        let readAgain: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)

        //Make sure we get nothing back
        assert.equal(readAgain, undefined)

        let dateList: PlayerDay[] = await playerDayService.listByDate("2018-05-06")
        assert.equal(dateList.length, 0)

        let playerList: PlayerDay[] = await playerDayService.listByPlayer(playerDay.player.id)
        assert.equal(playerList.length, 0)

    })

    //@ts-ignore
    it("Test listByDate", async () => {

        //Arrange
        let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-05-06")
        let playerDay2 = createTestPlayerDay(createTestPlayer2(), "2018-05-06")
        let playerDay3 = createTestPlayerDay(createTestPlayer3(), "2018-05-07")
        let playerDay4 = createTestPlayerDay(createTestPlayer4(), "2018-05-08")

        await playerDayService.create(playerDay1)
        await playerDayService.create(playerDay2)
        await playerDayService.create(playerDay3)
        await playerDayService.create(playerDay4)

        
        //Act
        let list1: PlayerDay[] = await playerDayService.listByDate("2018-05-06")
        let list2: PlayerDay[] = await playerDayService.listByDate("2018-05-07")
        let list3: PlayerDay[] = await playerDayService.listByDate("2018-05-08")


        //Assert

        //Check the first day
        assert.equal(list1[0].player.id, 1)
        assert.equal(list1[0].date, "2018-05-06")

        assert.equal(list1[1].player.id, 2)
        assert.equal(list1[1].date, "2018-05-06")


        //Check the second day
        assert.equal(list2[0].player.id, 3)
        assert.equal(list2[0].date, "2018-05-07")


        //Check the third day
        assert.equal(list3[0].player.id, 4)
        assert.equal(list3[0].date, "2018-05-08")

    })


    //@ts-ignore
    it("Test listByPlayer", async () => {

        //Arrange
        let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-05-05")
        let playerDay2 = createTestPlayerDay(createTestPlayer(), "2018-05-06")
        let playerDay3 = createTestPlayerDay(createTestPlayer(), "2018-05-07")
        let playerDay4 = createTestPlayerDay(createTestPlayer2(), "2018-05-08")

        await playerDayService.create(playerDay1)
        await playerDayService.create(playerDay2)
        await playerDayService.create(playerDay3)
        await playerDayService.create(playerDay4)

        
        //Act
        let list1: PlayerDay[] = await playerDayService.listByPlayer(playerDay1.player.id)
        let list2: PlayerDay[] = await playerDayService.listByPlayer(playerDay4.player.id)


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
    player.name = "Andrew McCutchen"
    player.positions = ["CF"]
    return player
}

function createTestPlayer2() {
    let player: Player = new Player()
    player.id = 2
    player.name = "Pedro Alvarez"
    player.positions = ["3B"]
    return player
}

function createTestPlayer3() {
    let player: Player = new Player()
    player.id = 3
    player.name = "Jordy Mercer"
    player.positions = ["SS"]
    return player
}

function createTestPlayer4() {
    let player: Player = new Player()
    player.id = 4
    player.name = "Gerrit Cole"
    player.positions = ["P"]
    return player
}



function createTestPlayerDay(player: Player, date: string) {

    let playerDay: PlayerDay = new PlayerDay()
    playerDay.player = player 
    playerDay.date = date
    
    return playerDay
}
