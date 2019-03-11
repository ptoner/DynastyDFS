import {SettingsService} from "./settings-service";
import {Global} from "../global";

import {Template7} from "framework7";

const Freedom: any = require('freedom-for-data')

import {ModelView} from "../model-view";
import freedom = Global.freedom;

class RouteService {

  constructor(private settingsService: SettingsService) {}


  getRoutes(baseurl: string) {

    const self = this

    // @ts-ignore
    const homeRoute = async function(routeTo, routeFrom, resolve, reject) {

      let settings = self.settingsService.getSettings()

      if (!settings) {
        await self.resolveController(resolve, Global.settingsController.showSettingsForm())
        return
      }

      await self.initAndResolve(resolve,function() {
        return Global.homeController.showHomePage()
      })

    }

    let routes = []

    if (baseurl != '/') {
      routes.push(      {
        path: baseurl,
        async: homeRoute
      })
    }

    routes.push(      {
      path: '/',
      async: homeRoute
    })

    routes.push({
      path: '/settings',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.resolveController(resolve, Global.settingsController.showSettingsForm())
      }
    })


    routes.push({
      path: '/admin',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.initAndResolve(resolve,function() {
          return Global.adminController.showLeagueSettings()
        })
      }
    })

    routes.push({
      path: '/admin/showLeagueSettingsForm',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.initAndResolve(resolve,function() {
          return Global.adminController.showLeagueSettingsForm()
        })
      }
    })



    return routes
  }



  async initialize() : Promise<void> {

    if (Global.freedom) return

    const settings = this.settingsService.getSettings()
    if (!settings) {
      throw 'No settings found'
    }

    Template7.global = {
      settings: settings,
      ipfsGateway: `https://${settings.ipfsHost}:${settings.ipfsGatewayPort}/ipfs`
    }

    Global.freedom = await Freedom({
      ipfsConfig: {
        host: settings.ipfsHost,
        port: settings.ipfsApiPort,
        protocol: 'http'
      },
      recordContractAddress: settings.recordContractAddress,
      recordContractTransactionHash: settings.recordContractTransactionHash
    })

  }


  // @ts-ignore
  async initAndResolve(resolve, successFunction) {
    try {
      await this.initialize()
      this.resolveController(resolve, successFunction())
    } catch(ex) {

      console.log(ex)


      Global.showExceptionPopup(ex)

      Global.navigate("/settings")
    }

  }


  //Handles routing to a controller
  // @ts-ignore
  async resolveController(resolve, controller_promise: Promise<ModelView>) {

    try {

      let modelView: ModelView = await controller_promise;

      if (!modelView) return

      resolve({
          componentUrl: modelView.view
        },
        {
          context: modelView.model
        })


    } catch (ex) {

      Global.showExceptionPopup(ex)

      console.log(ex)
    }

  }



}

export { RouteService}

// module.exports = RouteService
