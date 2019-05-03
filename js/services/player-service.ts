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

        return this.db.put(player)

    }

    async read(id: number) : Promise<Player> {
        
        let player: Player

        let results : Player[] = await this.db.get(id)

        if (results && results.length >0) {
            player = this.translateService.translatePlayer(results[0])
        }

        return player

    }

    async update(player: Player): Promise<void> {
        return this.db.put(player)
    }

    async delete(player: Player): Promise<void> {
        return this.db.del(player.id)
    }


    async list(offset: number, limit: number) : Promise<Player[]> {
        let players: Player[] = await this.db.query( player => true) 

        if (!players) return

        if (!offset) offset=0
        if (!limit) limit = players.length

        let list = players.slice(offset, offset + limit) 
        
        return list
    }

    async listAll() : Promise<Player[]> {
        return this.db.get('all')
    }

    async listBySeason(season: number) : Promise<Player[]> {
        return await this.db.query( player => player.seasons.includes(season) )
    }


    async count() : Promise<number> {
        return (await this.listAll()).length
    }

    async clearAll() : Promise<void> {
        let all = await this.db.query((player)=> player.id != null )

        for (let player of all) {
            await this.delete(player)
        }

    }




}

export { PlayerService}
