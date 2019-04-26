import { GamedayDownloadService } from "./gameday-download-service";
import { PlayerService } from "../player-service";
import { PlayerDayService } from "../player-day-service";
import { Player } from "../../dto/player";
import { Boxscore, BattingStats, PitchingStats, GamedayPlayer, GamedayFullPlayer } from "../../dto/gameday/gameday-boxscore";
import { PlayerDay } from "../../dto/player-day";
var deepEqual = require('deep-equal')


import * as moment from 'moment';


class GamedayProcessService {

    constructor(
        private downloadService: GamedayDownloadService,
        private playerService: PlayerService,
        private playerDayService: PlayerDayService
    ) {}


    async processSeason(season: number) : Promise<void> {

        let start: Date = moment(`${season}-03-01`).toDate()
        let end: Date = moment(`${season}-11-07`).toDate()

        this.processDateRange(start, end)

    }

    
    async processDateRange(start: Date, end: Date) : Promise<void> {

        let loop: Date = new Date(start)
        while(loop <= end){

            await this.createPlayerDaysForDate(loop)

           loop.setDate(loop.getDate() + 1)
        }

        // return this.playerService.write()
    }


    async createPlayerDaysForDate(date: Date) : Promise<void> {

        console.log(`Creating player days for ${date}`)

        try {
            // Read scoreboard
            let games = await this.downloadService.readSchedule(date)

            //Loop through every game
            if (games && games.length > 0) {
                for (let game of games) {
                    await this.createPlayerDaysForGame(game.gamePk, date)
                }
            }

        } catch(ex) {
            console.log(ex)
        }

    }


    async createPlayerDaysForGame(gamePk: number, date: Date) {
        
        try {
            let boxscore: Boxscore = await this.downloadService.readBoxScore(gamePk)

            //Update player list
            await this.insertNewPlayersForGame(boxscore.fullPlayers)


            for (let gamedayPlayer of boxscore.getPlayers()) {
                
                let player: Player = await this.playerService.read(gamedayPlayer.person.id)
                
                if (!player) {
                    throw "Can't generate player day for empty player"
                }

                let playerDay: PlayerDay = new PlayerDay()
                playerDay.player = player
                playerDay.setDate(date)
                playerDay.dayBatting = gamedayPlayer.stats.batting
                playerDay.dayPitching =  gamedayPlayer.stats.pitching

                playerDay.seasonBatting = gamedayPlayer.seasonStats.batting
                playerDay.seasonPitching = gamedayPlayer.seasonStats.pitching

                await this.insertOrUpdatePlayerDay(playerDay)

            }


        } catch(ex) {
            console.log(`Problem processing game #${gamePk}`, ex)
        }
    }


    async insertOrUpdatePlayerDay(hitterDay: PlayerDay) : Promise<void> {

        if (!hitterDay || !hitterDay.date || !hitterDay.player) {
            console.log("Invalid record. Skipping.")
            return
        }

        console.log(`Inserting hitter day: ${hitterDay.player.firstName} ${hitterDay.player.lastName} - ${hitterDay.date}`)
        await this.playerDayService.save(hitterDay)
    }




    async insertNewPlayersForGame(players: GamedayFullPlayer[]) {

        for (let gamedayPlayer of players) {

            try {

                //Check if it already exists
                let existing: Player =  await this.playerService.read(gamedayPlayer.id)
    
                let newPlayer: Player = new Player()
                Object.assign(newPlayer, gamedayPlayer)

            
                if (existing) {

                    //Only update if something has actually changed.
                    if (!deepEqual(existing, newPlayer)) {
                        console.log(`Updating player: ${existing.firstName} ${existing.lastName}`)
                        await this.playerService.update(newPlayer)
                    }
                } else {
                    console.log(`Creating player: ${newPlayer.firstName} ${newPlayer.lastName}`)
                    await this.playerService.create(newPlayer)
                }
            } catch(ex) {
                console.log(ex)
            }
        }
    }




}

export {
    GamedayProcessService
}