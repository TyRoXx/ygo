var FieldHalf = /** @class */ (function () {
    function FieldHalf(monsters, spellTraps, fieldSpell, graveyard, extraDeck, banished) {
        this.monsters = monsters;
        this.spellTraps = spellTraps;
        this.fieldSpell = fieldSpell;
        this.graveyard = graveyard;
        this.extraDeck = extraDeck;
        this.banished = banished;
        if (monsters.length !== 5) {
            throw new Error("There have to be 5 main monster zones");
        }
        if (!monsters.every(function (element) {
            return element != undefined;
        })) {
            throw new Error("The main monster zones must not be undefined");
        }
        if (spellTraps.length !== 5) {
            throw new Error("There have to be 5 spell/trap zones");
        }
        if (!spellTraps.every(function (element) {
            return element != undefined;
        })) {
            throw new Error("The spell/trap zones must not be undefined");
        }
    }
    return FieldHalf;
}());
