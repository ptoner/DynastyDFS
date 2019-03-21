import { Player } from "./player"
import moment = require('moment')
import { HitterLog } from "./hitter-log";


class HitterDay extends HitterLog {

    public id: number
    public date: string
    public salary: number 


    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }


}

export {
    HitterDay
}