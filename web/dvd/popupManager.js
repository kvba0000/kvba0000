// JUMPER - By how units will window move every tick
// DEAD_ZONE - specifies how much units won't be count

// DEAD_ZONE_MODE - specifies which wall will be affected by dead zone (for most windows users it's 2-  left)
// 0 - TOP | 1 - LEFT | 2 - BOTTOM | 3 - RIGHT

// FREQ - How fast to move window (higher - slower)
const JUMPER = Number(localStorage.getItem('SETTINGS.JUMPER') || 5),
    DEAD_ZONE = 50,
    DEAD_ZONE_MODE = 2,
    FREQ = Number(localStorage.getItem("SETTINGS.FREQ") || 50)

// ================


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let popupData, popupData_loaded = false;
fetch('dvd.html').then(r => r.text()).then(r => popupData = r, popupData_loaded = true)

const screenSize = {
    h: window.screen.height - 5,
    w: window.screen.width - 5
}

const waitFor_DELAY = 50, waitFor_TIMEOUT = 8000;
const waitFor = async (o) => new Promise((rs,re) => {
    const errorTimeout = setTimeout(() => {
        clearInterval(waitForInterval);
        re(['timeout', waitFor_TIMEOUT]);
    }, waitFor_TIMEOUT)
    const waitForInterval = setInterval(() => {
        if(o) {
            clearTimeout(errorTimeout);
            rs(true)
        }
    }, waitFor_DELAY);
}) 

/** @type {DVD_SS[]} */
let popups = [];

const DVD_Event = class {
    name = "";
    executor = () => {};
    once = false;
    constructor(name, executor, once = this.once){
        this.name = name;
        this.executor = executor;
        this.once = once;
    }
}

const COLORS = ["#F0F8FF","#FAEBD7","#00FFFF","#7FFFD4","#F0FFFF","#F5F5DC","#FFE4C4","#000000","#FFEBCD","#0000FF","#8A2BE2","#A52A2A","#DEB887","#5F9EA0","#7FFF00","#D2691E","#FF7F50","#6495ED","#FFF8DC","#DC143C","#00FFFF","#00008B","#008B8B","#B8860B","#A9A9A9","#A9A9A9","#006400","#BDB76B","#8B008B","#556B2F","#FF8C00","#9932CC","#8B0000","#E9967A","#8FBC8F","#483D8B","#2F4F4F","#2F4F4F","#00CED1","#9400D3","#FF1493","#00BFFF","#696969","#696969","#1E90FF","#B22222","#FFFAF0","#228B22","#FF00FF","#DCDCDC","#F8F8FF","#FFD700","#DAA520","#808080","#808080","#008000","#ADFF2F","#F0FFF0","#FF69B4","#CD5C5C","#4B0082","#FFFFF0","#F0E68C","#E6E6FA","#FFF0F5","#7CFC00","#FFFACD","#ADD8E6","#F08080","#E0FFFF","#FAFAD2","#D3D3D3","#D3D3D3","#90EE90","#FFB6C1","#FFA07A","#20B2AA","#87CEFA","#778899","#778899","#B0C4DE","#FFFFE0","#00FF00","#32CD32","#FAF0E6","#FF00FF","#800000","#66CDAA","#0000CD","#BA55D3","#9370DB","#3CB371","#7B68EE","#00FA9A","#48D1CC","#C71585","#191970","#F5FFFA","#FFE4E1","#FFE4B5","#FFDEAD","#000080","#FDF5E6","#808000","#6B8E23","#FFA500","#FF4500","#DA70D6","#EEE8AA","#98FB98","#AFEEEE","#DB7093","#FFEFD5","#FFDAB9","#CD853F","#FFC0CB","#DDA0DD","#B0E0E6","#800080","#663399","#FF0000","#BC8F8F","#4169E1","#8B4513","#FA8072","#F4A460","#2E8B57","#FFF5EE","#A0522D","#C0C0C0","#87CEEB","#6A5ACD","#708090","#708090","#FFFAFA","#00FF7F","#4682B4","#D2B48C","#008080","#D8BFD8","#FF6347","#40E0D0","#EE82EE","#F5DEB3","#FFFFFF","#F5F5F5","#FFFF00","#9ACD32"],
getRandomColor = () => COLORS[getRandomInt(0,COLORS.length)]

const DVD_SS = class {
    /** @type {DVD_Event[]} */
    _events = [];
    closed = true;
    size = {
        h: 260,
        w: 320
    }
    pos = {
        x: getRandomInt(0, screenSize.w - this.size.w),
        y: getRandomInt(0, screenSize.h - this.size.h - DEAD_ZONE)
    }
    xx = Boolean(getRandomInt(0,1));
    yy = Boolean(getRandomInt(0,1));
    /** @type {Window} */
    window = null;
    /** @type {number} */
    moveInterval = null;

    constructor(autoStart = true){
        if(autoStart) this.start();
    }

    async start() {
        if(!popupData_loaded) await waitFor(popupData_loaded)
        this.load();
    }

    async close() {
        this.window.close();
        this.closed = true;
        this.emit('closed')
    }

    async load() {
        this.window = window.open("", "_blank", `popup`)
        this.closed = false;
        this.window.resizeTo(this.startSize.w, this.startSize.h)
        this.window.moveTo(this.startPos.x, this.startPos.y)
        this.window.document.writeln(popupData)
        this.window.addEventListener('beforeunload', () => this.close(), {once: true})
        this.startMoving();
    }

    hitWall(){
        this.window.postMessage(['hitWall', getRandomColor()])
    }

    startMoving() {
        setInterval(() => {
            if(this.xx) this.pos.x += JUMPER;
            else this.pos.x -= JUMPER;

            if(this.yy) this.pos.y += JUMPER;
            else this.pos.y -= JUMPER;
    
            if(this.pos.x < 0+5 || this.pos.x > screenSize.w - this.size.w) {this.xx = !this.xx; this.hitWall()}
            if(this.pos.y < 0+5 || this.pos.y > screenSize.h - this.size.h - DEAD_ZONE) {this.yy = !this.yy; this.hitWall()}
    
            window.moveTo(this.pos.x, this.pos.y)
            window.resizeTo(this.size.w, this.size.h)
        }, FREQ);
    }



    // EVENTS PART
    /**
     * 
     * @param {String} evName 
     * @param {any} data 
     */
    emit(evName, data) {
        const events = this._events.filter(ev => ev.name === evName);
        for(let ev of events){
            ev.executor(this, data)
            if(ev.once) this._events.splice(this._events.indexOf(ev), 1) // Remove onces
        }
    }

    /**
     * 
     * @param {String} evName 
     * @param {(clas:this,data:any) => any} executor 
     */
    on(evName, executor) {
        this._events.push(new DVD_Event(evName, executor))
    }

    /**
     * @param {String} evName 
     * @param {(clas:this,data:any) => any} executor 
     */
    once(evName, executor) {
        this._events.push(new DVD_Event(evName, executor, true))
    }
}

let nextWindowAllowed = 0;
const spawnLogo = () => {
    if(nextWindowAllowed > Date.now()) return;
    nextWindowAllowed = Date.now() + 1000

    const dvd = new DVD_SS();

    dvd.once('closed', (cls) => {
        popups.splice(popups.indexOf(cls), 1)
        doUpdateCounter();
    })

    popups.push(dvd);
}



const clearLogos = () => {
    popups.forEach(p => p.window.postMessage(['exit']))
}
window.addEventListener('beforeunload', clearLogos, {capture: true})

