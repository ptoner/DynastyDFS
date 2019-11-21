import {LeagueSettingsService} from "../services/league-settings-service";
import {PlayerService} from "../services/player-service";
import { ModelView } from "large-web";

class LeagueController {


    constructor() {
    }


    async showIndex(): Promise<ModelView> {
        return new ModelView({}, 'pages/league/index.html')

    }

}

export { LeagueController }
