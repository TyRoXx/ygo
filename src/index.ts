export class Printer{
    private a: Number;

    constructor(a: Number){
        this.a = a;
    }

    public print(): void {
        console.log(this.a)
    }
}