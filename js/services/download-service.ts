import { PlayerDayService } from "./player-day-service";
import { PlayerService } from "./player-service";
import { FileService } from "./file-service";
import moment = require('moment');


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

        let start: Date = moment(`${season}-03-01`).toDate()
        let end: Date = moment(`${season}-11-07`).toDate()

        this.downloadRange(start, end)

    }

    async downloadRange(start: Date, end: Date) : Promise<void> {

        let loop: Date = new Date(start)
        while(loop <= end){

            await this.downloadDate(loop)

           loop.setDate(loop.getDate() + 1)
        }
    }

    async downloadDate(date: Date) : Promise<void> {

        console.log(`Downloading date: ${date}`)
        let games = await this.fetchGameDirectoriesOnDate(date)

        for (let game of games) {
            console.log(`Downloading files for: ${game} `)
            await this.downloadGameFiles(game)
        }
        
    }


    async fetchGameDirectoriesOnDate(date: Date) : Promise<any[]> {

        let gameDirectories: string[] = []

        let dayUrl = this._buildDayUrl(date)

        try {
            const miniScoreboard = await fetch(dayUrl + "miniscoreboard.json")

            const response = await miniScoreboard.json()

            if (response.data && response.data.games) {
                for (const game of response.data.games.game) {
                    gameDirectories.push(game.game_data_directory)
                }
            }

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
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


            response = await fetch(prefix + "/players.xml")
            this.fileService.writeToAll(await response.text(), [localGameFolder + "/players.xml"])

        } catch(ex) {
            console.log(`Error saving game files: ${gameFolderUrl}`)
        }
    }



    _buildDayUrl(date: Date) : string {

        // 01, 02, 03, ... 29, 30, 31
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate()
        // 01, 02, 03, ... 10, 11, 12
        var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
        // 1970, 1971, ... 2015, 2016, ...
        var yyyy = date.getFullYear()

        return this.host + `/components/game/mlb/year_${yyyy}/month_${MM}/day_${dd}/`
    }

}

export { DownloadService}