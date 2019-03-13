import TestServiceFactory from './test-service-factory'
import { LeagueSettingsService } from '../../js/services/league-settings-service';
import { LeagueSettings, PositionLimits, BattingScoring, PitchingScoring } from '../../js/dto/league-settings';
import assert = require('assert');

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })


//@ts-ignore
contract('LeagueSettingsService', async (accounts) => {


    //@ts-ignore
    let contract = artifacts.require("RecordService")

    let leagueSettingsService: LeagueSettingsService

    //@ts-ignore
    before('Setup', async () => {
        
        //@ts-ignore
        let serviceFactory = new TestServiceFactory(ipfs, await contract.deployed())

        await serviceFactory.init()

        leagueSettingsService = serviceFactory.leagueSettingsService
    });

    //@ts-ignore
    it("Test update & getLeagueSettings: Save default league settings", async () => {

        //Arrange
        const positionLimits: PositionLimits[] = []

        positionLimits.push(new PositionLimits("P", 1, 1))

        const battingScoring = new BattingScoring(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1)
        const pitchingScoring = new PitchingScoring(1,1,1,1,1,1,1,1,1,1,1,1,1,1)

        const leagueSettings: LeagueSettings = new LeagueSettings(
            "League of Legends",
            32,
            21,
            11,
            4,
            positionLimits,
            battingScoring,
            pitchingScoring
        )
        
        //Act
        await leagueSettingsService.update(leagueSettings)
        
        //Assert
        let read: LeagueSettings = await leagueSettingsService.getLeagueSettings()

        assert.equal(read.leagueName, "League of Legends")
        assert.equal(read.rosterSize, 32)
        assert.equal(read.totalStarters, 21)
        assert.equal(read.totalBench, 11)
        assert.equal(read.totalDl, 4)
        assert.equal(read.positionLimits.length, 1)
        assert.equal(read.battingScoring.assists, 1)
        assert.equal(read.battingScoring.bb, 1)
        assert.equal(read.battingScoring.cs, 1)
        assert.equal(read.battingScoring.cyc, 1)
        assert.equal(read.battingScoring.doubles, 1)
        assert.equal(read.battingScoring.dpt, 1)
        assert.equal(read.battingScoring.errors, 1)
        assert.equal(read.battingScoring.gidp, 1)
        assert.equal(read.battingScoring.gshr, 1)
        assert.equal(read.battingScoring.hbp, 1)
        assert.equal(read.battingScoring.hits, 1)
        assert.equal(read.battingScoring.homeRuns, 1)
        assert.equal(read.battingScoring.ibb, 1)
        assert.equal(read.battingScoring.k, 1)
        assert.equal(read.battingScoring.ofAssists, 1)
        assert.equal(read.battingScoring.putOuts, 1)
        assert.equal(read.battingScoring.rbi, 1)
        assert.equal(read.battingScoring.runsScored, 1)
        assert.equal(read.battingScoring.sb, 1)
        assert.equal(read.battingScoring.singles, 1)
        assert.equal(read.battingScoring.triples, 1)

        assert.equal(read.pitchingScoring.balks, 1)
        assert.equal(read.pitchingScoring.bb, 1)
        assert.equal(read.pitchingScoring.blownSave, 1)
        assert.equal(read.pitchingScoring.completeGame, 1)
        assert.equal(read.pitchingScoring.er, 1)
        assert.equal(read.pitchingScoring.h, 1)
        assert.equal(read.pitchingScoring.hbp, 1)
        assert.equal(read.pitchingScoring.holds, 1)
        assert.equal(read.pitchingScoring.hr, 1)
        assert.equal(read.pitchingScoring.ip, 1)
        assert.equal(read.pitchingScoring.k, 1)
        assert.equal(read.pitchingScoring.pickOffs, 1)
        assert.equal(read.pitchingScoring.shutOut, 1)
        assert.equal(read.pitchingScoring.wp, 1)





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


