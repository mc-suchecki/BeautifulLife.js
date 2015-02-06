/**
 * Game of Life implementation based on HTML5 canvas.
 * @author Maciej 'mc' Suchecki
 */

// TODO check this file using JSLint

// TODO move all of the above to external file
/**
 * Adds new event handler properly, regardless of the browser.
 * @param elem element associated with the event
 * @param type type of the desired event
 * @param eventHandle the event handler to add
 */
var addEvent = function (elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle);
    } else {
        elem["on" + type] = eventHandle;
    }
};

/**
 * Stores the calculated pixel ratio for the device. Used to handle HiDPI displays.
 */
var PIXEL_RATIO = (function () {
    var context = document.createElement("canvas").getContext("2d"),
        devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

    return devicePixelRatio / backingStoreRatio;
})();
// TODO end of code not associated with the game

// TODO move this inside the game class
function Cell(row, column) {
    this.row = row;
    this.column = column;
};

/**
 * The main class.
 */
var GameOfLife = {

    // state
    isRunning: false,

    // settings
    cellSize: 20,

    // the board
    board: [],
    boardSize: {
        height: 0,
        width: 0
    },

    // the canvas
    canvas: document.getElementById("canvas"),
    canvasMargin: {
        vertical: 0,
        horizontal: 0
    },

    // TODO move dead/alive states to enum

    setupFullScreenCanvas: function () {
        var ratio = PIXEL_RATIO;
        this.canvas.width = document.body.clientWidth * ratio;
        this.canvas.height = document.body.clientHeight * ratio;
        this.canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    },

    calculateBoardSizeAndCanvasMargin: function () {
        this.boardSize.height = Math.floor(document.body.clientHeight / this.cellSize);
        this.boardSize.width = Math.floor(document.body.clientWidth / this.cellSize);
        this.canvasMargin.vertical = document.body.clientHeight % this.cellSize;
        this.canvasMargin.horizontal = (document.body.clientWidth % this.cellSize) / 2;
    },

    createBoard: function (random) {
        var board = [], row;
        for (var y = 0; y < this.boardSize.height; y += 1) {
            row = [];
            for (var x = 0; x < this.boardSize.width; x += 1) {
                row[x] = random ? Math.round(Math.random()) : 0;
            }
            board[y] = row;
        }
        return board;
    },

    initializeEmptyBoard: function () {
        this.board = this.createBoard(false);
    },

    initializeRandomBoard: function () {
        this.board = this.createBoard(true);
    },

    drawGrid: function () {
        var context = this.canvas.getContext("2d");

        // draw vertical lines
        for (var x = this.canvasMargin.horizontal; x <= this.canvas.width; x += this.cellSize) {
            context.moveTo(x, 0);
            context.lineTo(x, this.canvas.height - this.canvasMargin.vertical);
        }

        // draw horizontal lines
        for (var y = 0; y <= this.canvas.height; y += this.cellSize) {
            context.moveTo(this.canvasMargin.horizontal, y);
            context.lineTo(this.canvas.width - this.canvasMargin.horizontal, y);
        }

        context.strokeStyle = "#BBBBBB";
        context.stroke();
    },

    drawCells: function () {
        var context = this.canvas.getContext("2d");
        for (var x = 0; x < this.boardSize.width; x++) {
            for (var y = 0; y < this.boardSize.height; y++) {
                if (this.board[y][x] === 1) {
                    context.fillStyle = "#444444";
                } else {
                    context.fillStyle = "#FFFFFF";
                }
                context.fillRect(
                    x * this.cellSize + this.canvasMargin.horizontal + 1,
                    y * this.cellSize + 1, this.cellSize - 1, this.cellSize - 1
                );
            }
        }
    },

    refreshCanvas: function () {
        GameOfLife.drawGrid();
        GameOfLife.drawCells();
    },

    calculateNeighbours: function (y, x) {
        var total = (GameOfLife.board[y][x] !== 0) ? -1 : 0;
        var height = GameOfLife.boardSize.height;
        var width = GameOfLife.boardSize.width;
        for (var h = -1; h <= 1; h++) {
            for (var w = -1; w <= 1; w++) {
                if (GameOfLife.board[(height + (y + h)) % height][(width + (x + w)) % width] !== 0) {
                    total++;
                }
            }
        }
        return total;
    },

    generateNewPopulation: function () {
        var neighbours;
        var nextGenerationBoard = GameOfLife.createBoard(false);

        for (var h = 0; h < GameOfLife.boardSize.height; h++) {
            for (var w = 0; w < GameOfLife.boardSize.width; w++) {
                neighbours = GameOfLife.calculateNeighbours(h, w);
                if (GameOfLife.board[h][w] !== 0) {
                    if (neighbours === 2 || neighbours === 3) {
                        nextGenerationBoard[h][w] = 1;
                    }
                } else {
                    if (neighbours === 3) {
                        nextGenerationBoard[h][w] = 1;
                    }
                }
            }
        }
        GameOfLife.board = nextGenerationBoard;
    },

    step: function () {
        GameOfLife.generateNewPopulation();
        GameOfLife.refreshCanvas();
        if (GameOfLife.isRunning) {
            setTimeout(function() {
                GameOfLife.step();
            }, 500);
        }
    },

    runOrPause: function () {
        GameOfLife.isRunning = !GameOfLife.isRunning;
        if (GameOfLife.isRunning) {
            GameOfLife.step();
            document.getElementById("run-icon").style.display = "none";
            document.getElementById("pause-icon").style.display = "inline";
        } else {
            document.getElementById("run-icon").style.display = "inline";
            document.getElementById("pause-icon").style.display = "none";
        }
    },

    init: function () {
        GameOfLife.setupFullScreenCanvas();
        GameOfLife.calculateBoardSizeAndCanvasMargin();
        GameOfLife.initializeEmptyBoard();
        GameOfLife.refreshCanvas();
    },

    clearBoard: function () {
        GameOfLife.initializeEmptyBoard();
        GameOfLife.refreshCanvas();
    },

    randomizeBoard: function () {
        GameOfLife.initializeRandomBoard();
        GameOfLife.refreshCanvas();
    },

    // TODO change these 3 functions, this is awful
    changeCellSizeTo10: function () {
        GameOfLife.cellSize = 10;
        GameOfLife.init();
    },
    changeCellSizeTo20: function () {
        GameOfLife.cellSize = 20;
        GameOfLife.init();
    },
    changeCellSizeTo50: function () {
        GameOfLife.cellSize = 50;
        GameOfLife.init();
    },

    switchCellState: function (event) {
        var cell = GameOfLife.getCursorPosition(event);
        var state = GameOfLife.board[cell.row][cell.column] === 1 ? 0 : 1;
        GameOfLife.board[cell.row][cell.column] = state;
        GameOfLife.refreshCanvas();
    },

    getCursorPosition: function (event) {
        var x, y;
        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        x -= this.canvasMargin.horizontal;

        return new Cell(Math.floor(y / this.cellSize), Math.floor(x / this.cellSize));
    }
};

// connect the event handlers
addEvent(window, 'load', GameOfLife.init);
addEvent(window, 'resize', GameOfLife.init);

// connect the buttons to actions
addEvent(document.getElementById("run-button"), 'click', GameOfLife.runOrPause);
addEvent(document.getElementById("step-button"), 'click', GameOfLife.step);
addEvent(document.getElementById("clear-board-button"), 'click', GameOfLife.clearBoard);
addEvent(document.getElementById("generate-random-board-button"), 'click', GameOfLife.randomizeBoard);
// TODO mark the selected cell size somehow
addEvent(document.getElementById("cell-size-button-10"), 'click', GameOfLife.changeCellSizeTo10);
addEvent(document.getElementById("cell-size-button-20"), 'click', GameOfLife.changeCellSizeTo20);
addEvent(document.getElementById("cell-size-button-50"), 'click', GameOfLife.changeCellSizeTo50);

// switching cell state by clicking on the canvas
addEvent(document.getElementById("canvas"), 'click', GameOfLife.switchCellState);
