import { PlayerDayService } from '../../js/services/player-day-service';
import assert = require('assert');
import { Player } from '../../js/dto/player';
import { isMainThread } from 'worker_threads';
import { FileService } from '../../js/services/util/file-service';
import { PlayerDay } from '../../js/dto/player-day';
import { PlayerService } from '../../js/services/player-service';
import moment = require('moment');

const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('PlayerDayService', async (accounts) => {

    let playerDayService: PlayerDayService
    
    //@ts-ignore
    before('Main setup', async () => {

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");

        const db = await orbitdb.docs('test-player-day', { indexBy: 'id' })

        playerDayService = new PlayerDayService(db, new PlayerService(db))

    })
    
    
    //@ts-ignore
    beforeEach('Setup', async () => {
       await playerDayService.clearAll()
    })


    //@ts-ignore
    it("Test create & get", async () => {
        //Arrange
        let player = createTestPlayer()
        let playerDay = createTestPlayerDay(player, "2018-05-26")

        
        //Act
        await playerDayService.save(playerDay)

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
        let dateList: PlayerDay[] = await playerDayService.listByDate(moment(playerDay.date).toDate())
        assert.equal(dateList[0].date, playerDay.date)
        assert.equal(dateList[0].player.id, player.id)


    })

    //@ts-ignore
    it("Test update", async () => {

        //Arrange
        let playerDay = createTestPlayerDay(createTestPlayer(), "2018-05-06")

        await playerDayService.save(playerDay)

        let read: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)

        read.salary = 40

        //Act
        await playerDayService.save(read)

        //Assert
        let readAgain: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)

        assert.equal(readAgain.salary, 40)


    }) 


    //@ts-ignore
    it("Test delete", async ()  => {

        //Arrange
        let playerDay = createTestPlayerDay(createTestPlayer(), "2018-06-06")

        await playerDayService.save(playerDay)

        let read: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)


        //Act
        await playerDayService.delete(read)

        //Assert
        let readAgain: PlayerDay = await playerDayService.read(playerDay.player.id, playerDay.date)

        //Make sure we get nothing back
        assert.equal(readAgain, undefined)

        let dateList: PlayerDay[] = await playerDayService.listByDate(moment("2018-06-06").toDate())
        assert.equal(dateList.length, 0)

        let playerList: PlayerDay[] = await playerDayService.listByPlayer(playerDay.player.id)
        assert.equal(playerList.length, 0)



    })

    //@ts-ignore
    it("Test listByDate", async () => {

        //Arrange
        let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-07-06")
        let playerDay2 = createTestPlayerDay(createTestPlayer2(), "2018-07-06")
        let playerDay3 = createTestPlayerDay(createTestPlayer3(), "2018-07-07")
        let playerDay4 = createTestPlayerDay(createTestPlayer4(), "2018-07-08")

        await playerDayService.save(playerDay1)
        await playerDayService.save(playerDay2)
        await playerDayService.save(playerDay3)
        await playerDayService.save(playerDay4)

        
        //Act
        let list1: PlayerDay[] = await playerDayService.listByDate(moment("2018-07-06").toDate())
        let list2: PlayerDay[] = await playerDayService.listByDate(moment("2018-07-07").toDate())
        let list3: PlayerDay[] = await playerDayService.listByDate(moment("2018-07-08").toDate())


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


    //@ts-ignore
    it("Test listByPlayer", async () => {

        //Arrange
        let playerDay1 = createTestPlayerDay(createTestPlayer(), "2018-08-05")
        let playerDay2 = createTestPlayerDay(createTestPlayer(), "2018-08-06")
        let playerDay3 = createTestPlayerDay(createTestPlayer(), "2018-08-07")
        let playerDay4 = createTestPlayerDay(createTestPlayer2(), "2018-08-08")

        await playerDayService.save(playerDay1)
        await playerDayService.save(playerDay2)
        await playerDayService.save(playerDay3)
        await playerDayService.save(playerDay4)

        
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
    player.firstName = "Andrew"
    player.lastName = "McCutchen"
    return player
}

function createTestPlayer2() {
    let player: Player = new Player()
    player.id = 2
    player.firstName = "Pedro"
    player.lastName = "Alvarez"
    return player
}

function createTestPlayer3() {
    let player: Player = new Player()
    player.id = 3
    player.firstName = "Jordy"
    player.lastName = "Mercer"
    return player
}

function createTestPlayer4() {
    let player: Player = new Player()
    player.id = 4
    player.firstName = "Gerrit"
    player.lastName = "Cole"
    return player
}



function createTestPlayerDay(player: Player, date: string) {

    let playerDay: PlayerDay = new PlayerDay()
    playerDay.player = player 
    playerDay.date = date
    
    return playerDay
}
