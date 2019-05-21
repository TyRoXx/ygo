import {FaceUpDownCardInstance} from '../Card/Card'

export class MonsterZone {
    constructor(public monster: FaceUpDownCardInstance | undefined, public inDefenseMode: boolean) {
    }
}

export class ExtraMonsterZone {
    constructor(public owner: Number, public monster: FaceUpDownCardInstance | undefined) {
    }
}

export class SpellTrapZone {
    constructor(public spellTrap: FaceUpDownCardInstance | undefined) {
    }
}

export class FieldSpellZone {
    constructor(public fieldSpell: FaceUpDownCardInstance | undefined) {
    }
}
