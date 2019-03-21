import { Player } from "../dto/player";


class PlayerService {
    filename: string = "players.json"

    players: Player[] = []

    constructor(
        private ipfs: any,
        private rootFolder: string 
    ) {    }

    async create(player: Player): Promise<Player> {
        this.players.push(player)
        return player
    }

    async read(id: number) : Promise<Player> {

        let player: Player

        if (!this.players || this.players.length == 0) return

        const pos = this._findPositionById(id)

        if (pos != null) {
            player = this.players[pos] 
        }

        return player
        
    }

    async update(player: Player): Promise<void> {

        var elementPos = this._findPositionById(player.id)

        if (elementPos) {
            this.players[elementPos] = player
        }

    }

    async delete(player: Player): Promise<void> {
        var elementPos = this._findPositionById(player.id)

        this.players.splice(elementPos, 1)

    }

    async list(offset: number, limit: number) : Promise<Player[]> {
        
        if (!this.players) return
        if (!offset) offset=0
        if (!limit) limit = this.players.length

        let list = this.players.slice(offset, offset + limit) 
        
        return list
    }

    count() : number {
        if (!this.players) return 0
        return this.players.length
    }


    async clearAll() : Promise<void> {
        this.players = []
    }

    _findPositionById(id:number) : number {
        if (!this.players || this.players.length == 0) return
        return this.players.map(function(x) {return x.id; }).indexOf(id)
    }

    async load() {

        try {
            let fileContents: Buffer  = await this.ipfs.files.read(this.rootFolder + '/' +  this.filename)

            this.players = JSON.parse(fileContents.toString())

        } catch(ex) {
            //File not found
            this.players = []
        }

    }

    async write() {
        await this.ipfs.files.write(this.rootFolder + '/' +  this.filename, Buffer.from(JSON.stringify(this.players)), {create: true, parents: true, truncate: true})
    }


}

export { PlayerService}

