import { PlayerDayService } from "./player-day-service";
import { PlayerService } from "./player-service";
import { FileService } from "./file-service";

const fetch = require("node-fetch");


class DownloadService {

    host: string = "http://gd2.mlb.com"
    localFolder: string = "/fantasybaseball/gameday"


    constructor(
        private playerDayService: PlayerDayService,
        private playerService: PlayerService,
        private fileService: FileService
    ) {}


    async downloadSeason(season: number) : Promise<void> {

    }

    async downloadRange(start: Date, end: Date) : Promise<void> {

    }

    async downloadDate(date: Date) : Promise<void> {

        let games = await this.fetchGameDirectoriesOnDate(date)

        for (let game of games) {

        }
        
    }


    async fetchGameDirectoriesOnDate(date: Date) : Promise<any[]> {

        let gameDirectories: string[] = []

        let dayUrl = this._buildDayUrl(date)

        try {
            const miniScoreboard = await fetch(dayUrl + "miniscoreboard.json")

            const response = await miniScoreboard.json()

            for (const game of response.data.games.game) {
                gameDirectories.push(game.game_data_directory)
            }
        } catch(ex) {
            console.log("Couldn't fetch scoreboard from gameday: ", ex)
        }

        return gameDirectories
    }

    async downloadGameFiles(gameFolderUrl: string ) : Promise<void> {
        
        let prefix: string = this.host + gameFolderUrl


       let localGameFolder: string = this.localFolder + gameFolderUrl


        try {
            let response = await fetch(prefix + "/boxscore.json")
            this.fileService.writeToAll(await response.json(), [localGameFolder + "/boxscore.json"])

            response = await fetch(prefix + "/linescore.json")
            this.fileService.writeToAll(await response.json(), [localGameFolder + "/linescore.json"])

            response = await fetch(prefix + "/game_events.json")
            this.fileService.writeToAll(await response.json(), [localGameFolder + "/game_events.json"])

        } catch(ex) {
            console.log("Error saving game files")
            console.log(ex)
        }
    }

    async downloadGamesOnDate(date: Date) : Promise<void> {

    }





    _buildDayUrl(date: Date) : string {

        const year = date.getFullYear()

        let monthNumber = date.getMonth() + 1
        let dayNumber = date.getDay()

        let month: string = monthNumber.toString()
        let day: string = dayNumber.toString()

        if (month.toString().length === 1) {
            month = `0${month}`
        }

        if (day.toString().length === 1) {
            day = `0${day}`
        }

        return this.host + `/components/game/mlb/year_${year}/month_${month}/day_${day}/`
    }

}

export { DownloadService}