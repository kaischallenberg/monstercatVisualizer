let first = false
let container = document.getElementById("visualizer");

let powScale = 5
let smoothWidth = 10
let smoothDivi = 8
let frameRate = 120
let cssSmooth = true
let highDivi = 0.1

if (cssSmooth && frameRate >= 60) {
    frameRate = 60
}

for (let x = 0; x < 63; x++) {
    if (cssSmooth) {
        container.innerHTML += `<div id=bar-${x} class="bar" style="width: 2px; height:10px; margin: 3px; background: white; transition: width ${(1000 / frameRate) / 1000}s ease;"></div>`
    } else {
        container.innerHTML += `<div id=bar-${x} class="bar" style="width: 2px; height:10px; margin: 3px; background: white";></div>`
    }
}

let c = 0

setInterval(() => {
    c = 0
}, 1000 / frameRate)
const audioMotion = new AudioMotionAnalyzer(
    null, {
        source: document.getElementById('audio'),
        useCanvas: false,
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
            let barPoints = [0, 1, 2, 3, 4, 6, 8, 10, 13, 18, 23, 29, 37, 46, 58, 72, 89, 111, 139, 184, 228, 272, 334, 393, 457, 516, 574, 646, 709, 774, 836, 900]

            for (let x = 0; x < barPoints.length; x++) {

                let percentage = x / (barPoints.length)
                // flip the percentage
                percentage = Math.pow(percentage, powScale / 7)
                percentage = 1 - percentage
                if(percentage < highDivi) percentage = highDivi
 
                if (x < 63 && (barPoints[x + 1] - barPoints[x]) > 10) {
                    let max = 0
                    for (let y = barPoints[x]; y < (barPoints[x] + barPoints[x + 1] / 2) - ((barPoints[x + 1] - barPoints[x]) / 1.5); y++) {

                        if (tempBars[y] && tempBars[y].value[0] > max) {
                            max = tempBars[y].value[0]
                        }
                    }
                    barPoints[x] = Math.pow(max, powScale)
                } else {
                    barPoints[x] = Math.pow(tempBars[barPoints[x]].value[0], powScale)
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
                document.getElementById(`bar-${x * 2}`).style.width = `${barPoints[x] * 200 + 2}px`
                if (x != 31) {
                    document.getElementById(`bar-${x * 2 + 1}`).style.width = `${((barPoints[x] + barPoints[x + 1]) / 2) * 200 + 2}px`
                }
            }
        }
    }
);