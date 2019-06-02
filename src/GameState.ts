import { Player } from "./Player/Player";
import { ExtraMonsterZone } from "./Field/Zones";

export const enum Phase {
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
        public turnPlayer: number,
        public phase: Phase,

        // TODO this field should only exist during the Draw Phase
        public normalDrawUsed: boolean,

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

    getTurnPlayer(): Player {
        return this.players[this.turnPlayer]
    }
}
