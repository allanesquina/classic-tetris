import { config } from "./gameConfig";
import { changeTheme } from "./themes";

export default function(game) {
  const appElements = document.querySelectorAll("[data-app]");
  const appScreens = document.querySelectorAll("[data-screen]");

  const SCREENS = new Map();

  const UI_ACTIONS = {
    togglePause: () => {
      console.log("toggle");
    },
    changeTheme: e => {
      const target = e.target;
      changeTheme(target.selectedIndex, game);
    },
    openOptionsMenuScreen: e => {
      router.goTo('options-menu');
    },
    openPauseMenuScreen: e => {
      router.goTo('pause-menu');
    },
    openPlayfieldScreen: e => {
      game.activeStage('playfield');
      game.event.emit('reset');
      router.goTo('playfield');
    },
    openGameoverScreen: e => {
      router.goTo('gameover');
      game.activeStage('menu');
    },
    restartGame: e => {
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
      });
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
    const screen = el.getAttribute("data-screen");
    SCREENS.set(screen, new Screen(el));
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
  }

  goTo(name) {
    const screen = this.screen.get(name);

    if(this.current) {
      this.current.hide();
      this.setHistory(this.current);
    }

    screen.show();
    this.current = screen;
  }

  goBack() {
    const last = this.history.pop();
    this.current.hide();

    if(last) {
      last.show();
      this.current = last;
    }
  }

  setHistory(screen) {
    this.history.push(screen);
  }
}

class Screen {
  constructor(el) {
    this.el = el;
    this.el.classList.add('screen');
  }

  show() {
    this.el.classList.add('screen--visible');
  }

  hide() {
    this.el.classList.remove('screen--visible');
  }
}
