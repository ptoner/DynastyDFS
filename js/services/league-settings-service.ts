import {LeagueSettings} from "../dto/league-settings";

const LEAGUE_SETTINGS_REPO = 51

class LeagueSettingsService {

    public freedom: any

    constructor(
    ) {}


    async getLeagueSettings(): Promise<LeagueSettings> {

        let leagueSettings: LeagueSettings

        try {
            leagueSettings = await this.freedom.readByIndex(LEAGUE_SETTINGS_REPO, 0)
        } catch (ex) {
            if (ex.name != "Web3Exception") {
                throw ex
            }
            console.log(ex)
        }

        return leagueSettings
    }

    async update(leagueSettings: LeagueSettings) {

        let currentSettings = await this.getLeagueSettings()

        if (!currentSettings) {
            return this.freedom.create(LEAGUE_SETTINGS_REPO, leagueSettings)
        } else {
            leagueSettings.id = currentSettings.id

            //Update existing
            return this.freedom.update(LEAGUE_SETTINGS_REPO, leagueSettings.id, leagueSettings)
        }

    }

}

export { LeagueSettingsService }
//
// module.exports = LeagueSettingsService