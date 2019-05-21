function isPasscode(value: string): boolean {
    return (value.length == 8)
}

export class Passcode {
    constructor(private value: string) {
        if (!isPasscode(value)) {
            throw new Error("Passcode expected: " + value)
        }
    }

    toString(): string {
        return this.value
    }
}

export class Card {
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

export class CardInstance {
    constructor(public card: Card) {
    }
}

export class FaceUpDownCardInstance extends CardInstance {
    constructor(card: Card, public isFaceUp: boolean) {
        super(card)
    }
}