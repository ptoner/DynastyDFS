import { Global } from "../../global";
const TableStore = require('orbit-db-tablestore')
const OrbitDB = require('orbit-db')
import { PlayerSchema, PlayerBoxscoreMapSchema, BoxscoreSchema, ScoreboardSchema, LeagueSettingsSchema, MainSchema } from '../../schemas'

class SettingsService {

  getSettings() {
    return JSON.parse(localStorage.getItem("settings"))
  }

  async saveSettings(settings: any) : Promise<void> {
    localStorage.setItem("settings", JSON.stringify(settings))
  }

  async generateDatabase(orbitdb) {

    console.log('Generating database')

    //@ts-ignore
    MainSchema.create = true
    //@ts-ignore
    PlayerSchema.create = true
    //@ts-ignore
    PlayerBoxscoreMapSchema.create = true
    //@ts-ignore
    BoxscoreSchema.create = true
    //@ts-ignore
    ScoreboardSchema.create = true
    //@ts-ignore
    LeagueSettingsSchema.create = true


    let mainDb = await orbitdb.open("mainDb", {create: true, type: 'table'})
    await mainDb.createIndexes(MainSchema.indexes)
    console.log('Created main schema')

    let leaguesettings = await orbitdb.open("leaguesettings", {create: true, type: 'table'})
    await leaguesettings.createIndexes(LeagueSettingsSchema.indexes)
    console.log('Created league settings')

    let scoreboard = await orbitdb.open("scoreboard", {create: true, type: 'table'})
    await scoreboard.createIndexes(ScoreboardSchema.indexes)
    console.log('Created scoreboard schema')

    let boxscore = await orbitdb.open("boxscore", {create: true, type: 'table'})
    await boxscore.createIndexes(BoxscoreSchema.indexes)
    console.log('Created boxscore schema')

    let player = await orbitdb.open("player", {create: true, type: 'table'})
    await player.createIndexes(PlayerSchema.indexes)
    console.log('Created player schema')

    let playerboxscoremap = await orbitdb.open("playerboxscoremap", {create: true, type: 'table'})
    await playerboxscoremap.createIndexes(PlayerBoxscoreMapSchema.indexes)
    console.log('Created playerboxscoremap schema')


    await mainDb.put("leaguesettings", { name: "leaguesettings", path: leaguesettings.address.toString()})
    await mainDb.put("scoreboard",  { name: "scoreboard", path: scoreboard.address.toString()})
    await mainDb.put("boxscore",  { name: "boxscore", path: boxscore.address.toString()})
    await mainDb.put("player",  { name: "player", path: player.address.toString()})
    await mainDb.put("playerboxscoremap",  { name: "playerboxscoremap", path: playerboxscoremap.address.toString()})

    await mainDb.commit()


    //Update settings
    let settings = this.getSettings()
    settings.dbAddress = mainDb.address.toString()
    await this.saveSettings(settings)


  }


}

export {SettingsService}

// module.exports = SettingsService

