import SpriteSheet from '../assets/img/sprite3.png';
import { themes } from './themes';

export const config = {
    canvas: () => ({
        height: ((config.matrix.height-2) * ((config.theme.sprite.size * config.theme.sprite.scale) + config.theme.sprite.border)) + config.theme.sprite.border,
        width: (config.matrix.width  * ((config.theme.sprite.size * config.theme.sprite.scale) + config.theme.sprite.border)) + config.theme.sprite.border
    }),
    matrix: {
        width: 10,
        height: 24,
    },
    matrixNext: {
        width: 6,
        height: 6,
    },
    initialState: {
        score: `0`, 
        lines: `0`, 
        level: `1`, 
        matrix: [],
        control: { down: false },
    },
    render: {
        fps: 50,
    },
    skipLevelAt: 10,
    theme: themes['digitalLight']
};