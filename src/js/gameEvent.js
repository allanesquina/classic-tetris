// Game events
export function GameEvents(game) {
    const $next = document.querySelector('#playfield-screen__info_next--value');
    const $score = document.querySelector('#playfield-screen__info_score--value');
    const $level = document.querySelector('#playfield-screen__info_level--value');
    const $lines = document.querySelector('#playfield-screen__info_lines--value');
    var images = new Map();

  game.event.on('nextPiece', (url, type) => {
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

  game.event.on('level', (val) => {
    $level.innerHTML = val;
  })

  game.event.on('line', (val) => {
    $lines.innerHTML = val;
  })

  game.event.on('theme', (newTheme, lastTheme) => {
    document.querySelector('#interface-wrapper').classList.remove(lastTheme);
    document.querySelector('#interface-wrapper').classList.add(newTheme);
  })

  game.event.on('gameover', () => {
    game.ui.actions.openGameoverScreen();
  })
}