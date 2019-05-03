import { SettingsService } from "./settings-service";
import { Global } from "../../global";

import { Template7 } from "framework7";

import { ModelView } from "../../model-view";

var TruffleContract = require('truffle-contract')

const ipfsClient = require('ipfs-http-client')
const OrbitDB = require('orbit-db')


import * as RecordService from '../../../truffle/build/contracts/RecordService.json'
import { LeagueSettingsService } from "../league-settings-service";
import { PlayerService } from "../player-service";
import { GamedayService } from "../gameday/gameday-service";
import { PlayerDayService } from "../player-day-service";
import { HomeController } from "../../controller/home-controller";
import { AdminController } from "../../controller/admin-controller";
import { PlayerController } from "../../controller/player-controller";
import { PagingService } from "./paging-service";
import { TranslateService } from "./translate-service";
import { PlayerBoxscoreMapService } from "../gameday/playerboxscoremap-service";


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
      protocol: 'http',
      pubsub: false
    })

    //Temp until ipfs-http-client properly supports it
    ipfs.pubsub = null

    Global.pagingService = new PagingService()
    
    

    //Create databases
    const orbitdb = await OrbitDB.createInstance(ipfs)

    const leagueSettingsDb = await orbitdb.keyvalue('leaguesettings', { overwrite: false })
    await leagueSettingsDb.load()
    
    const scoreboardDb = await orbitdb.docs('scoreboard', { indexBy: 'id', overwrite: false })
    await scoreboardDb.load()
  
    const boxscoreDb = await orbitdb.keyvalue('boxscore', { overwrite: false })
    // await boxscoreDb.load()
  
    const playerDb = await orbitdb.docs('player', { indexBy: 'id', overwrite: false })
    await playerDb.load()
  
    const playerBoxscoreMapDb = await orbitdb.docs('playerboxscoremap', { indexBy: 'id', overwrite: false })
    await playerBoxscoreMapDb.load()
  

    
    Global.leagueSettingsService = new LeagueSettingsService(leagueSettingsDb)
    Global.translateService = new TranslateService()
    Global.playerService = new PlayerService(playerDb, Global.translateService)
    Global.mapService = new PlayerBoxscoreMapService(playerBoxscoreMapDb, Global.translateService)
    Global.gamedayService = new GamedayService(scoreboardDb, boxscoreDb,Global.mapService,Global.playerService, Global.translateService)
    Global.playerDayService = new PlayerDayService(Global.mapService, Global.gamedayService, Global.translateService)


    Global.homeController = new HomeController(Global.leagueSettingsService, Global.playerService)
    Global.adminController = new AdminController(Global.leagueSettingsService, Global.queueService)
    Global.playerController = new PlayerController(Global.playerService, Global.pagingService)


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
