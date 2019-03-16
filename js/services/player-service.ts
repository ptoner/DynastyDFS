import { Player } from "../dto/player";


class PlayerService {

    nextId: number 
    path: string = "/fantasybaseball/"
    filename: string = "players.json"

    players: Player[]

    constructor(
        private ipfs: any
    ) {    }

    async create(player: Player): Promise<Player> {
        player.id = this.nextId
        this.nextId++

        this.players.push(player)
        this._write()
        return player
    }

    read(id: number) : Player {
        return this.players[this._findPositionById(id)]      
    }

    async update(player: Player): Promise<void> {
        var elementPos = this._findPositionById(player.id)

        if (elementPos) {
            this.players[elementPos] = player
        }

        return this._write()
    }

    async delete(player: Player): Promise<void> {
        var elementPos = this._findPositionById(player.id)

        this.players.splice(elementPos, 1)

        return this._write()
    }

    list() : Player[] {
        return this.players
    }

    async clearAll() : Promise<void> {
        this.players = []
        this._write()
        this.nextId = 1
    }

    _findPositionById(id:number) {
        return this.players.map(function(x) {return x.id; }).indexOf(id)
    }

    async _load() {

        try {
            let fileContents: Buffer  = await this.ipfs.files.read(this.path + this.filename)

            this.players = JSON.parse(fileContents.toString())

            const highestId = this.players.reduce((prev, current) => (prev.id > current.id) ? prev : current)
    
            this.nextId = highestId.id + 1
        } catch(ex) {
            //File not found
            this.players = []
            this.nextId = 1
        }

    }

    async _write() {
        await this.ipfs.files.write('/fantasybaseball/' + this.filename, Buffer.from(JSON.stringify(this.players)), {create: true, parents: true, truncate: true})
    }


}

export { PlayerService}

