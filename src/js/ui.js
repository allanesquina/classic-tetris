import { config } from "./gameConfig";
import { changeTheme } from "./themes";

export default function(game) {
  const appElements = document.querySelectorAll("[data-app]");
  const appScreens = document.querySelectorAll("[data-screen]");

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
  };

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
    }
  };

  // Event Delegation
  ["touch", "click"].forEach(eventType => {
    document.addEventListener(eventType, e => {
      e.stopImmediatePropagation();
      const el = e.target;
      const action = el.getAttribute("data-action");
      UI_ACTIONS[action] && UI_ACTIONS[action](e);
    });
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
    }, 0);
  }

  hide() {
    this.el.classList.remove('screen--visible');
  }
}
