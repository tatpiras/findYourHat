const readline = require("readline-sync");

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const holeOrfieldCharacter = [hole, fieldCharacter];

class Field {
  constructor(field = []) {
    this.field = field;
    this.X = 0;
    this.Y = 0;
    this.height;
    this.width;
  }

  setHeight(userHeight) {
    this.height = userHeight;
  }

  setWidth(userWidth) {
    this.width = userWidth;
  }

  generateField() {
    let columns;
    for (let i = 0; i < this.height; i++) {
    columns = []
      for (let j = 0; j < this.width; j++) {   
        let index = Math.floor(Math.random() * holeOrfieldCharacter.length);
        columns.push(holeOrfieldCharacter[index]);
      }
    this.field.push(columns);
    }
    // Set initial position of player
    this.field[0][0] = pathCharacter;

    // Set initial position of hat
    let x, y;
    do {
      x = Math.floor(Math.random() * this.width);
      y = Math.floor(Math.random() * this.height);
    }
    while(x === 0 || y === 0);
    this.field[y][x] = hat;
    return this.field;
  }

  printStatus() {
    const joined = this.field.map(row => {
      return row.join('');
  }).join('\n');
  console.log(joined + '\n');
  }

  runGame() {
    let playing = true;
    while (playing) {
      console.clear();
      this.printStatus();
      this.ask();
      if (!this.isInBounds()) {
        console.log('Out of bounds! Game over ( ✜︵✜ )  \n');
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log('You fell down a hole! Game over ( ✜︵✜ ) \n');
        playing = false;
        break;
      } else if (this.isHat()) {
        console.log(`You found your hat! ※\(^o^)/※ \n`);
        playing = false;
        break;
      }
      // Update the current location on the map
      this.field[this.Y][this.X] = pathCharacter;
      console.clear();
    }
    this.restart();
  }

  isInBounds() {
    return (
      this.Y >= 0 &&
      this.X >= 0 &&
      this.Y < this.field.length &&
      this.X < this.field[0].length
    );
  }

  isHat() {
    return this.field[this.Y][this.X] === hat;
  }

  isHole() {
    return this.field[this.Y][this.X] === hole;
  }

  ask() {
    const userChoice = readline.question('Which way? ');
    switch (userChoice) {
      case 'u':
        this.Y -= 1;
        break;
      case 'd':
        this.Y += 1;
        break;
      case 'l':
        this.X -= 1;
        break;
      case 'r':
        this.X += 1;
        break;
      default:
        console.log('Please choose a direction.');
        this.ask();
        break;
    }
  }

  refresh() {
    this.field = [];
    this.Y = 0;
    this.X = 0;
  }

  restart() {
    const restart = readline.question('Start over? y || n \n');

    switch(restart) {
      case 'y':
        console.clear();
        this.refresh();
        play();
        break;

      case 'n':
        console.log('Goodbye!');
        process.exit(0);
    } 
  }

} // class

const newGame = new Field();
play();

/*============================================================*/

function play() {
  gameIntro();
  newGame.setWidth(askWidth());
  newGame.setHeight(askHeight());
  newGame.generateField();
  console.clear();
  newGame.runGame();
};

function gameIntro() {
  console.log(`
//////////////////
* FIND YOUR HAT! *
//////////////////

To start: 
`)
}   

function askWidth() {
let userWidth;
do {userWidth = readline.question('...please choose a WIDTH (min 5 max 20): \n')}
while(parseInt(userWidth) < 5 || parseInt(userWidth) > 20 || userWidth.match(/\D/) || userWidth.length === 0);
return parseInt(userWidth);
};

function askHeight() {
let userHeight;
do {userHeight = readline.question('...and a HEIGHT (min 5 max 20): \n')}
while(parseInt(userHeight) < 5 || parseInt(userHeight) > 20 || userHeight.match(/\D/) || userHeight.length === 0);
return parseInt(userHeight);
};
