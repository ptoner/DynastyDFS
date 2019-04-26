import * as moment from 'moment';


class GamedayScoreboard {
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

    fullPlayers: GamedayFullPlayer[]

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

    public teamInfo: TeamInfo

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
    public note: string 

    //season only
    public avg: number 
    public obp: number 
    public slg: number 
    public ops: number 
    public stolenBasePercentage: number 

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
    public note: string 


    //season only
    public walksPer9Inn: number  
    public hitsPer9Inn: number  
    public strikeoutsPer9Inn: number 
    public strikeoutWalkRatio: number 
    public winPercentage: number 
    public stolenBasePercentage: number 


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