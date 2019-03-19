class GamedayAtbats {

    public atBats: GamedayAtBat[] = []

    constructor(rawJson: any) {

        for (let inning of rawJson.inning) {
            let inningNum: number = inning._attributes.num 


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

    // public baseRunner1Id: number
    // public baseRunner2Id: number
    // public baseRunner3Id: number  

    public rbi: number = 0
    public earnedRun: number = 0

    public pitches: GamedayPitch[]= []
    public runners: GamedayRunner[] = []

    constructor(rawJson: any){
        this.batterId = rawJson._attributes.batter 
        this.pitcherId = rawJson._attributes.pitcher 

        this.startTimeUtc = rawJson._attributes.start_tfs 
        this.num = rawJson._attributes.num 
        this.balls = rawJson._attributes.b 
        this.strikes = rawJson._attributes.s 
        this.outs = rawJson._attributes.o 

        this.description = rawJson._attributes.des 
        this.eventName = rawJson._attributes.event 

        this.score = rawJson._attributes.score ? true : false
        this.awayTeamRuns = rawJson._attributes.away_team_runs 
        this.homeTeamRuns = rawJson._attributes.home_team_runs 

        // console.log(rawJson)

        // this.baseRunner1Id = rawJson._attributes.b1 
        // this.baseRunner2Id = rawJson._attributes.b2 
        // this.baseRunner3Id = rawJson._attributes.b3 

        this.eventNum = rawJson._attributes.event_num 

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

    public id: number                 //="91"
    public tfs: number                //="233334"
    public tfsZulu: string            //="2016-05-09T23:33:34Z"
    public y: number                //="218.13"
    public eventNum: number         //="91"
    public on1b: number              //="408299"
    public on2b: number               //="521692"
    public on3b: number
    public playGuid: string         //="13919870-1e7c-4d09-bd4a-e9f1fc307729"
    public szTop: number            //="3.5"
    public szBot: number            //="1.59"
    public pfxX : number            //="3.23"
    public pfxZ : number            //="-2.82"
    public px  : number             //="1.086"
    public pz : number              //="0.765"
    public x0: number               //="-2.027"
    public y0: number               //="50.0"
    public z0 : number              //="6.592"
    public vx0: number              //="6.293"
    public vy0: number              //="-118.359"
    public vz0 : number             //="-5.883"
    public ax  : number             //="4.57"
    public ay  : number             //="22.808"
    public az  : number             //="-36.101"
    public breakY: number          //="23.9"
    public breakAngle : number      //="-8.4"
    public breakLength: number      //="10.7"
    public typeConfidence: number   //="2.000"
    public zone     : number        //="14"
    public nasty: number            //="84"
    public spinDir: number          //="49.327"
    public spinRate: number         //="738.570"


    constructor(rawJson: any) {
        this.sportsvisionId = rawJson._attributes.sv_id
        this.description = rawJson._attributes.des
        this.startSpeed = rawJson._attributes.start_speed
        this.type = rawJson._attributes.type
        this.pitchType = rawJson._attributes.pitch_type

        this.id = rawJson._attributes.id 
        this.tfs = rawJson._attributes.tfs 
        this.tfsZulu = rawJson._attributes.tfs_zulu 
        this.y = rawJson._attributes.y 
        this.eventNum = rawJson._attributes.event_num 
        this.on1b = rawJson._attributes.on1b 
        this.on2b = rawJson._attributes.on2b
        this.on3b = rawJson._attributes.on3b 
        this.playGuid = rawJson._attributes.play_guid 
        this.szTop = rawJson._attributes.sz_top 
        this.szBot = rawJson._attributes.sz_bot 
        this.pfxX = rawJson._attributes.pfx_x 
        this.pfxZ = rawJson._attributes.pfx_z 
        this.px = rawJson._attributes.px 
        this.pz = rawJson._attributes.pz 
        this.x0 = rawJson._attributes.x0 
        this.y0 = rawJson._attributes.y0 
        this.z0 = rawJson._attributes.z0 
        this.vx0 = rawJson._attributes.vx0 
        this.vy0 = rawJson._attributes.vy0 
        this.vz0 = rawJson._attributes.vz0
        this.ax = rawJson._attributes.ax 
        this.ay = rawJson._attributes.ay 
        this.az = rawJson._attributes.az 
        this.breakY = rawJson._attributes.break_y 
        this.breakAngle = rawJson._attributes.break_angle 
        this.breakLength = rawJson._attributes.break_length 
        this.typeConfidence = rawJson._attributes.type_confidence 
        this.zone = rawJson._attributes.zone 
        this.nasty = rawJson._attributes.nasty 
        this.spinDir = rawJson._attributes.spin_dir 
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
        this.id = rawJson._attributes.id 
        this.start = rawJson._attributes.start 
        this.end = rawJson._attributes.end 
        this.event = rawJson._attributes.event 

        this.score = rawJson._attributes.score 
        this.earned = rawJson._attributes.earned 

        this.eventNum = rawJson._attributes.event_num 
    }

}

export {
    GamedayAtbats,
    GamedayAtBat,
    GamedayPitch
}