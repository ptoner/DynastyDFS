import { HitterLog } from "./hitter-log";

class HitterSeason extends HitterLog {
    
    constructor(
        public year: number
    ) {
        super()
    }
}

export {
    HitterSeason
}