let ICONSMANAGER = {
    elem: document.querySelector('#win-icons'),
    template: document.querySelector('template#win-icontemplate')
}

ICONSMANAGER.list = [
    ["licenses.txt", null, showLicences],
    ["GitHub", "assets/icons/github-white.svg", "assets/window_contents/win_social.html?t=github"],
    ["YouTube", "assets/icons/youtube_red_64px.png", "assets/window_contents/win_social.html?t=youtube"],
    ["Mastodon", "assets/icons/mastodon-purple.svg", "assets/window_contents/win_social.html?t=mastodon"],
    ["Reddit", "assets/icons/reddit-normal.svg", "assets/window_contents/win_social.html?t=reddit"],
    ["OneShot", "assets/icons/oneshot.png", SECRETS.ONESHOT.iconTrigger],
    ["Omori", "assets/icons/omori.png", SECRETS.OMORI.iconTrigger],
    ["Undertale", "assets/icons/undertale.png", SECRETS.UNDERTALE.iconTrigger]
]   

ICONSMANAGER.update = () => {
    ICONSMANAGER.elem.querySelectorAll('.win-icon').forEach(el => el.remove());

    for(let [title, icon_url, handler] of ICONSMANAGER.list){
        let clone = document.importNode(ICONSMANAGER.template.content, true)

        if(title) clone.querySelector('span.win-icon-name').textContent = title
        
        let icon = "assets/icons/file.svg"
        if(icon_url) icon = icon_url
        else switch(title.split(".").pop()){
            case "txt": icon = "assets/icons/notepad.svg"; break;
        }

        clone.querySelector('img.win-icon-icon').src = icon
        
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
}

ICONSMANAGER.update();