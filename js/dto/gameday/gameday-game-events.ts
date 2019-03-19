class GamedayGameEvents {

    public atBats: GamedayAtBat[] = []

    constructor(rawJson: any) {

        for (let inning of rawJson.inning) {
            let inningNum: number = inning.num 

            for (let topAtBat of inning.top.atbat) {
                let gamedayAtBat: GamedayAtBat = new GamedayAtBat(topAtBat)
                gamedayAtBat.inningNum = inningNum
                gamedayAtBat.inningTop = true
                this.atBats.push(gamedayAtBat)
            }

            for (let bottomAtBat of inning.bottom.atbat) {
                let gamedayAtBat: GamedayAtBat = new GamedayAtBat(bottomAtBat)
                gamedayAtBat.inningNum = inningNum
                gamedayAtBat.inningTop = true
                this.atBats.push(gamedayAtBat)
            }

        }

        

    }
}

class GamedayAtBat {
    
    public eventNum: number 
    public inningNum: number 
    public inningTop: boolean 

    public batterId: number
    public pitcherId: number 

    public startTimeUtc: string 

    public num: number
    public balls: number
    public strikes: number
    public outs: number 

    public description: string
    public eventName: string

    public score: boolean
    public awayTeamRuns: number
    public homeTeamRuns: number

    public baseRunner1Id: number
    public baseRunner2Id: number
    public baseRunner3Id: number  

    public rbi: number = 0
    public earnedRun: number = 0

    public pitches: GamedayPitch[]= []
    public runners: GamedayRunner[] = []

    constructor(rawJson: any){
        this.batterId = rawJson.batter 
        this.pitcherId = rawJson.pitcher 

        this.startTimeUtc = rawJson.start_tfs 
        this.num = rawJson.num 
        this.balls = rawJson.b 
        this.strikes = rawJson.s 
        this.outs = rawJson.o 

        this.description = rawJson.des 
        this.eventName = rawJson.event 

        this.score = rawJson.score ? true : false
        this.awayTeamRuns = rawJson.away_team_runs 
        this.homeTeamRuns = rawJson.home_team_runs 

        this.baseRunner1Id = rawJson.b1 
        this.baseRunner2Id = rawJson.b2 
        this.baseRunner3Id = rawJson.b3 

        this.eventNum = rawJson.event_num 

        let i=0
        if (rawJson.pitch) {
            for (let pitch of rawJson.pitch) {
                let gamedayPitch: GamedayPitch = new GamedayPitch(pitch)
                gamedayPitch.sequence = i++
                this.pitches.push(gamedayPitch)
            }
        }

        if (rawJson.runner) {
            for (let runner of rawJson.runner) {
                let gamedayRunner: GamedayRunner = new GamedayRunner(runner)
                
                if ("T" == gamedayRunner.score) {
                    this.rbi++

                    if ("T" == gamedayRunner.earned) {
                        this.earnedRun++
                    }
                }
                this.runners.push(gamedayRunner)
            }
        }

    }


    public isSacFly() : boolean {
        return "Sac Fly" == this.eventName
    }

    public isHit() : boolean {
        return "Single" == this.eventName || "Double" == this.eventName || "Triple" == this.eventName || "Home Run" == this.eventName
    }

    public isBB() : boolean {
        return "Walk" == this.eventName || "Intent Walk" == this.eventName
    }

    public isIBB() : boolean {
        return "Intent Walk" == this.eventName
    }

    public isHpb() : boolean {
        return "Hit By Pitch" == this.eventName
    }

    public isSingle() : boolean {
        return "Single" == this.eventName
    }

    public isDouble() : boolean {
        return "Double" == this.eventName
    }

    public isTriple() : boolean {
        return "Triple" == this.eventName
    }

    public isHr() : boolean {
        return "Home Run" == this.eventName
    }

    public isStrikeout() : boolean {
        return "Strikeout" == this.eventName || "Strikeout - DP" == this.eventName
    }

    public isAtBat() : boolean {

        if ("Intent Walk" == this.eventName) return false
        if ("Hit By Pitch" == this.eventName) return false
        if ("Sac Bunt" == this.eventName) return false
        if ("Sac Fly" == this.eventName) return false
        if ("Sac Fly DP" == this.eventName) return false
        if ("Walk" == this.eventName) return false
        if ("Catcher Interference" == this.eventName) return false
        if ("Runner Out" == this.eventName) return false
        if ("Ejection" == this.eventName) return false

        return true

    }

