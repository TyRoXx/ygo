class Monster {
	private attack: Number;
	private defense: Number;
	private inDefenseMode: boolean;
	private imageURL: string;

	constructor(id: string) {
		// TODO: get information from api or so

		this.attack = 1000;
		this.defense = 400;
		this.inDefenseMode = false;
		this.imageURL = "https://ygoprodeck.com/pics/85936485.jpg";
	}

	getAttack(): Number { return this.attack }
	getDefense(): Number { return this.defense }
	isInDefensePosition(): boolean { return this.inDefenseMode }
	getImageUrl(): string { return this.imageURL }
}