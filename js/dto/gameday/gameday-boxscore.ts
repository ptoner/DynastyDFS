class GamedayBoxScore {

    public gameId: string
    public gamePk: string
    public date: string
    public status: string
    public venueName: string

    public awayId: number
    public awayTeamCode: string
    public awayFullName: string

    public homeId: number
    public homeTeamCode: string
    public homeFullName: string

    public awayTeamRuns: number
    public homeTeamRuns: number

    public awayTeamHits: number
    public homeTeamHits: number
    
    public awayTeamErrors: number
    public homeTeamErrors: number

    public pitching: Pitching[] = []
    public batting: Batting[] = []

    constructor(rawJson: any) {

        this.gameId = rawJson.game_id
        this.gamePk = rawJson.game_pk
        this.date = rawJson.date
        this.status = rawJson.status_ind
        this.venueName = rawJson.venue_name

        this.awayId = rawJson.away_id
        this.awayTeamCode = rawJson.away_team_code
        this.awayFullName = rawJson.away_fname


        for (let pitch of rawJson.pitching) {
            this.pitching.push(new Pitching(pitch))
        }

        for (let bat of rawJson.batting) {
            this.batting.push(new Batting(bat))
        }

        this.awayTeamRuns = rawJson.linescore.away_team_runs
        this.homeTeamRuns = rawJson.linescore.home_team_runs
        this.awayTeamHits = rawJson.linescore.away_team_hits
        this.homeTeamHits = rawJson.linescore.home_team_hits
        this.awayTeamErrors = rawJson.linescore.away_team_errors
        this.homeTeamErrors = rawJson.linescore.home_team_errors


    }

}

class Pitching {

    public teamFlag: string
    public battersFaced: number
    public hits: number
    public runs: number
    public hr: number
    public so: number
    public bb: number
    public out: number
    public er: number
    public era: number

    public appearances: PitchingAppearance[] = []
    
    constructor(rawJson: any) {
        this.teamFlag = rawJson.team_flag
        this.battersFaced = rawJson.bf
        this.hits = rawJson.h
        this.runs = rawJson.r 
        this.hr = rawJson.hr 
        this.so = rawJson.so 
        this.bb = rawJson.bb
        this.out = rawJson.out 
        this.er = rawJson.er 
        this.era = rawJson.era 

        //If there's an id we have a single pitcher instead of an array
        if (rawJson.pitcher && rawJson.pitcher.length > 0) {
            for(let pitcher of rawJson.pitcher) {
                this.appearances.push(new PitchingAppearance(pitcher))
            }
        } else {
            this.appearances.push(new PitchingAppearance(rawJson.pitcher))
        }
    }

}

class PitchingAppearance {

    public playerId: number
    public playerName: string
    public displayName: string
    public position: string

    public battersFace: number
    public numberOfPitches: number
    public strikes: number
    public hits: number
    public runs: number
    public hr: number
    public so: number
    public bb: number
    public outs: number
    public earnedRuns: number

    public won: boolean
    public lost: boolean
    public saved: boolean
    public blewSave: boolean

    public seasonEra: number
    public seasonWins: number
    public seasonLosses: number
    public seasonHolds:number
    public seasonSaves:number
    public seasonBlownSaves:number
    public seasonInningsPitched:number
    public seasonHits:number
    public seasonRuns:number
    public seasonWalks:number
    public seasonStrikeouts:number
    public seasonEarnedRuns:number
    

    constructor(rawJson: any) {
        this.playerId = rawJson.id 
        this.playerName = rawJson.name 
        this.displayName = rawJson.name_display_first_last 
        this.position = rawJson.pos 
        this.battersFace = rawJson.bf 
        this.numberOfPitches = rawJson.np
        this.strikes = rawJson.s 
        this.hits = rawJson.h 
        this.runs = rawJson.r 
        this.hr = rawJson.hr 
        this.so = rawJson.so 
        this.bb = rawJson.bb 
        this.outs = rawJson.out 
        this.earnedRuns = rawJson.er 

        this.won = rawJson.win ? true : false
        this.lost = rawJson.loss ? true : false
        this.saved = rawJson.save ? true : false
        this.blewSave = rawJson.blown_save ? true : false

        this.seasonEra = rawJson.era 
        this.seasonWins = rawJson.w 
        this.seasonLosses = rawJson.l 
        this.seasonHolds = rawJson.hld 
        this.seasonSaves = rawJson.sv 
        this.seasonBlownSaves = rawJson.bs 
        this.seasonInningsPitched = rawJson.s_ip 
        this.seasonHits = rawJson.s_h 
        this.seasonRuns = rawJson.s_r 
        this.seasonWalks = rawJson.s_bb 
        this.seasonStrikeouts = rawJson.s_so 
        this.seasonEarnedRuns = rawJson.s_er 

    }
}

