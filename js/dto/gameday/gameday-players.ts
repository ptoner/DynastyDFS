import  {DOMParser}  from 'xmldom'


class GamedayPlayers {
    
    public playerList: GamedayPlayer[]

    constructor(rawXml: any) {

        let parser = new DOMParser({
            /**
             * locator is always need for error position info
             */
            locator:{},
            /**
             * you can override the errorHandler for xml parser
             * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
             */
            errorHandler:{
                warning:function(w){
                },
                error:function(e) {
                    // console.log(e)
                },
                fatalError:function(e) {
                    // console.log(e)
                }
            }
        })

        let xmlDoc: Document = parser.parseFromString(rawXml, "text/xml")

        let teams = xmlDoc.getElementsByTagName("team")

        console.log(teams)

        //@ts-ignore 
        for(let team of teams) {
            let players = team.getElementsByTagName("player")

            for(let player of players) {
                let gamedayPlayer: GamedayPlayer = new GamedayPlayer(player)
                gamedayPlayer.gamedayTeamId = team.id 

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
    public gamedayTeamId: string 
    public battingOrder: number 
    public gamePosition: string 
    public avg: number 
    public hr: number 
    public rbi: number 

    constructor(xmlElement: any) {
        this.playerId = xmlElement.getAttribute('id') 
        this.firstName = xmlElement.getAttribute('first') 
        this.lastName = xmlElement.getAttribute('last') 

        this.playerNumber = xmlElement.getAttribute('num') 
        this.pitches = xmlElement.getAttribute('rl') 
        this.bats = xmlElement.getAttribute('bats')
        this.position = xmlElement.getAttribute('position')
        this.currentPosition = xmlElement.getAttribute('current_position') 
        this.teamId = xmlElement.getAttribute('team_id')
        this.hr = xmlElement.getAttribute('hr')
        this.battingOrder = xmlElement.getAttribute('bat_order') 
        this.gamePosition = xmlElement.getAttribute('game_position')
        this.avg = xmlElement.getAttribute('avg') 
        this.rbi = xmlElement.getAttribute('rbi') 
    }

}

export {
    GamedayPlayers,
    GamedayPlayer
}