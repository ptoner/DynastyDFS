import {LeagueSettings, BattingScoring, PitchingScoring, PositionLimits} from "../dto/league-settings";
import { SchemaService } from "./util/schema-service";


class LeagueSettingsService {

    private db: any    

    constructor(
        private schemaService: SchemaService
    ) {}


    async loadStoreForWallet(walletAddress:string) {
        this.db = await this.schemaService.getLeagueSettingsStoreByWalletAddress(walletAddress)
        return this.db.load()
    }


    async getLeagueSettings(walletAddress:string): Promise<LeagueSettings> {
        return this.db.get(walletAddress)
    }

    async update(leagueSettings: LeagueSettings) : Promise<void> {
        return this.db.put(leagueSettings.owner, leagueSettings)
    }

    public translate(rawJson) : LeagueSettings {

        if (!rawJson) return

        let leagueSettings: LeagueSettings

        Object.assign(leagueSettings, rawJson)

        leagueSettings.battingScoring = this.translateBattingScoring(rawJson.battingScoring)
        leagueSettings.pitchingScoring = this.translatePitchingScoring(rawJson.pitchingScoring)
        leagueSettings.positionLimits = this.translatePositionLimits(rawJson.positionLimits)

        return leagueSettings

    }

    public translateBattingScoring(rawJson) : BattingScoring {
        let battingScoring: BattingScoring = {}
        Object.assign(battingScoring, rawJson)
        return battingScoring
    }

    public translatePitchingScoring(rawJson) : PitchingScoring {
        let pitchingScoring: PitchingScoring = {}
        Object.assign(pitchingScoring, rawJson)
        return pitchingScoring
    }

    public translatePositionLimits(rawJson) : PositionLimits[] {

        let positionLimits: PositionLimits[] = []

        for (let positionLimit of rawJson) {
            let created: PositionLimits = {}
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
