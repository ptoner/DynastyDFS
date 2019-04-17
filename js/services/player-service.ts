import { Player } from "../dto/player";


class PlayerService {
    // filename: string = "players.json"

    // players: Player[] = []

    constructor(
        private orbitDocStore: any,
        private rootFolder: string 
    ) {    }

    async create(player: Player): Promise<Player> {
        await this.orbitDocStore.put(player)
        return player
    }

    async read(id: number) : Promise<Player> {

        let value = this.orbitDocStore.get(id)

        if (value) {
            return value[0]
        }
        
    }

    async update(player: Player): Promise<void> {
        await this.orbitDocStore.put(player)
    }

    async delete(player: Player): Promise<void> {
       await this.orbitDocStore.del(player.id)
    }

    async list(offset: number, limit: number) : Promise<Player[]> {
        
        let fullList =  this.orbitDocStore.get('') //returns all

        if (!fullList) return
        if (!offset) offset=0
        if (!limit) limit = fullList.length

        let list = fullList.slice(offset, offset + limit) 
        
        return list
    }

    count() : number {
        let fullList =  this.orbitDocStore.get('') //returns all
        return fullList.length
    }

    async clearAll() : Promise<void> {
    }


    async load() {
        this.orbitDocStore.load()
    }


}

export { PlayerService}

