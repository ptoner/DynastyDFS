import {LeagueSettings} from "../dto/league-settings";
import {Global} from "../global";

const LEAGUE_SETTINGS_REPO = 51

class LeagueSettingsService {

    constructor() {}


    async getLeagueSettings(): Promise<LeagueSettings> {

        let leagueSettings: LeagueSettings

        try {
            leagueSettings = await Global.freedom.readByIndex(LEAGUE_SETTINGS_REPO, 0)
        } catch (ex) {
            console.log(ex)
        }

        return leagueSettings
    }

    async update(leagueSettings: LeagueSettings): Promise<LeagueSettings> {

        let currentSettings = await this.getLeagueSettings()

        if (!currentSettings) {
            //Create them if they don't exist
            return Global.freedom.create(LEAGUE_SETTINGS_REPO, leagueSettings)
        } else {
            leagueSettings.id = currentSettings.id

            //Update existing
            return Global.freedom.update(LEAGUE_SETTINGS_REPO, leagueSettings.id, leagueSettings)
        }

    }

}

export { LeagueSettingsService }
//
// module.exports = LeagueSettingsService