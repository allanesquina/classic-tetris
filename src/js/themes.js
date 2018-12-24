import { config } from './gameConfig';
import SpriteSheet from '../assets/img/sprite2.png';
import SpriteSheet2 from '../assets/img/sprite3.png';
// import SpriteSheetRetro from '../assets/img/sprite_retro.png';
import SpriteSheetRetro from '../assets/img/sprite-test.png';

export const themes = [
    {
        id: 'retro',
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
                ['T']: 54,
                ['O']: 108,
                ['I']: 0,
                ['S']: 54,
                ['Z']: 108,
                ['L']: 54,
                ['J']: 81
            }
        },
    },
    {
        id: 'digital',
        className: 'retro-theme',
        color: {
            filled: '#999',
            empty: '#000',
        },
        sprite: {
            size: 27,
            scale: .8,
            border: 0,
            type: 'rect',
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
];

export const changeTheme = (index, game) => {
    const theme = themes[index]

    if(!theme) {
        throw new Error(`Theme ${index} not found.`);
    }

    const lastThemeName = config.theme.className;

    config.theme = theme;
    console.log(config.theme)
    game.event.emit('theme', theme.className, lastThemeName);
};