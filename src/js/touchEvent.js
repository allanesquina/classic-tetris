import { config } from './gameConfig';
import { changeTheme } from './themes';
import { totalmem } from 'os';

// Touch events by using Hammerjs
export function TouchEvents(gameController, game) {
    var myElement = document.getElementById('playfield-screen');
    var hammertime = new Hammer(myElement, {});

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

    hammertime.on('pandown panleft panright tap swipedown swipeup', function(ev) {
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

        if(ev.type === 'swipeup') {
            game.ui.actions.openPauseMenuScreen();
            // TODO- set pause
            return;
        }

        if(ev.type === 'tap') {
            resetKeys();
            keys[38]=true
        }

        gameController._movePiece(keys, game.getGameEventObject())
    });
}