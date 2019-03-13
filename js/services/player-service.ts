import { Player } from "../dto/player";


class PlayerService {

    nextId: number 
    filename: string = "players.json"

    players: Player[]

    constructor(
        private ipfs: any
    ) {
        this._load()
    }

    create(player: Player): Player {
        player.id = this.nextId++
        this.players.push(player)
        this._write()
        return player
    }

    read(id: number) {
        return this.players[this._findPositionById(id)]      
    }

    update(player: Player): void {
        var elementPos = this._findPositionById(player.id)

        if (elementPos) {
            this.players[elementPos] = player
        }

        this._write()
    }

    delete(player: Player) {
        var elementPos = this._findPositionById(player.id)
        delete this.players[elementPos]

        this._write()
    }

    list() : Player[] {
        return this.players
    }

    _findPositionById(id:number) {
        return this.players.map(function(x) {return x.id; }).indexOf(id)
    }

    async _load() {
        this.players  = await this.ipfs.files.read("/fantasybaseball/" + this.filename)

        const highestId = this.players.reduce((prev, current) => (prev.id > current.id) ? prev : current)

        this.nextId = highestId.id + 1

    }

    async _write() {
        await this.ipfs.files.write('/fantasybaseball/' + this.filename, Buffer.from(JSON.stringify(this.players)), {create: true, parents: true, truncate: true})
    }


}

export { PlayerService}

