
import { Hand, Position, GamedayFullPlayer } from "./gameday/gameday-boxscore"

class Player {

    id: number
    fullName: string
    link:string
    firstName:string
    lastName:string
    primaryNumber: number
    birthDate:string
    currentAge: number
    birthCity:string
    birthStateProvince:string
    birthCountry:string
    height:string
    weight: number
    active: boolean
    primaryPosition :Position
    useName:string
    middleName:string
    boxscoreName:string
    nickName:string
    draftYear: number
    pronunciation:string
    lastPlayedDate:string
    mlbDebutDate:string
    batSide: Hand
    pitchHand: Hand
    nameFirstLast:string
    nameSlug:string
    firstLastName:string
    lastFirstName:string
    lastInitName:string
    initLastName:string
    fullFMLName:string
    fullLFMName:string
    strikeZoneTop: number
    strikeZoneBottom: number

    public positions: Position[] = []

    constructor(
        private gamedayFullPlayer:GamedayFullPlayer
    ) {

        if (!gamedayFullPlayer) return

        Object.assign(this, gamedayFullPlayer)

        this.primaryPosition = new Position(gamedayFullPlayer.primaryPosition)
        this.batSide = new Hand(gamedayFullPlayer.batSide)
        this.pitchHand = new Hand(gamedayFullPlayer.pitchHand)
    }
}



export {
    Player
}