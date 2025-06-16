let song = false
let lastSongs = []
let loading = false
getSong()


async function getSong() {
    if (loading) return
    loading = true

    let num = false
    while (lastSongs.includes(num) || !num) {
        num = rdmNumBetween(0, songList.length - 1)
    }

    lastSongs.push(num)
    if (lastSongs.length >= songList.length / 2) lastSongs.shift()
    song = songList[num]

    console.log("Fetched song: ", num)

    play();

    switchCover(`${song.Cover ? song.Cover : "./cover/mcat.png"}`)

    typeOut(document.getElementById("title"), 400)
    await sleep(100)
    typeOut(document.getElementById("artist"), 400)
    await sleep(100)
    typeOut(document.getElementById("additional"), 400, true)
}

async function play() {
    loading = false

    document.getElementById("audio").src = `${song.Audio}`

    changeColor(song.Genre)

    await sleep(1000)

    document.getElementById("artistTest").innerText = song.Artist
    document.getElementById("artistTest").style.fontSize = "111px"


    let isOk = false
    let fontSize = 111
    while (!isOk) {
        if (document.getElementById("artistTest").offsetWidth > 1348) {
            document.getElementById("artistTest").style.fontSize = `${fontSize--}px`
        } else {
            isOk = true
        }
    }


    if (song.Additional) {
        document.getElementById("artist").style.fontSize = (fontSize < 111 ? fontSize : 93) + "px"
    } else {
        document.getElementById("artist").style.fontSize = (fontSize < 111 ? fontSize : 111) + "px"
    }

    typeIn(document.getElementById("additional"), (song.Additional ? song.Additional : ""), 800, true)

    typeIn(document.getElementById("artist"), song.Artist, 800)
    await sleep(100)
    typeIn(document.getElementById("title"), song.Title, 800)
}

document.getElementById("audio").oncanplaythrough = () => {
    console.log("Audio can play through")
    document.getElementById("audio").play()
}

document.getElementById("audio").onended = () => {
    console.log("Audio ended")
    getSong()
}

function rdmNumBetween(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeOut(element, duration, isAdditional) {
    // like a typewriter effect, type out the text in the element from end to start
    const text = element.innerText;

    for (let i = 0; i <= text.length; i++) {
        element.innerText = text.slice(0, text.length - i);
        if(element.innerText === "" && !isAdditional) {
            element.innerText = "‎";
        }
        await new Promise(resolve => setTimeout(resolve, duration / text.length));
    }
}

async function typeIn(element, text, duration, isAdditional) {
    // like a typewriter effect, type in the text in the element from start to end
    for (let i = 0; i <= text.length; i++) {
        element.innerText = text.slice(0, i);
        if(element.innerText === "" && !isAdditional) {
            element.innerText = "‎";
        }
        await new Promise(resolve => setTimeout(resolve, duration / text.length));
    }
}

async function switchCover(url) {
    let cover = document.getElementById("cover");
    let coverNew = document.getElementById("coverNew");
    coverNew.src = url;

    // if new cover is loaded
    coverNew.onload = async () => {
        cover.style.scale = "0.95";
        cover.style.transform = "rotateY(90deg)";
        await sleep(90);
        coverNew.style.transform = "rotateY(0deg)";
        coverNew.style.scale = "1";

        await sleep(200);
        cover.src = coverNew.src;
        cover.onload = async () => {
            cover.style.transform = "rotateY(0deg)";
            cover.style.scale = "1";
            await sleep(200);
            cover.style.opacity = "1";
            coverNew.style.opacity = "0";
            coverNew.style.transform = "rotateY(270deg)";
            coverNew.style.scale = "0.95";
        }
    };
}