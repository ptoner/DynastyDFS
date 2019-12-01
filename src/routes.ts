import { Global } from "./global"
import Web, { ModelView } from 'large-web'

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

    let routes = [
        {
            path: '/',
            url: 'pages/league/tabs.html',
            tabs: [
                {
                    path: '/',
                    id: 'home',
                    async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.leagueController.showIndex())
                },
                {
                    path: '/league/settings',
                    id: 'settings',
                    async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.settingsController.showSettings())
                },
                {
                    path: '/league/settings/edit',
                    id: 'settings-edit',
                    async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.settingsController.showSettingsForm())
                },
                {
                    path: '/league/teams',
                    id: 'teams',
                    async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.teamsController.showIndex())
                },
                {
                    path: '/league/teams/edit',
                    id: 'teams-edit',
                    async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.teamsController.showTeamsEdit())
                },

            ]
        },
        {
            path: '/myteam',
            async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.teamController.showIndex())
        },
        {
            path: '/players',
            async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.playerController.showIndex())
        },
        {
            path: '/scoreboard',
            async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.scoreboardController.showIndex())
        },
        {
            path: '/standings',
            async: async (routeTo, routeFrom, resolve, reject) => await defaultResolve(resolve, Global.standingsController.showIndex())
        }

    ]

    // if (baseurl != '/') {
    //     routes.push({
    //         path: baseurl,
    //         async: homeRoute
    //     })
    // }

    // routes.push({
    //     path: '/',
    //     async: homeRoute
    // })



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

async function defaultResolve(resolve, promise: Promise<ModelView>) {
    try {
        await doResolve(resolve, promise)
    } catch (ex) {
        Global.uiService.showExceptionPopup(ex)
    }
}


//Handles routing to a controller
async function doResolve(resolve, controller_promise: Promise<ModelView>) {

    let modelView: ModelView = await controller_promise;

    if (!modelView) return

    let ctx = await modelView.model

    let context = await ctx()

    resolve({
        componentUrl: modelView.view
    },
        {
            context: context
        })

}

export default routes 
