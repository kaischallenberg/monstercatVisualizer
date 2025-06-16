let first = false
let container = document.getElementById("visualizer");


let smoothWidth = 7
let smoothDivi = 5
let frameRate = 120
let cssSmooth = true



if (cssSmooth && frameRate >= 60) {
    frameRate = 60
}

for (let x = 0; x < 63; x++) {
    if (cssSmooth) {
        container.innerHTML += `<div id=bar-${x} class="bar" style="width: 2px; height:17px; margin-top: 8px; background: white; transition: width ${(1000 / frameRate) / 1000}s ease, background 1s ease; box-shadow: 2px 2px 10px black"></div>`
    } else {
        container.innerHTML += `<div id=bar-${x} class="bar" style="width: 2px; height:17px; margin-top: 8px; background: white; transition: background 1s ease; box-shadow: 2px 2px 10px black";></div>`
    }
}

let c = 0

setInterval(() => {
    c = 0
}, 1000 / frameRate)

const audioMotion = new AudioMotionAnalyzer(
    null, {
        source: document.getElementById("audio"),
        useCanvas: false,
        linearAmplitude: true,
        maxDecibels: -23,
        minDecibels: -90,
        smoothing: 0.8,
        frequencyScale: "bark",
        onCanvasDraw: instance => {
            c++
            if (c != 1) return
            if (!first) {
                console.log(instance.getBars())
                first = true
            }

            let tempBars = instance.getBars()

            // generate array of length with log scale (32 points) starting from 0 and only whole numbers (max of tempBars.length == 1160) with a larger width on the first 15 points
            //let barPoints = [0, 1, 2, 3, 5, 7, 9, 12, 16, 21, 28, 35, 44, 55, 69, 86, 107, 133, 166, 221, 273, 326, 401, 471, 548, 618, 689, 774, 851, 927, 1001, 1078]            
            let barPoints = [0, 1, 2, 3, 5, 7, 9, 10, 12, 14, 17, 20, 23, 28, 34, 41, 49, 60, 74, 96, 118, 140, 171, 200, 232, 260, 290, 325, 357, 388, 419, 450]
            //let barPoints = [0, 17, 28, 46, 59, 75, 97, 124, 140, 158, 179, 203, 229, 260, 294, 332, 376, 426, 482, 545, 617, 698, 789, 893, 1011, 1144, 1294, 1464, 1657, 1875, 2121, 2400]


            for (let x = 0; x < barPoints.length; x++) {

                if ((barPoints[x + 1] - barPoints[x]) > 5) {
                    let max = 0
                    for (let y = barPoints[x]; y < barPoints[x + 1]; y++) {
                        if (tempBars[y] && tempBars[y].value[0] >= max) {
                            max = tempBars[y].value[0]
                        }
                    }
                    //barPoints[x] = Math.pow(max, 0.9)
                    barPoints[x] = max
                } else {
                    //barPoints[x] = Math.pow(tempBars[barPoints[x]].value[0], powScale)
                    barPoints[x] = tempBars[barPoints[x]].value[0]
                }
            }

            for (let x = 0; x < barPoints.length; x++) {

                for (let y = 0; y < smoothWidth; y++) {
                    if (barPoints[x + y] !== undefined && barPoints[x] > barPoints[x + y]) {
                        barPoints[x + y] += barPoints[x] / (smoothDivi * y)
                        if (barPoints[x + y] > 1) {
                            barPoints[x + y] = 1
                        }
                    }

                    if (barPoints[x - y] !== undefined && barPoints[x] > barPoints[x - y]) {
                        barPoints[x - y] += barPoints[x] / (smoothDivi * y)
                        if (barPoints[x - y] > 1) {
                            barPoints[x - y] = 1
                        }
                    }
                }

            }

            for (let x = 0; x < barPoints.length; x++) {
                document.getElementById(`bar-${x * 2}`).style.width = `${barPoints[x] * 375 + 2}px`
                if (x != 31) {
                    document.getElementById(`bar-${x * 2 + 1}`).style.width = `${((barPoints[x] + barPoints[x + 1]) / 2) * 375 + 2}px`
                }
            }
        }
    }
);

function changeColor(genre) {
    if (!settings.genreColorsActive) return; // If genre colors are not active, do nothing
    let color = settings.genreColors[genre] || settings.genreColors.Default; // Default to white if genre not found
    document.querySelectorAll(".bar").forEach(bar => {
        bar.style.background = color;
    });
}