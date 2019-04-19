import { GamedayDownloadService } from "./gameday-download-service";
import { PlayerService } from "../player-service";
import { HitterDayService } from "../hitter-day-service";
import { PitcherDayService } from "../pitcher-day-service";
import { Player } from "../../dto/player";
import { Boxscore, BattingStats, PitchingStats, GamedayPlayer, GamedayFullPlayer } from "../../dto/gameday/gameday-boxscore";
import { HitterDay } from "../../dto/hitter-day";
import { PitcherDay } from "../../dto/pitcher-day";
import * as moment from 'moment';


class GamedayProcessService {

    constructor(
        private downloadService: GamedayDownloadService,
        private playerService: PlayerService,
        private hitterDayService: HitterDayService,
        private pitcherDayService: PitcherDayService
    ) {}

    
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
            for (let game of games) {
                await this.createPlayerDaysForGame(game.gamePk, date)
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

                console.log(`Inserting hitter day: ${player.firstName} ${player.lastName} - ${date}`)
                let hitterDay: HitterDay = new HitterDay(player, date, gamedayPlayer.stats.batting, gamedayPlayer.seasonStats.batting, 0)
                await this.hitterDayService.create(hitterDay)


                console.log(`Inserting pitcher day: ${player.firstName} ${player.lastName} - ${date}`)
                let pitcherDay: PitcherDay = new PitcherDay(player, date, gamedayPlayer.stats.pitching, gamedayPlayer.seasonStats.pitching, 0)

                await this.pitcherDayService.create(pitcherDay)

            }


        } catch(ex) {
            console.log(`Problem processing game #${gamePk}`)
        }
    }


    async insertNewPlayersForGame(players: GamedayFullPlayer[]) {
        
        for (let gamedayPlayer of players) {

            try {
                let exists: boolean = true

                //Check if it already exists
                let player: Player =  await this.playerService.read(gamedayPlayer.id)
    
                if (!player) {
                    exists = false
                }
    
                player = new Player(gamedayPlayer)
    
                if (exists) {
                    // console.log(`Updating player: ${player.firstName} ${player.lastName}`)
                    await this.playerService.update(player)
                } else {
                    // console.log(`Creating player: ${player.firstName} ${player.lastName}`)
                    await this.playerService.create(player)
                }
            } catch(ex) {
                console.log(ex)
            }
        }
    }

    async processHitterSeason(year: number) {


    }




    // buildPitcherDay(pitchingAppearance: PitchingAppearance, atBats: GamedayAtBat[], player: Player, date: Date) : PitcherDay {

    //     let pitcherDay: PitcherDay = new PitcherDay()
    //     pitcherDay.player = player 
    //     pitcherDay.setDate(date)

    //     pitcherDay.battersFace = pitchingAppearance.battersFace
    //     pitcherDay.numberOfPitches = pitchingAppearance.numberOfPitches
    //     pitcherDay.strikes = pitchingAppearance.strikes
    //     pitcherDay.hits = pitchingAppearance.hits 
    //     pitcherDay.runs = pitchingAppearance.runs
    //     pitcherDay.hr = pitchingAppearance.hr 
    //     pitcherDay.so = pitchingAppearance.so
    //     pitcherDay.bb = pitchingAppearance.bb 
    //     pitcherDay.outs = pitchingAppearance.outs
    //     pitcherDay.earnedRuns = pitchingAppearance.earnedRuns
    //     pitcherDay.won = pitchingAppearance.won
    //     pitcherDay.lost = pitchingAppearance.lost 
    //     pitcherDay.saved = pitchingAppearance.saved 
    //     pitcherDay.blewSave = pitchingAppearance.blewSave


    //     return pitcherDay
    // }






}

export {
    GamedayProcessService
}