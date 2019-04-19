import { Player } from "./player"
import moment = require('moment')
import { BattingStats, GamedayFullPlayer } from "./gameday/gameday-boxscore";


class HitterDay  {

    public date: string

    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }


    constructor(
        public player: Player,
        public dateOf: Date,
    
        public dayStats: BattingStats,
        public seasonStats: BattingStats,
    
        public salary: number 
    ){
        this.setDate(dateOf)
    }

}

export {
    HitterDay
}