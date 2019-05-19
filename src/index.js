var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var rightPane;
function isPasscode(value) {
    return (value.length == 8);
}
var Passcode = /** @class */ (function () {
    function Passcode(value) {
        this.value = value;
        if (!isPasscode(value)) {
            throw new Error("Passcode expected: " + value);
        }
    }
    Passcode.prototype.toString = function () {
        return this.value;
    };
    return Passcode;
}());
var Card = /** @class */ (function () {
    function Card(id, name, originalAttack, originalDefense, type, description) {
        this.id = id;
        this.name = name;
        this.originalAttack = originalAttack;
        this.originalDefense = originalDefense;
        this.type = type;
        this.description = description;
    }
    return Card;
}());
var CardInstance = /** @class */ (function () {
    function CardInstance(card) {
        this.card = card;
    }
    return CardInstance;
}());
var FaceUpDownCardInstance = /** @class */ (function (_super) {
    __extends(FaceUpDownCardInstance, _super);
    function FaceUpDownCardInstance(card, isFaceUp) {
        var _this = _super.call(this, card) || this;
        _this.isFaceUp = isFaceUp;
        return _this;
    }
    return FaceUpDownCardInstance;
}(CardInstance));
var Graveyard = /** @class */ (function () {
    function Graveyard(contents) {
        this.contents = contents;
    }
    return Graveyard;
}());
var ExtraDeck = /** @class */ (function () {
    function ExtraDeck(contents) {
        this.contents = contents;
    }
    return ExtraDeck;
}());
var Banished = /** @class */ (function () {
    function Banished(contents) {
        this.contents = contents;
    }
    return Banished;
}());
var Hand = /** @class */ (function () {
    function Hand(contents) {
        this.contents = contents;
    }
    return Hand;
}());
var Player = /** @class */ (function () {
    function Player(field, extraZone, life, hand) {
        this.field = field;
        this.extraZone = extraZone;
        this.life = life;
        this.hand = hand;
    }
    return Player;
}());
var Phase;
(function (Phase) {
    Phase[Phase["Draw"] = 0] = "Draw";
    Phase[Phase["Standby"] = 1] = "Standby";
    Phase[Phase["Main1"] = 2] = "Main1";
    // Battle Phase begin
    Phase[Phase["StartStep"] = 3] = "StartStep";
    Phase[Phase["BattleStep"] = 4] = "BattleStep";
    Phase[Phase["DamageStep"] = 5] = "DamageStep";
    Phase[Phase["EndStep"] = 6] = "EndStep";
    // Battle Phase end
    Phase[Phase["Main2"] = 7] = "Main2";
    Phase[Phase["End"] = 8] = "End";
})(Phase || (Phase = {}));
var GameState = /** @class */ (function () {
    function GameState(players, turnPlayer, phase) {
        this.players = players;
        this.turnPlayer = turnPlayer;
        this.phase = phase;
        if (players.length != 2) {
            throw new Error("Unsupported number of players");
        }
        if (turnPlayer < 0 || turnPlayer >= players.length) {
            throw new Error("Invalid turn player index");
        }
    }
    return GameState;
}());
var cardHeight = 153;
var createCell = function (imageUrl, playerOrientation, defenseMode) {
    var cell = document.createElement("td");
    cell.style.textAlign = "center";
    cell.style.border = "1px solid black";
    if (imageUrl) {
        var image = document.createElement("img");
        image.setAttribute("src", imageUrl);
        image.setAttribute("height", cardHeight.toString());
        var rotation = (defenseMode ? 270 : 0);
        switch (playerOrientation) {
            case 1 /* Down */:
                rotation += 180;
                break;
            case 0 /* Up */:
                break;
        }
        image.style.transform = "rotate(" + rotation + "deg)";
        cell.appendChild(image);
    }
    return cell;
};
var createCard = function (cardInstance, playerOrientation, defenseMode, isMonsterZone) {
    if (cardInstance === undefined) {
        return createCell(undefined, playerOrientation, defenseMode);
    }
    var card = cardInstance.card;
    var cell;
    if (cardInstance.isFaceUp) {
        cell = createCell(findCardPicture(card.id), playerOrientation, defenseMode);
    }
    else {
        cell = createCell("https://vignette.wikia.nocookie.net/yugioh/images/e/e5/Back-EN.png/revision/latest?cb=20100726082133", playerOrientation, defenseMode);
    }
    cell.style.position = 'relative';
    if (isMonsterZone) {
        var attack = document.createElement('p');
        attack.innerHTML = String(card.originalAttack);
        attack.style.color = 'red';
        var defense = document.createElement('p');
        defense.innerHTML = String(card.originalDefense);
        defense.style.color = 'blue';
        var overlay = document.createElement('div');
        overlay.appendChild(attack);
        overlay.appendChild(defense);
        overlay.style.position = 'absolute';
        overlay.style.top = '0px';
        overlay.style.width = '100%';
        overlay.style.zIndex = '10';
        overlay.style.textAlign = 'center';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        cell.appendChild(overlay);
    }
    cell.addEventListener('mousemove', function (e) {
        rightPane.style.display = 'block';
        var rightPaneElement = rightPane.children[0];
        rightPaneElement.innerHTML = "<h2>" + card.name + "</h2><b>" + card.type + "</b><br />" + card.description;
    });
    cell.addEventListener('mouseout', function () { return rightPane.style.display = 'none'; });
    return cell;
};
var findCardPicture = function (passcode) {
    return "https://ygoprodeck.com/pics/" + passcode.toString() + ".jpg";
};
var setUpPlayer = function (board, orientation, state) {
    var appendChildren = function (to, children) {
        switch (orientation) {
            case 1 /* Down */:
                children = children.slice(0).reverse();
                break;
            case 0 /* Up */:
                break;
        }
        children.forEach(function (element) {
            to.appendChild(element);
        });
    };
    var upperRow = [];
    var lowerRow = [];
    upperRow.push(document.createElement("td"));
    lowerRow.push(document.createElement("td"));
    var back = "https://vignette.wikia.nocookie.net/yugioh/images/e/e5/Back-EN.png/revision/latest?cb=20100726082133";
    var fieldSpell = createCell(back, orientation, false);
    upperRow.push(fieldSpell);
    var extraDeck = createCell(back, orientation, false);
    lowerRow.push(extraDeck);
    for (var i = 0; i < 5; ++i) {
        {
            var monsterZone = state.monsters[i];
            var monsterZoneElement = createCard(monsterZone.monster, orientation, monsterZone.inDefenseMode, true);
            upperRow.push(monsterZoneElement);
            monsterZoneElement.style.width = cardHeight.toString() + "px";
        }
        var spellTrap = state.spellTraps[i].spellTrap;
        var spellTrapZoneElement = void 0;
        if (spellTrap === undefined) {
            spellTrapZoneElement = createCell(undefined, orientation, false);
        }
        else {
            spellTrapZoneElement = createCard(spellTrap, orientation, false, false);
        }
        lowerRow.push(spellTrapZoneElement);
        spellTrapZoneElement.style.width = cardHeight.toString() + "px";
    }
    var graveyard = createCell("https://ygoprodeck.com/pics/85936485.jpg", orientation, false);
    upperRow.push(graveyard);
    var deck = createCell(back, orientation, false);
    lowerRow.push(deck);
    var banished = createCell("https://ygoprodeck.com/pics/85936485.jpg", orientation, false);
    upperRow.push(banished);
    lowerRow.push(document.createElement("td"));
    var player = [];
    {
        var tr = document.createElement("tr");
        appendChildren(tr, upperRow);
        player.push(tr);
    }
    {
        var tr = document.createElement("tr");
        appendChildren(tr, lowerRow);
        player.push(tr);
    }
    appendChildren(board, player);
};
var createEmptyMonsterZones = function () {
    var zones = new Array();
    for (var i = 0; i < 5; ++i) {
        zones.push(new MonsterZone(undefined, i % 2 === 0));
    }
    return zones;
};
var createEmptySpellTrapZones = function () {
    var zones = new Array();
    for (var i = 0; i < 5; ++i) {
        zones.push(new SpellTrapZone(undefined));
    }
    return zones;
};
function setUpBoard() {
    var state = new GameState([
        new Player(new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(), new FieldSpellZone(undefined), new Graveyard(new Array()), new ExtraDeck(new Array()), new Banished(new Array())), undefined, 8000, new Hand([])),
        new Player(new FieldHalf(createEmptyMonsterZones(), createEmptySpellTrapZones(), new FieldSpellZone(undefined), new Graveyard(new Array()), new ExtraDeck(new Array()), new Banished(new Array())), undefined, 8000, new Hand([]))
    ], 0, Phase.Main1);
    var demoMonster = new Card(new Passcode('85936485'), 'United Resistance', 1000, 400, 'Thunder', 'The people that gather to swear to fight their oppressors. A revolution is coming');
    var demoSpell = new Card(new Passcode('02314238'), 'Dark Magic Attack', 0, 0, 'Normal', 'If you control "Dark Magician": Destroy all Spell and Trap Cards your opponent controls.');
    state.players[0].field.monsters[2].monster = new FaceUpDownCardInstance(demoMonster, true);
    state.players[0].field.monsters[1].monster = new FaceUpDownCardInstance(demoMonster, false);
    state.players[0].field.monsters[1].inDefenseMode = true;
    state.players[0].field.spellTraps[0].spellTrap = new FaceUpDownCardInstance(demoSpell, false);
    state.players[1].field.monsters[1].monster = new FaceUpDownCardInstance(demoMonster, true);
    state.players[1].field.spellTraps[3].spellTrap = new FaceUpDownCardInstance(demoSpell, false);
    var body = document.createElement('div');
    body.style.display = 'flex';
    body.style.alignItems = 'stretch';
    var left = document.createElement('div');
    left.style.background = 'silver';
    left.style.cssFloat = 'left';
    left.style.minWidth = '1300px';
    var board = document.createElement("table");
    setUpPlayer(board, 1 /* Down */, state.players[0].field);
    {
        var tr = document.createElement("tr");
        for (var i = 0; i < 7; ++i) {
            switch (i) {
                case 3:
                case 5:
                    var extraMonster = new Card(new Passcode('23995346'), 'Ultimate Blue Eyed Dragon', 4500, 3800, 'Dragon/Fusion', '"Blue-Eyes White Dragon" * 3');
                    var extraMonsterZone = createCard(new FaceUpDownCardInstance(extraMonster, true), (i == 3) ? 1 /* Down */ : 0 /* Up */, false, true);
                    tr.appendChild(extraMonsterZone);
                    extraMonsterZone.style.width = cardHeight.toString() + "px";
                    break;
                default:
                    tr.appendChild(document.createElement("td"));
            }
        }
        board.appendChild(tr);
    }
    setUpPlayer(board, 0 /* Up */, state.players[1].field);
    rightPane = document.createElement('div');
    rightPane.appendChild(createParagraph('Card info'));
    rightPane.style.backgroundColor = 'gold';
    rightPane.style.width = '100%';
    rightPane.style.padding = '5px 10px';
    left.appendChild(board);
    body.appendChild(left);
    body.appendChild(rightPane);
    return body;
}
