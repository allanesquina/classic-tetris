export const throttle = (func, limit) => {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
              func.apply(context, args)
              inThrottle = true
          setTimeout(() => inThrottle = false, limit)
            }
      }
  }

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

  // var elem = document.documentElement;

  // /* View in fullscreen */
  // function openFullscreen() {
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.mozRequestFullScreen) { /* Firefox */
  //     elem.mozRequestFullScreen();
  //   } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
  //     elem.webkitRequestFullscreen();
  //   } else if (elem.msRequestFullscreen) { /* IE/Edge */
  //     elem.msRequestFullscreen();
  //   }
  // }