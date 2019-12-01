import {LeagueSettingsService} from "../services/league-settings-service";
import {Global} from "../global";
import {BattingScoring, LeagueSettings, PitchingScoring, PositionLimits} from "../dto/league-settings";
import {Dom7, Template7} from "framework7";
import { QueueService } from '../services/util/queue_service'
import { PlayerService } from '../services/player-service';
import { Player } from '../dto/player';
import { PagingService, PagingViewModel } from '../services/util/paging-service';
import { ModelView } from "large-web";

var $$ = Dom7;

class PlayerController {

    playerTemplate: any 

    constructor(
        private playerService: PlayerService,
        private pagingService: PagingService
    ) {
    }

    async showIndex(): Promise<ModelView> {
        return new ModelView(async () => {

        }, 'pages/player/index.html')

    }

}

export { PlayerController }