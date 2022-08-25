// セル1マスのサイズ
const CELL_SIZE = 8;

// 更新スピード(ms)
const SPEED = 100;

// カラーリスト
const COLOR_LIST = [
    '#f5f5f5',  // null(0)
    '#00ff7f',  // green(1)
    '#ff4545',  // red(2)
    '#00bfff',  // blue(3)
];

// フィールド
let width;
let height;
let cells_data = new Array();

// UI
let btn_start;
let btn_random;
let btn_reset;
let text_step;

// システム
let canvas;
let ctx;
let timer;
let running = false;
let step = 0;
let color_of_cells = new Object();

window.onload = function()
{
    canvas = document.getElementById('field');
    ctx = canvas.getContext('2d');

    width = Math.floor(canvas.width / CELL_SIZE);
    height = Math.floor(canvas.height / CELL_SIZE);
    
    btn_random = document.getElementById('btn_random');
    btn_start = document.getElementById('btn_start');
    btn_reset = document.getElementById('btn_reset');
    text_step = document.getElementById('step');
    btn_random.addEventListener('click', setRandom, false);
    btn_start.addEventListener('click', onStart, false);
    btn_reset.addEventListener('click', initialize, false);
    canvas.addEventListener('click', onClick, false);

    initialize();
};

// 初期化
function initialize() {
    step = 0;

    for (let y = 0; y < height; y++) {
        cells_data[y] = new Array();
        for (let x = 0; x < width; x++) {
            cells_data[y][x] = 0;
        }
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    reDraw();
}

// フィールド再描画
function reDraw() {
    text_step.innerHTML = step;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawCell(x, y);
        }
    }
}

// セル描画
function drawCell(x, y) {
    ctx.fillStyle = COLOR_LIST[cells_data[y][x]];
    ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 1, CELL_SIZE - 1);
}

// ランダム配置
function setRandom() {
    for (let y = 0; y < height; y++) {
        cells_data[y] = new Array();
        for (let x = 0; x < width; x++) {
            cells_data[y][x] = Math.floor(Math.random() * COLOR_LIST.length * 2);

            if (cells_data[y][x] >= COLOR_LIST.length) cells_data[y][x] = 0;
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

    if (cells_data[idx_y][idx_x] == 0) {
        cells_data[idx_y][idx_x] = 1;
    } else {
        cells_data[idx_y][idx_x] = 0;
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
    step++;

    let temp_cells = new Array();
    for (let y = 0; y < height; y++) {
        temp_cells[y] = new Array();
        for (let x = 0; x < width; x++) {
            let living_cells = getLivingCells(x, y);

            let max_value = Math.max(...Object.values(color_of_cells));
            let keys = Object.keys(color_of_cells)
            let array = new Array();
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = color_of_cells[key];

                if (value == max_value) array.push(key);
            }

            if (cells_data[y][x] == 0) {
                if (living_cells == 3) {
                    let num = COLOR_LIST.indexOf(array[Math.floor(Math.random() * array.length)]);
                    temp_cells[y][x] = num;
                } else {
                    temp_cells[y][x] = 0;
                } 
            } else {
                if (living_cells == 2 || living_cells == 3) {
                    if (array.length == 1) {
                        temp_cells[y][x] = cells_data[y][x];
                    } else {
                        let num = COLOR_LIST.indexOf(array[Math.floor(Math.random() * array.length)]);
                        temp_cells[y][x] = num;
                    }
                } else {
                    temp_cells[y][x] = 0;
                }
            }
        }
    }

    cells_data = temp_cells;
    reDraw();
}

// 8近傍のセルの色の種類と数を取得
function getLivingCells(x, y) {
    for (let i = 0; i < COLOR_LIST.length; i++) {
        color_of_cells[COLOR_LIST[i]] = 0;
    }
    
    let living_cells_num = 0;
    for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
            if (dy == 0 && dx == 0) continue;

            let color_num = cells_data[(dy + y + height) % height][(dx + x + width) % width];
            if (color_num != 0) living_cells_num++;
            if (color_num != 0) color_of_cells[COLOR_LIST[color_num]]++;
        }
    }

    return living_cells_num;
}