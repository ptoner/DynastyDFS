import { LeagueSettingsService } from "../../services/league-settings-service";
import { PlayerService } from "../../services/player-service";
import { ModelView, UiService } from "large-web";
import { PositionLimits, LeagueSettings, BattingScoring, PitchingScoring } from "../../dto/league-settings";
import { Global } from "../../global";
import { Dom7, Template7 } from "framework7"

var $$ = Dom7;


class LeagueController {

    constructor(
        private leagueSettingsService: LeagueSettingsService,
        private uiService: UiService
    ) { }

    async showIndex(): Promise<ModelView> {

        return new ModelView(async () => {

            await this.leagueSettingsService.loadStoreForWallet(window['currentAccount'])

        }, 'pages/league/index.html')

    }

    


}

export { LeagueController }
