import { CardInstance, FaceUpDownCardInstance, Card, Passcode } from './Card/Card'
import { FieldHalf, Banished, Graveyard, ExtraDeck } from './Field/Field'
import { ExtraMonsterZone, MonsterZone, SpellTrapZone, FieldSpellZone } from './Field/Zones'
import { createParagraph } from './dom'

class Hand {
    constructor(public contents: Array<Card>) {
    }
}

class Deck {
    constructor(public contents: Array<Card>) {
    }
}

class Player {
    constructor(
        public field: FieldHalf,
        public life: Number,
        public hand: Hand,
        public deck: Deck) {
    }
}

enum Phase {
    Draw,
    Standby,
    Main1,
    // Battle Phase begin
    StartStep,
    BattleStep,
    DamageStep,
    EndStep,
    // Battle Phase end
    Main2,
    End
}


class GameState {
    constructor(
        public players: Array<Player>,
        public turnPlayer: Number,
        public phase: Phase,
        public extraMonsterZones: Array<ExtraMonsterZone>) {
        if (players.length != 2) {
            throw new Error("Unsupported number of players")
        }
        if (turnPlayer < 0 || turnPlayer >= players.length) {
            throw new Error("Invalid turn player index")
        }
        if (extraMonsterZones.length != 2) {
            throw new Error("Unsupported number of extra monster zones")
        }
    }
}

const enum UpDownOrientation {
    Up,
    Down
}

const cardHeight = 102

