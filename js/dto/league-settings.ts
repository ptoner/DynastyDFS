class LeagueSettings {

    id: number
    leagueName: string
    rosterSize: number
    totalStarters: number
    totalBench: number
    totalDl: number
    positionLimits: PositionLimits[]
    battingScoring: BattingScoring
    pitchingScoring: PitchingScoring

    constructor(

    ) { }
}

class PositionLimits {

    position: string
    starters: Number
    maximums: Number

    constructor(
    ) { }
}


class BattingScoring {

    hits: Number
    runsScored: Number
    singles: Number
    doubles: Number
    triples: Number
    homeRuns: Number
    rbi: Number
    bb: Number
    ibb: Number
    k: Number
    hbp: Number
    sb: Number
    cs: Number

    constructor(

    ) { }
}

class PitchingScoring {

    ip: Number
    h: Number
    er: Number
    hr: Number
    bb: Number
    hbp: Number
    k: Number
    wp: Number
    balks: Number
    pickOffs: Number
    completeGame: Number
    shutOut: Number
    blownSave: Number
    holds: Number

    constructor(

    ) { }
}


export { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring }


// module.exports = {
//     LeagueSettings: LeagueSettings,
//     PositionLimits: PositionLimits,
//     GamesPlayedLimits: GamesPlayedLimits,
//     BattingScoring: BattingScoring,
//     PitchingScoring: PitchingScoring
// }
