import { FileService } from "../util/file-service";
import moment = require('moment');
import { Boxscore, GamedayPlayer, GamedayFullPlayer, GamedayScoreboard, Team, TeamInfo, Venue, League, Division, Sport, Record, Position, Hand, PlayerStats, BattingStats, PitchingStats, FieldingStats, PlayerStatus, GameStatus, Person } from "../../dto/gameday/gameday-boxscore";


const fetch = require("node-fetch");


class GamedayDownloadService {

    host: string = "http://gd2.mlb.com"

    constructor(
        private scoreboardDb: any,
        private boxscoreDb: any
    ) {}


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

            let rawJson = await miniScoreboard.json()

            let gamedayScoreboard: GamedayScoreboard = new GamedayScoreboard()
            Object.assign(gamedayScoreboard, rawJson)

            await this.scoreboardDb.put(gamedayScoreboard)

        } catch(ex) {
            console.log(`Couldn't fetch scoreboard from gameday: ${date}`, ex)
        }

    }

    async readSchedule(date: Date) : Promise<any[]> {

        let gamedayScoreboard: GamedayScoreboard = new GamedayScoreboard()

        let results : GamedayScoreboard[] = await this.scoreboardDb.get(moment(date).format("YYYY-MM-DD"))

        if (results && results.length >0) {
            Object.assign(gamedayScoreboard, results[0])
        }


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

            let rawJson = await response.json()

            let boxscore: Boxscore = this.translateBoxscore(rawJson)
            boxscore.id = gamePk

            await this.boxscoreDb.put(boxscore)

            
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

            let rawJson = await response.json()

            //Update the boxscore
            boxscore.fullPlayers = []
            for (let thePlayer of rawJson.people) {
                boxscore.fullPlayers.push(this.translateGamedayFullPlayer(thePlayer))
            }

            await this.boxscoreDb.put(boxscore)

        } catch(ex) {
            console.log(`Error downloading players for game #${gamePk}`)
        }

    }



    async readBoxScore(gamePk: number) : Promise<Boxscore> {
    
        let results: any[] = await this.boxscoreDb.get(gamePk)

        if (results && results.length > 0) {
            let boxscore: Boxscore = this.translateBoxscore(results[0])
            boxscore.id = gamePk
            return boxscore
        }

        throw new Error(`Boxscore for game #${gamePk} was not found`)

    }


    translateBoxscore(rawJson:any) : Boxscore {

        let boxscore: Boxscore = new Boxscore()
        boxscore.teams.away =   this.translateTeam(rawJson.teams.away)  
        boxscore.teams.home = this.translateTeam(rawJson.teams.home)  

        //Only exists when loading from db
        if (rawJson.fullPlayers) {
            boxscore.fullPlayers = []
            for (let thePlayer of rawJson.fullPlayers) {
                boxscore.fullPlayers.push(this.translateGamedayFullPlayer(thePlayer))
            }
        }
        
        return boxscore
    }

    translateTeam(rawJson:any) : Team {

        let team: Team = new Team()

        Object.assign(team, rawJson)

        team.teamInfo = this.translateTeamInfo(rawJson.team)

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

        teamInfo.venue = new Venue()
        Object.assign(teamInfo.venue, rawJson.venue)

        teamInfo.league = new League()
        Object.assign(teamInfo.league, rawJson.league)

        teamInfo.division = new Division()
        Object.assign(teamInfo.division, rawJson.division)

        teamInfo.sport = new Sport()
        Object.assign(teamInfo.sport, rawJson.sport)

        teamInfo.record = new Record()
        Object.assign(teamInfo.record, rawJson.record)

        return teamInfo
    }


    translateGamedayPlayer(rawJson: any) : GamedayPlayer {

        let player: GamedayPlayer = new GamedayPlayer()

        Object.assign(player, rawJson)

        player.person = new Person()
        Object.assign(player.person, rawJson.person)
        
        player.position = new Position()
        Object.assign(player.position, rawJson.position)

        player.stats = new PlayerStats()
        Object.assign(player.stats, rawJson.stats)

        player.status = new PlayerStatus()
        Object.assign(player.status, rawJson.status)

        player.seasonStats = new PlayerStats()
        Object.assign(player.seasonStats, rawJson.seasonStats)

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


}

export { GamedayDownloadService}