/**
 * Game of Life implementation based on canvas.
 * @author Maciej 'mc' Suchecki
 */

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

function setupFullScreenCanvas() {
    var ratio = PIXEL_RATIO;
    console.log(PIXEL_RATIO);
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    var canvas = document.getElementById("canvas");
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
}

function drawBoard(canvas, cellSize) {
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
}

function init() {
    var cellSize = 20;
    var canvas = setupFullScreenCanvas();
    drawBoard(canvas, cellSize);
}

init();
