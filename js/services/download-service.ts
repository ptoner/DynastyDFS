import { PlayerDayService } from "./player-day-service";
import { PlayerService } from "./player-service";

const fetch = require("node-fetch");


class DownloadService {

    host: string = "http://gd2.mlb.com/"


    constructor(
        private playerDayService: PlayerDayService,
        private playerService: PlayerService
    ) {}


    async downloadSeason(season: number) : Promise<void> {

    }

    async downloadRange(start: Date, end: Date) : Promise<void> {

    }

    async downloadDate(date: Date) : Promise<void> {

        let games = await this.fetchGamesOnDate(date)

        for (let game of games) {

        }
        
    }


    async fetchGamesOnDate(date: Date) : Promise<any[]> {

        let games: any[] = []

        let dayUrl = this._buildDayUrl(date)

        try {
            const miniScoreboard = await fetch(dayUrl + "miniscoreboard.json")

            const response = await miniScoreboard.json()

            for (const game of response.data.games.game) {
                games.push(game)
            }
        } catch(ex) {
            console.log("Couldn't fetch scoreboard from gameday: ", ex)
        }

        return games
    }

    async getBoxscoreForGame(gameFolderUrl: string ) : Promise<any> {

        let boxscore: any

        try {
            const response = await fetch(gameFolderUrl + "boxscore.json")
            boxscore = await response.json()

        } catch(ex) {
            console.log("Error getting boxscore")
            console.log(ex)
        }

        return boxscore

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

        return this.host + `components/game/mlb/year_${year}/month_${month}/day_${day}/`
    }

}

export { DownloadService}