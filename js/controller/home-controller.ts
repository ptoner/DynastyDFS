import { ModelView } from '../model-view'
import {LeagueSettingsService} from "../services/league-settings-service";
import {PlayerService} from "../services/player-service";

class HomeController {


    constructor(private leagueSettingsService: LeagueSettingsService, private playerService: PlayerService) {
    }


    async showHomePage(): Promise<ModelView> {

        return new ModelView({}, 'pages/home.html')

    }

}

export { HomeController }
