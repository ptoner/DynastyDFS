import  {DOMParser}  from 'xmldom'


class GamedayPlayers {
    
    public playerList: GamedayPlayer[] = []

    constructor(rawJson: any) {

        //@ts-ignore 
        for(let team of rawJson.team) {
            for(let player of team.player) {
                let gamedayPlayer: GamedayPlayer = new GamedayPlayer(player)
                this.playerList.push(gamedayPlayer)
            }
        }
    }
}

class GamedayPlayer {

    public playerId: number 
    public firstName: string
    public lastName: string 
    public playerNumber: number 
    public pitches: string 
    public bats: string 
    public position: string 
    public currentPosition: string 
    public teamId: string 
    public battingOrder: number 
    public gamePosition: string 
    public avg: number 
    public hr: number 
    public rbi: number 

    constructor(rawJson: any) {
        this.playerId = rawJson._attributes.id 
        this.firstName = rawJson._attributes.first 
        this.lastName = rawJson._attributes.last 

        this.playerNumber = rawJson._attributes.num 
        this.pitches = rawJson._attributes.rl 
        this.bats = rawJson._attributes.bats
        this.position = rawJson._attributes.position
        this.currentPosition = rawJson._attributes.current_position 
        this.teamId = rawJson._attributes.team_id
        this.hr = rawJson._attributes.hr
        this.battingOrder = rawJson._attributes.bat_order
        this.gamePosition = rawJson._attributes.game_position
        this.avg = rawJson._attributes.avg 
        this.rbi = rawJson._attributes.rbi 
    }

}

export {
    GamedayPlayers,
    GamedayPlayer
}