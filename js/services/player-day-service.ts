import { Player } from "../dto/player";
import { PlayerDay } from "../dto/player-day";
import * as moment from 'moment';
import { FileService } from "./file-service";

class PlayerDayService {

    path: string = "/fantasybaseball/playerDay/"
    playersFolder: string = "players"
    datesFolder: string = "dates"


    constructor(
        private ipfs: any,
        private fileService: FileService
    ) {}

    async create(playerDay: PlayerDay): Promise<void> {
        return this._write(playerDay)
    }

    async read(playerId: number, date: string) : Promise<PlayerDay> {
        return this._load(playerId, date)
    }

    async update(playerDay: PlayerDay): Promise<void> {
        return this._write(playerDay)
    }

    async delete(playerDay: PlayerDay) : Promise<void> {
        return this._delete(playerDay)
    }


    async listByDate(date: Date) : Promise<PlayerDay[]> {
        
        let folderName: string = this.path + this.datesFolder + `/${this.getFilenameDate(date)}`

        let results: PlayerDay[] = await this.fileService.listFromDirectory(folderName)

        return results

    }

    async listByPlayer(playerId: number) : Promise<PlayerDay[]> {

        let folderName: string = this.path + this.playersFolder + `/${playerId}`

        let results: PlayerDay[] = await this.fileService.listFromDirectory(folderName)

        return results

    }



    async clearAll() : Promise<void> {

        const fileExists: boolean = await this.fileService.fileExists(this.path)

        if (fileExists) {
            await this.ipfs.files.rm(this.path, {recursive: true})
        }
    }





    _getFilename(playerId: number, date: string) : string {
        let filename =  this.path + `${playerId}-${date}.json`
        return filename
    }

    _getPlayerIndexFilename(playerId: number, date: string) : string {
        return this.path + `${this.playersFolder}/${playerId}/${date}.json`
    }

    _getDateIndexFilename(playerId: number, date: string) : string {
        return this.path + `${this.datesFolder}/${date}/${playerId}.json`
    }


    getFilenameDate(date: Date) {
        return moment(date).format("YYYY-MM-DD")
    }


    async _load(playerId: number, date: string) : Promise<PlayerDay> {
        return this.fileService.loadFile(this._getFilename(playerId, date))
    }


    async _write(playerDay: PlayerDay) : Promise<void> {

        const files = [
            this._getFilename(playerDay.player.id, playerDay.date),             //Main directory
            this._getPlayerIndexFilename(playerDay.player.id, playerDay.date),  //Player specific
            this._getDateIndexFilename(playerDay.player.id, playerDay.date)     //Date specific
        ]

        await this.fileService.writeToAll(playerDay, files)

    }

    async _delete(playerDay: PlayerDay) : Promise<void> {

        const files = [
            this._getFilename(playerDay.player.id, playerDay.date),             //Main directory
            this._getPlayerIndexFilename(playerDay.player.id, playerDay.date),  //Player specific
            this._getDateIndexFilename(playerDay.player.id, playerDay.date)     //Date specific
        ]

        await this.fileService.deleteAll(files)

    }

}

export { PlayerDayService }

