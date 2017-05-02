// Config
let game = new Game('stage', 500, 300, 15);
let playField = new GameZone(game.context, {currentPiece: { type: 'T', rotate: 0, x: 3, y: 1 }, score: `0000`});

// Creating the pieces
let p = [];
let spriteSize = 7;
let pw = spriteSize * 2.5;
let border = 2;
for (let i = 0, l = 22; i < l; i++) {
  for (let j = 0, y = 10; j < y; j++) {
    playField.connect(new Pixel({
      name: `Piece-${i}-${j}`,
      type: 'sprite',
      sprite: `img/sprite2.png`,
      sw: spriteSize,
      sh: spriteSize,
      x: 0 + (j * (pw + border)),
      y: 0 + (i * (pw + border)),
      w: pw,
      h: pw,
      refX: j,
      refY: i,
      sx: 0
    }));
  }
}

let fieldController = new FieldController({
  name: 'FieldController',
  type: 'ctrl'
});

let score = new Text({
  name: `Score`,
  type: `text`,
  color: `#fff`,
  text: `1111`,
  font: `30px Arial`,
  x: 350,
  y: 50
})

playField.connect(fieldController);
playField.connect(score);
game.setZone(playField);
game.start();
