import {LeagueSettings} from "../dto/league-settings";
import { Buffer } from "buffer"


class LeagueSettingsService {

    filename: string = "leagueSettings.json"

    constructor(
        private ipfs: any,
        private rootFolder: string    
    ) {}

    async getLeagueSettings(): Promise<LeagueSettings> {

        let leagueSettings: LeagueSettings
        
        try {
            let result  = await this.ipfs.files.read(this.rootFolder + '/' + this.filename)
            leagueSettings = JSON.parse(result)
        }catch(ex) {
            console.log(ex)
        }

        return leagueSettings
    }

    async update(leagueSettings: LeagueSettings) : Promise<void> {

        await this.ipfs.files.write(
            this.rootFolder + '/' +  this.filename, 
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