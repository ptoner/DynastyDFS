import * as moment from 'moment';





class Boxscore {

    public awayTeam: Team 
    public homeTeam: Team 

    constructor(rawJson) {
        this.awayTeam = new Team(rawJson.away)
        this.homeTeam = new Team(rawJson.home)
    }

}

class Team {

    public id: number
    public name: string 
    public link: string 
    public season: string 
    public venue: Venue 
    public teamCode: string 
    public fileCode: string 
    public abbreviation: string 
    public teamName: string 
    public locationName: string 
    public firstYearOfPlay: string

    public league: League
    public division: Division
    public sport: Sport 

    public shortName: string 
    public record: Record 

    public players: Player[]

    public batters: number[]
    public pitchers: number[]
    public bench: number[]
    public bullpen: number[]
    public battingOrder: number[]

    constructor(rawJson) {
        Object.assign(this, rawJson)

        this.venue = new Venue(rawJson.venue)
        this.league = new League(rawJson.league)
        this.division = new Division(rawJson.division)
        this.sport = new Sport(rawJson.sport)
        this.record = new Record(rawJson.record)
    }

}

class Venue {
    public id: number 
    public name: string 
    public link: string 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}

class League {
    public id: number 
    public name: string 
    public link: string 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}

class Division {
    public id: number 
    public name: string 
    public link: string 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}

class Sport {
    public id: number 
    public name: string 
    public link: string 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}


class Record {
    public gamesPlayed: number 
    public wildCardGamesBack: number 
    public leagueGamesBack: number 
    public springLeagueGamesBack: number 
    public sportGamesBack: number 
    public divisionGamesBack: number 
    public conferenceGamesBack: number 
    public leagueRecord: LeagueRecord 

    public divisionLeader: boolean
    public wins: number 
    public losses: number 
    public winningPercentage: number 

    constructor(rawJson) {
        Object.assign(this, rawJson)

        this.leagueRecord = new LeagueRecord(rawJson.leagueRecord)
    }
}

class LeagueRecord {
   
    public wins: number 
    public losses: number
    public pct: number 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }

}

class Player {

    public person: Person 
    public jerseyNumber: number 
    public position: Position 
    public stats: PlayerStats
    public status: PlayerStatus
    public parentTeamId: number 
    public battingOrder: string 
    public seasonStats: PlayerStats
    public gameStatus: GameStatus
    public allPositions: Position[]

    constructor(rawJson) {
        Object.assign(this, rawJson)

        this.person = new Person(rawJson.person)
        this.position = new Position(rawJson.position)
        this.stats = new PlayerStats(rawJson.stats)
        this.status = new PlayerStatus(rawJson.status)
        this.seasonStats = new PlayerStats(rawJson.seasonStats)
        this.gameStatus = new GameStatus(rawJson.gameStatus)

        for (let pos in rawJson.allPositions) {
            this.allPositions.push(new Position(pos))
        }

    }
}

class Person {

    public id: number 
    public fullName: string 
    public link: string 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}


class Position {

    public code: number 
    public name: string 
    public type: string 
    public abbreviation: string

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}

class PlayerStatus {

    public code: string 
    public description: string 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}


class PlayerStats {
    public batting: BattingStats
    public pitching: PitchingStats
    public fielding: FieldingStats

    constructor(rawJson) {
        this.batting = new BattingStats(rawJson.batting)
        this.pitching = new PitchingStats(rawJson.pitching)
        this.fielding = new FieldingStats(rawJson.fielding)
    }
}


class BattingStats {

    public gamesPlayed: number 
    public flyOuts: number 
    public groundOuts: number 
    public runs: number 
    public doubles: number 
    public triples: number 
    public homeRuns: number 
    public strikeOuts: number 
    public baseOnBalls: number 
    public intentionalWalks: number 
    public hits: number 
    public hitByPitch: number 
    public atBats: number 
    public caughtStealing: number 
    public stolenBases: number 
    public groundIntoDoublePlay: number 
    public groundIntoTriplePlay: number 
    public totalBases: number 
    public rbi: number 
    public leftOnBase: number 
    public sacBunts: number 
    public sacFlies: number 
    public catchersInterference: number 
    public pickoffs: number 

    //season only
    public avg: number 
    public obp: number 
    public slg: number 
    public ops: number 
    public stolenBasePercentage: number 


    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}



class FieldingStats {

    public assists: number 
    public putOuts: number 
    public errors: number 
    public chances: number
    public fielding: number
    public caughtStealing: number
    public passedBall: number
    public stolenBases: number
    public stolenBasePercentage: number
    public pickoffs: number

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}



class PitchingStats {

    public gamesPlayed: number 
    public gamesStarted: number 
    public groundOuts: number 
    public runs: number
    public doubles: number
    public triples: number
    public homeRuns: number
    public strikeOuts: number
    public baseOnBalls: number
    public intentionalWalks: number
    public hits: number
    public atBats: number
    public caughtStealing: number
    public stolenBases: number
    public numberOfPitches: number
    public inningsPitched: string 
    public wins: number
    public losses: number
    public saves: number
    public saveOpportunities: number
    public holds: number
    public blownSaves: number
    public earnedRuns: number
    public battersFaced: number
    public outs: number
    public gamesPitched: number
    public completeGames: number
    public shutouts: number
    public pitchesThrown: number
    public balls: number
    public strikes: number
    public hitBatsmen: number
    public wildPitches: number
    public pickoffs: number
    public airOuts: number
    public rbi: number
    public gamesFinished: number
    public inheritedRunners: number
    public inheritedRunnersScored: number
    public catchersInterference: number
    public sacBunts: number
    public sacFlies: number


    //season only
    public walksPer9Inn: number  
    public hitsPer9Inn: number  
    public strikeoutsPer9Inn: number 
    public strikeoutWalkRatio: number 
    public winPercentage: number 
    public stolenBasePercentage: number 


    constructor(rawJson) {
        Object.assign(this, rawJson)
    }
}


class GameStatus {

    public isCurrentBatter: boolean 
    public isCurrentPitcher: boolean 
    public isOnBench: boolean 
    public isSubstitute: boolean 

    constructor(rawJson) {
        Object.assign(this, rawJson)
    }

}







export {
    Boxscore,
    Team,
    Venue,
    League,
    Division,
    Sport,
    Record,
    Player,
    Person,
    Position,
    PlayerStats,
    BattingStats,
    FieldingStats,
    PitchingStats,
    GameStatus
}