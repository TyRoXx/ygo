import { findLegalActions } from '../Rules';
import { prepareDuel } from '../PrepareDuel';
import { Passcode } from '../Card/Card';
import { findCard } from '../BuiltinCards';
import { NormalDrawAction, LeavePhaseAction } from '../Action';
import { Phase } from '../GameState';

test('draw phase', () => {
    let demoMonster = findCard(new Passcode('85936485'))
    if (demoMonster === undefined) {
        fail()
        return
    }
    let state = prepareDuel([
        [demoMonster],
        [demoMonster]
    ])
    let actionsBeforeDrawing = findLegalActions(state)
    expect(actionsBeforeDrawing.length).toBe(1)
    let draw = actionsBeforeDrawing[0]
    expect(draw).toBeInstanceOf(NormalDrawAction)
    let afterDrawing = draw.Take(state)
    expect(afterDrawing.turnPlayer).toBe(0)
    expect(afterDrawing.phase).toBe(Phase.Draw)
    expect(afterDrawing.players[0].hand.contents.length).toBe(1)
    let actionsAfterDrawing = findLegalActions(afterDrawing)
    expect(actionsAfterDrawing.length).toBe(1)
    let leavePhase = actionsAfterDrawing[0]
    expect(leavePhase).toBeInstanceOf(LeavePhaseAction)
    let afterLeaving = leavePhase.Take(afterDrawing)
    expect(afterLeaving.turnPlayer).toBe(0)
    expect(afterLeaving.phase).toBe(Phase.Standby)
})
