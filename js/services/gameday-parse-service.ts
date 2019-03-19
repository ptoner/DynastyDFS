import { GamedayBoxScore } from "../dto/gameday/gameday-boxscore"
import { GamedayGameEvents } from "../dto/gameday/gameday-game-events";
import { FileService } from "./file-service";
import { GamedayPlayers } from "../dto/gameday/gameday-players";

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
    async parseGameEvents(gameFolder: string) : Promise<GamedayGameEvents> {

        let localGameFolder: string = this.localFolder + gameFolder

        let fileContents: Buffer  = await this.ipfs.files.read(localGameFolder + "/innings/innings_all.xml")
        let rawXml = fileContents.toString()
        
        let gamedayGameEvents: GamedayGameEvents = new GamedayGameEvents(rawXml)

        return gamedayGameEvents

    }
    async parsePlayers(gameFolder: string) : Promise<GamedayPlayers> {

        let localGameFolder: string = this.localFolder + gameFolder

        let fileContents: Buffer  = await this.ipfs.files.read(localGameFolder + "/players.xml")

        let rawXml = fileContents.toString()

        let gamedayPlayers: GamedayPlayers = new GamedayPlayers(rawXml)
        
        return gamedayPlayers

    }

}

export { GamedayParseService}