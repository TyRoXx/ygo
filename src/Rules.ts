import { GameState, Phase } from "./GameState";
import { Action, LeavePhaseAction, NormalDrawAction } from "./Action";

export function findLegalActions(state: GameState): Array<Action> {
    let legalActions: Array<Action> = []
    switch (state.phase) {
        case Phase.Draw:
            if (state.normalDrawUsed) {
                legalActions.push(new LeavePhaseAction())
            } else {
                legalActions.push(new NormalDrawAction())
            } break

        default: throw new Error("not implemented")
    }
    return legalActions
}
