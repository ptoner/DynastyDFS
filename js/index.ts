const Freedom: any = require('freedom-for-data')
const Framework7: any = require('framework7/js/framework7.bundle')




import {Global} from './global'

import { LeagueSettingsService } from "../js/services/league-settings-service"
import { PlayerService } from "../js/services/player-service"
import { SettingsService } from "../js/services/settings-service"
import { RouteService } from "../js/services/route-service"
import { QueueService } from "../js/services/queue_service"


import { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring } from '../js/dto/league-settings'

import {HomeController}  from '../js/controller/home-controller'
import {SettingsController}  from '../js/controller/settings-controller'
import {AdminController}  from '../js/controller/admin-controller'





module.exports = async () => {

    let settingsService = new SettingsService()
    let routeService = new RouteService(settingsService)
    let leagueSettingsService = new LeagueSettingsService()
    let playerService = new PlayerService()
    let queueService = new QueueService()

    Global.homeController = new HomeController(leagueSettingsService, playerService)
    Global.settingsController = new SettingsController(settingsService, queueService)
    Global.adminController = new AdminController(leagueSettingsService, queueService)

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
        routes: routeService.getRoutes(rootUrl.pathname)

    })


    // Init/Create main view
    const mainView = Global.app.views.create('.view-main', {
        pushState: true
    });




}





