import { FileService } from "../util/file-service";
import moment = require('moment');
import { Boxscore, GamedayPlayer, GamedayFullPlayer } from "../../dto/gameday/gameday-boxscore";


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
        await this.downloadSchedule(date)

        let games: any[] = await this.readSchedule(date)

        if (games && games.length > 0) {
            for (let game of games) {
                await this.downloadGameFiles(game.gamePk)
            }
        }

        
    }


    async downloadSchedule(date: Date) : Promise<void> {

        let scheduleUrl = 'http://statsapi.mlb.com/api/v1/schedule?sportId=1&date=' + moment(date).format("MM/DD/YYYY")


        try {
            const miniScoreboard = await fetch(scheduleUrl)

            let filename: string =  `${this.localFolder}/scoreboard/${moment(date).format("YYYY-MM-DD")}.json`

            let buffer = await miniScoreboard.buffer()

            await this.fileService.writeBufferToAll(buffer, [filename])

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
        }

    }

    async readSchedule(date: Date) : Promise<any[]> {


        let rawJson = await this.fileService.loadFile(`${this.localFolder}/scoreboard/${moment(date).format("YYYY-MM-DD")}.json`)
        
        let games 

        try {
            if (rawJson.dates[0]) {
                games = rawJson.dates[0].games
            }
            
        } catch(ex) {
            console.log(ex)
        }

        return games

    }


    async downloadGameFiles(gamePk: number) : Promise<void> {

        console.log(`Downloading files for game #${gamePk}`)

        try {
            await this.downloadBoxScore(gamePk)
            await this.downloadPlayers(gamePk)

            
        } catch(ex) {
            console.log(`Error saving game #${gamePk}`)
        }
    }


    async downloadBoxScore(gamePk: number) : Promise<void> {

        try {
            let response = await fetch(`http://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`)
            await this.fileService.writeToAll(await response.json(), [this.localFolder + `/games/${gamePk}/boxscore.json`])

            
        } catch(ex) {
            console.log(`Error saving box score #${gamePk}`)
        }

    }


    async downloadPlayers(gamePk: number) : Promise<void> {

        try {

            let boxscore: Boxscore = await this.readBoxScore(gamePk)

            let players: GamedayPlayer[] = boxscore.getPlayers()

            let playerIds: number[] = []

            for (let player of players) {
                playerIds.push(player.person.id)
            }

            let playerIdString = playerIds.join(", ")
            
            let response = await fetch(`http://statsapi.mlb.com/api/v1/people?personIds=${playerIdString}`)
            await this.fileService.writeToAll(await response.json(), [this.localFolder + `/games/${gamePk}/players.json`])

        } catch(ex) {
            console.log(`Error downloading players for game #${gamePk}`)
        }

    }



    async readBoxScore(gamePk: Number) : Promise<Boxscore> {

        let rawJson = await this.fileService.loadFile(`${this.localFolder}/games/${gamePk}/boxscore.json`)

        let gamedayBoxScore: Boxscore = new Boxscore(rawJson)

        return gamedayBoxScore

    }


    async readPlayers(gamePk: Number) : Promise<GamedayFullPlayer[]> {

        let players: GamedayFullPlayer[] = []

        let rawJson = await this.fileService.loadFile(`${this.localFolder}/games/${gamePk}/players.json`)

        for (let player of rawJson.people) {
            players.push(new GamedayFullPlayer(player))
        }

        return players

    }

}

export { GamedayDownloadService}