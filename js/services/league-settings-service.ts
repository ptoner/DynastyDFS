import {LeagueSettings} from "../dto/league-settings";
import { Buffer } from "buffer"


class LeagueSettingsService {

    constructor(
        private ipfs: any    
    ) {}

    async getLeagueSettings(): Promise<LeagueSettings> {

        let leagueSettings: LeagueSettings
        
        let result  = await this.ipfs.files.read("/fantasybaseball/leagueSettings.json")

        return JSON.parse(result)
    }

    async update(leagueSettings: LeagueSettings) : Promise<void> {
         await this.ipfs.files.write('/fantasybaseball/leagueSettings.json', Buffer.from(JSON.stringify(leagueSettings)), {create: true, parents: true, truncate: true})
    }

}

export { LeagueSettingsService }
//
// module.exports = LeagueSettingsService