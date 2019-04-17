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

        let games: any[] = await this.readMiniScoreboard(date)


        for (let game of games) {
            await this.downloadGameFiles(game.gamePk)
        }
        
    }


    async downloadMiniScoreboard(date: Date) : Promise<void> {

        let scheduleUrl = 'http://statsapi.mlb.com/api/v1/schedule?sportId=1&date=' + moment(date).format("MM/DD/YYYY")


        try {
            const miniScoreboard = await fetch(scheduleUrl)

            let filename: string =  `${this.localFolder}/scoreboard/${moment(date).format("MM/DD/YYYY")}.json`

            let buffer = await miniScoreboard.buffer()

            await this.fileService.writeBufferToAll(buffer, [filename])

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
        }

    }

    async readMiniScoreboard(date: Date) : Promise<string[]> {


        let rawJson = await this.fileService.loadFile(`${this.localFolder}/scoreboard/${moment(date).format("MM/DD/YYYY")}.json`)
        
        let games 

        try {
            games = rawJson.dates[0].games
        } catch(ex) {
            console.log(ex)
        }


        return games


    }


    async downloadGameFiles(gamePk: number) : Promise<void> {

        console.log(`Downloading files for game #${gamePk}`)


        try {
            let response = await fetch(`http://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`)
            await this.fileService.writeToAll(await response.json(), [this.localFolder + `/games/${gamePk}/boxscore.json`])

        } catch(ex) {
            console.log(`Error saving game #${gamePk}`)
        }
    }



}

export { GamedayDownloadService}