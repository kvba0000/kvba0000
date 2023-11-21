const STARTMENUMANAGER = {

}

STARTMENUMANAGER.links = {}
STARTMENUMANAGER.links.build = (link, params = {}) => `${link}?${Object.entries(params).map(p=>`${p[0]}=${encodeURIComponent(p[1])}`).join("&")}`

STARTMENUMANAGER.list = [
    ["kb", () => {alert(Math.random()>0.01 ? "by kb with <3" : [
        "It's always good to feel loved, but it's not always lovely to feel good.",
        "Sometimes, you have to just stop... and think about everything you do in your life...",
        "Maybe it is something you like for example reading a good book, or playing a favorite video game...",
        "But sometimes it can be something as destroying as ignoring problems.",
        "I've been ignoring them since I remember and It's pretty much destroying.",
        "",
        "If you're the one that has a luck to get this message without looking to code. Congrats. You found my real reason why I'm always online...",
        "Problems are near us all the time... but you cannot just pretend all the time like they are not here.",
        "",
        "~ kb 2023"
    ].join("\n")); return true}],
    null,
    ["Share on Twitter!", () => window.open(STARTMENUMANAGER.links.build("https://twitter.com/intent/tweet", {
        url: "https://kuba.lol",
        text: `By the way! Have you heard about kuba.lol? It's so cool! Check it out! :D`
    }), "_blank")],
    ["Support me on Ko-fi!", () => window.open('https://ko-fi.com/kbvivi', '_blank')],
    ["This PC", /*"assets/window_contents/win_thisPC.html"*/'/'],
    null,
    ["Settings", () => {new SettingsWindowClass(); return true}]
]

STARTMENUMANAGER.elems = {
    main: document.querySelector("#startmenu"),
    get leftpane(){return this.main.querySelector('#startmenu-leftpane')},
    get rightpane(){return this.main.querySelector("#startmenu-rightpane")}
}

STARTMENUMANAGER.update = () => {
    STARTMENUMANAGER.elems.rightpane.querySelectorAll('.startmenu-rightpane-elem').forEach(e => e.remove())
    for(let button of STARTMENUMANAGER.list){
        if(button === null) {
            let elem = document.createElement('hr');
            elem.classList.add('startmenu-rightpane-elem')
            STARTMENUMANAGER.elems.rightpane.appendChild(elem)
            continue;
        }
        let [value, handler] = button;
        let elem = document.createElement('button')
        elem.classList.add('startmenu-rightpane-elem')
        elem.innerText = value
        elem.addEventListener('click', 
            typeof handler === 'string' ?
                (ev) => {new WindowClass(handler, value); WINDOWS.STARTMENU.toggle();} : 
            typeof handler === 'function' ?
                async (ev) => {
                    if(await handler(ev, value) === true) WINDOWS.STARTMENU.toggle();
                } :
            () => {throw new Error("unsupported button handler")}
        )
        STARTMENUMANAGER.elems.rightpane.appendChild(elem)
    }
}


STARTMENUMANAGER.update();
