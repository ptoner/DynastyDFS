const Framework7: any = require('framework7/js/framework7.bundle')
import { Dom7, Template7 } from "framework7/js/framework7.bundle"

import { Global } from './global'

import { QueueService } from "./services/util/queue_service"
import { UiService } from './services/util/ui-sevice'

import routes from "./routes"




module.exports = async () => {

    Template7.registerPartial("mobileBars", `
        <a href="#" class="link icon-only panel-open small-only" data-panel=".panel-left"><i class="icon f7-icons">bars</i></a>
    `)

    //Detect page root




    // @ts-ignore
    const rootUrl = new URL(window.location)


    // Framework7 App main instance
    Global.app = new Framework7({
        root: '#app', // App root element
        id: 'fantasybaseball', // App bundle ID
        name: 'Fantasy Baseball', // App name
        theme: 'auto', // Automatic theme detection

        // App routes
        routes: routes(rootUrl.pathname)

    })


    Global.uiService = new UiService(Global.app)
    Global.queueService = new QueueService(Global.uiService)



    try {
        await Global.init()
    } catch (ex) {
        console.log(ex)
    }


    Global.initializeControllers()


    // Init/Create main view
    const mainView = Global.app.views.create('.view-main', {
        pushState: true
    });




    window['Global'] = Global


}





