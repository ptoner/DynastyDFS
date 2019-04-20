import { Player } from "../dto/player";
import { HitterDay } from "../dto/hitter-day";
import * as moment from 'moment';
import { FileService } from "./util/file-service";

class HitterDayService {

    path: string
    playersFolder: string = "players"
    datesFolder: string = "dates"


    constructor(
        private ipfs: any,
        private fileService: FileService,
        private rootFolder: string
    ) {
        this.path = this.rootFolder + "/HitterDay/"
    }


    async create(hitterDay: HitterDay): Promise<void> {
        return this._write(hitterDay)
    }

    async read(hitterId: number, date: string) : Promise<HitterDay> {
        return this._load(hitterId, date)
    }

    async update(hitterDay: HitterDay): Promise<void> {
        return this._write(hitterDay)
    }

    async delete(hitterDay: HitterDay) : Promise<void> {
        return this._delete(hitterDay)
    }


    async listByDate(date: Date) : Promise<HitterDay[]> {
        
        let folderName: string = this.path + this.datesFolder + `/${this.getFilenameDate(date)}`

        let results: HitterDay[] = await this.fileService.listFromDirectory(folderName)

        return results

    }

    async listByPlayer(playerId: number) : Promise<HitterDay[]> {

        let folderName: string = this.path + this.playersFolder + `/${playerId}`

        let results: HitterDay[] = await this.fileService.listFromDirectory(folderName)

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


    async _load(playerId: number, date: string) : Promise<HitterDay> {
        return this.fileService.loadFile(this._getFilename(playerId, date))
    }


    async _write(playerDay: HitterDay) : Promise<void> {

        const files = [
            this._getFilename(playerDay.player.id, playerDay.date),             //Main directory
            this._getPlayerIndexFilename(playerDay.player.id, playerDay.date),  //Player specific
            this._getDateIndexFilename(playerDay.player.id, playerDay.date)     //Date specific
        ]

        return this.fileService.writeToAll(playerDay, files)

    }

    async _delete(playerDay: HitterDay) : Promise<void> {

        const files = [
            this._getFilename(playerDay.player.id, playerDay.date),             //Main directory
            this._getPlayerIndexFilename(playerDay.player.id, playerDay.date),  //Player specific
            this._getDateIndexFilename(playerDay.player.id, playerDay.date)     //Date specific
        ]

        return this.fileService.deleteAll(files)

    }

}

export { HitterDayService }

