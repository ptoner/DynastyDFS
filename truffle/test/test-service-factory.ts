import { LeagueSettingsService } from "../../js/services/league-settings-service";
import { SharedDirectoryService } from "../../js/services/shared-directory-service"
import { PlayerService } from "../../js/services/player-service";

const Freedom = require('freedom-for-data')


class TestServiceFactory {

    private contract: any
    private freedom: any
    private ipfs: any

    public leagueSettingsService: LeagueSettingsService
    public sharedDirectoryService: SharedDirectoryService
    public playerService: PlayerService

    constructor(ipfs, contract) {
        this.contract = contract
        this.ipfs = ipfs
    }


    async init()  {

      this.freedom = await Freedom(
        this.ipfs,
        this.contract
      )

      this.sharedDirectoryService = new SharedDirectoryService(this.ipfs)
      this.leagueSettingsService = new LeagueSettingsService(this.ipfs)
      this.playerService = new PlayerService(this.ipfs)

      // this.leagueSettingsService.freedom = this.freedom

    }

}


export default TestServiceFactory;