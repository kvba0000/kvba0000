/**
 * @description "Windows" properties like main element etc.
 */
let WINDOWS = {
    elem: document.querySelector("#windows"),
    taskbar: document.querySelector('#windows > #taskbar'),
    config: JSON.parse(localStorage.getItem('config') || '{}')
}

/**
 * Checks if string's valid URL
 * @param {string} url url(?) 
 * @returns {boolean}
 */
const isUrl = (url) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(url)

const isChristmasTime = () => new Date().getMonth() === 11 && new Date().getDate() >= 20 && new Date().getDate() <= 30

// Modifying wallpaper and lockscreen for config
if(isChristmasTime()) {
    WINDOWS.elem.style.backgroundImage = `url(/assets/christmas-wallpaper-2.jpg)`
    document.querySelector('#win-login-bg').style.backgroundImage = `url(/assets/christmas-wallpaper-1.jpg)`
} else {
    if(isUrl(WINDOWS.config.desktopWallpaper)) WINDOWS.elem.style.backgroundImage = `url(${WINDOWS.config.desktopWallpaper})`
    if(isUrl(WINDOWS.config.lockscreenWallpaper)) document.querySelector('#win-login-bg').style.backgroundImage = `url(${WINDOWS.config.lockscreenWallpaper})`
}

WINDOWS.setLoadingCursor = (state = false) => document.body.style.cursor = state === true ? 'progress' : 'unset'

/**
 * @description Selection box properties. (the one that allows you select things)
 */
WINDOWS.SELECTIONBOX = {
    elem: document.querySelector('#selectionbox'),
    pos: {x:0,y:0,w:0,h:0}
}

WINDOWS.elem.addEventListener('mousedown', (ev) => {
    if(ev.target === WINDOWS.elem) {
        WINDOWS.SELECTIONBOX.elem.classList.add('selecting')
        WINDOWS.SELECTIONBOX.pos.x = ev.clientX;
        WINDOWS.SELECTIONBOX.pos.y = ev.clientY;
        WINDOWS.SELECTIONBOX.elem.style.height = `unset`
        WINDOWS.SELECTIONBOX.elem.style.width = `unset`
    }
})

window.addEventListener('mousemove', (ev) => {
    if(WINDOWS.SELECTIONBOX.elem.classList.contains('selecting')){
        WINDOWS.SELECTIONBOX.pos.w = ev.clientX - WINDOWS.SELECTIONBOX.pos.x
        WINDOWS.SELECTIONBOX.pos.h = ev.clientY - WINDOWS.SELECTIONBOX.pos.y
        if(WINDOWS.SELECTIONBOX.pos.w < 0){
            WINDOWS.SELECTIONBOX.elem.style.left = `unset`;
            WINDOWS.SELECTIONBOX.elem.style.right = `${window.innerWidth-WINDOWS.SELECTIONBOX.pos.x}px`;
            WINDOWS.SELECTIONBOX.elem.style.width = `${-WINDOWS.SELECTIONBOX.pos.w}px`;
        }else{
            WINDOWS.SELECTIONBOX.elem.style.right = `unset`;
            WINDOWS.SELECTIONBOX.elem.style.left = `${WINDOWS.SELECTIONBOX.pos.x}px`;
            WINDOWS.SELECTIONBOX.elem.style.width = `${WINDOWS.SELECTIONBOX.pos.w}px`;
        }
        if(WINDOWS.SELECTIONBOX.pos.h < 0){
            WINDOWS.SELECTIONBOX.elem.style.top = `unset`;
            WINDOWS.SELECTIONBOX.elem.style.bottom = `${window.innerHeight-WINDOWS.SELECTIONBOX.pos.y}px`;
            WINDOWS.SELECTIONBOX.elem.style.height = `${-WINDOWS.SELECTIONBOX.pos.h}px`;
        }else{
            WINDOWS.SELECTIONBOX.elem.style.bottom = `unset`;
            WINDOWS.SELECTIONBOX.elem.style.top = `${WINDOWS.SELECTIONBOX.pos.y}px`;
            WINDOWS.SELECTIONBOX.elem.style.height = `${WINDOWS.SELECTIONBOX.pos.h}px`;
        }
    }
})

window.addEventListener('mouseup', () => {
    if(WINDOWS.SELECTIONBOX.elem.classList.contains('selecting')) {
        WINDOWS.SELECTIONBOX.elem.classList.remove('selecting')
    }
})

/**
 * @description Start menu properties. The one at the start... that acts like menu....
 */
WINDOWS.STARTMENU = {
    elem: document.querySelector("#startmenu"),
    button_elem: document.querySelector("#taskbar > svg#taskbar-win")
}

WINDOWS.STARTMENU.toggle = () => {
    WINDOWS.STARTMENU.button_elem.classList.toggle('clicked')
    WINDOWS.STARTMENU.elem.classList.toggle('shown')
    if(WINDOWS.STARTMENU.elem.classList.contains('shown')) WINDOWS.STARTMENU.elem.focus()
}
WINDOWS.STARTMENU.button_elem.addEventListener('click', WINDOWS.STARTMENU.toggle)

WINDOWS.elem.addEventListener('click', ({target}) => {
    if(WINDOWS.STARTMENU.elem.classList.contains('shown') && !WINDOWS.STARTMENU.button_elem.contains(target) && !WINDOWS.STARTMENU.elem.contains(target)) WINDOWS.STARTMENU.toggle();
})
window.addEventListener('keydown', (ev) => {
    if(WINDOWS.STARTMENU.elem.classList.contains('shown') && ev.code === 'Escape') WINDOWS.STARTMENU.toggle() // ESC closing start menu
})


/**
 * @description Clock functionality. That thing with numbers in corner.
 */
WINDOWS.CLOCK = {
    elem: document.querySelector("div#taskbar-rightside > span#clock"),
    started2137Secret: false,
    finished2137Secret: false
}

WINDOWS.CLOCK.handler2137Secret = () => {
    const audio = new Audio('assets/its_poping_time.mp3')
    audio.addEventListener('loadeddata', (ev) => {
        audio.play();
        const fade_elem = document.querySelector('#loadscreen')
        fade_elem.removeAttribute('hidden')
        
        let papamobil = document.createElement('img')
        papamobil.src = 'assets/its_poping_time.gif'
        papamobil.classList.add('ppe')

        setTimeout(() => {
            fade_elem.setAttribute('hidden', true)
            WINDOWS.elem.appendChild(papamobil)
            document.body.classList.add('pope')
        }, 1600);

        audio.addEventListener('ended', () => WINDOWS.CLOCK.finished2137Secret = true, {once: true})
    }, {once: true})
}


WINDOWS.CLOCK.tick = () => {
    const now = new Date(), hours = now.getHours(), minutes = now.getMinutes();

    if(hours === 21 && minutes === 37 && interactedWithWebsite && introFinished && !WINDOWS.CLOCK.finished2137Secret){
        if(!WINDOWS.CLOCK.started2137Secret){
            WINDOWS.CLOCK.started2137Secret = true;
            WINDOWS.CLOCK.handler2137Secret();
        }
    }else {
        if(WINDOWS.CLOCK.started2137Secret){
            document.body.classList.remove('pope')
            document.querySelector('.ppe').remove();
        }
        WINDOWS.CLOCK.started2137Secret = false;
    }

    const time = `${hours}:${minutes.toString().padStart(2, "0")}`
    WINDOWS.CLOCK.elem.textContent = time;
}

setInterval(WINDOWS.CLOCK.tick, 5000);
WINDOWS.CLOCK.tick();