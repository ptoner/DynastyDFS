import { Player } from "../dto/player";
import { FileService } from "./util/file-service";
import { Hand, Position } from "../dto/gameday/gameday-boxscore";
import { TranslateService } from "./util/translate-service";


class PlayerService {

    constructor(
        private db: any,
        private translateService: TranslateService
    ) {}

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
        let players = await this.db.index
        // let players: Player[] = await this.db.index

        if (!players) return []

        if (!offset) offset=0
        if (!limit) limit = players.length

        let list = players.slice(offset, offset + limit) 
        
        return list
    }

    async listAll() : Promise<Player[]> {
        return this.db.index
    }

    async listBySeason(season: number) : Promise<Player[]> {
        // return await this.db.query( player => player.seasons.includes(season) )
        return []
    }


    async count() : Promise<number> {
        return (await this.listAll()).length
    }



}

export { PlayerService}
