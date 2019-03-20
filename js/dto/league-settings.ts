class LeagueSettings {

    constructor(
        public leagueName: string,
        public rosterSize: Number,
        public totalStarters: Number,
        public totalBench: Number,
        public totalDl: Number,
        public positionLimits: PositionLimits[],
        public battingScoring: BattingScoring,
        public pitchingScoring: PitchingScoring
    ) {}
}

class PositionLimits {
    constructor(
        public position: string,
        public starters: Number,
        public maximums: Number
    ) {}
}


class BattingScoring {
    constructor(
        public hits: Number,
        public runsScored: Number,
        public singles: Number,
        public doubles: Number,
        public triples: Number,
        public homeRuns: Number,
        public rbi: Number,
        public bb : Number,
        public ibb: Number,
        public k: Number,
        public hbp: Number,
        public sb: Number,
        public cs: Number
    ) {}
}

class PitchingScoring {
    constructor(
        public ip: Number,
        public h: Number,
        public er: Number,
        public hr: Number,
        public bb : Number,
        public hbp: Number,
        public k: Number,
        public wp: Number,
        public balks: Number,
        public pickOffs: Number,
        public completeGame: Number,
        public shutOut: Number,
        public blownSave: Number,
        public holds: Number
    ) {}
}


export { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring }


// module.exports = {
//     LeagueSettings: LeagueSettings,
//     PositionLimits: PositionLimits,
//     GamesPlayedLimits: GamesPlayedLimits,
//     BattingScoring: BattingScoring,
//     PitchingScoring: PitchingScoring
// }
