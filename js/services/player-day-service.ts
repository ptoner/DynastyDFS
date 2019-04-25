import { Player } from "../dto/player";
import { PlayerDay } from "../dto/player-day";
import * as moment from 'moment';
import { BattingStats, PitchingStats } from "../dto/gameday/gameday-boxscore";
import { PlayerService } from "./player-service";

class PlayerDayService {

    constructor(
        private db: any,
        private playerService: PlayerService
    ) {}

    async save(playerDay: PlayerDay): Promise<void> {
        return this.db.put(playerDay)
    }

    async read(playerId: number, date: string) : Promise<PlayerDay> {
        
        let playerDay: PlayerDay

        let results : PlayerDay[] = await this.db.get(`${playerId}-${date}`)

        if (results && results.length >0) {
            playerDay = this.translate(results[0])
        }

        return playerDay
        
    }

    async delete(playerDay: PlayerDay) : Promise<void> {
        return this.db.del(playerDay.id)
    }


    async listByDate(date: Date) : Promise<PlayerDay[]> {
        return this.db.query( playerDay => {
            let theDate = playerDay.getDate()
            let result = (theDate.getTime() == date.getTime() )
            return result
        })
    }

    async listByPlayer(playerId: number) : Promise<PlayerDay[]> {
        return this.db.query( playerDay => playerDay.player.id == playerId )
    }


    async clearAll() : Promise<void> {
        let all = await this.db.query(playerDay => playerDay.id != null )

        for (let playerDay of all) {
            await this.delete(playerDay)
        }
    }


    translate(rawJson) : PlayerDay {

        if (!rawJson) return

        let playerDay:PlayerDay = new PlayerDay()
        
        Object.assign(playerDay, rawJson)
        
        playerDay.player = this.playerService.translate(rawJson.player)
        playerDay.dayBatting = new BattingStats(rawJson.dayBatting)
        playerDay.seasonBatting = new BattingStats(rawJson.seasonBatting)

        playerDay.dayPitching = new PitchingStats(rawJson.dayPitching)
        playerDay.seasonPitching = new PitchingStats(rawJson.seasonStats)

        return playerDay
    }

}

export { PlayerDayService }

