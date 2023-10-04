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
