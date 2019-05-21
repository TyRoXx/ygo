import { MonsterZone, SpellTrapZone, FieldSpellZone } from './Zones'
import { CardInstance, FaceUpDownCardInstance } from '../Card/Card'

export class Graveyard {
    constructor(public contents: Array<CardInstance>) {
    }
}

export class ExtraDeck {
    constructor(public contents: Array<CardInstance>) {
    }
}

export class Banished {
    constructor(public contents: Array<FaceUpDownCardInstance>) {
    }
}

export class FieldHalf {
    constructor(public monsters: Array<MonsterZone>,
        public spellTraps: Array<SpellTrapZone>,
        public fieldSpell: FieldSpellZone,
        public graveyard: Graveyard,
        public extraDeck: ExtraDeck,
        public banished: Banished) {
        if (monsters.length !== 5) {
            throw new Error("There have to be 5 main monster zones")
        }
        if (!monsters.every((element: MonsterZone | undefined) => {
            return element != undefined
        })) {
            throw new Error("The main monster zones must not be undefined")
        }
        if (spellTraps.length !== 5) {
            throw new Error("There have to be 5 spell/trap zones")
        }
        if (!spellTraps.every((element: SpellTrapZone | undefined) => {
            return element != undefined
        })) {
            throw new Error("The spell/trap zones must not be undefined")
        }
    }
}
