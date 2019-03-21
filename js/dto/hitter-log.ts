import { Player } from "./player";

class HitterLog {
    
    public player: Player 
    public hits: number = 0
    public runsScored: number = 0
    public singles: number = 0
    public doubles: number = 0
    public triples: number = 0
    public homeRuns: number = 0
    public rbi: number = 0
    public bb : number = 0
    public ibb: number = 0
    public k: number = 0
    public hbp: number = 0
    public sb: number = 0
    public cs: number = 0

}

export {
    HitterLog 
}