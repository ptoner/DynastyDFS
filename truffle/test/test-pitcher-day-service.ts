import { PitcherDayService } from '../../js/services/pitcher-day-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/file-service';
import { PitcherDay } from '../../js/dto/pitcher-day';
import { PlayerService } from '../../js/services/player-service';
import moment = require('moment');

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PitcherDayService', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let hitcherDayService: PitcherDayService = new PitcherDayService(ipfs, fileService)
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
       await hitcherDayService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {
        //Arrange
        let player = createTestPlayer()
        let playerDay = createTestPlayerDay(player, "2018-05-26")

        
        //Act
        await hitcherDayService.create(playerDay)

        //Assert
        
        //Get it by player/date
        let readPlayer = await hitcherDayService.read(player.id, playerDay.date)

        assert.equal(readPlayer.date, playerDay.date)
        assert.equal(readPlayer.player.id, player.id)

        //Check the list for this player
        let playerList: PitcherDay[] = await hitcherDayService.listByPlayer(player.id)



        assert.equal(playerList[0].date, playerDay.date)
        assert.equal(playerList[0].player.id, player.id)


        // //Check the list for this date
        let dateList: PitcherDay[] = await hitcherDayService.listByDate(moment(playerDay.date).toDate())
        assert.equal(dateList[0].date, playerDay.date)
        assert.equal(dateList[0].player.id, player.id)


    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let playerDay = createTestPlayerDay(createTestPlayer(), "2018-05-06")

        await hitcherDayService.create(playerDay)

        let read: PitcherDay = await hitcherDayService.read(playerDay.player.id, playerDay.date)

        read.salary = 40

        //Act
        await hitcherDayService.update(read)

        //Assert
        let readAgain: PitcherDay = await hitcherDayService.read(playerDay.player.id, playerDay.date)

        assert.equal(readAgain.salary, 40)


    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let playerDay = createTestPlayerDay(createTestPlayer(), "2018-06-06")

        await hitcherDayService.create(playerDay)

        let read: PitcherDay = await hitcherDayService.read(playerDay.player.id, playerDay.date)


        //Act
        await hitcherDayService.delete(read)

        //Assert
        let readAgain: PitcherDay = await hitcherDayService.read(playerDay.player.id, playerDay.date)

        //Make sure we get nothing back
        assert.equal(readAgain, undefined)

        let dateList: PitcherDay[] = await hitcherDayService.listByDate(moment("2018-06-06").toDate())
        assert.equal(dateList.length, 0)

        let playerList: PitcherDay[] = await hitcherDayService.listByPlayer(playerDay.player.id)
        assert.equal(playerList.length, 0)



    })

    // //@ts-ignore
    it("Test listByDate", async () => {

        //Arrange
        let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-07-06")
        let playerDay2 = createTestPlayerDay(createTestPlayer2(), "2018-07-06")
        let playerDay3 = createTestPlayerDay(createTestPlayer3(), "2018-07-07")
        let playerDay4 = createTestPlayerDay(createTestPlayer4(), "2018-07-08")

        await hitcherDayService.create(playerDay1)
        await hitcherDayService.create(playerDay2)
        await hitcherDayService.create(playerDay3)
        await hitcherDayService.create(playerDay4)

        
        //Act
        let list1: PitcherDay[] = await hitcherDayService.listByDate(moment("2018-07-06").toDate())
        let list2: PitcherDay[] = await hitcherDayService.listByDate(moment("2018-07-07").toDate())
        let list3: PitcherDay[] = await hitcherDayService.listByDate(moment("2018-07-08").toDate())


        //Assert

        //Check the first day
        assert.equal(list1[0].player.id, 1)
        assert.equal(list1[0].date, "2018-07-06")

        assert.equal(list1[1].player.id, 2)
        assert.equal(list1[1].date, "2018-07-06")


        //Check the second day
        assert.equal(list2[0].player.id, 3)
        assert.equal(list2[0].date, "2018-07-07")


        //Check the third day
        assert.equal(list3[0].player.id, 4)
        assert.equal(list3[0].date, "2018-07-08")



    })


    // //@ts-ignore
    it("Test listByPlayer", async () => {

        //Arrange
        let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-08-05")
        let playerDay2 = createTestPlayerDay(createTestPlayer(), "2018-08-06")
        let playerDay3 = createTestPlayerDay(createTestPlayer(), "2018-08-07")
        let playerDay4 = createTestPlayerDay(createTestPlayer2(), "2018-08-08")

        await hitcherDayService.create(playerDay1)
        await hitcherDayService.create(playerDay2)
        await hitcherDayService.create(playerDay3)
        await hitcherDayService.create(playerDay4)

        
        //Act
        let list1: PitcherDay[] = await hitcherDayService.listByPlayer(playerDay1.player.id)
        let list2: PitcherDay[] = await hitcherDayService.listByPlayer(playerDay4.player.id)


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



function createTestPlayerDay(player: Player, date: string) {

    let playerDay: PitcherDay = new PitcherDay()
    playerDay.player = player 
    playerDay.date = date
    
    return playerDay
}
