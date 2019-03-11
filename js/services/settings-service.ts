class SettingsService {

  getSettings() {
    return JSON.parse(localStorage.getItem("settings"))
  }

  async saveSettings(settings: any) : Promise<void> {
    localStorage.setItem("settings", JSON.stringify(settings))
  }

}

export {SettingsService}

// module.exports = SettingsService

