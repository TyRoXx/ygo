import { Card } from "../Card/Card";

export class RightPane {
    private heading: HTMLElement;
    private text: HTMLElement;
    private level: HTMLElement;
    private type: HTMLElement;

    constructor(
        public rightPane: HTMLElement
    ) {
        this.rightPane.style.backgroundColor = 'gold'
        this.rightPane.style.width = '100%'
        this.rightPane.style.padding = '5px 10px'
        this.rightPane.style.minWidth = '10em'

        // Creating the heading
        this.heading = document.createElement('h2')
        this.type = document.createElement('b')
        this.type.style.display = 'block';

        this.level = document.createElement('p');
        this.text = document.createElement('div')

        rightPane.append(
            this.heading,
            this.level,
            this.type,
            this.text
        )
    }

    public setHeading(headingText: string): void {
        this.heading.innerText = headingText;
    }

    public setText(description: string): void {
        this.text.innerText = description;
    }

    public setLevel(level: number | undefined): void {
        if (level === undefined) {
            this.level.innerText = '';
            return;
        }

        this.level.innerText = '★'.repeat(level) + ` (${level.toString()})`;
    }

    public setType(type: string): void {
        this.type.innerText = type;
    }
}

export function setRightPaneFromCard(rightPane: RightPane, card: Card): void {
    rightPane.setHeading(card.name)
    rightPane.setType(card.type)
    if (card.monster) {
        rightPane.setLevel(card.monster.level)
    } else {
        rightPane.setLevel(undefined)
    }
    rightPane.setText(card.description)
}