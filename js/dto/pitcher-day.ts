import { Player } from "./player";
import moment = require('moment');


class PitcherDay {

    public id: number
    public player: Player 
    public date: string
    public salary: number 

    public battersFace: number = 0
    public numberOfPitches: number = 0
    public strikes: number = 0
    public hits: number = 0
    public runs: number = 0
    public hr: number = 0
    public so: number = 0
    public bb: number = 0
    public outs: number = 0
    public earnedRuns: number = 0

    public won: boolean
    public lost: boolean
    public saved: boolean
    public blewSave: boolean

    constructor() {}

    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }


}

export {
    PitcherDay
}