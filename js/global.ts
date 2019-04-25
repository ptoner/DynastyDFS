import {HomeController} from "./controller/home-controller";
import {AdminController} from "./controller/admin-controller";
import {SettingsController} from "./controller/settings-controller";

import { LeagueSettingsService } from "../js/services/league-settings-service"
import { PlayerService } from "../js/services/player-service"
import { SettingsService } from "./services/util/settings-service"
import { RouteService } from "./services/util/route-service"
import { QueueService } from "./services/util/queue_service"

import Framework7 from "framework7";
import {Dialog} from "framework7/components/dialog/dialog";
import { FileService } from "./services/util/file-service";
import { GamedayDownloadService } from "./services/gameday/gameday-download-service";
import { GamedayProcessService } from "./services/gameday/gameday-process-service";
import { PlayerDayService } from "./services/player-day-service";

import { PlayerController } from "./controller/player-controller";
import { PagingService } from "./services/util/paging-service";


export namespace Global {

    export var homeController: HomeController
    export var adminController: AdminController
    export var playerController: PlayerController
    export var settingsController: SettingsController
    export var app: Framework7

    export var leagueSettingsService: LeagueSettingsService
    export var playerService: PlayerService
    export var settingsService: SettingsService
    export var routeService: RouteService
    export var queueService: QueueService
    export var fileService: FileService
    export var gamedayDownloadService: GamedayDownloadService
    export var gamedayProcessService: GamedayProcessService
    export var playerDayService: PlayerDayService
    export var pagingService: PagingService


    export function navigate(url: string) {
        Global.app.view.main.router.navigate(url);
    }

    export function showExceptionPopup(ex) {

        if (ex.name == "IpfsException") {
            Global.app.dialog.alert(ex.message, "Problem connecting to IPFS")
        } else {
            Global.app.dialog.alert(ex.message, "There was an error")
        }
    }
}