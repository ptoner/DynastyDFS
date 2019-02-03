const PLAYER_REPO = 52


class PlayerService {


    constructor() {}

    // async updatePlayerList(playerList) {
    //
    //     let currentPlayerList = await this.getPlayerList()
    //
    //     if (!currentPlayerList) {
    //         return await this.freedom.create(PLAYER_REPO, playerList)
    //     } else {
    //         return await this.freedom.update(PLAYER_REPO, playerList.id, playerList)
    //     }
    //
    // }
    //
    // async getPlayerList() {
    //     return this.freedom.readByIndex(PLAYER_REPO, 0)
    // }

}

export { PlayerService}

// module.exports = PlayerService