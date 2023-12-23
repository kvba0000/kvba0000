const sendMessage = (event, data) => window.parent.postMessage({iframeId: window.name, event, data})
const awaitForMessage = async (event, data) => new Promise(r => {
    const handler = (ev) => {
        r(ev.data)
        window.removeEventListener('message', handler)
    }
    window.addEventListener('message', handler)
    sendMessage(event, data)
})

setTimeout(() => {
    const splashElem = document.querySelector("#splash"), cogIconElem = splashElem.querySelector('img')
    const animation = splashElem.animate([
        {opacity: "100%"},
        {opacity: "0%"}
    ], {duration: 200, fill: "forwards"});
    cogIconElem.animate([
        {transform: "translate(-50%, -50%) scale(1.0)"},
        {transform: "translate(-50%, -50%) scale(0.9)"}
    ], {duration: 200, fill: "forwards"})
    animation.addEventListener('finish', () => splashElem.remove(), {once: true})
}, 1000);


document.querySelector('#save').addEventListener('click', () => {
    let config = [...document.querySelectorAll('*[name^="set-"]')].reduce((a, v) => ({ ...a, [v.getAttribute('name').split('set-')[1]]: v.value}), {}) 
    sendMessage('saveSettings', config)
})

window.addEventListener('message', ({data}) => {
    switch(data.event){
        case "loadSettings": {
            let elems = [...document.querySelectorAll('*[name^="set-"]')]
            for(let set of Object.entries(data.data)){
                let elem = elems.find(e => e.getAttribute('name') === `set-${set[0]}`)
                if(!elem) continue;
                elem.value = set[1]
            }
            break;
        }
    }
})
sendMessage('loadSettings')

const isChristmasTime = new Date().getMonth() === 11 && new Date().getDate() >= 20 && new Date().getDate() <= 30

// Event settings disabling
if(
    isChristmasTime
) {
    if(isChristmasTime) {
        [...document.querySelectorAll('#wallpaper > *[name^="set-"]')].forEach(e => e.disabled = true)
        document.querySelector('#christmas').removeAttribute('hidden')
    }
    
    const errElem = document.querySelector('span#error')
    errElem.textContent = 'During special events, some settings are disabled to prevent unwanted behavior. (some might be also visible now :P)';
    errElem.removeAttribute('hidden')
}
