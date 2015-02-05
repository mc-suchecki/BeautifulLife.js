/**
 * Game of Life implementation based on canvas.
 * @author Maciej 'mc' Suchecki
 */

var cellSize = 20;
var canvas = document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var context = canvas.getContext("2d");

function drawBoard() {
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

drawBoard();
