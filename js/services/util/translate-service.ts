import { Boxscore, Team, GamedayPlayer, TeamInfo, Venue, League, Division, Sport, Record, Person, Position, PlayerStats, PlayerStatus, GameStatus, BattingStats, PitchingStats, FieldingStats, GamedayFullPlayer, Hand } from "../../dto/gameday/gameday-boxscore";
import { Player } from "../../dto/player";
import { PlayerDay } from "../../dto/player-day";
import { PlayerBoxscoreMap } from "../../dto/gameday/player-boxscore-map";



class TranslateService {


    translateBoxscore(rawJson:any) : Boxscore {

        let boxscore: Boxscore = new Boxscore()
        boxscore.teams.away =   this.translateTeam(rawJson.teams.away)  
        boxscore.teams.home = this.translateTeam(rawJson.teams.home)  
        
        return boxscore
    }

    translateTeam(rawJson:any) : Team {

        let team: Team = new Team()

        Object.assign(team, rawJson)

        team.team = this.translateTeamInfo( rawJson.team )

        //@ts-ignore
        delete team.info 
        //@ts-ignore
        delete team.teamStats

        team.players = []
        for (let key in rawJson.players) {
            let player: GamedayPlayer = this.translateGamedayPlayer(rawJson.players[key])
            team.players.push(player)
        }

        return team
    }


    translateTeamInfo(rawJson:any) : TeamInfo {

        let teamInfo:TeamInfo = new TeamInfo()

        Object.assign(teamInfo, rawJson)

        // teamInfo.venue = new Venue()
        // Object.assign(teamInfo.venue, rawJson.venue)

        // teamInfo.league = new League()
        // Object.assign(teamInfo.league, rawJson.league)

        // teamInfo.division = new Division()
        // Object.assign(teamInfo.division, rawJson.division)

        // teamInfo.sport = new Sport()
        // Object.assign(teamInfo.sport, rawJson.sport)

        // teamInfo.record = new Record()
        // Object.assign(teamInfo.record, rawJson.record)

        return teamInfo
    }


    translateGamedayPlayer(rawJson: any) : GamedayPlayer {

        let player: GamedayPlayer = new GamedayPlayer()

        Object.assign(player, rawJson)

        player.person = new Person()
        Object.assign(player.person, rawJson.person)
        
        player.position = new Position()
        Object.assign(player.position, rawJson.position)

        player.stats = this.translatePlayerStats(rawJson.stats)
        player.seasonStats = this.translatePlayerStats(rawJson.seasonStats)

        player.status = new PlayerStatus()
        Object.assign(player.status, rawJson.status)

        player.gameStatus = new GameStatus()
        Object.assign(player.gameStatus, rawJson.gameStatus)

        player.allPositions = []
        for (let key in rawJson.allPositions) {
            let position:Position =  new Position()
            Object.assign(position, rawJson.allPositions[key])
            player.allPositions.push(position)
        }

        return player
    }

    translatePlayerStats(rawJson: any) : PlayerStats {

        let stats: PlayerStats = new PlayerStats()

        stats.batting = new BattingStats()
        Object.assign(stats.batting, rawJson.batting)


        stats.pitching = new PitchingStats()
        Object.assign(stats.pitching, rawJson.pitching)

        stats.fielding = new FieldingStats()
        Object.assign(stats.fielding, rawJson.fielding)


        return stats

    }


    translateGamedayFullPlayer(rawJson: any) : GamedayFullPlayer {

        let player: GamedayFullPlayer = new GamedayFullPlayer()

        Object.assign(player, rawJson)

        player.primaryPosition = new Position()
        Object.assign(player.primaryPosition, rawJson.primaryPosition)

        player.batSide = new Hand()
        Object.assign(player.batSide, rawJson.batSide)

        player.pitchHand = new Hand()
        Object.assign(player.pitchHand, rawJson.pitchHand)

        return player


    }


    translatePlayer(rawJson: any) : Player {

        if (!rawJson) return

        let player: Player = new Player()

        Object.assign(player, rawJson)

        player.primaryPosition = new Position()
        Object.assign(player.primaryPosition, rawJson.primaryPosition)

        player.batSide = new Hand()
        Object.assign(player.batSide, rawJson.batSide)

        player.pitchHand = new Hand()
        Object.assign(player.pitchHand, rawJson.pitchHand)


        return player

    }


    translatePlayerDay(rawJson: any) : PlayerDay {

        if (!rawJson) return

        let playerDay:PlayerDay = new PlayerDay()
        
        Object.assign(playerDay, rawJson)
        
        playerDay.player = this.translateGamedayPlayer(rawJson.player)

        return playerDay
    }



    translatePlayerDayFromGamedayPlayer(gamedayPlayer: GamedayPlayer, date: Date) : PlayerDay  {

        let playerDay: PlayerDay = new PlayerDay()

        playerDay.player = gamedayPlayer

        playerDay.setDate(date)
    
        return playerDay

    }


    translatePlayerBoxscoreMap(date: Date, boxscores: Boxscore[]) : PlayerBoxscoreMap {

        let map: PlayerBoxscoreMap = new PlayerBoxscoreMap()
        map.setDate(date)
        map.playerBoxscore = {}

        for (let boxscore of boxscores) {

            if (!boxscore) continue

            for (let player of boxscore.getPlayers()) {

                if (map.playerBoxscore[player.id]) {
                    map.playerBoxscore[player.id].push(boxscore.id)
                } else {
                    map.playerBoxscore[player.id] = [boxscore.id]
                }

            }
        }

        return map

    }


    translatePlayerBoxscoreMapRaw(rawJson) : PlayerBoxscoreMap {

        let map: PlayerBoxscoreMap = new PlayerBoxscoreMap()
        Object.assign(map, rawJson)

        return map

    }



}


export {
    TranslateService
}