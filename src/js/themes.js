import { config } from './gameConfig';
import SpriteSheet from '../assets/img/sprite2.png';
import { last } from 'rxjs/operators';

export const themes = {
    digitalLight: {
        className: 'light-theme',
        color: {
            filled: '#333333',
            empty: '#C5C5C5',
        },
        sprite: {
            size: 7,
            scale: 2.3,
            border: 2,
            type: 'rect',
            spriteSheet: SpriteSheet,
        },
    },
    digitalDark: {
        className: 'theme',
        color: {
            filled: '#C5C5C5',
            empty: '#333333',
        },
        sprite: {
            size: 7,
            scale: 2.3,
            border: 2,
            type: 'rect',
            spriteSheet: SpriteSheet,
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