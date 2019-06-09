import { MonsterZone, SpellTrapZone, FieldSpellZone, ExtraMonsterZone } from "./Field/Zones";
import { GameState, Phase } from "./GameState";
import { Graveyard, FieldHalf, ExtraDeck, Banished } from "./Field/Field";
import { Player, Hand, Deck } from "./Player/Player";
import { CardInstance, Card } from "./Card/Card";

export function createEmptyMonsterZones() {
    let zones = new Array<MonsterZone>()
    for (let i = 0; i < 5; ++i) {
        zones.push(new MonsterZone(undefined, i % 2 === 0))
    }
    return zones
}

export function createEmptySpellTrapZones() {
    let zones = new Array<SpellTrapZone>()
    for (let i = 0; i < 5; ++i) {
        zones.push(new SpellTrapZone(undefined))
    }
    return zones
}

type CardSequence = Array<Card>

export function prepareDuel(decks: Array<CardSequence>) {
    let players = []
    for (let deck of decks) {
        let player = new Player(
            new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(),
                new FieldSpellZone(undefined),
                new Graveyard([]),
                new ExtraDeck(new Array<CardInstance>()), new Banished([])),
            8000,
            new Hand([]),
            new Deck([...deck])
        )
        players.push(player)
    }
    let state = new GameState(
        players,
        0,
        Phase.Draw,
        false,
        [new ExtraMonsterZone(-1, undefined), new ExtraMonsterZone(-1, undefined)]
    )
    return state
}
