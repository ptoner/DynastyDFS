import { PlayerDay } from "../dto/player-day";
import { BattingStats, PitchingStats, Boxscore, GamedayPlayer, PlayerStats, FieldingStats } from "../dto/gameday/gameday-boxscore";
import { GamedayService } from "./gameday-service";
import { TranslateService } from "./util/translate-service";
import { PlayerBoxscoreMap } from "../dto/gameday/player-boxscore-map";
import { PlayerBoxscoreMapService } from "./playerboxscoremap-service";



class PlayerDayService {

    constructor(
        private mapService: PlayerBoxscoreMapService,
        private gamedayService: GamedayService,
        private translateService: TranslateService
    ) {}

    async read(playerId: number, date: Date) : Promise<PlayerDay> {
        
        let playerDay: PlayerDay = new PlayerDay()
        playerDay.setDate(date)

        //Get player-boxscore map 
        let map: PlayerBoxscoreMap = await this.mapService.read(date)

        let boxscoreIds: number[] = map.playerBoxscore[playerId]


        //Add all the GamedayPlayer games together
        let players: GamedayPlayer[] = []
        for (let boxscoreId of boxscoreIds) {
            let boxscore: Boxscore = await this.gamedayService.readBoxScore(boxscoreId)
            for (let player of boxscore.getPlayers()) {
                if (player.id == playerId) {
                    players.push(this.translateService.translateGamedayPlayer(player))                    
                }
            }
        }

        
        playerDay.player = this._combineGamedayPlayer(players)


        return playerDay
        
    }


    _combineGamedayPlayer(players: GamedayPlayer[]) : GamedayPlayer {

        if (!players || players.length == 0) return null

        let player: GamedayPlayer = new GamedayPlayer()
        Object.assign(player, players[players.length-1]) //grab defaults from the last one

        player.stats = new PlayerStats()

        let batting: BattingStats[] = []
        let pitching: PitchingStats[] = []
        let fielding: FieldingStats[] = []

        for (let thePlayer of players) {
            batting.push(thePlayer.stats.batting)
            pitching.push(thePlayer.stats.pitching)
            fielding.push(thePlayer.stats.fielding)
        }

        player.stats.batting = this.addBattingStats(batting)
        player.stats.pitching = this.addPitchingStats(pitching)
        player.stats.fielding = this.addFieldingStats(fielding)


        //Combine day stats

        return player


    }

    addBattingStats(stats: BattingStats[]) : BattingStats {

        let b: BattingStats = new BattingStats()

        b = this.sum(stats, [
            "gamesPlayed",
            "flyOuts",
            "groundOuts",
            "runs",
            "gamesPlayed",
            "flyOuts",
            "groundOuts",
            "runs",
            "doubles",
            "triples",
            "homeRuns",
            "strikeOuts",
            "baseOnBalls",
            "intentionalWalks",
            "hits",
            "hitByPitch",
            "atBats",
            "caughtStealing",
            "stolenBases",
            "groundIntoDoublePlay",
            "groundIntoTriplePlay",
            "totalBases",
            "rbi",
            "leftOnBase",
            "sacBunts",
            "sacFlies",
            "catchersInterference",
            "pickoffs"
        ])


        return b
    }


    addPitchingStats(stats: PitchingStats[]) : PitchingStats {

        let p: PitchingStats = new PitchingStats()

        p = this.sum(stats, [
            "gamesPlayed",
            "gamesStarted",
            "groundOuts",
            "runs",
            "doubles",
            "triples",
            "homeRuns",
            "runs",
            "doubles",
            "triples",
            "homeRuns",
            "strikeOuts",
            "baseOnBalls",
            "intentionalWalks",
            "hits",
            "atBats",
            "caughtStealing",
            "stolenBases",
            "numberOfPitches",
            "inningsPitched",
            "wins",
            "losses",
            "saves",
            "saveOpportunities",
            "holds",
            "blownSaves",
            "earnedRuns",
            "battersFaced",
            "outs",
            "gamesPitched",
            "completeGames",
            "shutouts",
            "pitchesThrown",
            "balls",
            "strikes",
            "hitBatsmen",
            "wildPitches",
            "pickoffs",
            "airOuts",
            "rbi",
            "inheritedRunners",
            "inheritedRunnersScored",
            "catchersInterference",
            "sacBunts",
            "sacFlies"
        ])


        return p
    }


    addFieldingStats(stats: FieldingStats[]) : FieldingStats  {

        let f: FieldingStats = new FieldingStats()

        f = this.sum(stats, [
            "assists",
            "putOuts",
            "errors",
            "chances",
            "fielding",
            "caughtStealing",
            "passedBall",
            "stolenBases",
            "stolenBasePercentage",
            "pickoffs"
            
        ])

        return f
    }





    sum(data, keys) { 
        return data.reduce(function (a, b) {
            for (let key of keys) {
                a[key] = a[key] + b[key]
            }
            return a;
        })
    };


}

export { PlayerDayService }

