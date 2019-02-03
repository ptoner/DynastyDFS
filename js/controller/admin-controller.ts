import { ModelView } from '../model-view'
import {LeagueSettingsService} from "../services/league-settings-service";
import {Global} from "../global";
import {BattingScoring, LeagueSettings, PitchingScoring, PositionLimits} from "../dto/league-settings";
import {Dom7} from "framework7";


var $$ = Dom7;

class AdminController {

    constructor(private leagueSettingsService: LeagueSettingsService) {

        const self = this

        $$(document).on('click', '#save-league-settings', async function(e: Event) {
            e.preventDefault()
            await self.saveButtonClicked(e)
        });
    }

    async showLeagueSettings() {

        let leagueSettings = await this.leagueSettingsService.getLeagueSettings()

        let leagueSettingsViewModel = this._translateToCommandModel(leagueSettings)

        return new ModelView(leagueSettingsViewModel, "pages/admin/league_settings.html")

    }

    async showLeagueSettingsForm() {

        let leagueSettings = await this.leagueSettingsService.getLeagueSettings()

        let leagueSettingsCommandModel

        if (leagueSettings) {
            leagueSettingsCommandModel = this._translateToCommandModel(leagueSettings)
        }


        return new ModelView(leagueSettingsCommandModel, "pages/admin/league_settings_form.html")

    }

    async saveButtonClicked(e: Event) {

        // @ts-ignore
        if (!$$('#league-settings-form')[0].checkValidity()) {
            console.log('Invalid form')
            return
        }

        try {

            //Look up existing league settings

            //Get data
            var leagueSettingCommandModel = Global.app.form.convertToData('#league-settings-form');

            console.log(leagueSettingCommandModel)

            let leagueSettings = this._translateFromCommandModel(leagueSettingCommandModel)

            console.log(leagueSettings)

            //Save
            leagueSettings = await this.leagueSettingsService.update(leagueSettings)

            console.log(leagueSettings)

            //Redirect
            // @ts-ignore
            Global.app.methods.navigate("/admin")

        } catch (ex) {
            // @ts-ignore
            Global.app.methods.showExceptionPopup(ex)
        }
    }


    _translateFromCommandModel(commandModel: any) {

        let positionLimits: PositionLimits[] = []

        positionLimits.push(new PositionLimits("C", commandModel.catcherStarters, commandModel.catcherMax))
        positionLimits.push(new PositionLimits("1B", commandModel.firstBaseStarters, commandModel.firstBaseMax))
        positionLimits.push(new PositionLimits("2B", commandModel.secondBaseStarters, commandModel.secondBaseMax))
        positionLimits.push(new PositionLimits("3B", commandModel.thirdBaseStarters, commandModel.thirdBaseMax))
        positionLimits.push(new PositionLimits("SS", commandModel.shortstopStarters, commandModel.shortstopMax))
        positionLimits.push(new PositionLimits("IF", commandModel.infieldStarters, commandModel.infieldMax))
        positionLimits.push(new PositionLimits("OF", commandModel.ofStarters, commandModel.ofMax))
        positionLimits.push(new PositionLimits("UTIL", commandModel.utilStarters, commandModel.utilMax))
        positionLimits.push(new PositionLimits("P", commandModel.pStarters, commandModel.pMax))
        positionLimits.push(new PositionLimits("SP", commandModel.spStarters, commandModel.spMax))
        positionLimits.push(new PositionLimits("RP", commandModel.rpStarters, commandModel.rpMax))


        const leagueSettings = new LeagueSettings (
            commandModel.id,
            commandModel.leagueName,
            commandModel.rosterSize,
            commandModel.totalStarters,
            commandModel.totalBench,
            commandModel.totalDl,
            positionLimits,
            new BattingScoring(
                commandModel.hitsBatting,
                commandModel.runsScoredBatting,
                commandModel.singlesBatting,
                commandModel.doublesBatting,
                commandModel.triplesBatting,
                commandModel.homeRunsBatting,
                commandModel.rbiBatting,
                commandModel.bbBatting,
                commandModel.iBBBatting,
                commandModel.kBatting,
                commandModel.hbpBatting,
                commandModel.sbBatting,
                commandModel.csBatting,

                //Garbage stats
                commandModel.gidpBatting,
                commandModel.cycBatting,
                commandModel.grandSlamBatting,
                commandModel.putOutsBatting,
                commandModel.assistsBatting,
                commandModel.ofAssistsBatting,
                commandModel.errorsBatting,
                commandModel.doublePlayTurnedBatting
            ),
            new PitchingScoring(
                commandModel.outPitching,
                commandModel.hitPitching,
                commandModel.earnedRunPitching,
                commandModel.homeRunPitching,
                commandModel.bbPitching,
                commandModel.hbpPitching,
                commandModel.kPitching,
                commandModel.wildPitchPitching,
                commandModel.balkPitching,
                commandModel.poPitching,
                commandModel.cgPitching,
                commandModel.shutoutPitching,
                commandModel.bsPitching,
                commandModel.holdsPitching
            )
        )



        return leagueSettings

    }

