import { Player } from "./player"
import moment = require('moment')
import { BattingStats, GamedayFullPlayer, PitchingStats } from "./gameday/gameday-boxscore";


class PlayerDay  {

    date: string
    player: Player

    dayBatting: BattingStats
    seasonBatting: BattingStats

    dayPitching: PitchingStats
    seasonPitching: PitchingStats

    salary: number 

    get id():string {
        return `${this.player.id}-${this.date}`;
    }

    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }

    getDate() : Date {
        return moment(this.date).toDate()
    }

    constructor(){}

}

export {
    PlayerDay
}