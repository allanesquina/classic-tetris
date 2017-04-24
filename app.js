// Config
let game = new Game('stage', 500, 300, 15);
let playField = new GameZone(game.context, {currentPiece: { type: 'T', rotate: 0, x: 3, y: 1 }});

// Creating the pieces
let p = [];
for (let i = 0, l = 22; i < l; i++) {
  for (let j = 0, y = 10; j < y; j++) {
    playField.connect(new Pixel({
      name: `Piece-${i}-${j}`,
      type: 'rect',
      color: '#333',
      w: 20,
      h: 20,
      x: 0 + (j * 22),
      y: 0 + (i * 22),
      refX: j, 
      refY: i
    }));
  }
}


let fieldController = new FieldController({
  name: 'FieldController',
  type: 'ctrl'
});

playField.connect(fieldController);
game.setZone(playField);
game.start();
