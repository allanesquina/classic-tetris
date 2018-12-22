import './vendor/hammer.min';
import app from './app';

// App bootstrap
window.onload = function() {
    setTimeout(() => {
        app();
    }, 500);
}




