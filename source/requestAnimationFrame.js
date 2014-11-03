// requestAnimationFrame implementation as a custom function to allow blacklisting
// devices with broken implementation. Currently needs timer-based fallbacks for iOS 6.x for
// code running inside <iframe> elements.
// Uses polyfills based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
 
    var blacklisted   = /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent),
        lastTime      = 0,
        nativeRequest = window.requestAnimationFrame || null,
        nativeCancel  = window.cancelAnimationFrame  || null;
 
    ['webkit', 'moz'].forEach(function(prefix) {
        nativeRequest = nativeRequest || window[prefix+'RequestAnimationFrame'] || null;
        nativeCancel  = nativeCancel  || window[prefix+'CancelAnimationFrame']  || window[prefix+'CancelRequestAnimationFrame'] || null;
    });
 
    function polyfillRequest(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 1000);
        lastTime = currTime + timeToCall;
        return id;
    }
 
    function polyfillCancel(id) {
        clearTimeout(id);
    }
 
    this.nextFrame   = (!blacklisted && nativeRequest !== null) ? nativeRequest : polyfillRequest;
    this.cancelFrame = (!blacklisted && nativeCancel  !== null) ? nativeCancel  : polyfillCancel;
 
})();
