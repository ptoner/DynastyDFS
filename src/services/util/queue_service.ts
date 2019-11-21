import { Global } from "../../global";
import { Template7 } from "framework7/js/framework7.bundle";
import { UiService } from "./ui-sevice";
import { PromiseView } from "large-web";



class QueueService {

    constructor(
      private uiService:UiService
    ) {}

    async queuePromiseView(promiseView: PromiseView) : Promise<any> {

      const self = this

      let queueItem: QueueItem = new QueueItem(
        Guid.newGuid(),
        promiseView.icon,
        promiseView.title,
        promiseView.view,
        promiseView.context
      )

      let before = async function () {
        return new Promise((resolve, reject) => {
          self.beforeSaveAction(queueItem)
          resolve();
        })
      }

      let during = async function() {
        return promiseView.promise
      }

      let after = async function (result) {
        
        if (result) {
          queueItem.context = result
        }

        return new Promise((resolve, reject) => {
          self.afterSaveAction(queueItem)
          resolve();
        })
      }

      return before()
              .then(during)
              .then(after)

    }


    
    beforeSaveAction(queueItem: QueueItem) : void {     

      queueItem.title = this._parseTitle(queueItem.titleTemplate, queueItem.context)

      // Create toast with close button
      queueItem.toast = Global.app.toast.create({
        text: queueItem.title,
        closeButton: true
      })

      queueItem.toast.open()

    }

    afterSaveAction(queueItem: QueueItem): void {

      queueItem.toast.close()

      queueItem.link = this._parseLink(queueItem.linkTemplate, queueItem.context)

      Global.app.toast.create({
        text: "Save Complete",
        closeButton: true,
        closeButtonText: "View",
        closeTimeout: 5000,
        on: {
          //@ts-ignore
          toastCloseButtonClick: function() {
            this.uiService.navigate(queueItem.link)
          }
        }
      }).open()


    }


    _parseTitle(titleTemplate: string, context: any) : string {
        const compiledTemplate = Template7.compile(titleTemplate)
        return compiledTemplate(context)
    }

    _parseLink(linkTemplate: string, context: any): string {
      const compiledTemplate = Template7.compile(linkTemplate)
      return compiledTemplate(context)
    }
    

}

class QueueItem {

  // public web3TransactionId: string

  public title: string
  public link: string
  public toast: any

  constructor(
    public id: string,
    public icon: string,
    public titleTemplate: string,
    public linkTemplate: string,
    public context: any
  ) {}

}

//from https://stackoverflow.com/questions/26501688/a-typescript-guid-class
class Guid {
  static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
  }
}

export { QueueService, QueueItem }
