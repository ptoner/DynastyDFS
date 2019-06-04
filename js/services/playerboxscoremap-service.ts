import { PlayerBoxscoreMap } from "../dto/gameday/player-boxscore-map";
import { TranslateService } from "./util/translate-service";
import { Player } from "../dto/player";
import moment = require("moment");

class PlayerBoxscoreMapService {

    constructor(
        private db: any,
        private translateService: TranslateService
    ) {}


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

}

export {
    PlayerBoxscoreMapService
}