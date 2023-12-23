let ICONSMANAGER = {
    elem: document.querySelector('#win-icons'),
    template: document.querySelector('template#win-icontemplate')
}

ICONSMANAGER.links = {}
ICONSMANAGER.links.social = (type, params = {}) => `assets/window_contents/win_social.html?${Object.entries(Object.assign({},{t:type},params)).map(e=>`${e[0]}=${encodeURIComponent(e[1])}`).join("&")}`
ICONSMANAGER.links.icon = (name, type = ".svg") => `assets/icons/${name}.${type}`

// firefox specific - firefox can't automatically calculate width of parent element so we have to do it manually
ICONSMANAGER.firefox_resize = () => ICONSMANAGER.elem.style.width = `${ICONSMANAGER.elem.lastChild.getBoundingClientRect().right - ICONSMANAGER.elem.getBoundingClientRect().left}px`

ICONSMANAGER.list = [
    ["licenses.txt", null, showLicences],
    ["GitHub", ICONSMANAGER.links.icon('github-white', 'svg'), ICONSMANAGER.links.social("github")],
    ["YouTube", ICONSMANAGER.links.icon('youtube_red_64px', 'png'), ICONSMANAGER.links.social("youtube")],
    ["Mastodon", ICONSMANAGER.links.icon('mastodon-purple', 'svg'), ICONSMANAGER.links.social("mastodon")],
    ["OneShot", ICONSMANAGER.links.icon('oneshot', 'png'), SECRETS.ONESHOT.iconTrigger],
    ["Omori", ICONSMANAGER.links.icon('omori', 'png'), SECRETS.OMORI.iconTrigger],
    ["Undertale", ICONSMANAGER.links.icon('undertale', 'png'), SECRETS.UNDERTALE.iconTrigger],
    ["DVD Screensaver", ICONSMANAGER.links.icon('DVD_logo_white', 'svg'), "/dvd"]
]   

ICONSMANAGER.update = () => {
    ICONSMANAGER.elem.querySelectorAll('.win-icon').forEach(el => el.remove());

    for(let [title, icon_url, handler] of ICONSMANAGER.list){
        let clone = document.importNode(ICONSMANAGER.template.content, true)

        if(title) clone.querySelector('span.win-icon-name').textContent = title
        
        let icon = ICONSMANAGER.links.icon('file', 'svg')
        if(icon_url) icon = icon_url
        else switch(title.split(".").pop()){
            case "txt": icon = ICONSMANAGER.links.icon('notepad', 'svg'); break;
        }

        clone.querySelector('img.win-icon-icon').src = icon
        clone.querySelector('div.win-icon').setAttribute('data-name', title)
        
        const iconElement = clone.querySelector('.win-icon')

        iconElement.addEventListener('dblclick', (ev) => typeof handler === "function" ? handler(ev, iconElement) : new WindowClass(handler, title))
        
        ICONSMANAGER.elem.appendChild(iconElement)
    }
    
    window.addEventListener('mousedown', (ev) => {
        document.querySelectorAll('.win-icon.selected').forEach(el => el.classList.remove('selected'))
        if(ev.target.classList.contains('win-icon')) ev.target.classList.add('selected')
    })

    window.addEventListener('mousemove', (ev) => {
        if(WINDOWS.SELECTIONBOX.elem.classList.contains('selecting')) {
            const icons = document.querySelectorAll('div.win-icon')
            for(let icon of icons){
                const targetBox = icon.getBoundingClientRect();
                const targetPos = {
                    left: targetBox.left,
                    right: targetBox.right,
                    top: targetBox.top,
                    bottom: targetBox.bottom
                }
                const box = WINDOWS.SELECTIONBOX.elem.getBoundingClientRect();
                const area = {
                    left: box.left,
                    right: box.right,
                    top: box.top,
                    bottom: box.bottom
                }
                const isElementWithinArea = (
                    targetPos.top >= area.top &&
                    targetPos.bottom <= area.bottom &&
                    targetPos.left >= area.left &&
                    targetPos.right <= area.right
                  );
                  if(isElementWithinArea) icon.classList.add('selected')
                  else icon.classList.remove('selected')
            }
        }
    })

    ICONSMANAGER.firefox_resize()
}

ICONSMANAGER.update();


window.addEventListener('resize', ICONSMANAGER.firefox_resize)
ICONSMANAGER.firefox_resize();



// Secrets (couldn't use in small.js because the order of files)
if(SECRETS.ONESHOT.brokenSunTimes >= 2) document.querySelector('[data-name="OneShot"]').remove()