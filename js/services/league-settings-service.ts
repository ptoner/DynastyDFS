import {LeagueSettings} from "../dto/league-settings";
import { Buffer } from "buffer"


class LeagueSettingsService {

    path: string = "/fantasybaseball/"
    filename: string = "leagueSettings.json"

    constructor(
        private ipfs: any    
    ) {}

    async getLeagueSettings(): Promise<LeagueSettings> {

        let leagueSettings: LeagueSettings
        
        let result  = await this.ipfs.files.read(this.path + this.filename)

        return JSON.parse(result)
    }

    async update(leagueSettings: LeagueSettings) : Promise<void> {

        await this.ipfs.files.write(
             this.path + this.filename, 
             Buffer.from(JSON.stringify(leagueSettings)), 
             {
                create: true, 
                parents: true, 
                truncate: true
             }
        )

    }

}

export { LeagueSettingsService }
//
// module.exports = LeagueSettingsService