// small check
let SECRETS = {};
let __smallCheck = () => Object.values(SECRETS).some(s => s.iconTriggered)

// -----------------------------------------------
//                     ONESHOT
// ------------------------------------------------
SECRETS.ONESHOT = {}

SECRETS.ONESHOT.iconTriggered = false;
SECRETS.ONESHOT.iconSecret = false;
SECRETS.ONESHOT.iconSecretDialogs = [
    "Niko probably is on the way to the tower...",
    "He'll return the sun and everyone's will be happy...",
    "...",
    "...?",
    "Isn't this what you wanted?",
    "Returning the sun and saving everyone's life from darkness?",
    "...",
    "Listen. We can get to compromise. I'll allow you to do this one last time.",
    "But that will be also the last time you'll see saviour...",
    "So...",
]
SECRETS.ONESHOT.iconSecretDialogIndex = 0;
SECRETS.ONESHOT.acceptedOffer = localStorage.getItem('this_time_is_true_oneshot') === 'true'
SECRETS.ONESHOT.brokenSunTimes = Number.parseInt(localStorage.getItem('oneshot_is_over') || 0)
SECRETS.ONESHOT.iconSecretGetNextDialog = () => SECRETS.ONESHOT.iconSecretDialogIndex === SECRETS.ONESHOT.iconSecretDialogs.length ? "..." : SECRETS.ONESHOT.iconSecretDialogs[SECRETS.ONESHOT.iconSecretDialogIndex++]
SECRETS.ONESHOT.iconSecretPromptAsked = 0;
/**
 * 
 * @param {MouseEvent} ev 
 */