    public isPa() : boolean {
        if ("Ejection" == this.eventName) return false
        if ("Runner Out" == this.eventName) return false
        return true
    }

    public isGroundBall() : boolean {
        if ("Bunt Groundout" == this.eventName) return true
        if ("Grounded Into DP" == this.eventName) return true
        if ("Groundout" == this.eventName) return true
        if ("Fielders Choice" == this.eventName) return true
        if ("Fielders Choice Out" == this.eventName) return true
        if ("Force Out" == this.eventName) return true
        if ("Sac Bunt" == this.eventName) return true
        if ("Sacrifice Bunt DP" == this.eventName) return true

        if (this.description) {
            if (this.description.includes(" ground ball ")) return true
            if (this.description.includes(" grounds out ")) return true
            if (this.description.includes(" grounds into ")) return true
        }

    }

    public isGroundOut() : boolean {
        return (this.isGroundBall() && this.isAnOut())
    }

    public  isLineDrive() : boolean {

        if ("Lineout" == this.eventName) return true
        if ("Bunt Lineout" == this.eventName) return true
        if ("Bunt Pop Out" == this.eventName) return true


        if (this.description.includes(" line drive ")) return true
        if (this.description.includes(" lines out ")) return true
        if (this.description.includes(" lines into ")) return true
    }

    public isLineOut() : boolean {
        return (this.isLineDrive() && this.isAnOut())
    }

    public isFlyBall() : boolean {
        if ("Flyout" == this.eventName) return true
        if ("Pop Out" == this.eventName) return true
        if ("Sac Fly" == this.eventName) return true
        if ("Sac Fly DP" == this.eventName) return true

        if (this.description.includes(" bunt pops ")) return true
        if (this.description.includes(" pops out ")) return true
        if (this.description.includes(" pops into ")) return true
        if (this.description.includes(" flies out ")) return true
        if (this.description.includes(" fly ball ")) return true
        if (this.description.includes(" flies into ")) return true

        return false
    }

    public isFlyOut() : boolean {
        return (this.isFlyBall() && this.isAnOut())
    }



    public isAnOut() : boolean {

        if ("Batter Interference" == this.eventName) return true
        if ("Bunt Groundout" == this.eventName) return true
        if ("Bunt Lineout" == this.eventName) return true
        if ("Bunt Pop Out" == this.eventName) return true
        if ("Fan interference" == this.eventName) return true
        if ("Fielders Choice Out" == this.eventName) return true
        if ("Flyout" == this.eventName) return true
        if ("Forceout" == this.eventName) return true
        if ("Grounded Into DP" == this.eventName) return true
        if ("Groundout" == this.eventName) return true
        if ("Lineout" == this.eventName) return true
        if ("Pop Out" == this.eventName) return true
        if ("Sac Bunt" == this.eventName) return true
        if ("Sac Fly" == this.eventName) return true
        if ("Sac Fly DP" == this.eventName) return true
        if ("Sacrifice Bunt DP" == this.eventName) return true
        if ("Strikeout" == this.eventName) return true
        if ("Strikeout - DP" == this.eventName) return true
        if ("Triple Play" == this.eventName) return true

        return false
    }



}


class GamedayPitch {

    public sportsvisionId: string
    public description: string
    public startSpeed: number
    public type: string
    public pitchType: string
    public sequence: number


    constructor(rawJson: any) {
        this.sportsvisionId = rawJson.sv_id
        this.description = rawJson.des
        this.startSpeed = rawJson.start_speed
        this.type = rawJson.type
        this.pitchType = rawJson.pitch_type
    }

}

class GamedayRunner {

    public id: number 
    public start: string 
    public end: string 
    public event: string 
    public score: string 
    public earned: string 
    public eventNum: number 

    constructor(rawJson: any) {
        this.id = rawJson.id 
        this.start = rawJson.start 
        this.end = rawJson.end 
        this.event = rawJson.event 

        this.score = rawJson.score 
        this.earned = rawJson.earned 

        this.eventNum = rawJson.event_num 
    }

}

export {
    GamedayGameEvents,
    GamedayAtBat,
    GamedayPitch
}