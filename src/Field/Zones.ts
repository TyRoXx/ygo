class MonsterZone {
	constructor(public monster: FaceUpDownCardInstance | undefined, public inDefenseMode: boolean) {
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