SECRETS.ONESHOT.iconTrigger = async (ev, iconElement) => {
    if(SECRETS.ONESHOT.acceptedOffer){
        const fade_elem = document.querySelector('#loadscreen')
        fade_elem.removeAttribute('hidden')

        let shakeSize = 200

        let song = new Audio("/assets/oneshot_home.mp3")
        song.loop = true

        if (SECRETS.ONESHOT.brokenSunTimes === 0) await new Promise(ended => {
            const starting_coords = {
                w: 640,
                h: 480,
                get x(){return (screen.width - this.w) / 2},
                get y(){return (screen.height - this.h) / 2}
            }

            const w = window.open("", "_blank", `popup,width=${starting_coords.w},height=${starting_coords.h}`)
            w.moveTo(starting_coords.x, starting_coords.y)
            w.document.body.style.backgroundColor = "black"
            w.document.title = "OneShot"

            let audio = new Audio("/assets/oneshot_shatter.mp3")
            audio.addEventListener('loadeddata', () => {
                localStorage.setItem('oneshot_is_over', SECRETS.ONESHOT.brokenSunTimes + 1)
                audio.play()
                const shakeInterval = setInterval(() => {
                    if(!w || w.closed) return clearInterval(shakeInterval)
                    w.moveTo(
                        starting_coords.x + Math.random() * shakeSize - shakeSize / 2,
                        starting_coords.y + Math.random() * shakeSize - shakeSize / 2
                    )
                    shakeSize -= 2
                    if(shakeSize <= 0) {
                        setTimeout(() => {
                            if(w && !w.closed) w.close()
                            ended()
                        }, 3000);
                        clearInterval(shakeInterval)
                    }
                }, 10)
            })
        })
        else localStorage.setItem('oneshot_is_over', SECRETS.ONESHOT.brokenSunTimes + 1)
        
        song.play()
        return
    }
    if(SECRETS.ONESHOT.iconSecret) {
        if(SECRETS.ONESHOT.iconSecretDialogIndex !== SECRETS.ONESHOT.iconSecretDialogs.length) return alert(SECRETS.ONESHOT.iconSecretGetNextDialog())
        let r;
        if(SECRETS.ONESHOT.iconSecretPromptAsked === 0) r = confirm("Do you want it..?")
        else r = confirm("So... you've changed your mind?")

        if(!r) {
            alert(SECRETS.ONESHOT.iconSecretPromptAsked === 0 ? "I'm gonna be here if you'll change your mind..." : "Okay then...")
            return SECRETS.ONESHOT.iconSecretPromptAsked++
        }

        alert("Then... it is done.")
        localStorage.setItem('this_time_is_true_oneshot', 'true')
        const fade_elem = document.querySelector('#loadscreen')
        fade_elem.removeAttribute('hidden')
        return location.reload()
    }
    if(__smallCheck()) return;
    SECRETS.ONESHOT.iconTriggered = true;

    /** @type {HTMLImageElement} */
    let icon = iconElement.querySelector('img.win-icon-icon')
    /** @type {DOMRect} */
    let iconPos = icon.getBoundingClientRect()

    let nikoChar = document.createElement('img')
    nikoChar.src = 'assets/oneshot_nikowalkL.gif'
    nikoChar.style.position = 'fixed';
    nikoChar.height = 80
    nikoChar.style.top = iconPos.y + nikoChar.height

    let sfx = new Audio('assets/oneshot_step.mp3')
    sfx.loop = true;
    sfx.preservesPitch = true;

    WINDOWS.elem.appendChild(nikoChar)
    sfx.play();

    nikoChar.animate([
        {left: "100%"},
        {left: `${iconPos.x}px`}
    ], {duration: 5000, fill: 'forwards'}).addEventListener('finish', () => {
        nikoChar.src = 'assets/oneshot_nikostandD.png'
        sfx.pause();
        setTimeout(() => {
            icon.animate([
                {transform: `translate(-50%, 0px)`},
                {transform: `translate(-50%, -20px)`},
                {transform: `translate(-50%, 100px)`},
            ], {duration: 800, fill: 'forwards', easing: 'ease-in-out'}).addEventListener('finish', () => {
                sfx.src = 'assets/oneshot_item_get.mp3'
                sfx.loop = false;
                icon.remove();
                nikoChar.src = 'assets/oneshot_nikostandD_bulb.png'
                nikoChar.animate([
                    {filter: "brightness(5)"},
                    {filter: "brightness(1.0)"}
                ], {duration: 500, easing: 'linear'})
                sfx.play();
                sfx.addEventListener('ended', () => {
                    sfx.pause();
                    nikoChar.src = 'assets/oneshot_nikowalkL_bulb.gif'
                    sfx.src = 'assets/oneshot_step.mp3'
                    sfx.playbackRate = 1.2;
                    sfx.loop = true;
                    sfx.play();
                    nikoChar.animate([
                        {left: "-50%"},
                    ], 2000).addEventListener('finish', () => {
                        SECRETS.ONESHOT.iconSecret = true;
                        nikoChar.remove();
                        sfx.pause();
                        sfx.remove();
                        SECRETS.ONESHOT.iconTriggered = false;
                    }, {once: true})
                }, {once: true})
            }, {once: true})
        }, 500);
    }, {once: true})
}



// -----------------------------------------------
//                      OMORI
// ------------------------------------------------



SECRETS.OMORI = {}

SECRETS.OMORI.iconTriggered = false;
SECRETS.OMORI.iconSecret = false;
SECRETS.OMORI.globalSfx = new Audio();

/**
 * 
 * @param {MouseEvent} ev 
 */
