import { PitcherLog } from "./pitcher-log";

class PitcherSeason extends PitcherLog {
    
    constructor(
        public year: number
    ) {
        super()
    }
}

export {
    PitcherSeason
}