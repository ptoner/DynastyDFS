const Freedom: any = require('freedom-for-data')
const Framework7: any = require('framework7/js/framework7.bundle')




import {Global} from './global'

import { LeagueSettingsService } from "../js/services/league-settings-service"
import { PlayerService } from "../js/services/player-service"
import { SettingsService } from "./services/util/settings-service"
import { RouteService } from "./services/util/route-service"
import { QueueService } from "./services/util/queue_service"


import { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring } from '../js/dto/league-settings'

import {HomeController}  from '../js/controller/home-controller'
import {SettingsController}  from '../js/controller/settings-controller'
import {AdminController}  from '../js/controller/admin-controller'





module.exports = async () => {

    Global.settingsService = new SettingsService()
    Global.queueService = new QueueService()
    Global.routeService = new RouteService(Global.settingsService)

    Global.settingsController = new SettingsController(Global.settingsService, Global.queueService)

    //Detect page root

    // @ts-ignore
    const rootUrl = new URL(window.location)

    // Framework7 App main instance
    Global.app = new Framework7({
        root: '#app', // App root element
        id: 'io.framework7.testapp', // App bundle ID
        name: 'freedom-for-data Demo', // App name
        theme: 'auto', // Automatic theme detection


        // App routes
        routes: Global.routeService.getRoutes(rootUrl.pathname)

    })


    // Init/Create main view
    const mainView = Global.app.views.create('.view-main', {
        pushState: true
    });


}





