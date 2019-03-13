

const SHARED_DIRECTORY_REPO = 52


class SharedDirectoryService {

    freedom: any

    constructor(
        private ipfs: any
    ) {}

    async getCid(): Promise<string> {

        let ipfsCid: string

        try {
            let sharedDirectory = await this.freedom.readByIndex(SHARED_DIRECTORY_REPO, 0)
            ipfsCid = sharedDirectory.ipfsCid
        } catch (ex) {
            console.log(ex)
        }

        return ipfsCid

    }

    async getLocalCid() : Promise<string> {

        let cid: string

        this.ipfs.files.stat('/fantasybaseball/', (err, stats) => {
            cid = stats.hash
        })

        return cid
    }


}

export {
    SharedDirectoryService
}