import { Player } from "./player"
import moment = require('moment')
import { PitchingStats, GamedayFullPlayer } from "./gameday/gameday-boxscore";


class PitcherDay  {

    public date: string

    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }


    constructor(
        public player: Player,
        public dateOf: Date,
    
        public dayStats: PitchingStats,
        public seasonStats: PitchingStats,
    
        public salary: number 
    ){
        this.setDate(dateOf)
    }

}

export {
    PitcherDay
}