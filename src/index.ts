function isPasscode(value: string): boolean {
    return (value.length == 8)
}

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
    constructor(public id: Passcode, public originalAttack: Number, public originalDefense: Number) {
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

class Graveyard {
    constructor(public contents: Array<CardInstance>) {
    }
}

class ExtraDeck {
    constructor(public contents: Array<CardInstance>) {
    }
}

class Banished {
    constructor(public contents: Array<FaceUpDownCardInstance>) {
    }
}

const enum UpDownOrientation {
    Up,
    Down
}

const cardHeight = 153

let createCell = function (
    imageUrl: string | undefined,
    playerOrientation: UpDownOrientation,
    defenseMode: boolean
) {
    let cell = document.createElement("td")
    cell.style.textAlign = "center"
    cell.style.border = "1px solid black"
    if (imageUrl) {
        let image = document.createElement("img")
        image.setAttribute("src", imageUrl)
        image.setAttribute("height", cardHeight.toString())
        let rotation = (defenseMode ? 270 : 0)
        switch (playerOrientation) {
            case UpDownOrientation.Down:
                rotation += 180
                break
            case UpDownOrientation.Up:
                break
        }
        image.style.transform = `rotate(${rotation}deg)`
        cell.appendChild(image)
    }

    return cell
}
let createMonsterCard = function (
    card: Card | undefined,
    playerOrientation: UpDownOrientation,
    defenseMode: boolean
): HTMLElement {
    if (card === undefined) {
        return createCell(undefined, playerOrientation, defenseMode)
    }
    let cell = createCell(findCardPicture(card.id), playerOrientation, defenseMode)
    cell.style.position = 'relative'

    let attack = document.createElement('p')
    attack.innerHTML = String(card.originalAttack)
    attack.style.color = 'red'

    let defense = document.createElement('p')
    defense.innerHTML = String(card.originalDefense)
    defense.style.color = 'blue'

    let overlay = document.createElement('div')
    overlay.appendChild(attack);
    overlay.appendChild(defense);
    overlay.style.position = 'absolute';
    overlay.style.top = '0px'
    overlay.style.width = '100%';
    overlay.style.zIndex = '10';
    overlay.style.textAlign = 'center';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';

    cell.appendChild(overlay)

    return cell;
}

let findCardPicture = function (passcode: Passcode): string {
    return `https://ygoprodeck.com/pics/${passcode.toString()}.jpg`
}

let setUpPlayer = function (
    board: HTMLTableElement,
    orientation: UpDownOrientation,
    state: FieldHalf
): void {
    let appendChildren = function (to: HTMLElement, children: Array<HTMLElement>) {
        switch (orientation) {
            case UpDownOrientation.Down:
                children = children.slice(0).reverse()
                break;

            case UpDownOrientation.Up:
                break;
        }
        children.forEach(element => {
            to.appendChild(element)
        })
    }
    let upperRow = []
    let lowerRow = []
    upperRow.push(document.createElement("td"))
    lowerRow.push(document.createElement("td"))

    let back = "https://vignette.wikia.nocookie.net/yugioh/images/e/e5/Back-EN.png/revision/latest?cb=20100726082133"

    let fieldSpell = createCell(back, orientation, false)
    upperRow.push(fieldSpell)

    let extraDeck = createCell(back, orientation, false)
    lowerRow.push(extraDeck)

    for (let i = 0; i < 5; ++i) {
        {
            let monsterZone = state.monsters[i]
            let monsterZoneElement = createMonsterCard(
                monsterZone.monster ? monsterZone.monster.card : undefined,
                orientation,
                monsterZone.inDefenseMode
            )
            upperRow.push(monsterZoneElement)
            monsterZoneElement.style.width = cardHeight.toString() + "px"
        }

        let spellTrapZone = state.spellTraps[i]
        let spellTrapZoneElement = createCell(
            spellTrapZone.spellTrap ? (spellTrapZone.spellTrap.isFaceUp ? findCardPicture(spellTrapZone.spellTrap.card.id) : back) : undefined,
            orientation,
            false)
        lowerRow.push(spellTrapZoneElement)
        spellTrapZoneElement.style.width = cardHeight.toString() + "px"
    }

    let graveyard = createCell("https://ygoprodeck.com/pics/85936485.jpg", orientation, false)
    upperRow.push(graveyard)

    let deck = createCell(back, orientation, false)
    lowerRow.push(deck)

    let banished = createCell("https://ygoprodeck.com/pics/85936485.jpg", orientation, false)
    upperRow.push(banished)
    lowerRow.push(document.createElement("td"))

    let player = []
    {
        let tr = document.createElement("tr")
        appendChildren(tr, upperRow)
        player.push(tr)
    }
    {
        let tr = document.createElement("tr")
        appendChildren(tr, lowerRow)
        player.push(tr)
    }
    appendChildren(board, player)
}

let createEmptyMonsterZones = function () {
    let zones = new Array<MonsterZone>()
    for (let i = 0; i < 5; ++i) {
        zones.push(new MonsterZone(undefined, i % 2 === 0))
    }
    return zones
}

let createEmptySpellTrapZones = function () {
    let zones = new Array<SpellTrapZone>()
    for (let i = 0; i < 5; ++i) {
        zones.push(new SpellTrapZone(undefined))
    }
    return zones
}

function setUpBoard(): HTMLElement {
    let field = new Field(
        new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(),
            new FieldSpellZone(undefined), new Graveyard(new Array<CardInstance>()),
            new ExtraDeck(new Array<CardInstance>()), new Banished(new Array<FaceUpDownCardInstance>())),
        new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(),
            new FieldSpellZone(undefined), new Graveyard(new Array<CardInstance>()),
            new ExtraDeck(new Array<CardInstance>()), new Banished(new Array<FaceUpDownCardInstance>())),
        undefined,
        undefined
    )
    let demoCard = new Card(new Passcode('85936485'), 1000, 400);

    field.firstPlayer.monsters[2].monster = new FaceUpDownCardInstance(demoCard, true)
    field.firstPlayer.spellTraps[0].spellTrap = new FaceUpDownCardInstance(demoCard, false)

    field.secondPlayer.monsters[1].monster = new FaceUpDownCardInstance(demoCard, true)
    field.secondPlayer.spellTraps[4].spellTrap = new FaceUpDownCardInstance(demoCard, false)

    let board = document.createElement("table")
    setUpPlayer(board, UpDownOrientation.Down, field.firstPlayer)
    {
        let tr = document.createElement("tr")
        for (let i = 0; i < 7; ++i) {
            switch (i) {
                case 3:
                case 5:
                    let extraMonsterZone = createCell("https://ygoprodeck.com/pics/23995346.jpg",
                        (i == 3) ? UpDownOrientation.Down : UpDownOrientation.Up, false)
                    tr.appendChild(extraMonsterZone)
                    extraMonsterZone.style.width = cardHeight.toString() + "px"
                    break

                default:
                    tr.appendChild(document.createElement("td"))
            }
        }
        board.appendChild(tr)
    }
    setUpPlayer(board, UpDownOrientation.Up, field.secondPlayer)
    return board
}
