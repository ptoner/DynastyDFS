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

const LazyKvStore = require('orbit-db-lazykv')



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
    console.log(3)
    if (ipfs) return

    let settings = this.settingsService.getSettings()
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
    

    OrbitDB.addDatabaseType(LazyKvStore.type, LazyKvStore)
    Global.orbitdb = await OrbitDB.createInstance(ipfs)

    if (!settings.dbAddress) {
      await this.settingsService.generateDatabase(Global.orbitdb)
      settings = this.settingsService.getSettings()
    }


    let address = OrbitDB.parseAddress(settings.dbAddress)


    Global.mainDb = await Global.orbitdb.open(address, {type: "lazykv"})

    //Look up the other database addresses
    let leagueSettingsAddress = await Global.mainDb.get('leaguesettings')
    let scoreboardAddress = await Global.mainDb.get('scoreboard')
    let boxscoreAddress = await Global.mainDb.get('boxscore')
    let playerAddress = await Global.mainDb.get('playerAddress')
    let playerboxscoreAddress = await Global.mainDb.get('playerboxscoremap')


    Global.leagueSettingsDb = await Global.orbitdb.open(leagueSettingsAddress.path, {type: "lazykv"})
    Global.scoreboardDb = await Global.orbitdb.open(scoreboardAddress.path, { type: "lazykv"})
    Global.boxscoreDb = await Global.orbitdb.open(boxscoreAddress.path, {type: "lazykv"})
    Global.playerDb = await Global.orbitdb.open(playerAddress.path, {type: "lazykv"})
    Global.playerBoxscoreMapDb = await Global.orbitdb.open(playerboxscoreAddress.path, {type: "lazykv"})
    
    Global.leagueSettingsService = new LeagueSettingsService(Global.leagueSettingsDb)
    Global.translateService = new TranslateService()
    Global.playerService = new PlayerService(Global.playerDb, Global.translateService)
    Global.mapService = new PlayerBoxscoreMapService(Global.playerBoxscoreMapDb, Global.translateService)
    Global.gamedayService = new GamedayService(Global.scoreboardDb, Global.boxscoreDb,Global.mapService,Global.playerService, Global.translateService)
    Global.playerDayService = new PlayerDayService(Global.mapService, Global.gamedayService, Global.translateService)


    Global.homeController = new HomeController(Global.leagueSettingsService, Global.playerService)
    Global.adminController = new AdminController(Global.leagueSettingsService, Global.gamedayService, Global.queueService)
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
      path: '/admin/downloadSeason',

      // @ts-ignore
      async async(routeTo, routeFrom, resolve, reject) {
        await self.initAndResolve(resolve, function () {
          return Global.adminController.downloadSeason(+routeTo.query.season)
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
