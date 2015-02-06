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

    // parameters
    cellSize: 20,

    setupFullScreenCanvas : function () {
        var ratio = PIXEL_RATIO;
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var canvas = document.getElementById("canvas");
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return canvas;
    },

    drawGrid: function (canvas, cellSize) {
        var context = canvas.getContext("2d");

        // draw vertical lines
        for (var x = 0; x <= canvas.width; x += cellSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
        }

        // draw horizontal lines
        for (var x = 0; x <= canvas.height; x += cellSize) {
            context.moveTo(0, x);
            context.lineTo(canvas.width, x);
        }

        context.strokeStyle = "#DDDDDD";
        context.stroke();
    },

    init : function () {
        var cellSize = 20;
        var canvas = GameOfLife.setupFullScreenCanvas();
        GameOfLife.drawGrid(canvas, cellSize);
    }
}

// connect the event handlers
addEvent(window, 'load', GameOfLife.init)
addEvent(window, 'resize', GameOfLife.init)
