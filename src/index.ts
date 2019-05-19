export function setUpBoard(): HTMLElement {
    let cardHeight = 153
    let upperRow = document.createElement("tr")
    let lowerRow = document.createElement("tr")
    let createCell = function (imageUrl: string) {
        let cell = document.createElement("td")
        let e = document.createElement("img")
        e.setAttribute("src", imageUrl)
        e.setAttribute("height", cardHeight.toString())
        cell.appendChild(e)
        return cell
    }
    let back = "https://vignette.wikia.nocookie.net/yugioh/images/e/e5/Back-EN.png/revision/latest?cb=20100726082133"

    let fieldSpell = createCell(back)
    upperRow.appendChild(fieldSpell)

    let extraDeck = createCell(back)
    lowerRow.appendChild(extraDeck)

    for (let i = 0; i < 5; ++i) {
        let monsterZone = createCell("https://ygoprodeck.com/pics/85936485.jpg")
        upperRow.appendChild(monsterZone)
        monsterZone.style.width = cardHeight.toString() + "px"
        monsterZone.style.textAlign = "center"

        if (i % 2) {
            monsterZone.style.transform = "rotate(270deg)"
        }

        let spellTrapZone = createCell((i % 2) ?
            back :
            "https://ygoprodeck.com/pics/55144522.jpg")
        lowerRow.appendChild(spellTrapZone)
        spellTrapZone.style.width = cardHeight.toString() + "px"
        spellTrapZone.style.textAlign = "center"
    }

    let graveyard = createCell("https://ygoprodeck.com/pics/85936485.jpg")
    upperRow.appendChild(graveyard)

    let deck = createCell(back)
    lowerRow.appendChild(deck)

    let player = document.createElement("table")
    player.appendChild(upperRow)
    player.appendChild(lowerRow)
    return player
}
