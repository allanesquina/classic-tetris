// Game events
export function GameEvents(game) {
  game.event.on('nextPiece', (url) => {
    const img = new Image()
    img.src = url;
    
    document.querySelector('#gameinfo_next').innerHTML = '';
    document.querySelector('#gameinfo_next').appendChild(img);
  });

  game.event.on('score', (val) => {
    document.querySelector('#gameinfo_scorea').innerHTML = val;
  })

  game.event.on('gameover', () => {
    game.activeStage('menu');
    document.querySelector('.gameover').style.display = 'block';
    document.querySelector('.restart-button').addEventListener('click', (e) => {
      // openFullscreen();
      game.activeStage('playfield');
      game.event.emit('reset');
      document.querySelector('.gameover').style.display = 'none';
    });
  })
}