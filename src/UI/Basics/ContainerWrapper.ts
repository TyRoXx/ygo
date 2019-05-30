export class ContainerWrapper {

    constructor(public container: HTMLElement) { }

    public setParent(parent: HTMLElement): void {
        parent.appendChild(this.container)
    }
}