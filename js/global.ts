import {HomeController} from "./controller/home-controller";
import {AdminController} from "./controller/admin-controller";
import {SettingsController} from "./controller/settings-controller";
import {LeagueSettingsService} from "./services/league-settings-service";
import {PlayerService} from "./services/player-service";
import {SettingsService} from "./services/settings-service";
import {RouteService} from "./services/route-service";
import Framework7 from "framework7";

export namespace Global {
    export var freedom: any
    export var homeController: HomeController
    export var adminController: AdminController
    export var settingsController: SettingsController
    export var app: Framework7



    export function navigate(url: string) {
        app.view.main.router.navigate(url);
    }

    export function showExceptionPopup(ex) {
        if (ex.name == "IpfsException") {
            app.dialog.alert(ex.message, "Problem connecting to IPFS")
        } else {
            app.dialog.alert(ex.message, "There was an error")
        }
    }
}