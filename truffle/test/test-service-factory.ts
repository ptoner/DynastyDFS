import { LeagueSettingsService } from "../../js/services/league-settings-service";


const Freedom = require('freedom-for-data')


class TestServiceFactory {

    contract: any
    freedom: any
    ipfs: any
    leagueSettingsService: LeagueSettingsService

    constructor(ipfs, contract) {
        this.contract = contract
        this.ipfs = ipfs
    }


    async init()  {

      this.freedom = await Freedom(
        this.ipfs,
        this.contract
      )

      this.leagueSettingsService = new LeagueSettingsService()

      this.leagueSettingsService.freedom = this.freedom

    }


    /**
     * Only giving getters to the actual services to expose
     */

    getLeagueSettingsService() {
        return this.leagueSettingsService
    }

}


export default TestServiceFactory;