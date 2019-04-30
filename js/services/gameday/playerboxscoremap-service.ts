import { PlayerBoxscoreMap } from "../../dto/gameday/player-boxscore-map";
import { TranslateService } from "../util/translate-service";
import { Player } from "../../dto/player";
import moment = require("moment");

class PlayerBoxscoreMapService {

    constructor(
        private db: any,
        private translateService: TranslateService
    ) {}


    async save(map: PlayerBoxscoreMap): Promise<void> {

        return this.db.put(map)
    }

    async read(date: Date) : Promise<PlayerBoxscoreMap> {
        
        let map: PlayerBoxscoreMap

        let results : any = await this.db.get(moment(date).format("YYYY-MM-DD"))

        if (results && results.length >0) {
            map = this.translateService.translatePlayerBoxscoreMapRaw(results[0])
        }

        return map

    }

}

export {
    PlayerBoxscoreMapService
}