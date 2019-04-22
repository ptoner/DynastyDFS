import { Player } from "../dto/player";
import { FileService } from "./util/file-service";


class PlayerService {

    path: string

    constructor(
        private ipfs: any,
        private fileService: FileService,
        private rootFolder: string
    ) {
        this.path = this.rootFolder + "/Players/"
    }

    async create(player: Player): Promise<void> {
        return this._write(player)
    }

    async read(id: number) : Promise<Player> {
        return this._load(id)
    }

    async update(player: Player): Promise<void> {
        return this._write(player)
    }

    async delete(player: Player): Promise<void> {
        return this._delete(player)
    }

    async list(offset: number, limit: number) : Promise<Player[]> {
        
        let players: Player[] = await this.listAll()

        if (!players) return

        if (!offset) offset=0
        if (!limit) limit = players.length

        let list = players.slice(offset, offset + limit) 
        
        return list
    }

    async listAll() : Promise<Player[]> {
        let players: Player[] = await this.fileService.listFromDirectory(this.path)
        return players
    }


    async count() : Promise<number> {

        let players: Player[] = await this.listAll()

        if (!players) return 0
        return players.length
    }

    async clearAll() : Promise<void> {

        const fileExists: boolean = await this.fileService.fileExists(this.path)

        if (fileExists) {
            await this.ipfs.files.rm(this.path, {recursive: true})
        }
    }


    _getFilename(playerId: number) : string {
        let filename =  this.path + `${playerId}.json`
        return filename
    }


    async _load(playerId: number) : Promise<Player> {

        let loaded: Player = this._translate(
            await this.fileService.loadFile(this._getFilename(playerId))
        )

        return loaded
    }


    _translate(rawJson) : Player {

        if (!rawJson) return

        return new Player(rawJson)

    }

    async _write(player: Player) : Promise<void> {

        const files = [
            this._getFilename(player.id),             //Main directory
        ]

        return this.fileService.writeToAll(player, files)

    }

    async _delete(player: Player) : Promise<void> {

        const files = [
            this._getFilename(player.id),             //Main directory
        ]

        return this.fileService.deleteAll(files)

    }


}

export { PlayerService}
