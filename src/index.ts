let popupElement = document.createElement('div');

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

let createCard = function (
    cardInstance: FaceUpDownCardInstance | undefined,
    playerOrientation: UpDownOrientation,
    defenseMode: boolean,
    isMonsterZone: boolean
): HTMLElement {
    if (cardInstance === undefined) {
        return createCell(undefined, playerOrientation, defenseMode)
    }

    let card = cardInstance.card;
    let cell;
    if (cardInstance.isFaceUp) {
        cell = createCell(findCardPicture(card.id), playerOrientation, defenseMode)
    } else {
        cell = createCell("https://vignette.wikia.nocookie.net/yugioh/images/e/e5/Back-EN.png/revision/latest?cb=20100726082133", playerOrientation, defenseMode)
    }
    cell.style.position = 'relative'

    if (isMonsterZone) {
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
    }

    cell.addEventListener('mousemove', (e): void => {
        popupElement.innerHTML = `<h2>${card.name}</h2><b>${card.type}</b><br />${card.description}`;
        popupElement.style.position = "fixed"
        popupElement.style.display = 'block'
        popupElement.style.zIndex = '20'
        popupElement.style.backgroundColor = 'gold'
        popupElement.style.padding = '0.5em'
        popupElement.style.left = (e.clientX + 20) + "px"
        popupElement.style.top = (e.clientY + 20) + "px"
    });
    cell.addEventListener('mouseout', () => popupElement.style.display = 'none')

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
            let monsterZoneElement = createCard(
                monsterZone.monster,
                orientation,
                monsterZone.inDefenseMode,
                true
            )
            upperRow.push(monsterZoneElement)
            monsterZoneElement.style.width = cardHeight.toString() + "px"
        }

        let spellTrap = state.spellTraps[i].spellTrap;
        let spellTrapZoneElement;
        if (spellTrap === undefined) {
            spellTrapZoneElement = createCell(undefined, orientation, false)
        } else {
            spellTrapZoneElement = createCard(spellTrap, orientation, false, false)
        }
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

    let demoMonster = new Card(
        new Passcode('85936485'),
        'United Resistance',
        1000,
        400,
        'Thunder',
        'The people that gather to swear to fight their oppressors. A revolution is coming'
    );

    let demoSpell = new Card(
        new Passcode('02314238'),
        'Dark Magic Attack',
        0, 0,
        'Normal',
        'If you control "Dark Magician": Destroy all Spell and Trap Cards your opponent controls.'
    )

    field.firstPlayer.monsters[2].monster = new FaceUpDownCardInstance(demoMonster, true)
    field.firstPlayer.monsters[1].monster = new FaceUpDownCardInstance(demoMonster, false)
    field.firstPlayer.monsters[1].inDefenseMode = true
    field.firstPlayer.spellTraps[0].spellTrap = new FaceUpDownCardInstance(demoSpell, false)

    field.secondPlayer.monsters[1].monster = new FaceUpDownCardInstance(demoMonster, true)
    field.secondPlayer.spellTraps[4].spellTrap = new FaceUpDownCardInstance(demoSpell, false)

    let board = document.createElement("table")
    setUpPlayer(board, UpDownOrientation.Down, field.firstPlayer)
    {
        let tr = document.createElement("tr")
        for (let i = 0; i < 7; ++i) {
            switch (i) {
                case 3:
                case 5:
                    let extraMonster = new Card(
                        new Passcode('23995346'),
                        'Ultimate Blue Eyed Dragon',
                        4500,
                        3800,
                        'Dragon/Fusion',
                        '"Blue-Eyes White Dragon" * 3'
                    )
                    let extraMonsterZone = createCard(
                        new FaceUpDownCardInstance(
                            extraMonster,
                            true
                        ),
                        (i == 3) ? UpDownOrientation.Down : UpDownOrientation.Up,
                        false,
                        true
                    )
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

    board.appendChild(popupElement)
    return board
}
