function createParagraph(text: string): HTMLElement {
    let p = document.createElement('p');
    p.innerHTML = text;

    return p
}
