import { LeagueController } from "./controller/league-controller";
import { AdminController } from "./controller/admin-controller";

import { LeagueSettingsService } from "./services/league-settings-service"
import { PlayerService } from "./services/player-service"

import { QueueService } from "./services/util/queue_service"

import Framework7 from "framework7";
import { Dialog } from "framework7/components/dialog/dialog";

import { PlayerDayService } from "./services/player-day-service";

import { PlayerController } from "./controller/player-controller";
import { PagingService } from "./services/util/paging-service";
import { TranslateService } from "./services/util/translate-service";
import { PlayerBoxscoreMapService } from "./services/playerboxscoremap-service";
import { GamedayService } from "./services/gameday-service";
import { SchemaService } from "./services/util/schema-service";
import { UiService } from "./services/util/ui-sevice";
import { IdentityService } from "./services/util/identity-service";
import { Schema } from "./dto/schema";
import { EventEmitter } from "events"
import { Player } from "./dto/player";
import { TeamController } from "./controller/team-controller";
import { StandingsController } from "./controller/standings-controller";
import { ScoreboardController } from "./controller/scoreboard-controller";

const { providers, ethers } = require('ethers')
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const Keystore = require('orbit-db-keystore')

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res);
    })
  );

export namespace Global {

    // export var homeController: HomeController
    // export var adminController: AdminController
    // export var playerController: PlayerController
    export var leagueController: LeagueController
    export var teamController: TeamController
    export var playerController: PlayerController
    export var standingsController: StandingsController 
    export var scoreboardController: ScoreboardController 
    export var app: Framework7


    /** Etherjs */
    export var provider: any
    export var wallet: any

    export var isElectron: boolean
    export var eventEmitter



    export var queueService: QueueService
    export var pagingService: PagingService
    export var uiService: UiService

    export var schemaService: SchemaService
    export var translateService: TranslateService
    export var identityService: IdentityService

    export var leagueSettingsService: LeagueSettingsService
    export var playerService: PlayerService
    export var playerBoxscoreMapService: PlayerBoxscoreMapService
    export var gamedayService: GamedayService
    export var playerDayService: PlayerDayService

    //Orbit-db tables
    export var ipfs: any
    export var orbitDb
    export var orbitAccessControl: any  //this is temporary. This will need to be refactored. Remove it and actually create access control

    export function initializeControllers() {
        Global.leagueController = new LeagueController()
        Global.teamController = new TeamController()
        Global.playerController = new PlayerController(Global.playerService, Global.pagingService)
        Global.scoreboardController = new ScoreboardController()
        Global.standingsController = new StandingsController()

        window['leagueController'] = Global.leagueController
        window['teamController'] = Global.teamController
        window['playerController'] = Global.playerController
        window['scoreboardController'] = Global.scoreboardController
        window['standingsController'] = Global.standingsController


    }


    export async function loadComponentState(component, showSpinner = true) {
        return Global.uiService.loadComponentState(component, showSpinner)
      }

    export async function init() {

        console.log("Initializing")

        Global.identityService = new IdentityService()
        Global.schemaService = new SchemaService()

        Global.isElectron = !(window['web3'])

        if (!Global.isElectron) {
            await Global.configureWeb3()
        } else {
            //@ts-ignore
            window['remote'] = window.require('electron').remote

            let defaultProviders = ethers.getDefaultProvider("homestead")
            Global.provider = defaultProviders.providers[0]

        }

        if (!Global.wallet) {
            throw new Error("No wallet found. Unable to initialize.")
        }

        if (Global.ipfs) {
            throw new Error("IPFS already configured. Unable to initialize.")
        }

        console.log('Configuring IPFS')

        if (Global.isElectron) {
            await Global.configureElectron()
        } else {
            await Global.configureBrowser()
        }



        let walletAddress = await Global.wallet.getAddress()

        console.log(`Initializing Fantasy Baseball for wallet: ${walletAddress}`)

        /**
         * Orbit
         */
        let keystore = new Keystore()

        let identity = await Global.identityService.getIdentity(keystore)

        Global.orbitDb = await OrbitDB.createInstance(Global.ipfs, {
            identity: identity
        })

        Global.orbitAccessControl = Global.identityService.getAccessController(Global.orbitDb)


        //Look up main address
        let mainStore
        try {
            mainStore = await Global.schemaService.getMainStoreByWalletAddress(walletAddress)
        } catch (ex) {
            console.log(ex)
        }

        //If it doesn't exist create it
        if (!mainStore) {
            mainStore = await Global.schemaService.generateMainStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
        }

        //Detect whether or not we already have a schema
        let schema: Schema = await Global.schemaService.getSchema(mainStore, walletAddress)

        if (!schema) {
            await Global.schemaService.generateSchema(Global.orbitDb, Global.orbitAccessControl, mainStore, walletAddress)
            schema = await Global.schemaService.getSchema(mainStore, walletAddress)
        }


        Global.eventEmitter = new EventEmitter()

        //Update the schema if it needs it.
        await Global.schemaService.updateSchema(mainStore, schema, walletAddress)


        Global.translateService = new TranslateService()
        Global.leagueSettingsService = new LeagueSettingsService(Global.schemaService)
        Global.playerService = new PlayerService(Global.translateService, Global.schemaService)
        Global.playerBoxscoreMapService = new PlayerBoxscoreMapService(Global.translateService, Global.schemaService)

        Global.gamedayService = new GamedayService(Global.playerBoxscoreMapService, Global.playerService, Global.translateService, Global.schemaService)
        Global.playerDayService = new PlayerDayService(Global.playerBoxscoreMapService, Global.gamedayService, Global.translateService)
        Global.uiService = new UiService(Global.app)

    }

    export async function configureWeb3() {

        if (!window['ethereum']) return

        // Request account access
        await window['ethereum'].enable()

        //@ts-ignore
        window.web3Provider = window.ethereum

        //@ts-ignore
        web3 = new Web3(window.web3Provider)

        //@ts-ignore
        const accounts = await promisify(cb => web3.eth.getAccounts(cb))

        let account = accounts[0]
        window['currentAccount'] = account //TODO: probably something better


        //@ts-ignore
        Global.provider = new providers.Web3Provider(web3.currentProvider)
        Global.wallet = Global.provider.getSigner()

    }

    export async function configureElectron() {

        //@ts-ignore
        Global.ipfsHost = remote.getGlobal('ipfsHost')

        Global.ipfs = await IPFS.create({
            EXPERIMENTAL: {
                ipnsPubsub: true
            },
            preload: {
                enabled: false
            },
            relay: {
                enabled: true,
                hop: {
                    enabled: true // enable circuit relay HOP (make this node a relay)
                }
            },
            config: {
                Addresses: {
                    //@ts-ignore
                    Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star', Core.ipfsHost]
                }
            }
        })

    }

    export async function configureBrowser() {

        Global.ipfs = await IPFS.create({
            EXPERIMENTAL: {
                ipnsPubsub: true
            },
            preload: {
                enabled: false
            },
            relay: {
                enabled: true,
                hop: {
                    enabled: true // enable circuit relay HOP (make this node a relay)
                }
            },
            config: {
                Addresses: {
                    //@ts-ignore
                    Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
                }
            }
        })

    }


}