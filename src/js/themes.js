import { config } from './gameConfig';
import SpriteSheet from '../assets/img/sprite2.png';
import SpriteSheet2 from '../assets/img/sprite3.png';
import SpriteSheetRetro from '../assets/img/sprite_retro.png';

export const themes = {
    digitalLight: {
        className: 'light-theme',
        color: {
            filled: '#333333',
            empty: '#C5C5C5',
        },
        sprite: {
            size: 7,
            scale: 2,
            border: 2,
            type: 'rect',
            spriteSheet: SpriteSheet,
        },
    },
    retro: {
        className: 'retro-theme',
        color: {
            filled: '#C5C5C5',
            empty: '#333333',
        },
        sprite: {
            size: 27,
            scale: .8,
            border: 0,
            type: 'sprite',
            spriteSheet: SpriteSheetRetro,
            colors: {
                ['black']:  27,
                ['T']: 0,
                ['O']: 0,
                ['I']: 0,
                ['S']: 0,
                ['Z']: 0,
                ['L']: 0,
                ['J']: 0,
            }
        },
    },
    digitalRealistic: {
        className: 'light-theme',
        sprite: {
            size: 7,
            scale: 2.3,
            border: 2,
            type: 'sprite',
            spriteSheet: SpriteSheet,
        },
    },
};

export const changeTheme = (name, game) => {
    if(!name) {
        throw new Error('A name is required.');
    }

    const theme = themes[name]

    if(!theme) {
        throw new Error(`Theme ${name} not found.`);
    }

    const lastThemeName = config.theme.className;

    config.theme = theme;
    game.event.emit('theme', theme.className, lastThemeName);
};