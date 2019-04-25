import { GamedayDownloadService } from "./gameday-download-service";
import { PlayerService } from "../player-service";
import { HitterDayService } from "../player-day-service";
import { PitcherDayService } from "../pitcher-day-service";
import { Player } from "../../dto/player";
import { Boxscore, BattingStats, PitchingStats, GamedayPlayer, GamedayFullPlayer } from "../../dto/gameday/gameday-boxscore";
import { HitterDay } from "../../dto/player-day";
import { PitcherDay } from "../../dto/pitcher-day";
var deepEqual = require('deep-equal')


import * as moment from 'moment';


class GamedayProcessService {

    constructor(
        private downloadService: GamedayDownloadService,
        private playerService: PlayerService,
        private hitterDayService: HitterDayService,
        private pitcherDayService: PitcherDayService
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
            let players: GamedayFullPlayer[] = await this.downloadService.readPlayers(gamePk)

            //Update player list
            await this.insertNewPlayersForGame(players)


            for (let gamedayPlayer of boxscore.getPlayers()) {
                
                let pitchingStats = gamedayPlayer.stats.pitching

                let player: Player = await this.playerService.read(gamedayPlayer.person.id)

                
                if (!player) {
                    throw "Can't generate player day for empty player"
                }

                let hitterDay: HitterDay = new HitterDay(player, date, gamedayPlayer.stats.batting, gamedayPlayer.seasonStats.batting, 0)
                await this.insertOrUpdateHitterDay(hitterDay)


                let pitcherDay: PitcherDay = new PitcherDay(player, date, gamedayPlayer.stats.pitching, gamedayPlayer.seasonStats.pitching, 0)
                await this.insertOrUpdatePitcherDay(pitcherDay)
            }


        } catch(ex) {
            console.log(`Problem processing game #${gamePk}`, ex)
        }
    }


    async insertOrUpdateHitterDay(hitterDay: HitterDay) : Promise<void> {

        if (!hitterDay || !hitterDay.date || !hitterDay.player) {
            console.log("Invalid record. Skipping.")
            return
        }


        let existing: HitterDay = await this.hitterDayService.read(hitterDay.player.id, hitterDay.date)

        if (!existing) {
            console.log(`Inserting hitter day: ${hitterDay.player.firstName} ${hitterDay.player.lastName} - ${hitterDay.date}`)
            await this.hitterDayService.create(hitterDay)
        } else {
            if (!deepEqual(existing, hitterDay)) {
                console.log(`Updating hitter day: ${hitterDay.player.firstName} ${hitterDay.player.lastName} - ${hitterDay.date}`)
                await this.hitterDayService.update(hitterDay)
            }
        }

    }


    async insertOrUpdatePitcherDay(pitcherDay: PitcherDay) : Promise<void> {

        if (!pitcherDay || !pitcherDay.date || !pitcherDay.player) {
            console.log("Invalid record. Skipping.")
            return
        }


        let existing: PitcherDay = await this.pitcherDayService.read(pitcherDay.player.id, pitcherDay.date)

        if (!existing) {
            console.log(`Inserting pitcher day: ${pitcherDay.player.firstName} ${pitcherDay.player.lastName} - ${pitcherDay.date}`)
            await this.pitcherDayService.create(pitcherDay)
        } else {
            if (!deepEqual(existing, pitcherDay)) {
                console.log(`Updating pitcher day: ${pitcherDay.player.firstName} ${pitcherDay.player.lastName} - ${pitcherDay.date}`)
                await this.pitcherDayService.update(pitcherDay)
            }
        }

    }




    async insertNewPlayersForGame(players: GamedayFullPlayer[]) {

        for (let gamedayPlayer of players) {

            try {

                //Check if it already exists
                let existing: Player =  await this.playerService.read(gamedayPlayer.id)
    
                let newPlayer: Player = new Player(gamedayPlayer)

            
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