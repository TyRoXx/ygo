import { Player } from "./Player/Player";
import { ExtraMonsterZone } from "./Field/Zones";

export enum Phase {
    Draw = 'Draw',
    Standby = 'Standby Phase',
    Main1 = 'First Main phase',
    // Battle Phase begin
    StartStep = 'Starting phase',
    BattleStep = 'Battle phase',
    DamageStep = 'Damage phase',
    EndStep = 'End Phase',
    // Battle Phase end
    Main2 = 'Second main phase',
    End = 'End Phase'
}

export class GameState {
    constructor(
        public players: Array<Player>,
        public turnPlayer: Number,
        public phase: Phase,
        public extraMonsterZones: Array<ExtraMonsterZone>) {
        if (players.length !== 2) {
            throw new Error("Unsupported number of players")
        }
        if (turnPlayer < 0 || turnPlayer >= players.length) {
            throw new Error("Invalid turn player index")
        }
        if (extraMonsterZones.length !== 2) {
            throw new Error("Unsupported number of extra monster zones")
        }
    }
}
