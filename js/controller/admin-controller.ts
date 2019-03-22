import { ModelView } from '../model-view'
import {LeagueSettingsService} from "../services/league-settings-service";
import {Global} from "../global";
import {BattingScoring, LeagueSettings, PitchingScoring, PositionLimits} from "../dto/league-settings";
import {Dom7} from "framework7";
import { QueueService } from '../services/util/queue_service'
import {PromiseView} from "../promise-view"

var $$ = Dom7;

class AdminController {

    constructor(
        private leagueSettingsService: LeagueSettingsService,
        private queueService: QueueService
    ) {

        const self = this

        $$(document).on('click', '#save-league-settings', async function(e: Event) {
            e.preventDefault()
            await self.saveButtonClicked(e)
        });
    }

    async index() {
        return new ModelView({}, "pages/admin/index.html")

    }


    async showLeagueSettings() {

        let leagueSettings = await this.leagueSettingsService.getLeagueSettings()

        let leagueSettingsViewModel = this._translateToCommandModel(leagueSettings)

        return new ModelView(leagueSettingsViewModel, "pages/admin/show_league_settings.html")

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

            let leagueSettings = this._translateFromCommandModel(leagueSettingCommandModel)



            //Redirect to home
            Global.navigate("/")

            await this.queueService.queuePromiseView(
                new PromiseView(
                    this.leagueSettingsService.update(leagueSettings),
                    "Saving league settings",
                    "gear",
                    leagueSettings,
                    "/admin"
                )
            )




        } catch (ex) {
            Global.showExceptionPopup(ex)
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
                commandModel.csBatting
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

        if (!leagueSettings) return null

        let catchers: PositionLimits
        let firstBase: PositionLimits
        let secondBase: PositionLimits
        let thirdBase: PositionLimits
        let shortstop: PositionLimits
        let infield: PositionLimits
        let outfield: PositionLimits
        let util: PositionLimits
        let sp: PositionLimits
        let rp: PositionLimits
        let p: PositionLimits


        if (leagueSettings.positionLimits) {
            catchers = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "C" })[0]
            firstBase  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "1B" })[0]
            secondBase  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "2B" })[0]
            thirdBase  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "3B" })[0]
            shortstop  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "SS" })[0]
            infield  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "IF" })[0]
            outfield  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "OF" })[0]
            util  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "UTIL" })[0]
            sp  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "SP" })[0]
            rp  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "RP" })[0]
            p  = leagueSettings.positionLimits.filter(function(positionLimit) { return positionLimit.position == "P" })[0]
        }



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


            //Define position limits
            catcherStarters: catchers ? catchers.starters : null,
            catcherMax: catchers ? catchers.maximums : null,

            firstBaseStarters: firstBase? firstBase.starters : null,
            firstBaseMax: firstBase ? firstBase.maximums : null,

            secondBaseStarters: secondBase ? secondBase.starters : null,
            secondBaseMax: secondBase ? secondBase.maximums : null,

            thirdBaseStarters: thirdBase ? thirdBase.starters : null,
            thirdBaseMax: thirdBase ? thirdBase.maximums : null,

            shortstopStarters: shortstop ? shortstop.starters : null,
            shortstopMax: shortstop ? shortstop.maximums : null,

            infieldStarters: infield ? infield.starters : null,
            infieldMax: infield ? infield.maximums : null,

            ofStarters: outfield ? outfield.starters : null,
            ofMax: outfield ? outfield.maximums : null,

            utilStarters: util ? util.starters : null,
            utilMax: util ? util.maximums : null,

            spStarters: sp? sp.starters : null,
            spMax: sp? sp.maximums : null,

            pStarters: p ? p.starters : null,
            pMax : p ? p.maximums : null,

            rpStarters: rp ? rp.starters : null,
            rpMax: rp ? rp.maximums : null
        }


        return commandModel
    }

}

export { AdminController }