SECRETS.OMORI.iconTrigger = (ev, iconElement) => {
    if(SECRETS.OMORI.iconSecret) {
        let nameElem = iconElement.querySelector('span.win-icon-name')
        let randomNameInterval = setInterval(() => nameElem.textContent = getRandomString(8), 10)
        let sfx = new Audio('assets/omori_gnihtemos.mp3')
        iconElement.querySelector('img.win-icon-icon').src = 'assets/omori_something_d.gif'
        SECRETS.OMORI.globalSfx.pause()
        sfx.play();
        sfx.addEventListener('ended', () => {
            clearInterval(randomNameInterval)
            sfx.remove();
            iconElement.remove();
            SECRETS.OMORI.iconSecret = false;
        }, {once: true})
        return;
    }
    if(__smallCheck()) return;
    iconElement.classList.remove('selected')
    SECRETS.OMORI.iconTriggered = true;
    let oldTitle = document.title;
    document.title = '\uFEFF'
    let sfx = new Audio("assets/light_switch.mp3")
    let bg = document.createElement('div');
    Object.entries({
        "position": "fixed",
        "width": "100vw",
        "height": "100vh",
        "backgroundColor": "black",
        "zIndex": "99998",
        "left": "0",
        "top": "0"
    }).forEach(s => bg.style[s[0]] = s[1])
    document.body.appendChild(bg)
    sfx.play();
    setTimeout(() => {
        let something = document.createElement('img')
        something.src = 'assets/omori_something.png'
        something.classList.add('shakeSmall')
        Object.entries({
            "position": "fixed",
            "width": "100px",
            "height": "300px",
            "left": "calc(50vw - 50px)",
            "top": "calc(50vh - 150px)",
            "zIndex": "99999",
            "opacity": "0"
        }).forEach(s => something.style[s[0]] = s[1])
        bg.appendChild(something)
        sfx.src = "assets/omori_SE_whispers.mp3"
        sfx.volume = 0.3
        sfx.loop = true;
        sfx.play();
        setTimeout(() => {
            something.animate([
                {"opacity": "0%"},
                {"opacity": "60%"},
            ], 9000)
            setTimeout(() => {
                let sfx2 = new Audio('assets/omori_SE_bs_shocking.mp3')
                let randomTitleInterval = setInterval(() => document.title = getRandomString(20), 300)
                sfx2.play();
                sfx2.addEventListener('ended', () => {
                    clearInterval(randomTitleInterval);
                    document.title = "Something's behind you."
                    bg.classList.remove('shakeSmall')
                    bg.style.transform = 'scale(3)'
                    setTimeout(() => {
                        SECRETS.OMORI.globalSfx.src = 'assets/omori_SE_sucks_a_LOT.mp3'
                        SECRETS.OMORI.globalSfx.loop = true;
                        iconElement.querySelector('img.win-icon-icon').src = 'assets/omori_something_m.png'
                        iconElement.querySelector('span.win-icon-name').textContent = '□□□'
                        SECRETS.OMORI.globalSfx.play();
                        sfx.pause()
                        sfx.remove()
                        sfx2.remove()
                        something.remove();
                        bg.remove();
                        SECRETS.OMORI.iconTriggered = false;
                        SECRETS.OMORI.iconSecret = true;
                        setTimeout(() => {
                            document.title = oldTitle
                        }, 1000);
                    }, 100);
                })
            }, 2000);
        }, 4000);
        
    }, 2000);
}


// -----------------------------------------------
//                    UNDERTALE
// ------------------------------------------------



SECRETS.UNDERTALE = {}

SECRETS.UNDERTALE.iconTriggered = false;
SECRETS.UNDERTALE.oldTitle = '';
SECRETS.UNDERTALE.iconSecret = false;
SECRETS.UNDERTALE.selectSFX = new Audio('assets/undertale_snd_select.mp3')
SECRETS.UNDERTALE.moveSFX = new Audio('assets/undertale_snd_squeak.mp3')
SECRETS.UNDERTALE.showSFX = new Audio('assets/undertale_mus_cymbal.mp3')

/**
 * 
 * @param {MouseEvent} ev 
 */
