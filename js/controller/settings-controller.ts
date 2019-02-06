import { ModelView } from '../model-view'
import {SettingsService} from "../services/settings-service";
import {Global} from "../global";
import {Dom7} from "framework7";

var $$ = Dom7;


class SettingsController {

    constructor(private settingsService: SettingsService) {
        const self = this;

        $$(document).on('click', '#settings-save', function(e: Event) {
            self.saveButtonClicked(e)
        });
    }

    async showSettingsForm() {

        const settings = this.settingsService.getSettings()

        return new ModelView(settings, 'pages/settings.html')

    }

    async saveButtonClicked(e: Event) {

        //Get the form data
        let settingsData = Global.app.form.convertToData('#settings-form');

        //Save it
        this.settingsService.saveSettings(settingsData)


        Global.navigate("/?reinit=true");

    }

}


export { SettingsController }

