import { GamedayParseService } from "./gameday-parse-service";

class GamedayProcessService {

    constructor(
        private parseService: GamedayParseService
    ) {

    }

    async createPlayerDaysForDate(date: Date) : Promise<void> {

        // this.parseService.parseGame


    }

    async processDateRange(date: Date) : Promise<void> {

    }


}