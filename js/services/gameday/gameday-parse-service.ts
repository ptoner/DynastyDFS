import { FileService } from "../util/file-service";
import { Boxscore } from "../../dto/gameday/gameday-boxscore";

var convert = require('xml-js');


class GamedayParseService {
    
    host: string = "http://gd2.mlb.com"
    localFolder: string

    constructor(
        private ipfs: any,
        private fileService: FileService,
        private rootFolder: string
    ) {
        this.localFolder = rootFolder + "/gameday"

    }

    async getBoxScore(gamePk: Number) : Promise<Boxscore> {

        let rawJson = await this.fileService.loadFile(`${this.localFolder}/games/${gamePk}/boxscore.json`)

        let gamedayBoxScore: Boxscore = new Boxscore(rawJson)

        return gamedayBoxScore

    }


}

export { GamedayParseService}