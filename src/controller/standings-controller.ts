import {LeagueSettingsService} from "../services/league-settings-service";
import {PlayerService} from "../services/player-service";
import { ModelView } from "large-web";

class StandingsController {


    constructor() {
    }


    async showIndex(): Promise<ModelView> {
        return new ModelView({}, 'pages/standings/index.html')

    }

}

export { StandingsController }
