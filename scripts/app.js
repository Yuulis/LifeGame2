// セル1マスのサイズ
const CELL_SIZE = 8;

// 更新スピード(ms)
const SPEED = 100;

// カラーリスト
const COLOR_LIST = [
    '#f5f5f5',  // null(0)
    '#00ff7f',  // green(1)
];

let canvas;
let ctx;
let width;
let height;
let cells = new Array();
let btn_start;
let btn_random;
let btn_reset;
let timer;
let running = false;

window.onload = function()
{
    canvas = document.getElementById('field');
    ctx = canvas.getContext('2d');

    width = Math.floor(canvas.width / CELL_SIZE);
    height = Math.floor(canvas.height / CELL_SIZE);
    initialize();

    btn_random = document.getElementById('btn_random');
    btn_start = document.getElementById('btn_start');
    btn_reset = document.getElementById('btn_reset');
    btn_start.addEventListener('click', onStart, false);
    btn_random.addEventListener('click', setRandom, false);
    btn_reset.addEventListener('click', initialize, false);

    canvas.addEventListener('click', onClick, false);
};

// フィールド初期化
function initialize() {
    for (let y = 0; y < height; y++) {
        cells[y] = new Array();
        for (let x = 0; x < width; x++) {
            cells[y][x] = 0;
        }
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    reDraw();
}

// フィールド再描画
function reDraw() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawCell(x, y);
        }
    }
}

// セル描画
function drawCell(x, y) {
    let style;
    if (cells[y][x] == 0) {
        style = '#f5f5f5';
    } else {
        style = '#00ff7f';
    }

    ctx.fillStyle = style;
    ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 1, CELL_SIZE - 1);
}

// ランダム配置
function setRandom() {
    for (let y = 0; y < height; y++) {
        cells[y] = new Array();
        for (let x = 0; x < width; x++) {
            cells[y][x] = Math.round(Math.random());
        }
    }

    reDraw();
}

// フィールドがクリックされたとき
function onClick(e) {
    let pos_x = e.clientX - canvas.offsetLeft;
    let pos_y = e.clientY - canvas.offsetTop;
    let idx_x = Math.floor(pos_x / CELL_SIZE);
    let idx_y = Math.floor(pos_y / CELL_SIZE);

    if (cells[idx_y][idx_x] == 0) {
        cells[idx_y][idx_x] = 1;
    } else {
        cells[idx_y][idx_x] = 0;
    }

    drawCell(idx_x, idx_y);
}

// 開始
function onStart() {
    if (running) {
        clearInterval(timer);
        btn_start.value = 'Start';
        running = false;
    } else {
        timer = setInterval('nextGeneration()', SPEED);
        btn_start.value = 'Stop';
        running = true;
    }
}

// 世代更新
function nextGeneration() {
    let temp_cells = new Array();
    for (let y = 0; y < height; y++) {
        temp_cells[y] = new Array();
        for (let x = 0; x < width; x++) {
            let cnt = getLivingCells(x, y);

            if (cells[y][x] == 0) {
                if (cnt == 3) {
                    temp_cells[y][x] = 1;
                } else {
                    temp_cells[y][x] = 0;
                } 
            } else {
                if (cnt == 2 || cnt == 3) {
                    temp_cells[y][x] = 1;
                } else {
                    temp_cells[y][x] = 0;
                }
            }
        }
    }

    cells = temp_cells;
    reDraw();
}

// 8近傍のセルの色の種類と数を取得
function getLivingCells(x, y) {
    let res = 0;

    for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
            if (dy == 0 && dx == 0) continue;
            
            if (cells[(dy + y + height) % height][(dx + x + width) % width] == 1) res++;
        }
    }

    return res;
}