import { FileService } from "../util/file-service";
import moment = require('moment');
import { Boxscore, GamedayPlayer, GamedayFullPlayer, GamedayScoreboard, Team, TeamInfo, Venue, League, Division, Sport, Record, Position, Hand, PlayerStats, BattingStats, PitchingStats, FieldingStats, PlayerStatus, GameStatus, Person } from "../../dto/gameday/gameday-boxscore";
import { PlayerDay } from "../../dto/player-day";
import { Player } from "../../dto/player";
import { PlayerService } from "../player-service";
import { PlayerDayService } from "../player-day-service";
import { TranslateService } from "../util/translate-service";
import { PlayerBoxscoreMap } from "../../dto/gameday/player-boxscore-map";
import { PlayerBoxscoreMapService } from "./playerboxscoremap-service";

const fetch = require("node-fetch");


class GamedayService {

    host: string = "http://gd2.mlb.com"

    constructor(
        private scoreboardDb: any,
        private boxscoreDb: any,
        private mapService: PlayerBoxscoreMapService,
        private playerService: PlayerService,
        private translateService: TranslateService
    ) {}


    async downloadSeason(season: number) : Promise<void> {

        let start: Date = moment(`${season}-03-01`).toDate()
        let end: Date = moment(`${season}-11-07`).toDate()

        return this.downloadRange(start, end)

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

        let boxscores: Boxscore[] = []

        if (games && games.length > 0) {
            for (let game of games) {

                if (game.gameType === "R") {


                    let existingBoxscore: Boxscore = await this.readBoxScore(game.gamePk)
                    if (existingBoxscore) {
                        console.log(`Boxscore #${existingBoxscore.id} already exists`)
                    }

                    console.log(`Downloading box score #${game.gamePk}`)
                    let boxscore: Boxscore = await this.downloadBoxScore(game.gamePk)
                    boxscores.push(boxscore)
                } else {
                    console.log(`Skipping non-regular season game`)
                }
            }
        }


        //Save the player-boxscore map
        console.log(`Creating player/boxscore map for #${date}`)
        let map: PlayerBoxscoreMap = this.translateService.translatePlayerBoxscoreMap(date, boxscores)
        await this.mapService.put(date, map)


        //Any players need updated?
        // await this.updatePlayers(Object.keys(map.playerBoxscore), date)


        
    }


    /**
     * Inserts brand new players and updates any that haven't been tagged to play this season yet.
     * @param playerBoxscoreMap The daily map between playerId and boxscoreId
     * @param date 
     */
    async updatePlayers(playerIds:any[], date: Date) : Promise<void> {

        for (let playerId of playerIds) {

            let existing: Player = await this.playerService.read(parseInt(playerId))

            if (!existing) {
                let player: Player = await this.downloadPlayer(parseInt(playerId))
                player.seasons.push(date.getFullYear())
                console.log(`Creating player ${player.fullName}`)
                await this.playerService.create(player)
            } else {
                if (!existing.seasons.includes(date.getFullYear())) {
                    existing.seasons.push(date.getFullYear())
                    console.log(`Adding year ${date.getFullYear()} to ${existing.fullName}`)
                    await this.playerService.update(existing)
                }
            }
        }
    }


    async downloadSchedule(date: Date) : Promise<void> {

        let scheduleUrl = 'http://statsapi.mlb.com/api/v1/schedule?sportId=1&date=' + moment(date).format("MM/DD/YYYY")


        try {
            const miniScoreboard = await fetch(scheduleUrl)

            let rawJson = await miniScoreboard.json()

            let gamedayScoreboard: GamedayScoreboard = new GamedayScoreboard()
            Object.assign(gamedayScoreboard, rawJson)

            if (gamedayScoreboard.id) {
                await this.scoreboardDb.put(moment(date).format("YYYY-MM-DD"), gamedayScoreboard)
            } else {
                console.log(`No data found for ${date}`)
            }
            

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
        }

    }

    async readSchedule(date: Date) : Promise<any[]> {

        let gamedayScoreboard: GamedayScoreboard = new GamedayScoreboard()

        let result = await this.scoreboardDb.get(moment(date).format("YYYY-MM-DD"))

        Object.assign(gamedayScoreboard, result)

        if (!gamedayScoreboard || !gamedayScoreboard.dates || gamedayScoreboard.dates.length == 0) return

        let games 

        try {
            if (gamedayScoreboard.dates[0]) {
                games = gamedayScoreboard.dates[0].games
            }
            
        } catch(ex) {
            console.log(ex)
        }

        return games

    }



    async downloadBoxScore(gamePk: number) : Promise<Boxscore> {

        try {
            let response = await fetch(`http://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`)

            let rawJson = await response.json()

            let boxscore: Boxscore = this.translateService.translateBoxscore(rawJson)
            boxscore.id = gamePk


            await this.boxscoreDb.put(gamePk, boxscore)

            // console.log(`Boxscore size: ${JSON.stringify(packed).length}`)

            return boxscore
            
        } catch(ex) {
            console.log(`Error saving box score #${gamePk}`)
        }

    }
 
    




    async downloadPlayer(playerId: number) : Promise<Player> {

        try {
            
            let player: Player = new Player()

            let response = await fetch(`http://statsapi.mlb.com/api/v1/people?personIds=${playerId}`)

            let rawJson = await response.json()

            if (rawJson && rawJson.people && rawJson.people[0])
            Object.assign(player, rawJson.people[0])

            return player

        } catch(ex) {
            console.log(`Error downloading player #${playerId}`)
        }

    }



    async readBoxScore(gamePk: number) : Promise<Boxscore> {
    
        let results: any = await this.boxscoreDb.get(gamePk)

        if (results) {
            let boxscore: Boxscore = this.translateService.translateBoxscore(results)
            boxscore.id = gamePk
            return boxscore
        }

    }



}

export { GamedayService}