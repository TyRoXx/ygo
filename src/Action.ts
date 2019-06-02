import { GameState, Phase } from "./GameState";

export interface Action {
    Take(originalState: GameState): GameState
}

function getOpponent(player: number): number {
    switch (player) {
        case 0: return 1;
        case 1: return 0;
    }
    throw new Error("Invalid player index")
}

function advancePhaseWithinTurn(originalState: GameState, nextPhase: Phase): GameState {
    return new GameState(
        originalState.players,
        originalState.turnPlayer,
        nextPhase,
        originalState.normalDrawUsed,
        originalState.extraMonsterZones)
}

function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here" + x);
}

export class LeavePhaseAction implements Action {
    Take(originalState: GameState): GameState {
        switch (originalState.phase) {
            case Phase.Draw: return advancePhaseWithinTurn(originalState, Phase.Standby);
            case Phase.Standby: return advancePhaseWithinTurn(originalState, Phase.Main1);
            case Phase.Main1: return advancePhaseWithinTurn(originalState, Phase.StartStep);
            case Phase.StartStep: return advancePhaseWithinTurn(originalState, Phase.BattleStep);
            case Phase.BattleStep: return advancePhaseWithinTurn(originalState, Phase.DamageStep);
            case Phase.DamageStep: return advancePhaseWithinTurn(originalState, Phase.EndStep);
            case Phase.EndStep: return advancePhaseWithinTurn(originalState, Phase.Main2);
            case Phase.Main2: return advancePhaseWithinTurn(originalState, Phase.End);
            case Phase.End:
                return new GameState(
                    originalState.players,
                    getOpponent(originalState.turnPlayer),
                    Phase.Draw,
                    originalState.normalDrawUsed,
                    originalState.extraMonsterZones
                )
        }
        return assertUnreachable(originalState.phase)
    }
}

export class NormalDrawAction implements Action {
    Take(originalState: GameState): GameState {
        if (originalState.phase != Phase.Draw) {
            throw new Error("Normal draw is only possible in the Draw Phase")
        }
        if (originalState.normalDrawUsed) {
            throw new Error("Normal draw is only possible once per Draw Phase")
        }
        let drawPlayer = originalState.getTurnPlayer()
        let drawn = drawPlayer.deck.contents.pop()
        if (drawn) {
            drawPlayer.hand.contents.push(drawn)
        } else {
            throw new Error("Normal draw is not possible with an empty deck")
        }
        return originalState
    }
}