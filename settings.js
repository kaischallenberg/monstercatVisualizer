let settings = {
    bgImage: "./bg/1.png", // Select a background image from the bg folder
    genreColorsActive: true, // Set to true to enable genre colors, false to disable
    genreColors: {
        Default: "#FFFFFF", // Default color for genres not specified or when genre colors are disabled
        Trap: "#8C0F27",
        DNB: "#F21904",
        House: "#EA8C00",
        Electro: "#E6CE00",
        HardDance: "#019700",
        GlitchHop: "#0B9757",
        NuDisco: "#1CABB3",
        FutureBass: "#9A98FC",
        Trance: "#007EE7",
        Dubstep: "#8D04E1",
        Drumstep: "#F32188",
        Electronic: "#C1C1C1",
    }
}


let songList = [{
        Info: "Do not remove this Object. Add your songs below this line."
    },
    ///////////////////////////////////////////////////////////////////////
    {
        Artist: "Au5", // Main artist
        Title: "Follow You", // Title of the song
        Additional: "feat. Danyka Nadeau", // Additional artists, if any (e.g., featured artists or remixers)
        Audio: "./audio/au5-follow-you.mp3", // Path to the audio file
        Cover: "./cover/au5-follow-you.webp", // Path to the cover image
        Genre: "FutureBass" // Genre of the song (has to match the genreColors settings)
    }, {
        Artist: "Sound Remedy & Nitro Fun",
        Title: "Turbo Penguin",
        Additional: false,
        Audio: "./audio/sound-remedy-nitro-fun-turbo-penguin.mp3",
        Cover: "./cover/sound-remedy-nitro-fun-turbo-penguin.webp",
        Genre: "GlitchHop"
    },
    {
        Artist: "Trivecta, AMIDY & RØRY",
        Title: "Riptide",
        Additional: false,
        Audio: "./audio/trivecta-amidy-rory-riptide.mp3",
        Cover: "./cover/trivecta-amidy-rory-riptide.webp",
        Genre: "FutureBass"
    }
]