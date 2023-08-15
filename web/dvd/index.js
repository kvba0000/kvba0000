const spawnCountElem = document.querySelector('p#logo-spawned-count span')
const spawningWarning = document.querySelector('#spawn-warning')
const openCreditsBtn = document.querySelector("#openContribBox"), closeCreditsBtn = document.querySelector("#closeContribBox"), contribBox = document.querySelector('div.contribBox')

const isOnMobile = /Android|iPhone/i.test(navigator.userAgent)

const CTX_MENUS = {
    DEFAULT: [
        ["By kb", null],
        ["Show native context menu.", () => {
            alert("To show native context menu please right click on this button.")
            return false;
        }, true]
    ],
    MAIN: [
        ["By kb", null],
        [null, null],
        ["Set update speed", () => {
            const p = () => {
                let msg = prompt("Updating speed (1 tick every X ms?):")
                if(!msg) return false;
                if(!/^[0-9]+$/.test(msg)) {
                    alert("Invalid number")
                    p();
                }
                localStorage.setItem('SETTINGS.FREQ', msg)
                alert(`Updated to ${msg}!`)
                location.reload();
                return true;
            }
            return p();
        }],
        ["Set jumper value", () => {
            const p = () => {
                let msg = prompt("Jumper value (by how many windows will move every tick?):")
                if(!msg) return false;
                if(!/^[0-9]+$/.test(msg)) {
                    alert("Invalid number")
                    p();
                }
                localStorage.setItem('SETTINGS.JUMPER', msg)
                alert(`Updated to ${msg}!`)
                location.reload();
                return true;
            }
            return p();
        }]
    ]
}

const doUpdateCounter = () => {
    spawnCountElem.innerHTML = popups.length
    if(popups.length >= 3) spawningWarning.removeAttribute('hidden'); else spawningWarning.setAttribute('hidden', true) 
},
doSpawnLogo = () => {
    if(isOnMobile) return alert("This website doesn't work on mobile! (or at least for now :>)")
    spawnLogo();
    doUpdateCounter();
},
doClearLogos = () => {
    clearLogos();
    setTimeout(() => {
        doUpdateCounter();
    }, 100);
}

document.querySelector('div.btn-list button#spawn-btn').addEventListener("click", doSpawnLogo)
document.querySelector('div.btn-list button#clear-btn').addEventListener("click", doClearLogos)

const pageAccessedByReload = (
    (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload')
  );

// Animate website reload
if(pageAccessedByReload){
    document.body.animate([
        {transform: "rotateY(0deg)"},
        {transform: "rotateY(180deg)", filter: "invert()"},
        {transform: "rotateY(360deg)"}
    ], {
        duration: 800,
        composite: "replace"
    })
}

const ctxElement = class {
    el;
    executor;
    constructor(text, executor, allowNativeCTX = false) {
        if(!text){
            this.el = document.createElement('hr');
            return this;
        }
        let e = document.createElement('div');
        e.classList.add("ctxMenu-btn")
        e.innerText = text;

        if(allowNativeCTX) e.classList.add('ctxMenu-btn-allowNative')
        if(!executor) e.classList.add("ctxMenu-btn-disabled")
        else {
            this.executor = executor;
            e.addEventListener('click', () => {
                let r = this.executor();
                if(r) CTX_MENU_EL.style.display = 'none';
            })
        }
        this.el = e;
    }
    getBtn() {
        return this.el;
    }
}

/** @type {HTMLDivElement} */
const CTX_MENU_EL = document.querySelector('div.ctxMenu')
let isCTXMenuShown = false;

/**
 * 
 * @param {MouseEvent} ev 
 * @returns {boolean} Should prevent default CTX menu
 */
const showCtxMenu = (ev) => {
    CTX_MENU_EL.style.top = `${ev.clientY}px`;
    CTX_MENU_EL.style.left = `${ev.clientX}px`;
    let ctx;
    switch(ev.target) {
        default: ctx = CTX_MENUS.DEFAULT; break;
        case document.body: ctx = CTX_MENUS.MAIN; break;
    }

    [...CTX_MENU_EL.children].forEach(el => el.remove());
    for(let option of ctx) {
        let el = new ctxElement(...option);
        CTX_MENU_EL.appendChild(el.getBtn());
    }

    CTX_MENU_EL.style.display = 'unset'
    isCTXMenuShown = true;
    CTX_MENU_EL.animate([
        {opacity: "0%"},
        {opacity: "100%"}
    ], {duration: 200, composite: "replace"})
    return true;
}

const hideCTXMenu = () => {
    CTX_MENU_EL.style.display = 'none'
    isCTXMenuShown = false
}

// Context Menu
window.addEventListener('contextmenu', (ev) => {
    if(ev.target.classList.contains("ctxMenu-btn-allowNative")) return true;
    if(CTX_MENU_EL.contains(ev.target)) return ev.preventDefault();

    let result = showCtxMenu(ev);
    if(result == true) ev.preventDefault();
})
window.addEventListener('click', (ev) => {
    if(!CTX_MENU_EL.contains(ev.target) && isCTXMenuShown) hideCTXMenu()
})
window.addEventListener('keydown', (ev) => {
    if(ev.key === "Escape" && isCTXMenuShown) hideCTXMenu()
})


// Credits
openCreditsBtn.addEventListener('click', () => {
    contribBox.style.display = 'unset';
    contribBox.animate([
        {left: "-100%"},
        {left: "0"}
    ], {
        duration: 500,
        composite: "replace",
        fill: "forwards",
        easing: "ease-in-out"
    })
})
closeCreditsBtn.addEventListener('click', () => {
    contribBox.animate([
        {left: "0"},
        {left: "-100%"}
    ], {
        duration: 500,
        composite: "replace",
        fill: "forwards",
        easing: "ease-in-out"
    }).addEventListener('finish', () =>     contribBox.style.display = 'unset', {once: true})
})

// Mobile warning
window.addEventListener('load', () => {
    if(isOnMobile) {
        spawningWarning.querySelector(".spawn-warning-msg").innerText = "This website WON'T work on mobile!";
        spawningWarning.removeAttribute('hidden')
    }
})