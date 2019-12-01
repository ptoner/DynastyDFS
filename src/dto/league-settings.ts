interface LeagueSettings {
    owner?: string,
    leagueName?: string
    rosterSize?: number
    totalStarters?: number
    totalBench?: number
    totalDl?: number
    positionLimits?: PositionLimits[]
    battingScoring?: BattingScoring
    pitchingScoring?: PitchingScoring
}

interface PositionLimits {

    position?: string
    starters?: Number
    maximums?: Number

}


interface BattingScoring {

    hits?: Number
    runsScored?: Number
    singles?: Number
    doubles?: Number
    triples?: Number
    homeRuns?: Number
    rbi?: Number
    bb?: Number
    ibb?: Number
    k?: Number
    hbp?: Number
    sb?: Number
    cs?: Number

}

interface PitchingScoring {
    ip?: Number
    h?: Number
    er?: Number
    hr?: Number
    bb?: Number
    hbp?: Number
    k?: Number
    wp?: Number
    balks?: Number
    pickOffs?: Number
    completeGame?: Number
    shutOut?: Number
    blownSave?: Number
    holds?: Number

}


export { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring }


// module.exports = {
//     LeagueSettings: LeagueSettings,
//     PositionLimits: PositionLimits,
//     GamesPlayedLimits: GamesPlayedLimits,
//     BattingScoring: BattingScoring,
//     PitchingScoring: PitchingScoring
// }
