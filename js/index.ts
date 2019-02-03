const Freedom: any = require('freedom-for-data')

console.log(Freedom)

const Framework7: any = require('framework7')


import {Global} from './global'

import { LeagueSettingsService } from "../js/services/league-settings-service"
import { PlayerService } from "../js/services/player-service"
import { SettingsService } from "../js/services/settings-service"
import { RouteService } from "../js/services/route-service"



import { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring } from '../js/dto/league-settings'

import {HomeController}  from '../js/controller/home-controller'
import {SettingsController}  from '../js/controller/settings-controller'
import {AdminController}  from '../js/controller/admin-controller'



module.exports = async () => {

    Global.freedom = await Freedom({
        ipfsHost: "localhost",
        ipfsPort: 5001,
        recordContractAddress: "0xE6655028D4A85DBfD6F362446541057aCC1b10A2",
        recordContractTransactionHash: "0x7f8d430867b1d59cf918faece6ccde7ddc97874ddc80c559ca2cba40001a291b"
    })

    let settingsService = new SettingsService()
    let routeService = new RouteService(settingsService)
    let leagueSettingsService = new LeagueSettingsService()
    let playerService = new PlayerService()

    Global.homeController = new HomeController(leagueSettingsService, playerService)
    Global.settingsController = new SettingsController(settingsService)
    Global.adminController = new AdminController(leagueSettingsService)

    //Detect page root

    // @ts-ignore
    const rootUrl = new URL(window.location)

    // Framework7 App main instance
    // @ts-ignore
    Global.app = new Framework7({
        root: '#app', // App root element
        id: 'io.framework7.testapp', // App bundle ID
        name: 'freedom-for-data Demo', // App name
        theme: 'auto', // Automatic theme detection

        on: {
            init: function () {
            }
        },

        methods: {

            // @ts-ignore
            navigate(url: string) {
                this.view.main.router.navigate(url);
            },

            // @ts-ignore
            showExceptionPopup: function (ex) {
                if (ex.name == "IpfsException") {
                    Global.app.dialog.alert(ex.message, "Problem connecting to IPFS")
                } else {
                    Global.app.dialog.alert(ex.message, "There was an error")
                }
            }

        },

        // App routes
        routes: routeService.getRoutes(rootUrl.pathname)

    });


    // Init/Create main view
    const mainView = Global.app.views.create('.view-main', {
        pushState: true
    });




}





