import {LeagueSettingsService} from "../services/league-settings-service";
import {PlayerService} from "../services/player-service";
import { ModelView } from "large-web";

class ScoreboardController {


    constructor() {
    }


    async showIndex(): Promise<ModelView> {
        return new ModelView({}, 'pages/scoreboard/index.html')

    }

}

export { ScoreboardController }
