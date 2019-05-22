import { Card } from '../Card/Card';
import { FieldHalf } from '../Field/Field';

export class Hand {
    constructor(public contents: Array<Card>) {
    }
}

export class Deck {
    constructor(public contents: Array<Card>) {
    }
}

export class Player {
    constructor(
        public field: FieldHalf,
        public life: Number,
        public hand: Hand,
        public deck: Deck) {
    }
}