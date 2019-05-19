class Passcode {
    constructor(private value: string) {
        if (!isPasscode(value)) {
            throw new Error("Passcode expected: " + value)
        }
    }

    toString(): string {
        return this.value
    }
}

class Card {
    constructor(
        public id: Passcode,
        public name: string,
        public originalAttack: Number,
        public originalDefense: Number,
        public type: string,
        public description: string
    ) {
    }
}

class CardInstance {
    constructor(public card: Card) {
    }
}

class FaceUpDownCardInstance extends CardInstance {
    constructor(card: Card, public isFaceUp: boolean) {
        super(card)
    }
}