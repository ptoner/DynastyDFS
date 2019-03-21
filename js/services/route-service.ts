import { SettingsService } from "./settings-service";
import { Global } from "../global";

import { Template7 } from "framework7";

import { ModelView } from "../model-view";

var TruffleContract = require('truffle-contract')

const ipfsClient = require('ipfs-http-client')


import * as RecordService from '../../truffle/build/contracts/RecordService.json'
import { LeagueSettings } from "../dto/league-settings";
import { LeagueSettingsService } from "./league-settings-service";
import { PlayerService } from "./player-service";
import { FileService } from "./file-service";
import { GamedayDownloadService } from "./gameday-download-service";
import { GamedayParseService } from "./gameday-parse-service";
import { GamedayProcessService } from "./gameday-process-service";
import { HitterDayService } from "./hitter-day-service";
import { PitcherDayService } from "./pitcher-day-service";
import { HomeController } from "../controller/home-controller";
import { AdminController } from "../controller/admin-controller";
import { PlayerController } from "../controller/player-controller";
import { PagingService } from "./paging-service";


const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res);
    })
  );

let ipfs

class RouteService {

  constructor(private settingsService: SettingsService) { }

  async initialize(): Promise<void> {

    if (ipfs) return

    const settings = this.settingsService.getSettings()
    if (!settings) {
      throw 'No settings found'
    }

    Template7.global = {
      settings: settings,
      ipfsGateway: `https://${settings.ipfsHost}:${settings.ipfsGatewayPort}/ipfs`
    }


    // Request account access
    await window['ethereum'].enable()

    //@ts-ignore
    window.web3Provider = window.ethereum

    //@ts-ignore
    web3 = new Web3(window.web3Provider)

    //@ts-ignore
    // console.log(web3)

    //@ts-ignore
    const accounts = await promisify(cb => web3.eth.getAccounts(cb))

    let account = accounts[0]
    window['currentAccount'] = account


    
    const truffleContract = TruffleContract(RecordService);

    let contract

    try {
        //@ts-ignore
        truffleContract.setProvider(window.web3Provider)
        truffleContract.defaults({from: account})

        contract = await truffleContract.deployed()
    } catch (ex) {
        console.log(ex)
    }


    ipfs = ipfsClient({
      host: settings.ipfsHost,
      port: settings.ipfsApiPort,
      protocol: 'http'
    })

    let rootFolder = "/fantasybaseball"

    //@ts-ignore
    Global.leagueSettingsService = new LeagueSettingsService(ipfs, rootFolder)
    
    Global.playerService = new PlayerService(ipfs, rootFolder)

    await Global.playerService.load()

    Global.pagingService = new PagingService()
    Global.fileService = new FileService(ipfs)
    Global.hitterDayService= new HitterDayService(ipfs, Global.fileService, rootFolder)
    Global.pitcherDayService = new PitcherDayService(ipfs, Global.fileService, rootFolder)
    Global.gamedayDownloadService = new GamedayDownloadService(Global.fileService, rootFolder)
    Global.gamedayParseService = new GamedayParseService(ipfs, Global.fileService, rootFolder)
    Global.gamedayProcessService = new GamedayProcessService(Global.gamedayParseService, Global.gamedayDownloadService, Global.playerService, Global.hitterDayService, Global.pitcherDayService)


    Global.homeController = new HomeController(Global.leagueSettingsService, Global.playerService)
    Global.adminController = new AdminController(Global.leagueSettingsService, Global.queueService)
    Global.playerController = new PlayerController(Global.playerService, Global.pagingService)


    console.log('init complete')

  }



  getRoutes(baseurl: string) {
    const self = this

    // @ts-ignore
    const homeRoute = async function (routeTo, routeFrom, resolve, reject) {

      let settings = self.settingsService.getSettings()

      if (!settings) {
        await self.resolveController(resolve, Global.settingsController.showSettingsForm())
        return
      }

      await self.initAndResolve(resolve, function () {
        return Global.homeController.showHomePage()
      })

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
        await self.initAndResolve(resolve, function () {
          return Global.adminController.index()
        })
      }
    })


    routes.push({
      path: '/admin/showLeagueSettings',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.initAndResolve(resolve, function () {
          return Global.adminController.showLeagueSettings()
        })
      }
    })

    routes.push({
      path: '/admin/showLeagueSettingsForm',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.initAndResolve(resolve, function () {
          return Global.adminController.showLeagueSettingsForm()
        })
      }
    })


    routes.push({
      path: '/player/list',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.initAndResolve(resolve, function () {
          return Global.playerController.list(+routeTo.query.offset)
        })
      }
    })


    return routes
  }



  

  // @ts-ignore
  async initAndResolve(resolve, successFunction) {
    try {
      await this.initialize()
      this.resolveController(resolve, successFunction())
    } catch (ex) {

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








export { RouteService }

// module.exports = RouteService
