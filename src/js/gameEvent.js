// Game events
export function GameEvents(game) {
    const $next = document.querySelector('#playfield-screen__info_next--value');
    const $score = document.querySelector('#playfield-screen__info_score--value');
    var images = new Map();

  game.event.on('nextPiece', (url, type) => {
    console.log(type)
    let tmpImg = images.get(type);
    if(!tmpImg) {
      const img = new Image()
      img.src = url;
      images.set(type, img);
      tmpImg = img;
    }
    
  //  $next.innerHTML = `<img src=${url} />`;
   $next.innerHTML = ``;
   $next.appendChild(tmpImg);
  });

  game.event.on('score', (val) => {
    $score.innerHTML = val;
  })

  game.event.on('theme', (newTheme, lastTheme) => {
    document.querySelector('#interface-wrapper').classList.remove(lastTheme);
    document.querySelector('#interface-wrapper').classList.add(newTheme);
  })

    document.querySelector('#gameover-screen__restart-button').addEventListener('click', (e) => {
      // openFullscreen();
      game.activeStage('playfield');
      game.event.emit('reset');
      document.querySelector('#gameover-screen').style.display = 'none';
    });

  game.event.on('gameover', () => {
    game.activeStage('menu');
    document.querySelector('#gameover-screen').style.display = 'block';
  })
}