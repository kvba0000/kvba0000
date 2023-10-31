/**
 * @description True, if user interacted with website (for example by clicking)
 */
let interactedWithWebsite = false;
window.addEventListener('click', () => interactedWithWebsite = true, {once: true})


/*

    ERROR ALERTING

*/
window.addEventListener("error", (err) => {
    const url = `https://github.com/kbvivi/kbvivi/issues/new?title=${encodeURIComponent(`Error in ${new URL(err.filename).pathname}`)}&body=${encodeURIComponent(`When I was <replace this section with what were you doing before> I got an error on ${err.filename} at line ${err.lineno} in column ${err.colno}:\n\n\`\`\`\n${err.message}\n\`\`\``)}`
    if (confirm([
        "There was an error when executing this operation:",
        "",
        `"${err.message}" at ${err.lineno}:${err.colno} (${new URL(err.filename).pathname})`,
        "",
        "Please report it ASAP to me at https://github.com/kbvivi/kbvivi/issues!",
        "Do you want to automatically go to the issues page?"
    ].join("\n"))) interactedWithWebsite ? window.open(url, "_blank") : location.href = url;
})



/**
 * Generates random string of given length
 * @param {number} length Length of a string
 * @returns {string} Random string
 */
const getRandomString = (length = 5) => {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let str = "";
    while(str.length < length) str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return str;
}

const isOnMobile = /Android|iPhone/i.test(navigator.userAgent)


/**
 * Tries to parse JSON object
 * @param {string} jsonObjectIthink string representation of JSON object
 * @returns Parsed JSON object, returns null if couldn't parse
 */
const tryParseJSON = (jsonObjectIthink = "{}") => {
    let result;
    try{
        result = JSON.parse(jsonObjectIthink)
    }catch {result = null;}
    return result;
}



/**
 * @description Did user accepted the message when opening dev tools?
 */
let devtools_aknowledged = (localStorage.getItem("devtools_aknowledged") || "false") === "true";
if(!devtools_aknowledged){
    window.addEventListener('keydown', (ev) => {
        if(
            !devtools_aknowledged &&
            (
                (ev.ctrlKey && ev.shiftKey && ["i","j"].includes(ev.key.toLowerCase())) || // CTRL+SHIFT+I/J
                (ev.key.toLowerCase() === "f12") // F12
            )
        ) {
            let aknowledged = confirm([
                "I see you wanted to open dev tools!",
                "If you want to check out the code or even grab some then go ahead!",
                "https://github.com/kbvivi/kbvivi/tree/main/web",
                "",
                "Please just credit me in your project as I spent much of my time on this, it would mean a lot to me. <3",
                "(Confirm to never see this message again)"
            ].join("\n"))
            devtools_aknowledged = true;
            if(aknowledged) localStorage.setItem('devtools_aknowledged', true)
        }
    })
}

// disable drag effect
window.ondragstart = () => false

/**
 * @description Did intro sequence finished?
 */
let introFinished = false;
window.addEventListener('load', () => {
    WINDOWS.setLoadingCursor(true)
    /*

        FADE ANIMATION

    */
    const loadingScreenElem = document.querySelector('#loadscreen')
    const animation = loadingScreenElem.animate([
        {"opacity": "100%"},
        {"opacity": "0%"}
    ], {
        duration: 1000,
        composite: "replace",
    })
    animation.addEventListener('finish', () => setTimeout(() => {
        loadingScreenElem.setAttribute('hidden', true)
        /*

            WINDOWS LOAD ANIMATION

        */
        const windowsLoadingScreen = document.querySelector("#win-load-screen")
        const animation = windowsLoadingScreen.animate([
            {"opacity": "100%"},
            {"opacity": "0%"}
        ], {
            duration: 100,
            composite: "replace",
            fill: "forwards"
        })
        animation.addEventListener("finish", () => {
            windowsLoadingScreen.remove()
            /*

                WINDOWS LOGIN BLUR

            */
            const windowsLoginBackground = document.querySelector("#win-login-bg")
            const animation = windowsLoginBackground.animate([
                {filter: "blur(0px)", transform: "scale(1.1)"},
                {filter: "blur(5px)", transform: "scale(1.15)"}
            ], {
                duration: 400,
                fill: "forwards",
                easing: "ease-in-out",
                delay: 50
            })
            animation.addEventListener('finish', () => setTimeout(() => {
                /*

                    WINDOWS LOGIN END

                */
                if(isOnMobile) alert("Remember! Some features/minigames might not work on mobile. :(")
                const windowsLoginElem = document.querySelector("#win-login-screen")
                const animation = windowsLoginElem.animate([
                    {opacity: "100%"},
                    {opacity: "0%"}
                ], {
                    duration: 400,
                    fill: "forwards"
                })
                animation.addEventListener('finish', () => {
                    introFinished = true;
                    windowsLoginElem.remove()
                    WINDOWS.setLoadingCursor(false)
                }, {once: true})
            }, 3000), {once: true})
        }, {once: true})
    }, 500), {once: true})
}, {once: true})


/**
 * @description Show notepad window with license info.
 */
const showLicences = async () => {
    const licenseInfo = (await fetch('/licenses.txt').then(res => res.text()))
        .replace(/^\s*$/gm, '') // reduce new lines
        .replace(/^\|3([^].*)$/gm, '<h3>$1</h3>') // h3
        .replace(/^\|2([^].*)$/gm, '<h2>$1</h2>') // h2
        .replace(/^\|1([^].*)$/gm, '<h1>$1</h1>') // h1
        .replace(/(^|\s)(((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?)/gm, '$1<a href="$2" target="_blank">$2</a>')

    new NotepadWindowClass(licenseInfo, "Licenses")
}