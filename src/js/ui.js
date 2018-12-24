import { config } from "./gameConfig";
import { changeTheme } from "./themes";
// ---> svg
import arrowSvg from '../assets/img/arrow.svg';
import rotateSvg from '../assets/img/rotate.svg';
import pushSvg from '../assets/img/push.svg';

const SVG = new Map();
SVG.set('arrow', arrowSvg);
SVG.set('rotate', rotateSvg);
SVG.set('push', pushSvg);

// ---<svg


export default function(game, gameController) {
  const appElements = document.querySelectorAll("[data-app]");
  const appScreens = document.querySelectorAll("[data-screen]");

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

  const SCREENS = new Map();

  const UI_ACTIONS = {
    changeTheme: e => {
      const target = e.target;
      changeTheme(target.selectedIndex, game);
    },
    openOptionsMenuScreen: e => {
      router.goTo('options-menu');
    },
    openPauseMenuScreen: e => {
      game.event.emit('musicState', false);
      game.setState({ gamePaused: true });
      router.goTo('pause-menu');
    },
    closePauseMenuScreen: e => {
      game.event.emit('musicState', true);
      game.setState({ gamePaused: false });
      router.goBack();
    },
    openGameoverScreen: e => {
      router.goTo('gameover');
      game.activeStage('menu');
      game.event.emit('musicState', false);
    },
    openStartMenuScreen: e => {
      router.goTo('start-menu');
      game.activeStage('menu');
      game.event.emit('musicState', false);
    },
    startGame: e => {
      game.activeStage('playfield');
      game.event.emit('reset');
      router.goTo('playfield');
    },
    goBack: e => {
      router.goBack();
    },
    userControlTouch: (e, el) => {
      const key = el.getAttribute('data-key');
      if(e.type === 'click') {
        resetKeys();
        const keys = {};
        keys[key]=true;
        gameController._movePiece(keys, game.getGameEventObject())
      } else if(e.type === 'press') {
        game.pressedKeys[key] = true;
        game.pressedKeys.isPressed = true;
      } else {
        game.pressedKeys[key] = false;
        game.pressedKeys.isPressed = false;
      }
    },
  };

    // buttons.forEach((button) => {
    //     var hammertimebtn = new Hammer(button, {});

    //     hammertimebtn.on('press', function(e) {
    //     resetKeys();
    //     var key = e.target.getAttribute('data-key');
    //     game.pressedKeys[key] = e;
    //     game.pressedKeys.isPressed = true;
    //     });

    //     hammertimebtn.on('pressup', function(e) {
    //     resetKeys();
    //     var key = e.target.getAttribute('data-key');
    //     game.pressedKeys[key] = false;
    //     game.pressedKeys.isPressed = false;
    //     });

    //     button.addEventListener('click', (e) => {
    //     resetKeys();
    //     var keys = {};
    //     var key = e.target.getAttribute('data-key');
    //     keys[key]=true;
    //     gameController._movePiece(keys, game.getGameEventObject())
    //     });
        

  const APPLICATION_TYPES = {
    ["option:check"]: (el, name) => {
      // Sync values from state
      el.checked = config[name];

      el.addEventListener("change", e => {
        const target = e.target;
        const value = target.checked;
        config[name] = value;
        game.event.emit('options:update');
      });
    },
    ["option:select"]: (el, name) => {
      // Sync values from state
      const id = config[name].id;
      const selectedOption = el.options[id].index;
      const action = el.getAttribute("data-select-action");

      el.selectedIndex = selectedOption;

      el.addEventListener("change", e => {
        UI_ACTIONS[action] && UI_ACTIONS[action](e);
        game.event.emit('options:update');
      });
    },
    ["text"]: (el, name) => {
      // Sync values from state
      el.innerHTML = game.state[name] || '';

      game.event.on('updateState', (value) => {
        el.innerHTML = value[name];
      })
    },
    ["icon"]: (el, name) => {
      el.innerHTML = SVG.get(name);

      // game.event.on('updateState', (value) => {
      //   el.innerHTML = value[name];
      // })
    }
  };

  // Event Delegation
  ["click"].forEach(eventType => {
    document.addEventListener(eventType, e => {
      e.stopImmediatePropagation();
      const el = e.target;
      const action = el.getAttribute("data-action");
      UI_ACTIONS[action] && UI_ACTIONS[action](e, el);
    });
  });

  var touchDelegation = new Hammer(document, {});

  touchDelegation.on('press pressup', function(e) {
    e.preventDefault();
    const el = e.target;
    const action = el.getAttribute("data-action");
    UI_ACTIONS[action] && UI_ACTIONS[action](e, el);

  // resetKeys();
  // var key = e.target.getAttribute('data-key');
  // game.pressedKeys[key] = e;
  // game.pressedKeys.isPressed = true;
  });


  appElements.forEach(el => {
    const appType = el.getAttribute("data-app");
    const name = el.getAttribute("name");
    APPLICATION_TYPES[appType] && APPLICATION_TYPES[appType](el, name);
  });

  appScreens.forEach(el => {
    const screenName = el.getAttribute("data-screen");
    SCREENS.set(screenName, new Screen(screenName, el));
  });

  const router = new Router(SCREENS);

  game.ui = {
    screen: SCREENS, 
    actions: UI_ACTIONS,
    router: router,
  }
}

class Router {
  constructor(screenList) {
    this.screen = screenList;
    this.history = [];
    this.browserHistory = window.history;
    this.bindEvent();
  }

  bindEvent() {
    window.onpopstate = (event) => {
      this.closeAllScreen();
      this.history[event.state.name].show();
    };
  }

  closeAllScreen() {
    this.screen.forEach((s) => {
      s.hide();
    })
  }

  goTo(name) {
    const screen = this.screen.get(name);

    this.closeAllScreen();

    this.setHistory(screen);
    screen.show();
  }

  goBack() {
    this.browserHistory.back();
  }

  setHistory(screen) {
    this.history[screen.name] = screen;
    this.browserHistory.pushState({name: screen.name}, screen.name);
  }
}

class Screen {
  constructor(name, el) {
    console.log(el)
    this.el = el;
    this.el.classList.add('screen');
    this.el.classList.remove('hide');
    this.name = name;
  }

  show() {
    setTimeout(() => {
      this.el.classList.add('screen--visible');
    }, 300);
  }

  hide() {
    setTimeout(() => {
      this.el.classList.remove('screen--visible');
    }, 300);
  }
}
