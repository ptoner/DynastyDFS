import { Player } from "../dto/player";
import { HitterSeason } from "../dto/hitter-season";
import * as moment from 'moment';
import { FileService } from "./util/file-service";

class HitterSeasonService {

    path: string
    playersFolder: string = "players"
    yearFolder: string = "year"


    constructor(
        private ipfs: any,
        private fileService: FileService,
        private rootFolder: string
    ) {
        this.path = rootFolder + "/HitterSeason/"

    }


    async create(hitterSeason: HitterSeason): Promise<void> {
        return this._write(hitterSeason)
    }

    async read(playerId: number, year: number) : Promise<HitterSeason> {
        return this._load(playerId, year)
    }

    async update(hitterSeason: HitterSeason): Promise<void> {
        return this._write(hitterSeason)
    }

    async delete(hitterSeason: HitterSeason) : Promise<void> {
        return this._delete(hitterSeason)
    }


    async listByYear(year: number) : Promise<HitterSeason[]> {
        
        let folderName: string = this.path + this.yearFolder + `/${year}`

        let results: HitterSeason[] = await this.fileService.listFromDirectory(folderName)

        return results

    }

    async listByPlayer(playerId: number) : Promise<HitterSeason[]> {

        let folderName: string = this.path + this.playersFolder + `/${playerId}`

        let results: HitterSeason[] = await this.fileService.listFromDirectory(folderName)

        return results

    }



    async clearAll() : Promise<void> {

        const fileExists: boolean = await this.fileService.fileExists(this.path)

        if (fileExists) {
            await this.ipfs.files.rm(this.path, {recursive: true})
        }
    }





    _getFilename(playerId: number, year: number) : string {
        let filename =  this.path + `${playerId}-${year}.json`
        return filename
    }

    _getPlayerIndexFilename(playerId: number, year: number) : string {
        return this.path + `${this.playersFolder}/${playerId}/${year}.json`
    }

    _getYearIndexFilename(playerId: number, year: number) : string {
        return this.path + `${this.yearFolder}/${year}/${playerId}.json`
    }


    getFilenameDate(date: Date) {
        return moment(date).format("YYYY-MM-DD")
    }


    async _load(playerId: number, year: number) : Promise<HitterSeason> {
        return this.fileService.loadFile(this._getFilename(playerId, year))
    }


    async _write(hitterSeason: HitterSeason) : Promise<void> {

        const files = [
            this._getFilename(hitterSeason.player.id, hitterSeason.year),             //Main directory
            this._getPlayerIndexFilename(hitterSeason.player.id,  hitterSeason.year),  //Player specific
            this._getYearIndexFilename(hitterSeason.player.id,  hitterSeason.year)     //Year specific
        ]

        return this.fileService.writeToAll(hitterSeason, files)

    }

    async _delete(hitterSeason: HitterSeason) : Promise<void> {

        const files = [
            this._getFilename(hitterSeason.player.id, hitterSeason.year),             //Main directory
            this._getPlayerIndexFilename(hitterSeason.player.id,  hitterSeason.year),  //Player specific
            this._getYearIndexFilename(hitterSeason.player.id,  hitterSeason.year)     //Year specific
        ]

        return this.fileService.deleteAll(files)

    }

}

export { HitterSeasonService }

