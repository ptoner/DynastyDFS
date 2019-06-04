import * as moment from 'moment';


class GamedayScoreboard {

    date: string 

    copyright: string
    totalItems: number
    totalEvents: number
    totalGames: number
    totalGamesInProgress : number
    dates: any[]

    get id():string {
        if (this.dates && this.dates.length > 0) {
            return this.dates[0].date
        }
        return null
    }
}




class Boxscore {

    id: number
    teams: {
        away: Team 
        home: Team
    }

    constructor() {
        this.teams = {
            away: undefined,
            home: undefined
        }
    }

    public getPlayers() : GamedayPlayer[] {
        let awayPlayers = this.teams.away.players
        let homePlayers = this.teams.home.players
        return awayPlayers.concat(homePlayers)
    }

}

class Team {

    public team: TeamInfo

    public players: GamedayPlayer[]

    public batters: number[]
    public pitchers: number[]
    public bench: number[]
    public bullpen: number[]
    public battingOrder: number[]


}

class TeamInfo {

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


}

class Venue {
    public id: number 
    public name: string 
    public link: string 
}

class League {
    public id: number 
    public name: string 
    public link: string 

}

class Division {
    public id: number 
    public name: string 
    public link: string 
}

class Sport {
    public id: number 
    public name: string 
    public link: string 
}


class Record {
    public gamesPlayed: number 
    public wildCardGamesBack: number 
    public leagueGamesBack: number 
    public springLeagueGamesBack: number 
    public sportGamesBack: number 
    public divisionGamesBack: number 
    public conferenceGamesBack: number 

    public divisionLeader: boolean
    public wins: number 
    public losses: number 
    public winningPercentage: number 
}


class GamedayFullPlayer {

    id: number
    fullName: string
    link:string
    firstName:string
    lastName:string
    primaryNumber: number
    birthDate:string
    currentAge: number
    birthCity:string
    birthStateProvince:string
    birthCountry:string
    height:string
    weight: number
    active: boolean
    primaryPosition :Position
    useName:string
    middleName:string
    boxscoreName:string
    nickName:string
    draftYear: number
    pronunciation:string
    lastPlayedDate:string
    mlbDebutDate:string
    batSide: Hand
    pitchHand: Hand
    nameFirstLast:string
    nameSlug:string
    firstLastName:string
    lastFirstName:string
    lastInitName:string
    initLastName:string
    fullFMLName:string
    fullLFMName:string
    strikeZoneTop: number
    strikeZoneBottom: number

}

class Hand {
    public code: string 
    public description: string 

}

class GamedayPlayer {

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

    get id():number {
        return this.person.id
    }

}

class Person {

    public id: number 
    public fullName: string 
    public link: string 

}


class Position {

    public code: number 
    public name: string 
    public type: string 
    public abbreviation: string

}

class PlayerStatus {

    public code: string 
    public description: string 

}


class PlayerStats {
    public batting: BattingStats
    public pitching: PitchingStats
    public fielding: FieldingStats

}


class BattingStats {

    gamesPlayed: number 
    flyOuts: number 
    groundOuts: number 
    runs: number 
    doubles: number 
    triples: number 
    homeRuns: number 
    strikeOuts: number 
    baseOnBalls: number 
    intentionalWalks: number 
    hits: number 
    hitByPitch: number 
    atBats: number 
    caughtStealing: number 
    stolenBases: number 
    groundIntoDoublePlay: number 
    groundIntoTriplePlay: number 
    totalBases: number 
    rbi: number 
    leftOnBase: number 
    sacBunts: number 
    sacFlies: number 
    catchersInterference: number 
    pickoffs: number 
    note: string 

    //season only
    avg: number 
    obp: number 
    slg: number 
    ops: number 
    stolenBasePercentage: number 

}



class FieldingStats {

    assists: number 
    putOuts: number 
    errors: number 
    chances: number
    fielding: number
    caughtStealing: number
    passedBall: number
    stolenBases: number
    stolenBasePercentage: number
    pickoffs: number

}



class PitchingStats {

    gamesPlayed: number 
    gamesStarted: number 
    groundOuts: number 
    runs: number
    doubles: number
    triples: number
    homeRuns: number
    strikeOuts: number
    baseOnBalls: number
    intentionalWalks: number
    hits: number
    atBats: number
    caughtStealing: number
    stolenBases: number
    numberOfPitches: number
    inningsPitched: string 
    wins: number
    losses: number
    saves: number
    saveOpportunities: number
    holds: number
    blownSaves: number
    earnedRuns: number
    battersFaced: number
    outs: number
    gamesPitched: number
    completeGames: number
    shutouts: number
    pitchesThrown: number
    balls: number
    strikes: number
    hitBatsmen: number
    wildPitches: number
    pickoffs: number
    airOuts: number
    rbi: number
    gamesFinished: number
    inheritedRunners: number
    inheritedRunnersScored: number
    catchersInterference: number
    sacBunts: number
    sacFlies: number
    note: string 


    //season only
    walksPer9Inn: number  
    hitsPer9Inn: number  
    strikeoutsPer9Inn: number 
    strikeoutWalkRatio: number 
    winPercentage: number 
    stolenBasePercentage: number 


}


class GameStatus {

    public isCurrentBatter: boolean 
    public isCurrentPitcher: boolean 
    public isOnBench: boolean 
    public isSubstitute: boolean 


}







export {
    Boxscore,
    Team,
    TeamInfo,
    Venue,
    League,
    Division,
    Sport,
    Record,
    GamedayPlayer,
    Person,
    Position,
    PlayerStats,
    PlayerStatus,
    BattingStats,
    FieldingStats,
    PitchingStats,
    GameStatus,
    GamedayFullPlayer,
    Hand,
    GamedayScoreboard
}