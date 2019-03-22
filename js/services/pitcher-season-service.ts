import { Player } from "../dto/player";
import { PitcherSeason } from "../dto/pitcher-season";
import * as moment from 'moment';
import { FileService } from "./util/file-service";

class PitcherSeasonService {

    path: string
    playersFolder: string = "players"
    yearFolder: string = "year"


    constructor(
        private ipfs: any,
        private fileService: FileService,
        private rootFolder: string
    ) {
        this.path = rootFolder + "/PitcherSeason/"

    }


    async create(pitcherSeason: PitcherSeason): Promise<void> {
        return this._write(pitcherSeason)
    }

    async read(playerId: number, year: number) : Promise<PitcherSeason> {
        return this._load(playerId, year)
    }

    async update(pitcherSeason: PitcherSeason): Promise<void> {
        return this._write(pitcherSeason)
    }

    async delete(pitcherSeason: PitcherSeason) : Promise<void> {
        return this._delete(pitcherSeason)
    }


    async listByYear(year: number) : Promise<PitcherSeason[]> {
        
        let folderName: string = this.path + this.yearFolder + `/${year}`

        let results: PitcherSeason[] = await this.fileService.listFromDirectory(folderName)

        return results

    }

    async listByPlayer(playerId: number) : Promise<PitcherSeason[]> {

        let folderName: string = this.path + this.playersFolder + `/${playerId}`

        let results: PitcherSeason[] = await this.fileService.listFromDirectory(folderName)

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


    async _load(playerId: number, year: number) : Promise<PitcherSeason> {
        return this.fileService.loadFile(this._getFilename(playerId, year))
    }


    async _write(pitcherSeason: PitcherSeason) : Promise<void> {

        const files = [
            this._getFilename(pitcherSeason.player.id, pitcherSeason.year),             //Main directory
            this._getPlayerIndexFilename(pitcherSeason.player.id,  pitcherSeason.year),  //Player specific
            this._getYearIndexFilename(pitcherSeason.player.id,  pitcherSeason.year)     //Year specific
        ]

        return this.fileService.writeToAll(pitcherSeason, files)

    }

    async _delete(pitcherSeason: PitcherSeason) : Promise<void> {

        const files = [
            this._getFilename(pitcherSeason.player.id, pitcherSeason.year),             //Main directory
            this._getPlayerIndexFilename(pitcherSeason.player.id,  pitcherSeason.year),  //Player specific
            this._getYearIndexFilename(pitcherSeason.player.id,  pitcherSeason.year)     //Year specific
        ]

        return this.fileService.deleteAll(files)

    }

}

export { PitcherSeasonService }

