/**
 * Created by Si on 23/09/16.
 */

//Get viewport width/height
var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var canPaint = true;
//Create the canvas
var canvas = document.getElementById('canvas');
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
var context = canvas.getContext("2d");

$canvas = $('#canvas');

$canvas.bind("touchstart, mousedown", function(e){
    e.preventDefault();
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    if(canPaint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    }
});

$canvas.on("touchmove", function(e){
    e.preventDefault();
    if(canPaint) {
        addClick(e.originalEvent.touches[0].pageX - this.offsetLeft, e.originalEvent.touches[0].pageY - this.offsetTop, true);
        redraw();
    }
});

$canvas.bind("mousemove", function(e){
    if(canPaint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

$canvas.bind("touchend, mouseup", function(e){
    e.preventDefault();
    paint = false;
});


//$('#canvas').mouseleave(function(e){
//    paint = false;
//});


var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#ff0000";
    context.lineJoin = "round";
    context.lineWidth = 100;

    for(var i=0; i < clickX.length; i++) {
        context.beginPath();
        if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
    checkData();
}






// enumerate all pixels
// each pixel's r,g,b,a datum are stored in separate sequential array elements
function checkData(){

    var imgData = context.getImageData(0,0,canvas.width,canvas.height);
    var data = imgData.data;
    var totes = 0;

    for(var i=0; i<data.length; i+=4) {
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];
        var alpha = data[i+3];

        if (red == 255){
            totes+=4;
        }
    }

    console.log(data.length, totes);
    percentage_filled =  ( (data.length-totes) / data.length) * 100;
    console.log(percentage_filled);

    $('#display').text(100-Math.round(percentage_filled) + "%");
    $('#progress').css("width", 100-Math.round(percentage_filled) + "%");

    if(Math.floor(percentage_filled)==0){
        console.log("Done");
        end();
    }

}




function end(){
    //Funtion called when someone wins!

    //fill your screen red (slight bug cover up here)
    context.fillStyle="red";
    context.fillRect(0,0,canvas.width,canvas.height);
    //send message to everyone else that the game is over
    socket.emit('winner', me);
}

socket.on('winner', function(winner){
    //when the servers says someones one, stop the game and display the winner
    canPaint = false;
    $("#win").removeClass("animate");
    $("#win").find("#message").text(winner + " wins!");
    $("#win").addClass("animate");
});

$('#replay').on("click", function(e){
    //tell the server you want to restart the game
    socket.emit('restart', me);
});

socket.on('restart', function(msg){
    //when a user has requested a reset, restart the game
    restart();
});

//Functio to reset the game
function restart(){
    clickX = [];
    clickY = [];
    clickDrag = [];
    context.clearRect(0,0,canvas.width,canvas.height);
    canPaint = true;
    $("#win").removeClass("animate");
}
