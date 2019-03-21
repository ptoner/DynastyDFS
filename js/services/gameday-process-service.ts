import { GamedayParseService } from "./gameday-parse-service";
import { GamedayDownloadService } from "./gameday-download-service";
import { GameSummary } from "../dto/gameday/game-summary";
import { PlayerService } from "./player-service";
import { HitterDayService } from "./hitter-day-service";
import { PitcherDayService } from "./pitcher-day-service";
import { GamedayPlayers } from "../dto/gameday/gameday-players";
import { Player } from "../dto/player";
import { Batting, BattingAppearance, PitchingAppearance } from "../dto/gameday/gameday-boxscore";
import { HitterDay } from "../dto/hitter-day";
import { PitcherDay } from "../dto/pitcher-day";
import { GamedayAtBat } from "../dto/gameday/gameday-atbats";
import * as moment from 'moment';


class GamedayProcessService {

    constructor(
        private parseService: GamedayParseService,
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

        return this.playerService.write()
    }


    async createPlayerDaysForDate(date: Date) : Promise<void> {

        console.log(`Creating player days for ${date}`)

        try {
            //Read scoreboard
            let games = await this.downloadService.readMiniScoreboard(date)

            //Loop through every game
            for (let game of games) {

                try {
                    let gameSummary: GameSummary = await this.parseService.parseGame(game)
    
                    //Update player list
                    await this.insertNewPlayersForGame(gameSummary.players)
    
                    for (let battingAppearance of gameSummary.boxScore.batting.appearances) {
    
                        let atBats: GamedayAtBat[] = gameSummary.atBats.atBats.filter(function(el) {
                            return el.batterId == battingAppearance.playerId
                        })
    
                        let player: Player = await this.playerService.read(battingAppearance.playerId)
    
                        console.log(`Inserting hitter day: ${player.firstName} ${player.lastName} - ${gameSummary.boxScore.date}`)
    
                        await this.hitterDayService.create(this.buildHitterDay(battingAppearance, atBats, player, gameSummary.boxScore.date))
                    }
    
                    for (let pitchingAppearance of gameSummary.boxScore.pitching.appearances) {
    
                        let atBats: GamedayAtBat[] = gameSummary.atBats.atBats.filter(function(el) {
                            return el.pitcherId == pitchingAppearance.playerId
                        })
    
                        let player: Player = await this.playerService.read(pitchingAppearance.playerId)
    
                        console.log(`Inserting pitcher day: ${player.firstName} ${player.lastName} - ${gameSummary.boxScore.date}`)
    
                        await this.pitcherDayService.create(this.buildPitcherDay(pitchingAppearance, atBats, player, gameSummary.boxScore.date))
                    }
                } catch(ex) {
                    console.log(`Problem processing game: ${game}`)
                }
            }
        } catch(ex) {
            console.log(ex)
        }





    }

    async insertNewPlayersForGame(gamedayPlayers: GamedayPlayers) {
        
        for (let gamedayPlayer of gamedayPlayers.playerList) {

            let exists: boolean = true

            let player: Player =  await this.playerService.read(gamedayPlayer.playerId)

            if (!player) {
                player = new Player()
                exists = false
            }

            player.id = gamedayPlayer.playerId
            player.firstName = gamedayPlayer.firstName
            player.lastName = gamedayPlayer.lastName
            player.bats = gamedayPlayer.bats
            player.pitches = gamedayPlayer.pitches

            if (gamedayPlayer.gamePosition) {
                if (player.positions.indexOf(gamedayPlayer.gamePosition) == -1) {
                    player.positions.push(gamedayPlayer.gamePosition)
                }
            }


            if (exists) {
                // console.log(`Updating player: ${player.firstName} ${player.lastName}`)
                await this.playerService.update(player)
            } else {
                // console.log(`Creating player: ${player.firstName} ${player.lastName}`)
                await this.playerService.create(player)
            }

        }


    }

    buildHitterDay(battingAppearance: BattingAppearance, atBats: GamedayAtBat[], player: Player, date: Date) : HitterDay {

        let hitterDay: HitterDay = new HitterDay()
        hitterDay.player = player
        hitterDay.setDate(date)

        for (let atBat of atBats) {
            if (atBat.isSingle()) hitterDay.singles++
            if (atBat.isDouble()) hitterDay.doubles++
            if (atBat.isTriple()) hitterDay.triples++
            if (atBat.isHr()) hitterDay.homeRuns++
            if (atBat.isIBB()) hitterDay.ibb++
        }

        hitterDay.hits = battingAppearance.hits
        hitterDay.runsScored = battingAppearance.runs

        hitterDay.rbi = battingAppearance.rbi
        hitterDay.bb = battingAppearance.bb
        hitterDay.k = battingAppearance.so
        hitterDay.hbp = battingAppearance.hbp
        hitterDay.sb = battingAppearance.sb
        hitterDay.cs = battingAppearance.cs

        return hitterDay

    }

    buildPitcherDay(pitchingAppearance: PitchingAppearance, atBats: GamedayAtBat[], player: Player, date: Date) : PitcherDay {

        let pitcherDay: PitcherDay = new PitcherDay()
        pitcherDay.player = player 
        pitcherDay.setDate(date)

        pitcherDay.battersFace = pitchingAppearance.battersFace
        pitcherDay.numberOfPitches = pitchingAppearance.numberOfPitches
        pitcherDay.strikes = pitchingAppearance.strikes
        pitcherDay.hits = pitchingAppearance.hits 
        pitcherDay.runs = pitchingAppearance.runs
        pitcherDay.hr = pitchingAppearance.hr 
        pitcherDay.so = pitchingAppearance.so
        pitcherDay.bb = pitchingAppearance.bb 
        pitcherDay.outs = pitchingAppearance.outs
        pitcherDay.earnedRuns = pitchingAppearance.earnedRuns
        pitcherDay.won = pitchingAppearance.won
        pitcherDay.lost = pitchingAppearance.lost 
        pitcherDay.saved = pitchingAppearance.saved 
        pitcherDay.blewSave = pitchingAppearance.blewSave


        return pitcherDay
    }






}

export {
    GamedayProcessService
}