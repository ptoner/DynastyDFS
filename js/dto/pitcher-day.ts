import { Player } from "./player";
import moment = require('moment');


class PitcherDay {

    public id: number
    public player: Player 
    public date: string
    public salary: number 

    constructor() {}

    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }


}

export {
    PitcherDay
}