// Touch events by using Hammerjs
export function TouchEvents(gameController, game) {
    var myElement = document.getElementById('canvas-wrapper');
    var hammertime = new Hammer(myElement, {});
    var buttons = document.querySelectorAll('.button');

    hammertime.get('swipe')
    .set({ 
        direction: Hammer.DIRECTION_VERTICAL, 
        threshold: 5,
        velocity: 0.2
    });

    hammertime.get('pan')
    .set({ 
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
            resetKeys();
            keys[38]=true
        }

        gameController._movePiece(keys, game.getGameEventObject())
    });

    buttons.forEach((button) => {
        var hammertimebtn = new Hammer(button, {});

        hammertimebtn.on('press', function(e) {
        resetKeys();
        var key = e.target.getAttribute('data-key');
        game.pressedKeys[key] = e;
        game.pressedKeys.isPressed = true;
        });

        hammertimebtn.on('pressup', function(e) {
        resetKeys();
        var key = e.target.getAttribute('data-key');
        game.pressedKeys[key] = false;
        game.pressedKeys.isPressed = false;
        });

        button.addEventListener('click', (e) => {
        resetKeys();
        var keys = {};
        var key = e.target.getAttribute('data-key');
        keys[key]=true;
        gameController._movePiece(keys, game.getGameEventObject())
        });
        
    })

    document.querySelector('.start-button').addEventListener('click', (e) => {
        // openFullscreen();
        game.activeStage('playfield');
        document.querySelector('.menu').style.display = 'none';
    });

    function resetKeys() {
        game.pressedKeys[74] = false;
        game.pressedKeys[72] = false;
        game.pressedKeys[75] = false;
        game.pressedKeys[76] = false;
        game.pressedKeys[39] = false;
        game.pressedKeys[37] = false;
        game.pressedKeys[40] = false;
        game.pressedKeys[38] = false;
        game.pressedKeys[32] = false;
        game.pressedKeys.isPressed = false;
    }
}