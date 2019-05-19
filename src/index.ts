enum UpDownOrientation {
    Up,
    Down
}

const cardHeight = 153

let createCell = function (imageUrl: string, playerOrientation: UpDownOrientation, defenseMode: boolean) {
    let cell = document.createElement("td")
    let image = document.createElement("img")
    image.setAttribute("src", imageUrl)
    image.setAttribute("height", cardHeight.toString())
    cell.style.textAlign = "center"
    cell.style.border = "1px solid black"
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
    return cell
}

let setUpPlayer = function (board: HTMLTableElement, orientation: UpDownOrientation): void {
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
        let monsterZone = createCell("https://ygoprodeck.com/pics/85936485.jpg", orientation, (i % 2) == 0)
        upperRow.push(monsterZone)
        monsterZone.style.width = cardHeight.toString() + "px"

        let spellTrapZone = createCell((i % 2) ?
            back :
            "https://ygoprodeck.com/pics/55144522.jpg", orientation, false)
        lowerRow.push(spellTrapZone)
        spellTrapZone.style.width = cardHeight.toString() + "px"
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

export function setUpBoard(): HTMLElement {
    let board = document.createElement("table")
    setUpPlayer(board, UpDownOrientation.Down)
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
    setUpPlayer(board, UpDownOrientation.Up)
    return board
}
