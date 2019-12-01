import { SchemaService } from "./util/schema-service"

class TeamService {

    private store: any

    constructor(
        private schemaService: SchemaService
    ) {}

    async loadStoreForWallet(walletAddress:string) {
        this.store = await this.schemaService.getTeamStoreByWalletAddress(walletAddress)
        await this.store.load()
    }

    async get(id: string) : Promise<Team> {

        let result = await this.store.get(id)

        if (result && result.length > 0) {
            return result[0]
        }
    }

    async put(team: Team): Promise<void> {
        return this.store.put(team)
    }

    async delete(_id:string): Promise<void> {
        return this.store.del(_id)
    }

    async list(offset: number, limit: number) : Promise<Team[]> {
        let teams:Team[] = this.store.query( (team) => true  )

        return teams.slice(offset).slice(0, limit)
    }

    async listAll() : Promise<Team[]> {
        return this.store.query( (team) => true  )
    }


    async load() {
        await this.store.load()
    }


}

export { TeamService }