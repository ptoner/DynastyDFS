import { FileService } from "../util/file-service";
import moment = require('moment');


const fetch = require("node-fetch");


class GamedayDownloadService {

    host: string = "http://gd2.mlb.com"
    localFolder: string


    constructor(
        private fileService: FileService,
        private rootFolder: string
    ) {
        this.localFolder = rootFolder + "/gameday"
    }


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
            await this.downloadGameFiles(game)
        }
        
    }


    async downloadMiniScoreboard(date: Date) : Promise<void> {

        let dayUrl = this._buildDayUrl(date)

        let localDayFolder: string = this._buildDayFolder(date)

        try {
            const miniScoreboard = await fetch(dayUrl + "/miniscoreboard.json")

            let filename: string = localDayFolder + "/miniscoreboard.json"

            await this.fileService.writeBufferToAll(await miniScoreboard.buffer(), [filename])

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
        }

    }

    async readMiniScoreboard(date: Date) : Promise<string[]> {

        let gameDirectories: string[] = []

        let localDayFolder: string = this._buildDayFolder(date)

        let rawJson = await this.fileService.loadFile(localDayFolder + "/miniscoreboard.json")
        
        try {
            if (rawJson && rawJson.data && rawJson.data.games) {
                for (const game of rawJson.data.games.game) {
                    gameDirectories.push(game.game_data_directory)
                }
            }
        } catch(ex) {
            console.log(ex)
        }


        return gameDirectories


    }


    async downloadGameFiles(gameFolderUrl: string ) : Promise<void> {

        console.log(`Downloading files for: ${gameFolderUrl} `)

        let prefix: string = this.host + gameFolderUrl
        let localGameFolder: string = this.localFolder + gameFolderUrl

        try {
            let response = await fetch(prefix + "/boxscore.json")
            await this.fileService.writeToAll(await response.json(), [localGameFolder + "/boxscore.json"])

            response = await fetch(prefix + "/linescore.json")
            await this.fileService.writeToAll(await response.json(), [localGameFolder + "/linescore.json"])

            response = await fetch(prefix + "/game_events.json")
            await this.fileService.writeToAll(await response.json(), [localGameFolder + "/game_events.json"])

            response = await fetch(prefix + "/players.xml")
            await this.fileService.writeBufferToAll(await response.buffer(), [localGameFolder + "/players.xml"])

            response = await fetch(prefix + "/inning/inning_all.xml")
            await this.fileService.writeBufferToAll(await response.buffer(), [localGameFolder + "/inning/inning_all.xml"])

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

    _buildDayFolder(date: Date) : string {

        const dd = (date.getDate() < 10 ? '0' : '') + date.getDate()
        const MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
        const yyyy = date.getFullYear()

        return this.localFolder + `/components/game/mlb/year_${yyyy}/month_${MM}/day_${dd}`
    }

}

export { GamedayDownloadService}