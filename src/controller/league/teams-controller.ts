import { ModelView, UiService } from "large-web"
import { TeamService } from "../../services/team-service"
import { Global } from "../../global"
import { Dom7, Template7 } from "framework7/js/framework7.bundle"


var $$ = Dom7

class TeamsController {

    virtualList: any

    constructor(
        private teamsService: TeamService,
        private uiService: UiService
    ) {

    }

    async showIndex(): Promise<ModelView> {

        return new ModelView(async () => {

            await this.teamsService.loadStoreForWallet(window['currentAccount'])

            let teams: Team[] = await this.teamsService.list(0, 1000)

            return {
                teams: teams
            }

        }, 'pages/league/teams/index.html')

    }

    async showTeamsEdit(teamId: string): Promise<ModelView> {
        return new ModelView(async () => {

            await this.teamsService.loadStoreForWallet(window['currentAccount'])

            let team: Team = await this.teamsService.get(teamId)

            return {
                team: team
            }

        }, 'pages/league/teams/edit.html')
    }


    async showCreate(): Promise<ModelView> {
        return new ModelView(async () => {

            await this.teamsService.loadStoreForWallet(window['currentAccount'])

        }, 'pages/league/teams/create.html')
    }



    async saveEditButtonClicked(e:Event) {

        // @ts-ignore
        if (!$$('#edit-teams-form')[0].checkValidity()) {
            console.log('Invalid form')
            return
        }

        let team = Global.app.form.convertToData('#edit-teams-form')

        //@ts-ignore
        await this.teamsService.put(team)

        //@ts-ignore
        if (team._id != team.previousId) {
            //@ts-ignore
            await this.teamsService.delete(team.previousId)
        }

        this.uiService.navigate("/league/teams", false, false)
    }

    async saveCreateButtonClicked(e:Event) {

        // @ts-ignore
        if (!$$('#create-teams-form')[0].checkValidity()) {
            console.log('Invalid form')
            return
        }

        let team = Global.app.form.convertToData('#create-teams-form')


        //@ts-ignore
        await this.teamsService.put(team)

        this.uiService.navigate("/league/teams", false, true)

    }


    async deleteButtonClicked(e:Event) {

        try {
    
          let self = this
    
          let teamId = $$(e.target).data('id')
          if (!teamId) return 
      
          Global.app.dialog.confirm(
            "Do you want to remove this team?",
            async function() {
      
              //@ts-ignore
              await self.teamsService.delete(teamId)
          
              //Redirect
              self.uiService.navigate(`/league/teams`, true, true)
    
            }
          
          )
    
        } catch(ex) {
          this.uiService.showExceptionPopup(ex)
        }
      }



}

export { TeamsController }