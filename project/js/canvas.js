// * canvas sets
const canvasesContainer = document.querySelector(".charts");
// * Data sets
const dataSrc = "../data/chart_data.json";
async function getData(api) {
    let res = await fetch(api);
    let data = await res.json();
    for (let i = 0; i < data.length; i++) {
        canvasesContainer.insertAdjacentHTML(
            "afterbegin",
            `<div class="chart${i}"><canvas id="chart${i}" data-chart-id="${i}" class="canvas"></canvas></div>`
        );
        contextChoose(data, i);
    }
}
getData(dataSrc);

// *______________________________________________________________________________________________

function contextChoose(data, chartIndex) {

    const canvas = document.querySelector(`canvas#chart${chartIndex}`);
    const context = canvas.getContext("2d");

    canvasSet()

    function canvasSet() {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        // requestAnimationFrame(canvasSet)
        data = data[chartIndex];

        canvas.height = canvas.parentElement.getBoundingClientRect().height;
        canvas.width = canvas.parentElement.getBoundingClientRect().width;
        let maxH = canvas.height;
        let maxW = canvas.width;
        let helperChartHeigth = 65;
        let mainChartDownH = maxH - 100;
        let helperChartStartH = maxH - helperChartHeigth;
        for (let i = 0; i < data.columns.length; i++) {
            resetDataColumns(data.columns[i]);
        }

        graph()

        function graph() {
            context.clearRect(0, 0, maxW, maxH);
            requestAnimationFrame(graph)
            drawHelperChart(data, maxW, maxH, helperChartStartH, helperChartHeigth, context, canvas);
            drawMainChart(data, maxW, maxH, mainChartDownH, context, canvas);

        }
    }

}

function resetDataColumns(columns) {
    let str = columns.findIndex((item) => item !== Number);
    if ((str = Number)) {
        columns.splice(str, 1);
    }
    return columns;
}

function getMaxArr(arr) {
    let peack = Math.max.apply(null, arr);
    return peack;
}

function drawMainChart(data, maxW, maxH, mainChartDownH, context) {


    for (let i = 0; i < 6; i++) {
        context.beginPath();
        context.strokeStyle = "#F5F6F7FF";
        context.moveTo(0, mainChartDownH - (mainChartDownH / 6) * i);
        context.lineTo(maxW, mainChartDownH - (mainChartDownH / 6) * i);
        context.stroke();

        context.beginPath();
        context.font = "10px sans-serif";
        context.fillStyle = "#96A2AAFF";
        context.fillText(`${((getMaxArr(data.columns[1]) / 6) << 0) * i}`, 0, mainChartDownH - (mainChartDownH / 6) * i - 5, 30);
        context.font = "12px sans-serif";
        // context.fillText(`${new Date(data.columns[0][i + 1]).toLocaleString('en-us', {month: 'short',day : 'numeric'})}`, (maxW / 6) * i + ((maxW / 6) / 2), mainChartDownH + 15, 40);
    }
}


function drawHelperChart(data, maxW, maxH, startH, height, context, canvas) {
    let rectSize = 100;
    let startX = 0;



    rectBorder(startX, startH, rectSize, height, maxW)
    context.globalCompositeOperation = "xor";
    let mouseDownX;
    let checkerOfMouse = false;

    function moveEvents() {
        window.addEventListener("mousedown", (e) => {
            mouseDownX = e.clientX - canvas.getBoundingClientRect().x;
            if (mouseDownX > startX && mouseDownX < rectSize) {
                checkerOfMouse = true;
            }
        });
        window.addEventListener("mouseup", () => {
            checkerOfMouse = false;
        });
        canvas.addEventListener("mousemove", (e) => {
            let mouseMoveX = e.clientX - canvas.getBoundingClientRect().x;
            if (checkerOfMouse && mouseDownX > startX && mouseDownX < rectSize) {
                rectBorder(startX + mouseMoveX - mouseDownX, startH, rectSize + mouseMoveX - mouseDownX, height);
                console.log(startX + mouseMoveX - mouseDownX);
            }
        });
    }
    moveEvents()

    function rectBorder(left, top, right, bottom, maxW) {
        // * testing rect 
        context.beginPath();
        context.fillStyle = 'red';
        context.fillRect(left, top, right, bottom);

        // * BackGround
        context.beginPath();
        context.fillStyle = "rgba(250, 252, 253, 0.9)";
        context.rect(left + right, top, maxW, bottom);
        context.fill();


        // // * rectaingelsInner
        // context.fillStyle = 'rgba(355,255,255,0.1)';
        // context.beginPath();
        // context.rect(left, top, rectSize, bottom);
        // context.fill();


        // // * rects sides
        // context.beginPath();
        // context.strokeStyle = "rgba(221,234,243,1)";
        // context.moveTo(left, top);
        // context.lineWidth = 2;
        // context.lineTo(right, top);
        // context.stroke();

        // context.beginPath();
        // context.moveTo(right - 3, top + 1);
        // context.lineWidth = 6;
        // context.lineTo(right - 3, maxH);
        // context.stroke();

        // context.beginPath();
        // context.moveTo(right - 6, maxH - 1);
        // context.lineWidth = 2;
        // context.lineTo(left, maxH - 1);
        // context.stroke();

        // context.beginPath();
        // context.moveTo(left, maxH - 2);
        // context.lineWidth = 12;
        // context.lineTo(left, top + 1);
        // context.stroke();

    }



    for (let index = 1; index < data.columns.length; index++) {
        context.beginPath();
        // context.globalCompositeOperation='source-over';
        context.globalCompositeOperation = 'xor';

        context.lineWidth = 2;
        context.moveTo(
            startX,
            startH +
            (data.columns[index][0] * (maxH - startH)) /
            getMaxArr(data.columns[index])
        );

        for (let i = 0; i < data.columns[0].length; i++) {
            let y = startH + (data.columns[index][i] * height) / getMaxArr(data.columns[index]);
            let x = (maxW / data.columns[0].length) * i;
            context.lineTo(x, y);
        }
        let name = `y${index - 1}`;
        context.globalCompositeOperation = "destination-over";
        context.strokeStyle = `${data.colors[name]}`;
        context.stroke();


    }


}