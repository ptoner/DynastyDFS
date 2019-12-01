import { Schema } from "../../dto/schema"
import { Global } from "../../global"

const OrbitDB = require('orbit-db')
const OrbitDBAddress = require('orbit-db/src/orbit-db-address.js')

const sha256 = require('js-sha256')


class SchemaService {

    private _cachedSchemas = {}


    constructor(
    ) {}


    async getSchema(store, walletAddress:string) : Promise<Schema> {

        let schema:Schema

        let results = await store.get(walletAddress)

        if (results && results[0] && results[0].value) {
            schema = results[0].value
        }

        return schema
    }

    async getSchemaByWalletAddress(walletAddress:string) : Promise<Schema> {

        // //Check if we've loaded it already
        let cached = this._cachedSchemas[walletAddress]
        if (cached) return cached


        let mainStore = await this.getMainStoreByWalletAddress(walletAddress)
        let schema:Schema = await this.getSchema(mainStore, walletAddress)

        //Cache it
        this._cachedSchemas[walletAddress] = schema

        if (schema) return schema
        
        return new Promise((resolve, reject) => {
            mainStore.events.on('replicated', async () => {
                console.log(`Replicated main store for ${walletAddress}`)
                let schema:Schema = await this.getSchema(mainStore, walletAddress)

                //Cache it
                this._cachedSchemas[walletAddress] = schema

                resolve(schema)
            })
        })
        
        // throw new Error(`Schema for wallet ${walletAddress} could not be found`)

        return schema
    }

    async getMainStoreByWalletAddress(walletAddress:string) {

        let mainStore
        let mainStoreName = `baseball-main-${walletAddress.toLowerCase()}`

        //get name
        let mainStoreAddress = await Global.orbitDb.determineAddress(mainStoreName, 'docstore', {
            accessController: Global.orbitAccessControl //This might cause issues in the future. Do we need to
        })

        //Try to open it
        mainStore = await Global.orbitDb.open(mainStoreAddress, {
            fetchEntryTimeout: 5000
        })

        await mainStore.load()

        return mainStore

    }

    async getScoreboardStoreByWalletAddress(walletAddress: string) {
        let schema:Schema = await this.getSchemaByWalletAddress(walletAddress)
        return Global.orbitDb.open(schema.scoreboardStore, {
            fetchEntryTimeout: 5000
        })
    }

    async getBoxscoreStoreByWalletAddress(walletAddress: string) {
        let schema:Schema = await this.getSchemaByWalletAddress(walletAddress)
        return Global.orbitDb.open(schema.boxscoreStore, {
            fetchEntryTimeout: 5000
        })
    }

    async getPlayerStoreByWalletAddress(walletAddress: string) {
        let schema:Schema = await this.getSchemaByWalletAddress(walletAddress)
        return Global.orbitDb.open(schema.playerStore, {
            fetchEntryTimeout: 5000
        })
    }

    async getTeamStoreByWalletAddress(walletAddress: string) {
        let schema:Schema = await this.getSchemaByWalletAddress(walletAddress)
        return Global.orbitDb.open(schema.teamStore, {
            fetchEntryTimeout: 5000
        })
    }


    async getPlayerBoxscoreMapStoreByWalletAddress(walletAddress: string) {
        let schema:Schema = await this.getSchemaByWalletAddress(walletAddress)
        return Global.orbitDb.open(schema.playerBoxscoreMapStore, {
            fetchEntryTimeout: 5000
        })
    }

    async getLeagueSettingsStoreByWalletAddress(walletAddress: string) {
        let schema:Schema = await this.getSchemaByWalletAddress(walletAddress)
        return Global.orbitDb.open(schema.leagueSettingsStore, {
            fetchEntryTimeout: 5000
        })
    }

