class MonsterZone {
    constructor(public monster: FaceUpDownCardInstance | undefined, public inDefenseMode: boolean) {
    }
}

class ExtraMonsterZone {
    constructor(public owner: Number, public monster: FaceUpDownCardInstance | undefined) {
    }
}

class SpellTrapZone {
    constructor(public spellTrap: FaceUpDownCardInstance | undefined) {
    }
}

class FieldSpellZone {
    constructor(public fieldSpell: FaceUpDownCardInstance | undefined) {
    }
}
