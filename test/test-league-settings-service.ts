import { LeagueSettingsService } from '../src/services/league-settings-service';
import { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring } from '../src/dto/league-settings';
import assert = require('assert');
import { platform } from 'os';
import { LeagueSettingsSchema } from '../src/schemas';



const OrbitDB = require('orbit-db')


import { getIPFS } from './ipfs'
import { Global } from '../src/global'
import { SchemaService } from '../src/services/util/schema-service'
import { TranslateService } from '../src/services/util/translate-service';


//@ts-ignore
describe('LeagueSettingsService', async (accounts) => {

    let leagueSettingsService: LeagueSettingsService 

    let mainStore
    let ipfs 
    let address

    //@ts-ignore
    before('Main setup', async () => {

        ipfs = await getIPFS()

        const orbitdb = await OrbitDB.createInstance(ipfs, {
            directory: "./test/orbitdb/" + Math.random().toString()
        })

        address = Math.random().toString()

        Global.ipfs = ipfs 
        Global.orbitDb = orbitdb
        Global.schemaService = new SchemaService()

        leagueSettingsService = new LeagueSettingsService(Global.schemaService)


        mainStore = await Global.schemaService.getMainStoreByWalletAddress(address)
        await mainStore.load()

        await Global.schemaService.generateSchema(Global.orbitDb, Global.orbitAccessControl, mainStore, address)

        await leagueSettingsService.loadStoreForWallet(address)
        await leagueSettingsService.load()


    })

    //@ts-ignore
    it("Test update & getLeagueSettings: Save default league settings", async () => {

        //Arrange
        const positionLimits: PositionLimits[] = [
            {
                position: "P",
                starters: 1,
                maximums: 1
            }
        ]


        let battingScoring = {
            hits: 1,
            runsScored:  1,
            singles:  1,
            doubles:  1,
            triples: 1,
            homeRuns:  1,
            rbi:  1,
            bb:  1,
            ibb:  1,
            k: 1,
            hbp:  1,
            sb:  1,
            cs:  1
        }



        let pitchingScoring = {
            ip: 1,
            h: 1,
            er: 1,
            hr: 1,
            bb: 1,
            hbp: 1,
            k : 1,
            wp: 1,
            balks: 1,
            pickOffs: 1,
            completeGame: 1,
            shutOut: 1,
            blownSave: 1,
            holds: 1
        }





        const leagueSettings: LeagueSettings = {
            owner: address.toString(),
            leagueName: "League of Legends",
            rosterSize: 32,
            totalStarters: 21,
            totalBench:11,
            totalDl: 4,
            pitchingScoring: pitchingScoring,
            battingScoring: battingScoring,
            positionLimits: positionLimits
        }


        
        //Act
        await leagueSettingsService.update(leagueSettings)
        
        //Assert
        let read: LeagueSettings = await leagueSettingsService.getLeagueSettings(address.toString())

        assert.deepEqual(read, leagueSettings)




    })

    //@ts-ignore
    it("Test update when already exists", async () => {

        //Arrange
        let leagueSettings: LeagueSettings = await leagueSettingsService.getLeagueSettings(address.toString())

        leagueSettings.leagueName = "A Different League"

        //Act
        await leagueSettingsService.update(leagueSettings)

        //Assert
        let read: LeagueSettings = await leagueSettingsService.getLeagueSettings(address.toString())

        assert.equal(read.leagueName, "A Different League")



    })


})


