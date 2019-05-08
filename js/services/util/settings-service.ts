import { Global } from "../../global";
const LazyKvStore = require('orbit-db-lazykv')
const OrbitDB = require('orbit-db')

class SettingsService {

  getSettings() {
    return JSON.parse(localStorage.getItem("settings"))
  }

  async saveSettings(settings: any) : Promise<void> {
    localStorage.setItem("settings", JSON.stringify(settings))
  }

  async generateDatabase(orbitdb) {

    let mainDb = await orbitdb.open("mainDb", {create: true, type: "lazykv"})
    let leaguesettings = await orbitdb.open("leaguesettings", {create: true, type: "lazykv"})
    let scoreboard = await orbitdb.open("scoreboard", {create: true, type: "lazykv"})
    let boxscore = await orbitdb.open("boxscore", {create: true, type: "lazykv"})
    let player = await orbitdb.open("player", {create: true, type: "lazykv"})
    let playerboxscoremap = await orbitdb.open("playerboxscoremap", {create: true, type: "lazykv"})


    await mainDb.put("leaguesettings", { path: leaguesettings.address.toString()})
    await mainDb.put("scoreboard",  { path: scoreboard.address.toString()})
    await mainDb.put("boxscore",  { path: boxscore.address.toString()})
    await mainDb.put("player",  { path: player.address.toString()})
    await mainDb.put("playerboxscoremap",  { path: playerboxscoremap.address.toString()})


    await orbitdb._ipfs.files.mkdir(leaguesettings.address.toString(), { parents: true })
    await orbitdb._ipfs.files.mkdir(scoreboard.address.toString(), { parents: true })
    await orbitdb._ipfs.files.mkdir(boxscore.address.toString(), { parents: true })
    await orbitdb._ipfs.files.mkdir(player.address.toString(), { parents: true })
    await orbitdb._ipfs.files.mkdir(playerboxscoremap.address.toString(), { parents: true })


    //Update settings
    let settings = this.getSettings()
    settings.dbAddress = mainDb.address.toString()
    await this.saveSettings(settings)


  }


}

export {SettingsService}

// module.exports = SettingsService

