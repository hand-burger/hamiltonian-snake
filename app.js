var pos = 0;
var appleX = Math.floor(Math.random() * 20);
var appleY = Math.floor(Math.random() * 20);
var apple = false;
var snakeX = [];
var snakeY = [];
var path;
var c;
var ctx;
var speed = 1;
var progress = 0;
function backbite(n, path) {
  var i; 
  var j;
  var x; 
  var y;
  var dx;
  var dy;
  var xedge;
  var yedge;
  var iedge;
  var add_edge;
  var success;
  var temp;
  const itemp = Math.floor(Math.random() * 2);
  const nsq = n * n;

  x = path[nsq - 1][0];
  y = path[nsq - 1][1];
  xedge = ((x == 0) || (x == n - 1));
  yedge = ((y == 0) || (y == n - 1));
  if (xedge && yedge) {
    add_edge = Math.floor(Math.random() * 3) - 2;
  } else if (xedge || yedge) {
    add_edge = Math.floor(Math.random() * 3) - 1;
  } else {
    add_edge = Math.floor(Math.random() * 3);
  }
  success = (add_edge >= 0);
  iedge = 0;
  i = nsq - 4;
  while (iedge <= add_edge) {
    dx = Math.abs(x - path[i][0]);
    dy = Math.abs(y - path[i][1]);
    if (dx + dy == 1) {
      if (iedge == add_edge) {
        const jlim = (nsq - 1 - i - 1) / 2;
        for (j = 0; j < jlim; j++) {
          temp = path[nsq - 1 - j];
          path[nsq - 1 - j] = path[i + 1 + j];
          path[i + 1 + j] = temp;
        }
      }
      iedge++;
    }
    i -= Math.max(2, dx + dy - 1);
  }
  return success;
}

function generate_hamiltonian_path(n, q) {
  const path = new Array(n * n);
  var i; var j;
  var nsuccess; var
    nattempts;
  for (i = 0; i < n; i++) {
    if (i % 2 == 0) {
      for (j = 0; j < n; j++) {
        path[i * n + j] = [i, j];
      }
    } else {
      for (j = 0; j < n; j++) {
        path[i * n + j] = [i, n - j - 1];
      }
    }
  }
  nsuccess = 0;
  nattempts = 0;
  var nmoves = q * 10.0 * n * n * Math.pow(Math.log(2.0 + n), 2);
  while (nsuccess < nmoves) {
    var success = backbite(n, path);
    if (success){ 
	nsuccess++;
    nattempts++;
	}
  }
  for (i = 0; i < nattempts; i++) {
    success = backbite(n, path);
  }
  return path;
}
function generate_hamiltonian_circuit(n, q) {
  const path = generate_hamiltonian_path(n, q);
  const nsq = n * n;
  const min_dist = 1 + (n % 2);
  while (Math.abs(path[nsq - 1][0] - path[0][0]) + Math.abs(path[nsq - 1][1] - path[0][1]) !== min_dist) {
    success = backbite(n, path);
  }
  return path;
}

function drawGrid(){
ctx.strokeStyle = "black";
for (var i = 1; i <= 20; i++){
	ctx.moveTo(i * 20, 0);
	ctx.lineTo(i * 20, 400);
	ctx.stroke();
	ctx.moveTo(0, i * 20);
	ctx.lineTo(400, i * 20);
	ctx.stroke();
}
}

function clearCanvas(){
	ctx.clearRect(0, 0, 400, 400);
}
function drawRect(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * 20, appleY * 20, 20, 20);
	snakeX.unshift(path[pos][0]);
	snakeY.unshift(path[pos][1]);
	if(snakeX[0] == appleX && snakeY[0] == appleY){
		apple = true;
	}
	else
	{
		apple = false;
	}
    if(pos < 399){
    pos++;
    }else{
        pos = 0;
    }
	ctx.fillStyle = "green";
	for (var i = 0; i < snakeX.length; i++)
	{
		if (i == 0)
		{
			ctx.fillStyle = "#00f000";
		}
		else
		{
			ctx.fillStyle = "green";
		}
		ctx.fillRect(snakeX[i] * 20, snakeY[i] * 20, 20, 20);
	}
	if (!apple)
	{
		snakeX.pop();
		snakeY.pop();
	}
	else{
        if(progress == 400){
            progress = 400;
        }else{
            progress++;
        }
		appleX = Math.floor(Math.random() * 20);
		appleY = Math.floor(Math.random() * 20);
	}
}
function pBar(){
    document.getElementById("progress").value = progress;
    document.getElementById("outOf").innerHTML = `${progress} out of 400`;
}
function update(){
	clearCanvas();
	drawRect();
    pBar();
	}

function refresh_path() {
  myCanvas = document.getElementById("myCanvas");
  ctx = myCanvas.getContext("2d");
  var myWidth = 400;
  var myHeight = 400;
  const n = 20;
  const q = 1;
  path = generate_hamiltonian_circuit(n, q);
  var interval = setInterval(function(){update();}, speed);
  return;
}
