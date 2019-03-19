//Filename: gameId-num-eventNum.json
//Indexes: gameId, year, hitterId, pitcherId


class AtBat {

    public gameId: number
    public year: number
    public eventNum: number

    public inningNum: number
    public inningTop: number

    public hitterId: number
    public pitcherId: number

    public startTimeUtc: Date

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

    public rbi: number
    public earnedRuns: number

    public pitcherHandedness: string
    public hitterHandedness: string

    public pitcherHomeAway: string
    public hitterHomeAway: string

    public pc: number    


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