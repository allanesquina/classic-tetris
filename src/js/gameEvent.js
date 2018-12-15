// Game events
export function GameEvents(game) {
  game.event.on('nextPiece', (url) => {
    const img = new Image()
    img.src = url;
    
    document.querySelector('#playfield-screen__info_next--value').innerHTML = '';
    document.querySelector('#playfield-screen__info_next--value').appendChild(img);
  });

  game.event.on('score', (val) => {
    document.querySelector('#playfield-screen__info_score--value').innerHTML = val;
  })

  game.event.on('gameover', () => {
    game.activeStage('menu');
    document.querySelector('#gameover-screen').style.display = 'block';
    document.querySelector('#gameover-screen__restart-button').addEventListener('click', (e) => {
      // openFullscreen();
      game.activeStage('playfield');
      game.event.emit('reset');
      document.querySelector('#gameover-screen').style.display = 'none';
    });
  })
}