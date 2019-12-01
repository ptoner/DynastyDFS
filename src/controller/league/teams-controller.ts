import { ModelView } from "large-web"
import { TeamService } from "../../services/team-service"

class TeamsController {

    constructor(
        private teamsService:TeamService
    ) {}

    async showIndex(): Promise<ModelView> {

        return new ModelView(async () => {

            await this.teamsService.loadStoreForWallet(window['currentAccount'])

            let teams:Team[] = await this.teamsService.list(0, 1000)

            return {
                teams: teams
            }

        }, 'pages/league/teams/index.html')

    }

    async showTeamsEdit(): Promise<ModelView> {
        return new ModelView(async () => {

            await this.teamsService.loadStoreForWallet(window['currentAccount'])

        }, 'pages/league/teams/edit.html')
    }

}

export {TeamsController}