class SettingsService {

  getSettings() {
    return JSON.parse(localStorage.getItem("settings"))
  }

  saveSettings(settings: any) {
    localStorage.setItem("settings", JSON.stringify(settings))
  }

}

export {SettingsService}

// module.exports = SettingsService

