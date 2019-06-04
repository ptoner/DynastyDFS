
let PlayerSchema = {
    indexes: [
        {column: "id", primary: true, unique: true},
        {column: "firstName", unique: false},
        {column: "lastName", unique: false},
        {column: "batSide", unique: false},
        {column: "pitchHand", unique: false},
    ]
}

let PlayerBoxscoreMapSchema = {
    indexes: [
        {column: "date", primary: true, unique: true}
    ]
}

let BoxscoreSchema = {
    indexes: [
        {column: "id", primary: true, unique: true}
    ]
}

let ScoreboardSchema = {
    indexes: [
        {column: "date", primary: true, unique: true}
    ]
}

let LeagueSettingsSchema = {
    indexes: [
        {column: "id", primary: true, unique: true}
    ]
}

let MainSchema = {
    indexes: [
        {column: "name", primary: true, unique: true}
    ]
}


export {
    PlayerSchema,
    PlayerBoxscoreMapSchema,
    BoxscoreSchema,
    ScoreboardSchema,
    LeagueSettingsSchema,
    MainSchema
}