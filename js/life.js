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
function Cell(column, row) {
    this.column = column;
    this.row = row;
}

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
        var board = [], column;
        for (var x = 0; x < this.boardSize.width; x += 1) {
            column = [];
            for (var y = 0; y < this.boardSize.height; y += 1) {
                column[y] = random ? Math.round(Math.random()) : 0;
            }
            board[x] = column;
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
                if (this.board[x][y] === 1) {
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

    calculateNeighbours: function (x, y) {
        var total = (GameOfLife.board[x][y] !== 0) ? -1 : 0;
        var height = GameOfLife.boardSize.height;
        var width = GameOfLife.boardSize.width;
        for (var h = -1; h <= 1; h++) {
            for (var w = -1; w <= 1; w++) {
                if (GameOfLife.board[(width + (x + w)) % width][(height + (y + h)) % height] !== 0) {
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
                neighbours = GameOfLife.calculateNeighbours(w, h);
                if (GameOfLife.board[w][h] !== 0) {
                    if (neighbours === 2 || neighbours === 3) {
                        nextGenerationBoard[w][h] = 1;
                    }
                } else {
                    if (neighbours === 3) {
                        nextGenerationBoard[w][h] = 1;
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
            setTimeout(function () {
                GameOfLife.step();
            }, 200);
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
    changeCellSizeTo40: function () {
        GameOfLife.cellSize = 40;
        GameOfLife.init();
    },

    switchCellState: function (event) {
        var cell = GameOfLife.getCursorPosition(event);
        var state = GameOfLife.board[cell.column][cell.row] === 1 ? 0 : 1;
        GameOfLife.board[cell.column][cell.row] = state;
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

        return new Cell(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
    },

    drawPatternInTheMiddle: function (pattern) {
        // TODO check if pattern fits on the screen!
        GameOfLife.board = GameOfLife.createBoard(false);
        var middleX = Math.floor(this.boardSize.width / 2);
        var middleY = Math.floor(this.boardSize.height / 2);
        for (var i = 0, size = pattern.length; i < size; i++) {
            var coords = pattern[i];
            GameOfLife.board[middleX + coords.column][middleY + coords.row] = 1;
        }
        GameOfLife.refreshCanvas();
    },

    patternGenerators: {
        // Oscillators
        generateTrafficLight: function () {
            var trafficLight = [new Cell(3, -1), new Cell(3, 0), new Cell(3, 1), new Cell(-3, -1), new Cell(-3, 0), new Cell(-3, 1),
                new Cell(-1, 3), new Cell(0, 3), new Cell(1,3), new Cell(-1, -3), new Cell(0, -3), new Cell(1, -3)];
            GameOfLife.drawPatternInTheMiddle(trafficLight);
        },
        generatePrePulsar: function () {
            var prePulsar = [new Cell(2, -1), new Cell(2, 0), new Cell(2, 1), new Cell(3, -1), new Cell(3, 1),
                new Cell(4, -1), new Cell(4, 0), new Cell(4, 1), new Cell(-2, -1), new Cell(-2, 0), new Cell(-2, 1),
                new Cell(-3, -1), new Cell(-3, 1), new Cell(-4, -1), new Cell(-4, 0), new Cell(-4, 1)];
            GameOfLife.drawPatternInTheMiddle(prePulsar);
        },
        // Spaceships
        generateGlider: function () {
            var glider = [
                new Cell(-1, 1),
                new Cell(0, 1),
                new Cell(1, 1),
                new Cell(1, 0),
                new Cell(0,-1)
            ];
            GameOfLife.drawPatternInTheMiddle(glider);
        },
        generateLWSS: function () {
            var lwss = [
                new Cell(1, 3),
                new Cell(2, 3),
                new Cell(0, 2),
                new Cell(1, 2),
                new Cell(2, 2),
                new Cell(3, 2),
                new Cell(0, 1),
                new Cell(1, 1),
                new Cell(3, 1),
                new Cell(4, 1),
                new Cell(2, 0),
                new Cell(3, 0)
            ];
            GameOfLife.drawPatternInTheMiddle(lwss);
        },
        // Guns
        generateGosperGliderGun: function () {
            var gosperGun = [new Cell(4, -4), new Cell(2, -3), new Cell(4, -3), new Cell(-8, -2), new Cell(-7, -2),
                new Cell(0, -2), new Cell(1, -2), new Cell(14, -2), new Cell(15, -2), new Cell(-9, -1),
                new Cell(-5, -1), new Cell(0, -1), new Cell(1, -1), new Cell(14, -1), new Cell(15, -1),
                new Cell(-20, 0), new Cell(-19, 0), new Cell(-10, 0), new Cell(-4, 0), new Cell(0, 0), new Cell(1, 0),
                new Cell(-20, 1), new Cell(-19, 1), new Cell(-10, 1), new Cell(-6, 1), new Cell(-4, 1), new Cell(-3, 1),
                new Cell(2, 1), new Cell(4, 1), new Cell(-10, 2), new Cell(-4, 2), new Cell(4, 2), new Cell(-9, 3),
                new Cell(-5, 3), new Cell(-8, 4), new Cell(-7, 4)];
            GameOfLife.drawPatternInTheMiddle(gosperGun);
        },
        // Methuselahs
        generateAcorn: function () {
            var acorn = [new Cell(0, 0), new Cell(-2, -1), new Cell(-3, 1), new Cell(-2, 1),
                new Cell(1, 1), new Cell(2, 1), new Cell(3, 1)];
            GameOfLife.drawPatternInTheMiddle(acorn);
        },
        generateDiehard: function () {
            var diehard = [new Cell(1, 1), new Cell(2, 1), new Cell(3, 1), new Cell(2, -1),
                new Cell(-3, 0), new Cell(-3, 1), new Cell(-4, 0)];
            GameOfLife.drawPatternInTheMiddle(diehard);
        },
        generateRpentonimo: function () {
            var rpentonimo = [new Cell(0, 0), new Cell(0, 1), new Cell(0, -1), new Cell(-1, 0), new Cell(1, -1)];
            GameOfLife.drawPatternInTheMiddle(rpentonimo);
        }
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
addEvent(document.getElementById("cell-size-button-40"), 'click', GameOfLife.changeCellSizeTo40);

// switching cell state by clicking on the canvas
addEvent(document.getElementById("canvas"), 'click', GameOfLife.switchCellState);

// patterns
addEvent(document.getElementById("generate-glider-button"), 'click', GameOfLife.patternGenerators.generateGlider);
addEvent(document.getElementById("generate-lwss-button"), 'click', GameOfLife.patternGenerators.generateLWSS);
addEvent(document.getElementById("generate-glider-gun-button"), 'click', GameOfLife.patternGenerators.generateGosperGliderGun);
addEvent(document.getElementById("generate-traffic-light-button"), 'click', GameOfLife.patternGenerators.generateTrafficLight);
addEvent(document.getElementById("generate-pre-pulsar-button"), 'click', GameOfLife.patternGenerators.generatePrePulsar);
addEvent(document.getElementById("generate-acorn-button"), 'click', GameOfLife.patternGenerators.generateAcorn);
addEvent(document.getElementById("generate-diehard-button"), 'click', GameOfLife.patternGenerators.generateDiehard);
addEvent(document.getElementById("generate-r-pentomino-button"), 'click', GameOfLife.patternGenerators.generateRpentonimo);
