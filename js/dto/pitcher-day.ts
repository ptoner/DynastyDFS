import { Player } from "./player";
import moment = require('moment');
import { PitcherLog } from "./pitcher-log";


class PitcherDay extends PitcherLog {

    public id: number
    
    public date: string
    public salary: number 


    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }


}

export {
    PitcherDay
}