import { FileService } from "./file-service";
import moment = require('moment');


const fetch = require("node-fetch");


class GamedayDownloadService {

    host: string = "http://gd2.mlb.com"
    localFolder: string = "/fantasybaseball/gameday"


    constructor(
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
        await this.downloadMiniScoreboard(date)

        let games = await this.readMiniScoreboard(date)

        for (let game of games) {
            console.log(`Downloading files for: ${game} `)
            await this.downloadGameFiles(game)
        }
        
    }


    async downloadMiniScoreboard(date: Date) : Promise<void> {

        let dayUrl = this._buildDayUrl(date)

        let localDayFolder: string = this.localFolder + dayUrl

        try {
            const miniScoreboard = await fetch(dayUrl + "/miniscoreboard.json")

            return this.fileService.writeToAll(await miniScoreboard.json(), [localDayFolder + "/miniscoreboard.json"])

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
        }

    }

    async readMiniScoreboard(date: Date) : Promise<string[]> {

        let gameDirectories: string[] = []

        let dayUrl = this._buildDayUrl(date)

        let localDayFolder: string = this.localFolder + dayUrl

        let rawJson = await this.fileService.loadFile(localDayFolder + "/miniscoreboard.json")

        if (rawJson.data && rawJson.data.games) {
            for (const game of rawJson.data.games.game) {
                gameDirectories.push(game.game_data_directory)
            }
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
            this.fileService.writeBufferToAll(await response.buffer(), [localGameFolder + "/players.xml"])

            response = await fetch(prefix + "/inning/inning_all.xml")
            this.fileService.writeBufferToAll(await response.buffer(), [localGameFolder + "/inning/inning_all.xml"])

        } catch(ex) {
            console.log(`Error saving game files: ${gameFolderUrl}`)
        }
    }

    

    _buildDayUrl(date: Date) : string {

        const dd = (date.getDate() < 10 ? '0' : '') + date.getDate()
        const MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
        const yyyy = date.getFullYear()

        return this.host + `/components/game/mlb/year_${yyyy}/month_${MM}/day_${dd}`
    }

}

export { GamedayDownloadService}