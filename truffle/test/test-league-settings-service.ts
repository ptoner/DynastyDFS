import { LeagueSettingsService } from '../../js/services/league-settings-service';
import { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring } from '../../js/dto/league-settings';
import assert = require('assert');
import { platform } from 'os';
import { LeagueSettingsSchema } from '../../js/schemas';

const TableStore = require('orbit-db-tablestore')
const OrbitDB = require('orbit-db')
const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })



//@ts-ignore
contract('LeagueSettingsService', async (accounts) => {


    let leagueSettingsService: LeagueSettingsService 


    //@ts-ignore
    before('Main setup', async () => {

        if (!OrbitDB.isValidType(TableStore.type)) {
            OrbitDB.addDatabaseType(TableStore.type, TableStore)
        }

        const orbitdb = await OrbitDB.createInstance(ipfs, "./orbitdb");


        let db = await orbitdb.open("test-league-settings", {create: true, type: 'table'})
        await db.createIndexes(LeagueSettingsSchema.indexes)


        leagueSettingsService = new LeagueSettingsService(db)

    })

    //@ts-ignore
    it("Test update & getLeagueSettings: Save default league settings", async () => {

        //Arrange
        const positionLimits: PositionLimits[] = []

        let pLimit = new PositionLimits()
        pLimit.position = "P"
        pLimit.starters = 1
        pLimit.maximums = 1

        positionLimits.push(pLimit)

        let battingScoring = new BattingScoring()
        battingScoring.hits = 1
        battingScoring.runsScored = 1
        battingScoring.singles = 1
        battingScoring.doubles = 1
        battingScoring.triples = 1
        battingScoring.homeRuns = 1
        battingScoring.rbi = 1
        battingScoring.bb = 1
        battingScoring.ibb = 1
        battingScoring.k = 1
        battingScoring.hbp = 1
        battingScoring.sb = 1
        battingScoring.cs = 1


        let pitchingScoring = new PitchingScoring()

        pitchingScoring.ip = 1
        pitchingScoring.h = 1
        pitchingScoring.er = 1
        pitchingScoring.hr = 1
        pitchingScoring.bb = 1
        pitchingScoring.hbp = 1
        pitchingScoring.k = 1
        pitchingScoring.wp = 1
        pitchingScoring.balks = 1
        pitchingScoring.pickOffs = 1
        pitchingScoring.completeGame = 1
        pitchingScoring.shutOut = 1
        pitchingScoring.blownSave = 1
        pitchingScoring.holds = 1



        const leagueSettings: LeagueSettings = new LeagueSettings()
        leagueSettings.leagueName = "League of Legends"
        leagueSettings.rosterSize = 32
        leagueSettings.totalStarters =  21
        leagueSettings.totalBench = 11
        leagueSettings.totalDl = 4
        leagueSettings.pitchingScoring = pitchingScoring
        leagueSettings.battingScoring = battingScoring
        leagueSettings.positionLimits = positionLimits

        
        //Act
        await leagueSettingsService.update(leagueSettings)
        
        //Assert
        let read: LeagueSettings = await leagueSettingsService.getLeagueSettings()

        assert.deepEqual(read, leagueSettings)




    })

    //@ts-ignore
    it("Test update when already exists", async () => {

        //Arrange
        let leagueSettings: LeagueSettings = await leagueSettingsService.getLeagueSettings()

        leagueSettings.leagueName = "A Different League"

        //Act
        await leagueSettingsService.update(leagueSettings)

        //Assert
        let read: LeagueSettings = await leagueSettingsService.getLeagueSettings()

        assert.equal(read.leagueName, "A Different League")



    })


})