    _translateToCommandModel(leagueSettings: LeagueSettings) : any {

        const catchers: PositionLimits = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "C" })[0]
        const firstBase: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "1B" })[0]
        const secondBase: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "2B" })[0]
        const thirdBase: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "3B" })[0]
        const shortstop: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "SS" })[0]
        const infield: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "IF" })[0]
        const outfield: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "OF" })[0]
        const util: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "UTIL" })[0]
        const sp: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "SP" })[0]
        const rp: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "RP" })[0]
        const p: PositionLimits  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "P" })[0]


        const commandModel = {
            leagueName: leagueSettings.leagueName,
            rosterSize: leagueSettings.rosterSize,
            totalStarters: leagueSettings.totalStarters,
            totalBench: leagueSettings.totalBench,
            totalDl: leagueSettings.totalDl,

            //Pitching scoring
            outPitching: leagueSettings.pitchingScoring.ip,
            hitPitching: leagueSettings.pitchingScoring.h,
            earnedRunPitching: leagueSettings.pitchingScoring.er,
            homeRunPitching: leagueSettings.pitchingScoring.hr,
            bbPitching: leagueSettings.pitchingScoring.bb,
            hbpPitching: leagueSettings.pitchingScoring.hbp,
            kPitching: leagueSettings.pitchingScoring.k,
            wildPitchPitching: leagueSettings.pitchingScoring.wp,
            balkPitching: leagueSettings.pitchingScoring.balks,
            poPitching:leagueSettings.pitchingScoring.pickOffs,
            cgPitching: leagueSettings.pitchingScoring.completeGame,
            shutoutPitching: leagueSettings.pitchingScoring.shutOut,
            bsPitching: leagueSettings.pitchingScoring.blownSave,
            holdsPitching: leagueSettings.pitchingScoring.holds,

            //Hitting scoring
            hitsBatting: leagueSettings.battingScoring.hits,
            runsScoredBatting: leagueSettings.battingScoring.runsScored,
            singlesBatting: leagueSettings.battingScoring.singles,
            doublesBatting: leagueSettings.battingScoring.doubles,
            triplesBatting: leagueSettings.battingScoring.triples,
            homeRunsBatting: leagueSettings.battingScoring.homeRuns,
            rbiBatting: leagueSettings.battingScoring.rbi,
            bbBatting: leagueSettings.battingScoring.bb,
            iBBBatting: leagueSettings.battingScoring.ibb,
            kBatting: leagueSettings.battingScoring.k,
            hbpBatting: leagueSettings.battingScoring.hbp,
            sbBatting: leagueSettings.battingScoring.sb,
            csBatting: leagueSettings.battingScoring.cs,

            //Garbage stats
            gidpBatting: leagueSettings.battingScoring.gidp,
            cycBatting: leagueSettings.battingScoring.cyc,
            grandSlamBatting: leagueSettings.battingScoring.gshr,
            putOutsBatting: leagueSettings.battingScoring.putOuts,
            assistsBatting: leagueSettings.battingScoring.assists,
            ofAssistsBatting: leagueSettings.battingScoring.ofAssists,
            errorsBatting: leagueSettings.battingScoring.errors,
            doublePlayTurnedBatting: leagueSettings.battingScoring.dpt,


            //Define position limits
            catcherStarters: catchers.starters,
            catcherMax: catchers.maximums,

            firstBaseStarters: firstBase.starters,
            firstBaseMax: firstBase.maximums,

            secondBaseStarters: secondBase.starters,
            secondBaseMax: secondBase.maximums,

            thirdBaseStarters: thirdBase.starters,
            thirdBaseMax: thirdBase.maximums,

            shortstopStarters: shortstop.starters,
            shortstopMax: shortstop.maximums,

            infieldStarters: infield.starters,
            infieldMax: infield.maximums,

            ofStarters: outfield.starters,
            ofMax: outfield.maximums,

            utilStarters: util.starters,
            utilMax: util.maximums,

            spStarters: sp.starters,
            spMax: sp.maximums,

            pStarters: p.starters,
            pMax : p.maximums,

            rpStarters: rp.starters,
            rpMax: rp.maximums
        }


        return commandModel
    }

}

export { AdminController }