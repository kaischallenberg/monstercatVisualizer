let song = false
let lastSongs = []
let currentSongId = false
let currentSongObj = false
let songInterval = false
let loading = false
let audioNode = false
let total = 3000
let xx = true
getSong()



async function getSong() {
    if (loading) return
    loading = true

    let num = false
    while (lastSongs.includes(num) || !num) {
        // 2100 good old
        num = rdmNumBetween(2100, total)
    }

    lastSongs.push(num)
    if (lastSongs.length >= 100) lastSongs.shift()

        if(xx) {
            //num = 3190
            xx = false
        }
        

    fetch(`https://player.monstercat.app/api/catalog/browse?offset=0${num}&limit=1&streamerMode=false&brands[]=1&brands[]=2&sort=-date&brands%5B%5D=&types%5B%5D=Single&types%5B%5D=EP&types%5B%5D=Album&nogold=false`)
        .then(response => response.json())
        .then(async response => {
            if (response.Data.length === 0) {
                console.error("No song found")
                loading = false
                getSong()
                return;
            }

            console.log("Total", response.Total, "Offset", response.Offset)
            total = response.Total
            song = response.Data[0]

            console.log("Fetched song: ", song)

            play();

            switchCover(`https://cdx.monstercat.com/?width=1920&encoding=webp&url=https://www.monstercat.com/release/${song.Release.CatalogId}/cover`)

            typeOut(document.getElementById("title"), 400)
            await sleep(100)
            typeOut(document.getElementById("artist"), 400)
            await sleep(100)
            typeOut(document.getElementById("additional"), 400 , true)

        })
        .catch(err => {
            setTimeout(() => {
                console.error("Error fetching song: ", err)
                loading = false
                getSong()
            }, 3000)
        });
}

async function play() {
    loading = false

    document.getElementById("audio").src = `http://localhost:5501/stream?url=https://player.monstercat.app/api/release/${song.Release.Id}/track-stream/${song.Id}`

    let primary = []
    let featured = []
    let version = []

    for (let i = 0; i < song.Artists.length; i++) {
        if (song.Artists[i].Role == "Primary") {
            primary.push(song.Artists[i].Name)
        } else if (song.Artists[i].Role == "Featured") {
            featured.push(song.Artists[i].Name)
        } else if (song.Artists[i].Role == "Remixer") {
            version.push(song.Artists[i].Name)
        }
    }

    if(song.GenreSecondary == "Drum & Bass") {
        song.GenreSecondary = "DNB"
    }

    if(song.GenreSecondary.includes("Nu Disco")) {
        song.GenreSecondary = "NuDisco"
    }

    if(song.GenreSecondary == "Happy Hardcore") {
        song.GenreSecondary = "HardDance"
    }

    changeColor(song.GenreSecondary.split(" ").join(""))

    await sleep(1000)

    document.getElementById("artistTest").innerText = primary.join(" & ")
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


    if (featured.length > 0 || version.length > 0) {
        document.getElementById("artist").style.fontSize = (fontSize < 111 ? fontSize : 93) + "px"
        document.getElementById("title").style.marginTop = "0px"
    } else {
        document.getElementById("artist").style.fontSize = (fontSize < 111 ? fontSize : 111) + "px"
        document.getElementById("title").style.marginTop = "-5px"
    }

    typeIn(document.getElementById("additional"), (featured.length > 0 ? "feat. " + featured.join(" & ") : "") + (version.length > 0 ? " [" + version.join(" & ") + " Remix]" : ""), 800, true)

    typeIn(document.getElementById("artist"), primary.join(" & "), 800)

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
    return Math.floor(Math.random() * (max - min + 1)) + min;
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