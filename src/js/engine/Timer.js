export default class Timer {
    constructor(deltaTime = 1/60) {
        this.deltaTime = deltaTime;
        this.lastTime = 0;
        this.currentTime = 0;
        this.accumulatedTime = 0;
        this.updateProxy = this.updateProxy.bind(this);
    }

    updateProxy(time) {
        this.accumulatedTime += (time - this.lastTime) / 1000;
        this.currentTime = time;

        while(this.accumulatedTime > this.deltaTime) {
            this.update(time);
            this.accumulatedTime -= this.deltaTime;
        }

        this.lastTime = time;
        this.cicle();
    }

    setUpdateFunction(fn) {
        this.update = fn;
    }

    cicle() {
        // setTimeout(this.updateProxy, 1000/1, performance.now())
        requestAnimationFrame(this.updateProxy);
    }

    start() {
        this.cicle();
    }
}