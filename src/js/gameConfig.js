export const config = {
    canvas: {
        width: 175,
        height: 380,
    },
    sprite: {
        size: 7,
        scale: 2.3,
        border: 1,
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
        fps: 5,
    },
    skipLevelAt: 10,

};