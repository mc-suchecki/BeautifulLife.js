/**
 * Game of Life implementation based on HTML5 canvas.
 * @author Maciej 'mc' Suchecki
 */

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

/**
 * The main class.
 */
var GameOfLife = {

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

    initializeBoard: function () {
        this.board = [];
        var row, i, j;
        for (i = 0; i < this.boardSize.height; i += 1) {
            row = [];
            for (j = 0; j < this.boardSize.width; j += 1) {
                row[j] = 0;
            }
            this.board[i] = row;
        }
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

        context.strokeStyle = "#DDDDDD";
        context.stroke();
    },

    init: function () {
        GameOfLife.setupFullScreenCanvas();
        GameOfLife.calculateBoardSizeAndCanvasMargin();
        GameOfLife.initializeBoard();
        GameOfLife.drawGrid();
    },

    // TODO change all these 3 functions, this is awful
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
    }
}

// connect the event handlers
addEvent(window, 'load', GameOfLife.init)
addEvent(window, 'resize', GameOfLife.init)

// connect the buttons to actions
// TODO mark the selected one somehow
addEvent(document.getElementById("cell-size-button-10"), 'click', GameOfLife.changeCellSizeTo10)
addEvent(document.getElementById("cell-size-button-20"), 'click', GameOfLife.changeCellSizeTo20)
addEvent(document.getElementById("cell-size-button-50"), 'click', GameOfLife.changeCellSizeTo50)
