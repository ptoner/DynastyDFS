import { Player } from "../dto/player";
import { Hand, Position } from "../dto/gameday/gameday-boxscore";
import { TranslateService } from "./util/translate-service";
import { SchemaService } from "./util/schema-service";


class PlayerService {

    private db: any

    constructor(
        private translateService: TranslateService,
        private schemaService: SchemaService
    ) {}

    async loadStoreForWallet(walletAddress:string) {
        this.db = await this.schemaService.getPlayerStoreByWalletAddress(walletAddress)
    }

    async get(id: string) : Promise<Player> {
        
        let player: Player

        let result = await this.db.get(id)

        if (result && result.length > 0) {
            player = this.translateService.translatePlayer(result[0])
        }

        return player

    }

    async put(player: Player): Promise<void> {
        return this.db.put(player)
    }

    async list(offset: number, limit: number) : Promise<Player[]> {

        let players:Player[] = this.db.query( (player) => true  )

        return players.slice(offset).slice(0, limit)
    }

    async listAll() : Promise<Player[]> {
        return this.db.query( (player) => true  )
    }

    async listByLastName(lastName: string, limit: number, offset: number) : Promise<Player[]> {

        let players:Player[] = this.db.query( (player) => player.lastName == lastName )

        return players.slice(offset).slice(0, limit)
    }

    async count() : Promise<number> {
        return this.db.count()
    }

    async load() {
        await this.db.load()
    }

}

export { PlayerService}
