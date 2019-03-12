const TestServiceFactory = require('./test-service-factory');

let contract = artifacts.require("RecordService")



contract('LeagueSettingsService', async (accounts) => {

    let leagueSettingsService

    before('Setup', async () => {
        let serviceFactory = await new TestServiceFactory(web3, contract)
        leagueSettingsService = serviceFactory.getLeagueSettingsService()
    });


    it("Test callReadList: Get empty list", async () => {
        console.log('here')
        console.log(leagueSettingsService)

    })


})


