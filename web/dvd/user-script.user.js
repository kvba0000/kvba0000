// ==UserScript==
// @name         DVD Screensaver - Helper Script
// @namespace    tech.kb.dvd1
// @version      0.1
// @description  Helper Script for kobb.tech/dvd
// @author       kb
// @match        https://kobb.tech/dvd/dvd.html
// @icon         https://kobb.tech/dvd/favicon.ico
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.USERSCRIPT_LOADED = true;

    const moveWindow = (x,y) => {
        if(typeof navigator.brave === 'undefined') window.moveTo(x,y)
        else { // fix for brave - f*ck you brave <3
            window.moveBy(-999999,-999999)
            window.moveBy(x,y)
        }
    }

    unsafeWindow.startMoving = (windowData) => {
        setInterval(() => {
            if(windowData.xx) windowData.pos.x += windowData.JUMPER;
            else windowData.pos.x -= windowData.JUMPER;
        
            if(windowData.yy) windowData.pos.y += windowData.JUMPER;
            else windowData.pos.y -= windowData.JUMPER;
        
            if(windowData.pos.x < 0+5 || windowData.pos.x > windowData.screenSize.w - windowData.size.w) {windowData.xx = !windowData.xx; hitWall()}
            if(windowData.pos.y < 0+5 || windowData.pos.y > windowData.screenSize.h - windowData.size.h - windowData.DEAD_ZONE) {windowData.yy = !windowData.yy; hitWall()}
        
            moveWindow(windowData.pos.x, windowData.pos.y)
            window.resizeTo(windowData.size.w, windowData.size.h)
        }, windowData.FREQ);
    }

})();