let createCell = function (
    imageUrl: string | undefined,
    playerOrientation: UpDownOrientation,
    defenseMode: boolean
) {
    let cell = document.createElement("td")
    cell.style.textAlign = "center"
    cell.style.border = "1px solid black"

    // make that empty cells do not collapse
    cell.style.width = (cardHeight * 0.7).toString() + "px"

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
    isMonsterZone: boolean,
    rightPane: HTMLElement
): HTMLElement {
    if (cardInstance === undefined) {
        return createCell(undefined, playerOrientation, defenseMode)
    }

    let card = cardInstance.card;
    let cell: HTMLElement;
    if (cardInstance.isFaceUp) {
        cell = createCell(findCardPicture(card.id), playerOrientation, defenseMode)
    } else {
        cell = createCell("https://vignette.wikia.nocookie.net/yugioh/images/e/e5/Back-EN.png/revision/latest?cb=20100726082133", playerOrientation, defenseMode)
    }
    cell.style.position = 'relative'

    if (isMonsterZone) {
        let attack = document.createElement('p')
        attack.innerText = String(card.originalAttack)
        attack.style.color = 'red'
        attack.style.padding = "0"
        attack.style.margin = "0"

        let defense = document.createElement('p')
        defense.innerText = String(card.originalDefense)
        defense.style.color = 'blue'
        defense.style.padding = "0"
        defense.style.margin = "0"

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

    cell.addEventListener('click', (e): void => {
        rightPane.style.display = 'block';
        let rightPaneElement = rightPane.children[0]
        let name = document.createElement("h2")
        name.innerText = card.name
        let type = document.createElement("b")
        type.innerText = card.type
        while (rightPaneElement.firstChild) {
            rightPaneElement.removeChild(rightPaneElement.firstChild);
        }
        rightPaneElement.append(
            name,
            type,
            document.createElement("br"),
            document.createTextNode(card.description)
        )
    });

    return cell;
}

let findCardPicture = function (passcode: Passcode): string {
    let withoutLeadingZero = parseInt(passcode.toString(), 10).toString()
    return `https://ygoprodeck.com/pics/${withoutLeadingZero}.jpg`
}

let setUpPlayer = function (
    board: HTMLTableElement,
    orientation: UpDownOrientation,
    playerState: Player,
    rightPane: HTMLElement
): void {
    let field = playerState.field
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

    let fieldSpellCard = field.fieldSpell.fieldSpell
    let fieldSpell = createCard(fieldSpellCard, orientation, false, false, rightPane)
    upperRow.push(fieldSpell)

    let extraDeck = createCell((playerState.field.extraDeck.contents.length > 0) ? back : undefined, orientation, false)
    lowerRow.push(extraDeck)

    for (let i = 0; i < 5; ++i) {
        {
            let monsterZone = field.monsters[i]
            let monsterZoneElement = createCard(
                monsterZone.monster,
                orientation,
                monsterZone.inDefenseMode,
                true, rightPane
            )
            upperRow.push(monsterZoneElement)
            monsterZoneElement.style.width = cardHeight.toString() + "px"
        }

        let spellTrap = field.spellTraps[i].spellTrap;
        let spellTrapZoneElement;
        if (spellTrap === undefined) {
            spellTrapZoneElement = createCell(undefined, orientation, false)
        } else {
            spellTrapZoneElement = createCard(spellTrap, orientation, false, false, rightPane)
        }
        lowerRow.push(spellTrapZoneElement)
        spellTrapZoneElement.style.width = cardHeight.toString() + "px"
    }

    let graveyard = createCell((field.graveyard.contents.length > 0) ? findCardPicture(field.graveyard.contents[
        field.graveyard.contents.length - 1
    ].card.id) : undefined, orientation, false)
    upperRow.push(graveyard)

    let deck = createCell((playerState.deck.contents.length > 0) ? back : undefined, orientation, false)
    lowerRow.push(deck)

    let banished = createCell((field.banished.contents.length > 0) ? findCardPicture(field.banished.contents[
        field.banished.contents.length - 1
    ].card.id) : undefined, orientation, false)
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

let createHand = function (hand: Hand, rightPane: HTMLElement): HTMLElement {
    let container = document.createElement('div')
    container.style.textAlign = 'center'

    let cardList = document.createElement('div');
    cardList.style.marginTop = '20px';
    cardList.style.display = 'inline-block'
    hand.contents.forEach(card => {
        cardList.appendChild(
            createCard(
                new FaceUpDownCardInstance(card, true),
                UpDownOrientation.Up,
                false,
                false, rightPane
            )
        );
    })
    container.appendChild(cardList);

    return container;
}

function setUpBoard(): HTMLElement {
    let rightPane: HTMLElement = document.createElement('div');

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

    let demoFieldSpell = new Card(
        new Passcode('79698395'),
        'Realm of Danger!',
        0, 0,
        'Normal',
        'Your opponent cannot target “Danger!” monsters you control with card effects during the turn they are Special Summoned. Once per turn: you can target 1 “Danger!” monster you control; while you control that faceup monster and this faceup card, that monster can attack your opponent directly, also your opponent’s monsters cannot target it for attacks, but it does not prevent your opponent from attacking you directly.'
    )

    let extraMonster = new Card(
        new Passcode('23995346'),
        'Ultimate Blue Eyed Dragon',
        4500,
        3800,
        'Dragon/Fusion',
        '"Blue-Eyes White Dragon" * 3'
    )

    let state = new GameState(
        [
            new Player(new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(),
                new FieldSpellZone(undefined), new Graveyard([new CardInstance(demoMonster)]),
                new ExtraDeck(new Array<CardInstance>()), new Banished([new FaceUpDownCardInstance(demoSpell, true)])),
                8000,
                new Hand([demoMonster]),
                new Deck([])),
            new Player(new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(),
                new FieldSpellZone(new FaceUpDownCardInstance(demoFieldSpell, true)), new Graveyard(new Array<CardInstance>()),
                new ExtraDeck([new CardInstance(extraMonster)]), new Banished(new Array<FaceUpDownCardInstance>())),
                8000,
                new Hand([demoMonster]),
                new Deck([demoSpell]))
        ],
        0,
        Phase.Main1,
        [new ExtraMonsterZone(-1, undefined), new ExtraMonsterZone(-1, undefined)]
    )

    state.players[0].field.monsters[2].monster = new FaceUpDownCardInstance(demoMonster, true)
    state.players[0].field.monsters[1].monster = new FaceUpDownCardInstance(demoMonster, false)
    state.players[0].field.monsters[1].inDefenseMode = true
    state.players[0].field.spellTraps[0].spellTrap = new FaceUpDownCardInstance(demoSpell, false)
    state.extraMonsterZones[1] = new ExtraMonsterZone(0, new FaceUpDownCardInstance(
        extraMonster,
        true
    ))

    state.players[1].field.monsters[1].monster = new FaceUpDownCardInstance(demoMonster, true)
    state.players[1].field.spellTraps[3].spellTrap = new FaceUpDownCardInstance(demoSpell, false)
    state.extraMonsterZones[0] = new ExtraMonsterZone(1, new FaceUpDownCardInstance(
        extraMonster,
        true
    ))

    let body = document.createElement('div')
    body.style.display = 'flex';
    body.style.alignItems = 'stretch';
    let leftPane = document.createElement('div')
    leftPane.style.background = 'silver';
    leftPane.style.cssFloat = 'left';
    leftPane.style.minWidth = '1300px'

    leftPane.appendChild(createHand(state.players[0].hand, rightPane))
    let board = document.createElement("table")
    setUpPlayer(board, UpDownOrientation.Down, state.players[0], rightPane)
    {
        let tr = document.createElement("tr")
        for (let i = 0; i < 9; ++i) {
            switch (i) {
                case 3:
                case 5:
                    let extraMonsterZone = state.extraMonsterZones[(i === 3) ? 0 : 1]
                    let extraMonsterZoneElement = createCard(
                        extraMonsterZone.monster,
                        (extraMonsterZone.owner === 0) ? UpDownOrientation.Down : UpDownOrientation.Up,
                        false,
                        true, rightPane
                    )
                    tr.appendChild(extraMonsterZoneElement)
                    extraMonsterZoneElement.style.width = cardHeight.toString() + "px"
                    break

                default:
                    tr.appendChild(document.createElement("td"))
            }
        }
        board.appendChild(tr)
    }
    setUpPlayer(board, UpDownOrientation.Up, state.players[1], rightPane)
    leftPane.appendChild(board)

    leftPane.appendChild(createHand(state.players[1].hand, rightPane))

    rightPane.appendChild(createParagraph('Card info'))
    rightPane.style.backgroundColor = 'gold'
    rightPane.style.width = '100%'
    rightPane.style.padding = '5px 10px'
    rightPane.style.minWidth = '10em'

    body.appendChild(leftPane)
    body.appendChild(rightPane)
    return body
}

document.body.appendChild(setUpBoard())
