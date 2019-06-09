import { Card, Passcode } from "./Card/Card";
import { Monster } from "./Card/Monster";

const allCards = [new Card(
    new Passcode('85936485'),
    'United Resistance',
    'Thunder',
    'The people that gather to swear to fight their oppressors. A revolution is coming',
    new Monster(1000, 400, 3)
), new Card(
    new Passcode('02314238'),
    'Dark Magic Attack',
    'Normal',
    'If you control "Dark Magician": Destroy all Spell and Trap Cards your opponent controls.'
), new Card(
    new Passcode('79698395'),
    'Realm of Danger!',
    'Normal',
    'Your opponent cannot target “Danger!” monsters you control with card effects during the turn they are Special Summoned. Once per turn: you can target 1 “Danger!” monster you control; while you control that faceup monster and this faceup card, that monster can attack your opponent directly, also your opponent’s monsters cannot target it for attacks, but it does not prevent your opponent from attacking you directly.'
), new Card(
    new Passcode('23995346'),
    'Blue Eyed Ultimate Dragon',
    'Dragon/Fusion',
    '"Blue-Eyes White Dragon" * 3',
    new Monster(4500, 3800, 12)
)
]

export function findCard(code: Passcode): Card | undefined {
    for (let i = 0; i < allCards.length; ++i) {
        if (allCards[i].id.equals(code)) {
            return allCards[i]
        }
    }
    return undefined
}
