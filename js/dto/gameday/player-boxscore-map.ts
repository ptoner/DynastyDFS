import moment = require("moment");

class PlayerBoxscoreMap {

    date: string

    playerBoxscore: any = {}

    get id():string {
        return moment(this.date).format("YYYY-MM-DD")
    }

    setDate(date: Date) {
        this.date = moment(date).format("YYYY-MM-DD")
    }

    getDate() : Date {
        return moment(this.date).toDate()
    }


}

export {
    PlayerBoxscoreMap
}