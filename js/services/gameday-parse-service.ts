import { GamedayBoxScore } from "../dto/gameday/gameday-boxscore"
import { GamedayAtbats } from "../dto/gameday/gameday-atbats";
import { FileService } from "./file-service";
import { GamedayPlayers } from "../dto/gameday/gameday-players";
import { GameSummary } from "../dto/gameday/game-summary";

var convert = require('xml-js');


class GamedayParseService {
    
    host: string = "http://gd2.mlb.com"
    localFolder: string = "/fantasybaseball/gameday"

    constructor(
        private ipfs: any,
        private fileService: FileService
    ) {}

    async parseBoxScore(gameFolder: string) : Promise<GamedayBoxScore> {

        let localGameFolder: string = this.localFolder + gameFolder

        let rawJson = await this.fileService.loadFile(localGameFolder + "/boxscore.json")

        let gamedayBoxScore: GamedayBoxScore = new GamedayBoxScore(rawJson.data.boxscore)

        return gamedayBoxScore

    }
    async parseGameAtbats(gameFolder: string) : Promise<GamedayAtbats> {

        let localGameFolder: string = this.localFolder + gameFolder

        let fileContents: Buffer  = await this.ipfs.files.read(localGameFolder + "/inning/inning_all.xml")
        let rawXml = fileContents.toString('utf8')

        let rawJson = convert.xml2js(rawXml, {compact: true, spaces: 4});
        
        let gamedayGameAtbats: GamedayAtbats = new GamedayAtbats(rawJson.game)

        return gamedayGameAtbats

    }
    async parsePlayers(gameFolder: string) : Promise<GamedayPlayers> {

        let localGameFolder: string = this.localFolder + gameFolder

        let fileContents: Buffer  = await this.ipfs.files.read(localGameFolder + "/players.xml")
        let rawXml = fileContents.toString('utf8')

        let rawJson = convert.xml2js(rawXml, {compact: true, spaces: 4})
        

        let gamedayPlayers: GamedayPlayers = new GamedayPlayers(rawJson.game)
        
        return gamedayPlayers

    }

    async parseGame(gameFolder: string) : Promise<GameSummary> {

        return new GameSummary(
            await this.parseGameAtbats(gameFolder),
            await this.parseBoxScore(gameFolder),
            await this.parsePlayers(gameFolder)
        )

    }


}

export { GamedayParseService}