
import { Hand, Position, GamedayFullPlayer } from "./gameday/gameday-boxscore"

class Player {

    // From gameday
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
    //end gameday

    positions: Position[] = []
    seasons: number[] = []

}



export {
    Player
}