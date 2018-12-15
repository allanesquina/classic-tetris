export const config = {
    canvas: () => ({
        height: ((config.matrix.height-2) * ((config.sprite.size * config.sprite.scale) + config.sprite.border)) + config.sprite.border,
        width: (config.matrix.width  * ((config.sprite.size * config.sprite.scale) + config.sprite.border)) + config.sprite.border
    }),
    sprite: {
        size: 7,
        scale: 2.3,
        border: 2,
        type: 'sprite',
    },
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
        fps: 60,
    },
    skipLevelAt: 10,

};