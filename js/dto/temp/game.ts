//Filename: gameId.json
//Indexes: year, awayTeam, homeTeam

class Game {

    public gameId: string //from gameday
    public gamePk: string //from gameday

    public year: number

    public type: string
    public status: string

    public startDate: Date

    public venueWeatherChannelCode: string

    public homeTeam: Team
    public awayTeam: Team

    public homeProbablePitcherId: number
    public awayProbablePitcherId: number

    public homeStartingPitcherId: number
    public awayStartingPitcherId: number

    public winningPitcherId: number
    public losingPitcherId: number
    public savePitcherId: number

    public awayTeamRuns: number
    public homeTeamRuns: number
    public awayTeamHits: number
    public homeTeamHits: number
    public awayTeamErrors: number
    public homeTeamErrors: number


    public awayLineupPopulated: boolean //from gameday
    public awayLineupConfirmed: boolean //from rotogrinders
    public awayLineupUnconfirmed: boolean //from rotogrinders

    public homeLineupPopulated: boolean
    public homeLineupConfirmed: boolean
    public homeLineupUnconfirmed: boolean

    
    public hasStarted() : boolean {
        return (this.startDate <= new Date())
    }

    public getTextDescription() : string  {
        return this.awayTeam.abbrev + " vs. @" + this.homeTeam.abbrev + " " + this.startDate
    }

    public getAwayLineupStatus(): string {

        if (this.awayLineupPopulated) return "official"
        if (this.awayLineupConfirmed) return "confirmed"
        if (this.awayLineupUnconfirmed) return "unconfirmed"
        return null

    }

    public getHomeLineupStatus(): string {

        if (this.homeLineupPopulated) return "official"
        if (this.homeLineupConfirmed) return "confirmed"
        if (this.homeLineupUnconfirmed) return "unconfirmed"
        return null

    }





}