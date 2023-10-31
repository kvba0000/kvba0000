let WINDOWMANAGER = {
    nextWindowPos: {x: 100, y: 100},
    windowTemplate: document.querySelector("template#win-windowtemplate"),
}

WINDOWMANAGER.generateWindowIframe = (url) => {
    const e = document.createElement('iframe');
    e.setAttribute('frameborder', '0')
    e.src = url;
    return e;
}


Object.defineProperty(WINDOWMANAGER, 'defaultContent', {
    get() {
        const element = document.createElement('iframe')
        element.src = "https://www.youtube-nocookie.com/embed/xkIICPm9nag?controls=0&cc_load_policy=0&fs=0&disablekb=1&iv_load_policy=3&autoplay=1&rel=0&modestbranding=0"
        element.setAttribute('frameborder', 0)
        return element
    }
})

const WindowClass = class {
    content;
    title;
    scrollable;
    id = getRandomString(8);
    window;
    position = {x: 0, y: 0};

    constructor(content = WINDOWMANAGER.defaultContent, title = "kobb.tech", scrollable = false, autoSpawning = true){
        if(typeof content === "string") {
            this.content = WINDOWMANAGER.generateWindowIframe(content);
            this.content.name = this.id;
        }
        else if(content instanceof Node) this.content = content;
        else if(content === null){}
        else throw new Error("Invalid window content. It must be a iframe url or document element")
        this.title = title;
        this.scrollable = scrollable;

        let clone = document.importNode(WINDOWMANAGER.windowTemplate.content, true);
        this.window = clone.querySelector('.win-window');

        this.setTitle(title);
        this.setEvents();
        if(this.content instanceof HTMLIFrameElement){
            this.window.setAttribute('hidden', true)
            WINDOWS.setLoadingCursor(true)
            this.content.addEventListener('load', () => {
                WINDOWS.setLoadingCursor(false)
                this.window.removeAttribute('hidden')
            }, {once: true})
        }

        const contentElem = this.window.querySelector(`.win-window-content`)
        if(scrollable) contentElem.style.overflow = 'scroll'
        if(content !== null) contentElem.appendChild(this.content)

        this.window.style.left = `${WINDOWMANAGER.nextWindowPos.x = (WINDOWMANAGER.nextWindowPos.x + 50) % Math.min(400, screen.availWidth)}px`
        this.window.style.top = `${WINDOWMANAGER.nextWindowPos.y = (WINDOWMANAGER.nextWindowPos.y + 50) % Math.min(400, screen.availHeight)}px`
        
        if(autoSpawning) this.spawn();
    }

    setTitle(title) {
        this.window.querySelector(`.win-window-titlebar-title`).textContent = title
    }

    setEvents() {
        // movement functionality
        const titlebar = this.window.querySelector(`.win-window-titlebar`);
        titlebar.addEventListener('pointerdown', (ev) => {
            this.window.classList.add('moving-window')
            
            const rect = ev.target.getBoundingClientRect();
            this.position = {
                x: ev.clientX - rect.left,
                y: ev.clientY - rect.top
            }

            titlebar.setPointerCapture(ev.pointerId)
        })
        window.addEventListener('mousemove', (ev) => {
            if(this.window.classList.contains('moving-window')){
                this.window.style.left = ev.clientX - this.position.x
                this.window.style.top = ev.clientY - this.position.y
            }
        })

        // closing functionality
        this.window.querySelector(".win-window-titlebar-exit").addEventListener('mousedown', () => {
            this.window.animate([
                {"opacity": "100%", "transform": "scale(1.0)"},
                {"opacity": "0%", "transform": "scale(0.8)"}
            ], 100).addEventListener('finish', () => this.window.remove(), {once: true})
        })

        // maximizing functionality
        this.window.querySelector(".win-window-titlebar-max").addEventListener('mousedown', () => this.window.classList.toggle('maximized'))
        
        // messages
        this.setMessageHandler();
    }

    onMessage(data) {}

    sendMessage(event, data) {
        this.content.contentWindow.postMessage({event, data})
    }

    setMessageHandler() {
        window.addEventListener('message', (ev) => {
            if(typeof ev.data !== "object") return;
            if(ev.data.iframeId !== this.id) return;
            this.onMessage(ev.data);
        })
    }

    spawn(){
        WINDOWS.elem.appendChild(this.window);
    }
}

const NotepadWindowClass = class extends WindowClass {
    constructor(text = "", fileName = "Untitled") {
        super(null, `${fileName} - Notepad`, true, true)

        const c = this.window.querySelector(`.win-window-content`);
        
        c.style.whiteSpace = 'break-spaces'
        c.innerHTML = text;
    }
}

const SettingsWindowClass = class extends WindowClass {
    constructor(){
        super("assets/window_contents/win_settings.html", "Settings")
    }

    onMessage(data){
        switch(data.event) {
            case "saveSettings": {
                const config = data.data;
                localStorage.setItem('config', JSON.stringify(config))
                alert('Saved!');
                location.reload();
                break;
            }
            case "loadSettings": {
                const config = WINDOWS.config;
                this.sendMessage('loadSettings', config)
                break;
            }
        }
    }
}


window.addEventListener('pointerup', ev => {
    document.querySelectorAll('.win-window.moving-window').forEach(el => {
        const titlebar = el.querySelector('.win-window-titlebar');

        const windowPos = el.getBoundingClientRect();
        const titlebarPos = titlebar.getBoundingClientRect();
        const taskbarPos = WINDOWS.taskbar.getBoundingClientRect();
        
        el.classList.remove('moving-window')
        titlebar.releasePointerCapture(ev.pointerId)

        const underTaskbarDist = windowPos.top - taskbarPos.top

        const checks = [
            [titlebarPos.bottom <= 0, () => el.style.top = 0], // titlebar above the page 
            [underTaskbarDist >= 0, () => el.style.top = taskbarPos.top - titlebar.clientHeight], // titlebar below the taskbar
            [titlebarPos.right <= 0, () => el.style.left = 0], // titlebar outside the page - left
            [titlebarPos.left >= document.documentElement.clientWidth, () => el.style.left = document.documentElement.clientWidth - titlebar.clientWidth] // titlebar outside the page - right
        ]
        checks.forEach(check => {
            if(check[0]) check[1]()
        })
    })
})