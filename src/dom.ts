export function createParagraph(text: string): HTMLElement {
    let p = document.createElement('p');
    p.innerText = text;

    return p
}
