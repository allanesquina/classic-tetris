// Config
let game = new Game('stage', 300, 450, 15);
let playField = new GameZone(game.context, {
  score: `0000`, 
  lines: `0`, 
  level: `1`, 
  matrix: [],
  control: { down: false },
});

function createPiecesArea(playField) {
  // Creating the pieces area
  let p = [];
  let spriteSize = 7;
  let pw = spriteSize * 2.3;
  let border = 1;
  let matrixHeight;
  let matrixWidth;

  for (let i = 0, l = 22; i < l; i++) {
    for (let j = 0, y = 10; j < y; j++) {
      playField.connect(new Pixel({
        name: `Piece-${i+2}-${j}`,
        type: 'sprite',
        sprite: `img/sprite2.png`,
        sw: spriteSize,
        sh: spriteSize,
        x: 0 + (j * (pw + border)),
        y: 0 + (i * (pw + border)),
        w: pw,
        h: pw,
        refX: j,
        refY: i+2,
        matrix: playField.state.matrix,
        sx: 0
      }));

      // Used to create lines at the bottom of the matrix
      matrixHeight = 0 + (i * ((pw + border))) + (pw + border);
      matrixWidth = 0 + (j * (pw + border)) + pw;
    }
  }

  // Create a line at the bottom of the matrix
  playField.connect(new GameObject({
    type: 'rect',
    color: '#000',
    x: 0,
    y: matrixHeight,
    w: matrixWidth,
    h: 2
  }))

  playField.connect(new GameObject({
    type: 'rect',
    color: '#0c0c0c',
    x: 0,
    y: matrixHeight + 2,
    w: matrixWidth,
    h: 140
  }))
}

function createNextPiecesArea(playField) {
  // Creating the next piece area
  let p = [];
  let spriteSize = 7;
  let pw = spriteSize * 1.1;
  let border = 3;
  for (let i = 0, l = 6; i < l; i++) {
    for (let j = 0, y = 4; j < y; j++) {
      playField.connect(new Pixel({
        name: `Piece-${i}-${j}`,
        type: 'sprite',
        sprite: `img/sprite2.png`,
        sw: spriteSize,
        sh: spriteSize,
        x: 210 + (j * (pw + border)),
        y: 120 + (i * (pw + border)),
        w: pw,
        h: pw,
        refX: j,
        refY: i,
        matrix: playField.state.matrixNext,
        sx: 0
      }));
    }
  }
}


let fieldController = new FieldController({
  name: 'FieldController',
  type: 'ctrl'
}, playField);

let score = new Score({
  name: `Score`,
  type: `text`,
  color: `#fff`,
  font: `25px Arial`,
  x: 200,
  y: 55
})

let lines = new Lines({
  name: `Lines`,
  type: `text`,
  color: `#fff`,
  font: `25px Arial`,
  x: 200,
  y: 245
})

let level = new Level({
  name: `Level`,
  type: `text`,
  color: `#fff`,
  font: `25px Arial`,
  x: 200,
  y: 340
})

var myElement = document.getElementById('stage');
var hammertime = new Hammer(myElement, {});

hammertime.get('swipe')
  .set({ 
    direction: Hammer.DIRECTION_VERTICAL, 
    threshold: 5,
    velocity: 0.2
  });
hammertime.get('pan')
  .set({ 
    // direction: Hammer.DIRECTION_HORIZONTAL, 
    threshold: 15 
  });
hammertime.on('pandown panleft panright tap swipedown', function(ev) {
  var keys = {};
  if(ev.type === 'panleft') {
    keys[72]=ev;
  }
  if(ev.type === 'panright') {
    keys[76]=ev;
  }
  if(ev.type === 'pandown') {
    keys[74]=ev;
  }

  if(ev.type === 'swipedown') {
    keys[32]=ev;
  }

  if(ev.type === 'tap') {
    keys[38]=ev;
  }

  fieldController._movePiece(keys, playField)
});

var buttons = document.querySelectorAll('.button');


buttons.forEach((button) => {
  var hammertimebtn = new Hammer(button, {});
  hammertimebtn.on('press', function(e) {
    var key = e.target.getAttribute('data-key');
    game.pressedKeys[key] = e;
    game.pressedKeys.isPressed = true;
  });
  hammertimebtn.on('pressup', function(e) {
    var key = e.target.getAttribute('data-key');
    game.pressedKeys[key] = false;
    game.pressedKeys.isPressed = false;
  });

  // button.addEventListener('touchstart', (e) => {
  //   var key = e.target.getAttribute('data-key');
  //   game.pressedKeys[key] = e;
  //   game.pressedKeys.isPressed = true;
  // });
  // button.addEventListener('touchend', (e) => {
  //   var key = e.target.getAttribute('data-key');
  //   game.pressedKeys[key] = false;
  //   game.pressedKeys.isPressed = false;

  // });

  button.addEventListener('click', (e) => {
    var keys = {};
    var key = e.target.getAttribute('data-key');
    keys[key]=e;
    fieldController._movePiece(keys, playField)
  });
  
})

function move(key, pressed) {
    game.pressedKeys[key] = pressed;
    game.pressedKeys.isPressed = pressed;
}

playField.connect(fieldController);
createPiecesArea(playField, game);
createNextPiecesArea(playField, game);
playField.connect(score);
playField.connect(lines);
playField.connect(level);
game.setZone(playField);
game.start();
