import Pixel from './Pixel';
import Game from './engine/GameEngine';
import FieldController from './FieldController';
import SpriteSheet from '../assets/img/sprite3.png';
import { TouchEvents } from './touchEvent';
import { GameEvents } from './gameEvent';
import { config } from './gameConfig';
import { changeTheme } from './themes';
import UI from './ui.js';

export default function () {

  // Config

  let game = new Game('stage', config.canvas().width, config.canvas().height, config.render.fps);
  let playField = game.stage('playfield', config.initialState);
  let menu = game.stage('menu');

  let fieldController = new FieldController({
    id: 'gameController',
    name: 'FieldController',
    type: 'ctrl'
  });

  playField.connect(fieldController);

  game.event.on('theme', (theme) => {
    // createPiecesArea(playField);
  });

  function createPiecesArea(playField) {
    // Creating the pieces area
    let spriteSize = config.theme.sprite.size;
    let pixelWidth = parseInt(spriteSize * config.theme.sprite.scale);
    let border = config.theme.sprite.border;
    const matrixHeight = ((config.matrix.height-2) * ((pixelWidth + border))) + border;
    const matrixWidth = (config.matrix.width  * (pixelWidth + border));

    for (let i = 0, l = config.matrix.height-2; i < l; i++) {
      for (let j = 0, y = config.matrix.width; j < y; j++) {
        console.log((i * (pixelWidth + border)))
        playField.connect(new Pixel({
          name: `Piece-${i+2}-${j}`,
          id: `Piece-${i+2}-${j}`,
          type: config.theme.sprite.type,
          sprite: config.theme.sprite.spriteSheet,
          sw: spriteSize,
          sh: spriteSize,
          x: 0 + (j * (pixelWidth + border)),
          y: 0 + (i * (pixelWidth + border)),
          w: pixelWidth,
          h: pixelWidth,
          refX: j,
          refY: i+2,
          matrix: 'matrix',
          sx:0
        }));
      }
    }

    // // Create a line at the bottom of the matrix
    // playField.connect(game.object({
    //   id: 'lineBottom1',
    //   type: 'rect',
    //   color: '#000',
    //   x: 0,
    //   y: matrixHeight,
    //   w: matrixWidth,
    //   h: 2
    // }))

    // playField.connect(game.object({
    //   id: 'lineBottom2',
    //   type: 'rect',
    //   color: '#0c0c0c',
    //   x: 0,
    //   y: matrixHeight + 1,
    //   w: matrixWidth,
    //   h: 1
    // }))
  }

  // Init game config
  UI(game, fieldController);
  TouchEvents(fieldController, game);
  GameEvents(game);
  createPiecesArea(playField, game);

  game.ui.router.goTo('start-menu');
  // Active the menu stage
  game.activeStage(menu);

  // Start the game loop
  game.start();



}