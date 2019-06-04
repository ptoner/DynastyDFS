import { Player } from "../dto/player";
import { FileService } from "./util/file-service";
import { Hand, Position } from "../dto/gameday/gameday-boxscore";
import { TranslateService } from "./util/translate-service";


class PlayerService {

    constructor(
        private db: any,
        private translateService: TranslateService
    ) {}

    async commit() {
        return this.db.commit() 
    }

    async create(player: Player): Promise<void> {

        let existing: Player = await this.read(player.id)

        if (existing) {
            throw new Error("Player already exists")
        }

        return this.db.put(player.id, player)

    }

    async read(id: number) : Promise<Player> {
        
        let player: Player

        let result = await this.db.get(id)

        if (result) {
            player = this.translateService.translatePlayer(result)
        }

        return player

    }

    async update(player: Player): Promise<void> {
        return this.db.put(player.id, player)
    }

    async list(offset: number, limit: number) : Promise<Player[]> {
        return this.db.list(offset, limit)
    }

    async listAll() : Promise<Player[]> {
        return this.db.index
    }

    async listByLastName(lastName: string, limit: number, offset: number) : Promise<Player[]> {
        return this.db.getByIndex("lastName", lastName, limit, offset)
    }

    async count() : Promise<number> {
        return this.db.count()
    }



}

export { PlayerService}
