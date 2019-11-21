import { Global } from "./global"
import Web from 'large-web'

const routes = function (baseurl) {

    const homeRoute = async function (routeTo, routeFrom, resolve, reject) {
    
        let promise
        if (Global.isElectron) {

            // if (Global.wallet) {
            //     promise = Global.dashboardController.showIndex()
            // } else {
            //     promise = Global.walletController.showLanding()
            // }

        } else {
            promise = Global.leagueController.showIndex()
        }


        try {
            Web.modelViewService.resolve(resolve, promise)
        } catch (ex) {
            Global.uiService.showExceptionPopup(ex)
        }

    }

    let routes = []

    if (baseurl != '/') {
        routes.push({
            path: baseurl,
            async: homeRoute
        })
    }

    routes.push({
        path: '/',
        async: homeRoute
    })


    routes.push({
        path: '/myteam',
        async async(routeTo, routeFrom, resolve, reject) {

            try {
                Web.modelViewService.resolve(resolve, Global.teamController.showIndex())
            } catch (ex) {
                Global.uiService.showExceptionPopup(ex)
            }

        }
    })


    routes.push({
        path: '/players',
        async async(routeTo, routeFrom, resolve, reject) {

            try {
                Web.modelViewService.resolve(resolve, Global.playerController.showIndex())
            } catch (ex) {
                Global.uiService.showExceptionPopup(ex)
            }

        }
    })

    routes.push({
        path: '/scoreboard',
        async async(routeTo, routeFrom, resolve, reject) {

            try {
                Web.modelViewService.resolve(resolve, Global.scoreboardController.showIndex())
            } catch (ex) {
                Global.uiService.showExceptionPopup(ex)
            }

        }
    })

    routes.push({
        path: '/standings',
        async async(routeTo, routeFrom, resolve, reject) {

            try {
                Web.modelViewService.resolve(resolve, Global.standingsController.showIndex())
            } catch (ex) {
                Global.uiService.showExceptionPopup(ex)
            }

        }
    })


    //Needs to be last
    routes.push({
        path: '(.*)',
        // url: 'pages/404.html',
        async async(routeTo, routeFrom, resolve, reject) {
            console.log(routeTo)
        }
    })

    return routes
}

export default routes 
