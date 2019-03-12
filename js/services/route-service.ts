import { SettingsService } from "./settings-service";
import { Global } from "../global";

import { Template7 } from "framework7";

const Freedom: any = require('freedom-for-data')

import { ModelView } from "../model-view";

var TruffleContract = require('truffle-contract')

const ipfsClient = require('ipfs-http-client')


import * as RecordService from '../../truffle/build/contracts/RecordService.json'


const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res);
    })
  );


class RouteService {

  constructor(private settingsService: SettingsService) { }

  async initialize(): Promise<void> {

    if (Global.freedom) return

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


    const ipfs = ipfsClient({
      host: settings.ipfsHost,
      port: settings.ipfsApiPort,
      protocol: 'http'
    })

    //@ts-ignore
    Global.freedom = await Freedom( ipfs , contract)

    Global.leagueSettingsService.freedom = Global.freedom

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


  // getContractAbi() {
  //   return [
  //     {
  //       "inputs": [],
  //       "payable": false,
  //       "stateMutability": "nonpayable",
  //       "type": "constructor",
  //       "signature": "constructor"
  //     },
  //     {
  //       "anonymous": false,
  //       "inputs": [
  //         {
  //           "indexed": false,
  //           "name": "id",
  //           "type": "uint256"
  //         },
  //         {
  //           "indexed": false,
  //           "name": "owner",
  //           "type": "address"
  //         },
  //         {
  //           "indexed": false,
  //           "name": "ipfsCid",
  //           "type": "string"
  //         },
  //         {
  //           "indexed": false,
  //           "name": "repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "indexed": false,
  //           "name": "eventType",
  //           "type": "string"
  //         }
  //       ],
  //       "name": "RecordEvent",
  //       "type": "event",
  //       "signature": "0x050a6f24947f7fed7d2d6fe904ff10e1cfbee598adc5c40655e61383e60d2b0d"
  //     },
  //     {
  //       "constant": false,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_ipfsCid",
  //           "type": "string"
  //         }
  //       ],
  //       "name": "create",
  //       "outputs": [
  //         {
  //           "name": "id",
  //           "type": "uint256"
  //         }
  //       ],
  //       "payable": false,
  //       "stateMutability": "nonpayable",
  //       "type": "function",
  //       "signature": "0x0118fa49"
  //     },
  //     {
  //       "constant": true,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_id",
  //           "type": "uint256"
  //         }
  //       ],
  //       "name": "read",
  //       "outputs": [
  //         {
  //           "name": "id",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "owner",
  //           "type": "address"
  //         },
  //         {
  //           "name": "ipfsCid",
  //           "type": "string"
  //         },
  //         {
  //           "name": "repoId",
  //           "type": "uint256"
  //         }
  //       ],
  //       "payable": false,
  //       "stateMutability": "view",
  //       "type": "function",
  //       "signature": "0x75080997"
  //     },
  //     {
  //       "constant": false,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_id",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_ipfsCid",
  //           "type": "string"
  //         }
  //       ],
  //       "name": "update",
  //       "outputs": [],
  //       "payable": false,
  //       "stateMutability": "nonpayable",
  //       "type": "function",
  //       "signature": "0xd753fd25"
  //     },
  //     {
  //       "constant": true,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         }
  //       ],
  //       "name": "count",
  //       "outputs": [
  //         {
  //           "name": "theCount",
  //           "type": "uint256"
  //         }
  //       ],
  //       "payable": false,
  //       "stateMutability": "view",
  //       "type": "function",
  //       "signature": "0x3b3546c8"
  //     },
  //     {
  //       "constant": true,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_index",
  //           "type": "uint256"
  //         }
  //       ],
  //       "name": "readByIndex",
  //       "outputs": [
  //         {
  //           "name": "id",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "owner",
  //           "type": "address"
  //         },
  //         {
  //           "name": "ipfsCid",
  //           "type": "string"
  //         },
  //         {
  //           "name": "repoId",
  //           "type": "uint256"
  //         }
  //       ],
  //       "payable": false,
  //       "stateMutability": "view",
  //       "type": "function",
  //       "signature": "0x5a24fb94"
  //     },
  //     {
  //       "constant": true,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_owner",
  //           "type": "address"
  //         }
  //       ],
  //       "name": "countOwned",
  //       "outputs": [
  //         {
  //           "name": "theCount",
  //           "type": "uint256"
  //         }
  //       ],
  //       "payable": false,
  //       "stateMutability": "view",
  //       "type": "function",
  //       "signature": "0x0a66e564"
  //     },
  //     {
  //       "constant": true,
  //       "inputs": [
  //         {
  //           "name": "_repoId",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "_owner",
  //           "type": "address"
  //         },
  //         {
  //           "name": "_index",
  //           "type": "uint256"
  //         }
  //       ],
  //       "name": "readByOwnedIndex",
  //       "outputs": [
  //         {
  //           "name": "id",
  //           "type": "uint256"
  //         },
  //         {
  //           "name": "owner",
  //           "type": "address"
  //         },
  //         {
  //           "name": "ipfsCid",
  //           "type": "string"
  //         },
  //         {
  //           "name": "repoId",
  //           "type": "uint256"
  //         }
  //       ],
  //       "payable": false,
  //       "stateMutability": "view",
  //       "type": "function",
  //       "signature": "0xf6c8405e"
  //     }
  //   ]
  // }


}








export { RouteService }

// module.exports = RouteService
