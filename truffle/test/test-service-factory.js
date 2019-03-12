import { LeagueSettingsService } from '../../js/services/league-settings-service.js';


const Freedom = require('freedom-for-data')


class TestServiceFactory {

    async constructor(web3, contract) {
        
        this.freedom = await Freedom({
            ipfsConfig: {
              host: settings.ipfsHost,
              port: settings.ipfsApiPort,
              protocol: 'http'
            }
          },
            web3,
            contract
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