    async generateSchema(orbitdb, accessController, mainStore, walletAddress:string) {

        console.log('Generating schema')

        let scoreboardStore = await this.generateScoreboardStore(orbitdb, accessController, walletAddress)
        let boxscoreStore = await this.generateBoxscoreStore(orbitdb, accessController, walletAddress)
        let playerStore = await this.generatePlayerStore(orbitdb, accessController, walletAddress)
        let playerBoxscoreMapStore = await this.generatePlayerBoxscoreMapStore(orbitdb, accessController, walletAddress)
        let leagueSettingsStore = await this.generateLeagueSettingsStore(orbitdb, accessController, walletAddress)
        let teamStore = await this.generateTeamStore(orbitdb, accessController, walletAddress)


        let schema:Schema = {
        
            scoreboardStore: scoreboardStore.address.toString(),
            boxscoreStore: boxscoreStore.address.toString(),
            playerStore: playerStore.address.toString(),
            playerBoxscoreMapStore: playerBoxscoreMapStore.address.toString(),
            leagueSettingsStore: leagueSettingsStore.address.toString(),
            teamStore: teamStore.address.toString()
        }

        await mainStore.put({
          _id: walletAddress,
          value: schema
        })

        console.log('Inserted schema into mainStore')

    }


    async updateSchema(mainStore, schema:Schema, walletAddress:string) {

        //Make sure schema has all fields
        let schemaUpdated:boolean = false


        if (!schema.scoreboardStore) {
            let scoreboardStore = await this.generateScoreboardStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
            schema.scoreboardStore = scoreboardStore.address.toString()
            schemaUpdated = true
        }

        if (!schema.boxscoreStore) {
            let boxscoreStore = await this.generateBoxscoreStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
            schema.boxscoreStore = boxscoreStore.address.toString()
            schemaUpdated = true
        }

        if (!schema.playerStore) {
            let playerStore = await this.generatePlayerStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
            schema.playerStore = playerStore.address.toString()
            schemaUpdated = true
        }


        if (!schema.playerBoxscoreMapStore) {
            let playerBoxscoreMapStore = await this.generatePlayerBoxscoreMapStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
            schema.playerBoxscoreMapStore = playerBoxscoreMapStore.address.toString()
            schemaUpdated = true
        }

        if (!schema.leagueSettingsStore) {
            let leagueSettingsStore = await this.generateLeagueSettingsStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
            schema.playerBoxscoreMapStore = leagueSettingsStore.address.toString()
            schemaUpdated = true
        }

        if (!schema.teamStore) {
            let teamStore = await this.generateTeamStore(Global.orbitDb, Global.orbitAccessControl, walletAddress)
            schema.teamStore = teamStore.address.toString()
            schemaUpdated = true
        }


        if (schemaUpdated) {

            console.log("Updating schema")

            await mainStore.put({
                _id: walletAddress,
                value: schema
            })
        }

    }


    async generateMainStore(orbit, accessController, walletAddress:string) {

        return Global.orbitDb.docstore(`mainStore-${walletAddress.toLowerCase()}`, {
            accessController: accessController
        })
    }



    async generateScoreboardStore(orbitdb, accessController, walletAddress:string) {

        console.log("Generating scoreboard store")

        return orbitdb.kvstore(`scoreboard-${walletAddress.toLowerCase()}`, {
          create: true,
          accessController: accessController
        })

    }


    async generateBoxscoreStore(orbitdb, accessController, walletAddress:string) {

        console.log("Generating boxscore store")

        return orbitdb.kvstore(`boxscore-${walletAddress.toLowerCase()}`, {
          create: true,
          accessController: accessController
        })

    }


    async generatePlayerStore(orbitdb, accessController, walletAddress:string) {

        console.log("Generating player store")

        return orbitdb.docstore(`player-${walletAddress.toLowerCase()}`, {
          create: true,
          accessController: accessController
        })

    }

    async generateLeagueSettingsStore(orbitdb, accessController, walletAddress:string) {

        console.log("Generating league settings store")

        return orbitdb.kvstore(`league-settings-${walletAddress.toLowerCase()}`, {
          create: true,
          accessController: accessController
        })

    }


    async generateTeamStore(orbitdb, accessController, walletAddress:string) {

        console.log("Generating team store")

        return orbitdb.docstore(`team-${walletAddress.toLowerCase()}`, {
          create: true,
          accessController: accessController
        })

    }



    async generatePlayerBoxscoreMapStore(orbitdb, accessController, walletAddress:string) {

        console.log("Generating playerboxscoremap store")

        return orbitdb.kvstore(`playerboxscoremap-${walletAddress.toLowerCase()}`, {
          create: true,
          accessController: accessController
        })

    }


    async openAddress(address:any) {

        let orbitAddress = new OrbitDBAddress(address.root, address.path)

        let parsedAddress = orbitAddress.toString()
        return Global.orbitDb.open(parsedAddress)
    }


}



export {
    SchemaService
}
