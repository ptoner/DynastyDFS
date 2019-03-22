import { ModelView } from '../model-view'
import {SettingsService} from "../services/util/settings-service"
import {QueueService} from "../services/util/queue_service"
import {Global} from "../global"
import {Dom7} from "framework7"
import {PromiseView} from "../promise-view"


var $$ = Dom7;


class SettingsController {

    constructor(
        private settingsService: SettingsService,
        private queueService: QueueService
    ) {
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

        try {
            //Get the form data
            let settingsData = Global.app.form.convertToData('#settings-form')

            Global.navigate("/?reinit=true");

            await this.queueService.queuePromiseView(
                new PromiseView(
                    this.settingsService.saveSettings(settingsData),
                  "Saving settings",
                  "gear",
                  settingsData,
                  "/settings"
                )
              )

        } catch (ex) {
            Global.showExceptionPopup(ex)
        }

    }

}


export { SettingsController }

