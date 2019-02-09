import {HomeController} from "./controller/home-controller";
import {AdminController} from "./controller/admin-controller";
import {SettingsController} from "./controller/settings-controller";

import Framework7 from "framework7";
import {Dialog} from "framework7/components/dialog/dialog";

export namespace Global {
    export var freedom: any
    export var homeController: HomeController
    export var adminController: AdminController
    export var settingsController: SettingsController
    export var app: Framework7



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