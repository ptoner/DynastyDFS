import {LeagueSettingsService} from "../services/league-settings-service";
import {PlayerService} from "../services/player-service";
import { ModelView } from "large-web";

class TeamController {


    constructor() {
    }


    async showIndex(): Promise<ModelView> {
        return new ModelView(async () => {
        }, 'pages/team/index.html')

    }

}

export { TeamController }
