import { GamedayAtbats } from "./gameday-atbats";
import { GamedayBoxScore } from "./gameday-boxscore";
import { GamedayPlayers } from "./gameday-players";

class GameSummary {
    constructor(
        public atBats: GamedayAtbats,
        public boxScore: GamedayBoxScore,
        public players: GamedayPlayers
    ) {}
}

export {
    GameSummary
}