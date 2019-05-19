class FieldHalf {
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

class Field {
	constructor(public firstPlayer: FieldHalf,
		public secondPlayer: FieldHalf,
		public firstExtraZone: FaceUpDownCardInstance | undefined,
		public secondExtraZone: FaceUpDownCardInstance | undefined) {
	}
}