SECRETS.UNDERTALE.iconTrigger = (ev, iconElement) => {
    if(SECRETS.UNDERTALE.iconTriggered) return;
    SECRETS.UNDERTALE.iconTriggered = true;
    SECRETS.UNDERTALE.oldTitle = document.title;
    

    const container = document.createElement('div')
    document.body.appendChild(container)

    /** @type {HTMLImageElement} */
    let icon = iconElement.querySelector('img.win-icon-icon')

    WINDOWS.taskbar.setAttribute('hidden', true)

    const frame = document.createElement('iframe')
    Object.entries({
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        position: 'fixed',
        left: 0,
        top: 0
    }).forEach(s => frame.style[s[0]] = s[1])

    const closeIcon = document.createElement('img')
    closeIcon.src = 'assets/undertale_close.png'
    Object.entries({
        height: '50px',
        position: 'fixed',
        right: 0,
        top: 0,
        margin: '20px'
    }).forEach(s => closeIcon.style[s[0]] = s[1])
    closeIcon.classList.add('undertale-btn')

    closeIcon.addEventListener('mouseenter', () => SECRETS.UNDERTALE.moveSFX.play())
    closeIcon.addEventListener('click', () => {
        icon.removeAttribute('style')
        iconElement.appendChild(icon)
        SECRETS.UNDERTALE.selectSFX.play()
        WINDOWS.taskbar.removeAttribute('hidden')
        container.remove()
        document.title = SECRETS.UNDERTALE.oldTitle;
        SECRETS.UNDERTALE.iconTriggered = false;
    }, {once: true})

    const iconpos = iconElement.getBoundingClientRect();
    WINDOWS.elem.appendChild(icon)
    icon.style.position = 'fixed'
    icon.style.left = `${iconpos.left + iconpos.width / 2 - icon.clientWidth / 2}px`
    icon.style.top = `${iconpos.top + iconpos.height / 2 - icon.clientHeight / 2}px`


    SECRETS.UNDERTALE.showSFX.play()
    icon.animate([
        {zIndex: 99999999},
        {transform: 'scale(20)', filter: 'grayscale(100%) brightness(10)', zIndex: 99999999}
    ], {
        duration: 5000
    }).addEventListener('finish', () => {
        document.title = '\uFEFF'
        container.appendChild(frame)
        frame.animate([
            {backgroundColor: 'black'}
        ], {duration: 1000, fill: 'forwards'}).addEventListener('finish', () => {
            frame.src = 'https://jcw87.github.io/c2-sans-fight/'
            container.appendChild(closeIcon)
        }, {once: true})
    }, {once: true})
}

SECRETS.CHRISTMAS = {}
if(isChristmasTime()) {
    SECRETS.CHRISTMAS.generateSnowflake = (autoAppendElem, randomDelay = true) => {
        const e = document.createElement('span')
        const randomize = () => {
            e.innerHTML = '❄'
            e.style.marginLeft = `${Math.random() * 100}%`
            e.style.fontSize = `${Math.random() * 20 + 10}px`
        }
        const animate = () => {
            randomize()
            e.animate([
                {transform: 'translateY(-5vh) translateX(-5px) rotate(0turn)'},
                {transform: 'translateY(25vh) translateX(5px) rotate(0.5turn)'},
                {transform: 'translateY(50vh) translateX(-5px) rotate(1turn)'},
                {transform: 'translateY(75vh) translateX(5px) rotate(1.5turn)'},
                {transform: 'translateY(100vh) translateX(-5px) rotate(2turn)'},
            ], {
                duration: Math.random() * 8000 + 8000,
                easing: 'linear',
            }).addEventListener('finish', animate, {once: true})
        }
        
        setTimeout(() => {
            if(autoAppendElem) autoAppendElem.appendChild(e)
            animate()
        }, randomDelay ? Math.random() * 8000 : 0);
        return e
    }
    SECRETS.CHRISTMAS.elem = (() => {
        // Create main div
        const e = document.createElement('div')
        e.classList.add('KRIMA-so-cool')

        // Create snowflakes if they are enabled
        
        if (WINDOWS.config.hideSnowflakes !== "true") for(let i = 0; i < (Number.parseInt(WINDOWS.config.snowflakesIntensity) || 30); i++) SECRETS.CHRISTMAS.generateSnowflake(e)

        WINDOWS.elem.prepend(e)
        return e
    })()
} else SECRETS.CHRISTMAS.msg = ((list => list[Math.floor(Math.random() * list.length)]))([
    "Nothing's here, pal.",
    "Don't tell anybody but there's gonna be here some day.",
    "Looking for presents?",
    "I don't have any presents yet. I'm sorry.",
    `Too ${new Date().getMonth() < 5 ? 'early' : 'late'}.`,
])