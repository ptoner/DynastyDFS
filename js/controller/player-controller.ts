import { ModelView } from '../model-view'
import {LeagueSettingsService} from "../services/league-settings-service";
import {Global} from "../global";
import {BattingScoring, LeagueSettings, PitchingScoring, PositionLimits} from "../dto/league-settings";
import {Dom7, Template7} from "framework7";
import { QueueService } from '../services/util/queue_service'
import {PromiseView} from "../promise-view"
import { PlayerService } from '../services/player-service';
import { Player } from '../dto/player';
import { PagingService, PagingViewModel } from '../services/util/paging-service';

var $$ = Dom7;

class PlayerController {

    playerTemplate: any 

    constructor(
        private playerService: PlayerService,
        private pagingService: PagingService
    ) {
    }

    async list(offset: number): Promise<ModelView> {
        
        let limit: number = 100

        let players: Player[] = await this.playerService.list(offset, limit)

        let page: PagingViewModel = this.pagingService.buildPagingViewModel(offset, limit, await this.playerService.count())

        return new ModelView({
                players: players,
                page: page
            }, 
            "pages/player/list.html"
        )
    }


}

export { PlayerController }