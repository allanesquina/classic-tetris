function trhottle(fn, time) {
  var interval;
  return function() {
    if (!interval) {
      interval = setInterval(function() {
        fn();
        clearInterval(interval);
      }, time);
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
