import {LeagueSettings, BattingScoring, PitchingScoring, PositionLimits} from "../dto/league-settings";
import { Buffer } from "buffer"
import { SchemaService } from "./util/schema-service";


class LeagueSettingsService {

    private db: any    

    constructor(
        private schemaService: SchemaService
    ) {}


    async loadStoreForWallet(walletAddress:string) {
        this.db = await this.schemaService.getLeagueSettingsStoreByWalletAddress(walletAddress)
    }


    async getLeagueSettings(): Promise<LeagueSettings> {
        return await this.db.get(1)
    }

    async update(leagueSettings: LeagueSettings) : Promise<void> {

        //Make sure the ID is 1
        leagueSettings.id = 1

        return this.db.put(leagueSettings.id, leagueSettings)
    }

    public translate(rawJson) : LeagueSettings {

        if (!rawJson) return

        let leagueSettings: LeagueSettings = new LeagueSettings()

        Object.assign(leagueSettings, rawJson)

        leagueSettings.battingScoring = this.translateBattingScoring(rawJson.battingScoring)
        leagueSettings.pitchingScoring = this.translatePitchingScoring(rawJson.pitchingScoring)
        leagueSettings.positionLimits = this.translatePositionLimits(rawJson.positionLimits)

        return leagueSettings

    }

    public translateBattingScoring(rawJson) : BattingScoring {
        let battingScoring: BattingScoring = new BattingScoring()
        Object.assign(battingScoring, rawJson)
        return battingScoring
    }

    public translatePitchingScoring(rawJson) : PitchingScoring {
        let pitchingScoring: PitchingScoring = new PitchingScoring()
        Object.assign(pitchingScoring, rawJson)
        return pitchingScoring
    }

    public translatePositionLimits(rawJson) : PositionLimits[] {

        let positionLimits: PositionLimits[] = []

        for (let positionLimit of rawJson) {
            let created: PositionLimits = new PositionLimits()
            Object.assign(created, positionLimit)
            positionLimits.push(created)
        }

        return positionLimits

    }


    async load() {
        await this.db.load()
    }

}

export { LeagueSettingsService }
//
// module.exports = LeagueSettingsService