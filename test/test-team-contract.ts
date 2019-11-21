import assert = require('assert')

//@ts-ignore 
const Team = artifacts.require("Team");



//@ts-ignore
contract('Team', async (accounts) => {

    let teamContract: any 
    
    
    //@ts-ignore
    before('Setup', async () => {
        teamContract = await Team.deployed()
    })


    //@ts-ignore
    it("Test downloadMiniScoreboard & readMiniScoreboard", async () => {

        // //Arrange
        // let date: Date = moment("2018-05-26").toDate()
       
        // //Act
        // await downloadService.downloadMiniScoreboard(date)

        // //Assert
        // let games = await downloadService.readMiniScoreboard(date)

        // assert.equal(games.length, 15)

    })


})
