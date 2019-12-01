import { PitchingScoring, LeagueSettings, BattingScoring, PositionLimits } from "../../dto/league-settings"
import { LeagueSettingsService } from "../../services/league-settings-service"
import { UiService } from "../../services/util/ui-sevice"
import { ModelView } from "large-web"
import { Global } from "../../global"
import { Dom7, Template7 } from "framework7"
var $$ = Dom7;


class SettingsController {


    constructor(
        private leagueSettingsService: LeagueSettingsService,
        private uiService: UiService
    ) { }

    async showSettings(): Promise<ModelView> {
        return new ModelView(async () => {

            let leagueSettingCommandModel = await this.getLeagueSettings()
            return leagueSettingCommandModel


        }, 'pages/league/settings/show.html')
    }

    async showSettingsForm(): Promise<ModelView> {

        return new ModelView(async () => {

            let leagueSettingCommandModel = await this.getLeagueSettings()
            return leagueSettingCommandModel

        }, 'pages/league/settings/form.html')

    }


    private async getLeagueSettings() {

        await this.leagueSettingsService.loadStoreForWallet(window['currentAccount'])

        let leagueSettings = await this.leagueSettingsService.getLeagueSettings(window['currentAccount'])

        let leagueSettingsCommandModel

        if (leagueSettings) {
            leagueSettingsCommandModel = this._translateToCommandModel(leagueSettings)
        }

        return leagueSettingsCommandModel
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
            var leagueSettingCommandModel: any = Global.app.form.convertToData('#league-settings-form');

            let leagueSettings:LeagueSettings = this._translateFromCommandModel(leagueSettingCommandModel)

            //TODO: This might have to change if we're ever editing a league started by someone else
            if (!leagueSettings.owner) {
                leagueSettings.owner = window['currentAccount']
            }

            await this.leagueSettingsService.loadStoreForWallet(window['currentAccount'])
            await this.leagueSettingsService.update(leagueSettings)

            //Redirect to home
            this.uiService.navigate("/")


        } catch (ex) {
            this.uiService.showExceptionPopup(ex)
        }
    }


    _translateToCommandModel(leagueSettings: LeagueSettings): any {

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
            catchers = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "C" })[0]
            firstBase = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "1B" })[0]
            secondBase = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "2B" })[0]
            thirdBase = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "3B" })[0]
            shortstop = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "SS" })[0]
            infield = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "IF" })[0]
            outfield = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "OF" })[0]
            util = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "UTIL" })[0]
            sp = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "SP" })[0]
            rp = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "RP" })[0]
            p = leagueSettings.positionLimits.filter(function (positionLimit) { return positionLimit.position == "P" })[0]
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
            poPitching: leagueSettings.pitchingScoring.pickOffs,
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

            firstBaseStarters: firstBase ? firstBase.starters : null,
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

            spStarters: sp ? sp.starters : null,
            spMax: sp ? sp.maximums : null,

            pStarters: p ? p.starters : null,
            pMax: p ? p.maximums : null,

            rpStarters: rp ? rp.starters : null,
            rpMax: rp ? rp.maximums : null
        }


        return commandModel
    }


    _translateFromCommandModel(commandModel: any) : LeagueSettings {

        let positionLimits: PositionLimits[] = [
            { position: "C", maximums:   commandModel.catcherMax, starters: commandModel.catcherStarters },
            { position: "1B", maximums:   commandModel.firstBaseStarters, starters: commandModel.firstBaseMax },
            { position: "2B", maximums:   commandModel.secondBaseStarters, starters: commandModel.secondBaseMax },
            { position: "3B", maximums:   commandModel.thirdBaseStarters, starters: commandModel.thirdBaseMax },
            { position: "SS", maximums:   commandModel.shortstopStarters, starters: commandModel.shortstopMax },
            { position: "IF", maximums:   commandModel.infieldStarters, starters: commandModel.infieldMax },
            { position: "OF", maximums:   commandModel.ofStarters, starters: commandModel.ofMax },
            { position: "UTIL", maximums:   commandModel.utilStarters, starters: commandModel.utilMax },
            { position: "P", maximums:   commandModel.pStarters, starters: commandModel.pMax },
            { position: "SP", maximums:   commandModel.spStarters, starters: commandModel.spMax },
            { position: "RP", maximums:   commandModel.rpStarters, starters: commandModel.rpMax }

        ]

        let battingScoring:BattingScoring = {
            hits: commandModel.hitsBatting,
            runsScored: commandModel.runsScoredBatting,
            singles: commandModel.singlesBatting,
            doubles: commandModel.doublesBatting,
            triples: commandModel.triplesBatting,
            homeRuns: commandModel.homeRunsBatting,
            rbi: commandModel.rbiBatting,
            bb: commandModel.bbBatting,
            ibb: commandModel.iBBBatting,
            k: commandModel.kBatting,
            hbp: commandModel.hbpBatting,
            sb: commandModel.sbBatting,
            cs: commandModel.csBatting
        }

        let pitchingScoring:PitchingScoring = {
            ip: commandModel.outPitching,
            h: commandModel.hitPitching,
            er: commandModel.earnedRunPitching,
            hr: commandModel.homeRunPitching,
            bb: commandModel.bbPitching,
            hbp: commandModel.hbpPitching,
            k: commandModel.kPitching,
            wp: commandModel.wildPitchPitching,
            balks: commandModel.balkPitching,
            pickOffs: commandModel.poPitching,
            completeGame: commandModel.cgPitching,
            shutOut: commandModel.shutoutPitching,
            blownSave: commandModel.bsPitching,
            holds: commandModel.holdsPitching
        }


        let leagueSettings:LeagueSettings = {
            leagueName: commandModel.leagueName,
            rosterSize: commandModel.rosterSize,
            totalStarters: commandModel.totalStarters,
            totalBench: commandModel.totalBench,
            totalDl: commandModel.totalDl,
            positionLimits: positionLimits,
            battingScoring: battingScoring,
            pitchingScoring: pitchingScoring
        }

        return leagueSettings

    }

}

export { SettingsController }