class Batting {

    public teamFlag: string 
    public atBats: number
    public avg: number 
    public hits: number
    public bb: number 
    public so: number 
    public r: number 
    public rbi: number 
    public lob: number 
    public doubles: number 
    public triples: number 
    public hr: number 
    public defensiveAvg: number 
    public putOuts: number 

    public appearances: BattingAppearance[] = []

    constructor(rawJson: any) {
        this.teamFlag = rawJson.team_flag 
        this.atBats = rawJson.ab 
        this.avg = rawJson.avg 
        this.hits = rawJson.h 
        this.bb = rawJson.bb 
        this.so = rawJson.so 
        this.r = rawJson.r 
        this.rbi = rawJson.rbi 
        this.lob = rawJson.lob 
        this.doubles = rawJson.d 
        this.triples = rawJson.t 
        this.hr = rawJson.hr 
        this.defensiveAvg = rawJson.da 
        this.putOuts = rawJson.po  
        
        for (let batter of rawJson.batter) {
            this.appearances.push(new BattingAppearance(batter))
        }
    }

}

class BattingAppearance {

    public playerId: number 
    public playerName: string 
    public displayName: string 
    public position: string 

    public battingOrder: number 

    public avg: number 
    public fieldingPercentage: number 
    public atBats: number 
    public hits: number 
    public bb: number 
    public hbp: number 
    public so: number 
    public runs: number 
    public rbi: number 
    public lob: number 
    public doubles: number 
    public triples: number 
    public hr: number 
    public sacBunts: number 
    public sacFlys: number 
    public groundOuts: number 
    public flyOuts: number 
    public gidp: number 
    public sb: number 
    public cs: number 
    public po: number 
    public assists: number 
    public errors: number 
    public seasonHits: number 
    public seasonWalks: number 
    public seasonStrikeouts: number 
    public seasonRuns: number 
    public seasonRbi: number 
    public seasonHr: number 




    constructor(rawJson: any) {
        this.playerId = rawJson.id 
        this.playerName = rawJson.name 
        this.displayName = rawJson.name_display_first_last
        this.position = rawJson.pos 
        this.battingOrder = rawJson.bo 
        this.atBats = rawJson.ab 
        this.avg = rawJson.avg 
        this.hits = rawJson.h 
        this.bb = rawJson.bb 
        this.hbp = rawJson.hbp 
        this.so = rawJson.so 
        this.runs = rawJson.r 
        this.rbi = rawJson.rbi 
        this.lob = rawJson.lob 
        this.doubles = rawJson.d 
        this.triples = rawJson.t 
        this.hr = rawJson.hr 
        this.sacBunts = rawJson.sac 
        this.sacFlys = rawJson.sf 
        this.groundOuts = rawJson.go 
        this.flyOuts = rawJson.ao 
        this.gidp = rawJson.gidp 
        this.sb = rawJson.sb 
        this.cs = rawJson.cs 
        this.po = rawJson.po
        this.assists = rawJson.a 
        this.errors = rawJson.e 
        this.fieldingPercentage = rawJson.fldg 

        this.seasonHits = rawJson.s_h 
        this.seasonWalks = rawJson.s_bb 
        this.seasonStrikeouts = rawJson.s_so 
        this.seasonRuns = rawJson.s_r 
        this.seasonRbi = rawJson.s_rbi 
        this.seasonHr = rawJson.s_hr 
    }

}

export {
    GamedayBoxScore,
    Pitching,
    PitchingAppearance,
    Batting,
    BattingAppearance
}