import { PlayerBoxscoreMap } from "../dto/gameday/player-boxscore-map";
import { TranslateService } from "./util/translate-service";
import { Player } from "../dto/player";
import moment = require("moment");
import { SchemaService } from "./util/schema-service";

class PlayerBoxscoreMapService {

    private db: any

    constructor(
        private translateService: TranslateService,
        private schemaService: SchemaService

    ) {}

    async loadStoreForWallet(walletAddress:string) {
        this.db = await this.schemaService.getPlayerBoxscoreMapStoreByWalletAddress(walletAddress)
    }


    async put(date: Date, map: PlayerBoxscoreMap): Promise<void> {
        return this.db.put(moment(date).format("YYYY-MM-DD"), map)
    }

    async read(date: Date) : Promise<PlayerBoxscoreMap> {
        
        let map: PlayerBoxscoreMap

        let result = await this.db.get(moment(date).format("YYYY-MM-DD"))

        if (result == null) return null

        map = this.translateService.translatePlayerBoxscoreMapRaw(result)

        return map

    }

    async load() {
        await this.db.load()
    }

}

export {
    PlayerBoxscoreMapService
}