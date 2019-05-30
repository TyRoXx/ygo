import { ContainerWrapper } from "./ContainerWrapper";

export class TextContainer extends ContainerWrapper {
    public setText(text: string): void {
        this.container.innerText = text;
    }

    public getText(): string {
        return this.container.innerText
    }
}