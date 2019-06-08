import { Card } from "../Card/Card";

function createRightPane(headingText: string, type: string,
    level: number | undefined, description: string) {
    let rightPane = document.createElement('div')

    rightPane.style.backgroundColor = 'gold'
    rightPane.style.width = '100%'
    rightPane.style.padding = '5px 10px'
    rightPane.style.minWidth = '10em'

    let heading = document.createElement('h2')
    heading.innerText = headingText;

    let typeElement = document.createElement('b')
    typeElement.style.display = 'block';
    typeElement.innerText = type

    let levelElement = document.createElement('p')
    if (level === undefined) {
        levelElement.innerText = '';
    } else {
        levelElement.innerText = '★'.repeat(level) + ` (${level.toString()})`;
    }

    let text = document.createElement('div')
    text.innerText = description

    rightPane.append(
        heading,
        levelElement,
        typeElement,
        text
    )
    return rightPane
}

export function createRightPaneFromCard(card: Card) {
    return createRightPane(card.name, card.type,
        card.monster ? card.monster.level : undefined, card.description)
}
