var pos = 0;
var appleX = Math.floor(Math.random() * 20);
var appleY = Math.floor(Math.random() * 20);
var apple = false;
var snakeX = [];
var snakeY = [];
var progress = 0;
var randX = 0;
var randY = 0;
var apples = [];
var snake = [];

function backbite(n,path){
    var i, j;
    var x, y;
    var dx, dy;
    var xedge, yedge;
    var iedge, add_edge;
    var success;
    // Choose one of the two endpoints at random.
    // Identify whether it is on the edge or not
    // Decide which edge will be added (if any)
    // Traverse walk, updating path
    var itemp=Math.floor(Math.random()*2);
    // Pre-compute n*n
    var nsq = n*n;
    if (itemp == 0)
    {
        // start at end: path[0]
        x = path[0][0];
        y = path[0][1];
        xedge = ((x == 0) || (x == n-1));
        yedge = ((y == 0) || (y == n-1));
        if (xedge && yedge)
        {
            // corner
            // 1/3 acceptance probability
            add_edge = Math.floor(Math.random()*3) - 2;
        }
        else if (xedge || yedge)
        {
            // edge
            // 2/3 acceptance probability
            add_edge = Math.floor(Math.random()*3) - 1;
        }
        else
        {
            // interior
            add_edge = Math.floor(Math.random()*3);
        }
        success = (add_edge >= 0);
        iedge = 0;
        i = 3;
        while(iedge<=add_edge)
        {
            dx = Math.abs(x - path[i][0]);
            dy = Math.abs(y - path[i][1]);
            if (dx+dy == 1)
            {
                // we have found an empty edge
                if (iedge == add_edge)
                {
                    // This is the edge we wish to add.
                    // reverse the walk from 0 to i-1
                    var jlim = (i-1)/2;
                    for (j=0; j<jlim; j++)
                    {
                        temp = path[j];
                        path[j] = path[i-1-j];
                        path[i-1-j] = temp;
                    }
                }
                iedge++;
            }
            // Can increment i by 2 due to bipartite nature of square
            // lattice
            // Even better: can increment by larger steps, but still
            // ensure that we never miss a neighbour
            i += Math.max(2,dx+dy-1);
        }
    }
    else
    {
        // start at end: path[nsq-1]
        x = path[nsq-1][0];
        y = path[nsq-1][1];
        xedge = ((x == 0) || (x == n-1));
        yedge = ((y == 0) || (y == n-1));
        if (xedge && yedge)
        {
            // corner
            // 1/3 acceptance probability
            add_edge = Math.floor(Math.random()*3) - 2;
        }
        else if (xedge || yedge)
        {
            // edge
            // 2/3 acceptance probability
            add_edge = Math.floor(Math.random()*3) - 1;
        }
        else
        {
            // interior
            add_edge = Math.floor(Math.random()*3);
        }
        success = (add_edge >= 0);
        iedge = 0;
        i = nsq-4;
        while(iedge<=add_edge)
        {
            dx = Math.abs(x - path[i][0]);
            dy = Math.abs(y - path[i][1]);
            if (dx+dy == 1)
            {
                // we have found an empty edge
                if (iedge == add_edge)
                {
                    // This is the edge we wish to add.
                    // reverse the walk from i+1 to n*n-1
                    var jlim = (nsq-1-i-1)/2;
                    for (j=0; j<jlim; j++)
                    {
                        temp = path[nsq-1-j];
                        path[nsq-1-j] = path[i+1+j];
                        path[i+1+j] = temp;
                    }
                }
                iedge++;
            }
            // Can decrement i by 2 due to bipartite nature of square lattice
            // Even better: can increment by larger steps, but still
            // ensure that we never miss a neighbour
            i -= Math.max(2,dx+dy-1);
        }
    }
    return success;
}

function generate_hamiltonian_path(n,q){
    var path = new Array(n*n);
    var i, j;
    var nsuccess, nattempts;
    for (i=0; i<n; i++){
        if (i % 2 == 0){
            for (j=0; j<n; j++){
                path[i*n+j] = [i,j];
            }
        }
        else{
            for (j=0; j<n; j++){
                path[i*n+j] = [i,n-j-1];
            }
        }
    }
    //Now we attempt to apply backbite move repeatedly
    // Our stopping criterion is that we want the random
    // walk to have `covered' the whole grid.
    // 20*n*n successful moves is clearly not enough,
    // by inspection on 100x100 grid.
    // Take 10*n*n*n. By inspection this is enough, but slow.
    // Relevant time for equilibrium is the cover time for an nxn grid.
    // This is O(n^2 log^2 n)
    // So ... could take const. * n^2 * log^2 n
    // By inspection, this does a good job, and is asymptotically faster
    // than previous proposol of O(n^3)
    nsuccess = 0;
    nattempts = 0;
    // Constant factor is a guess which is based on appearance - could
    // experiment with making factor a bit smaller than 10.0, e.g. 5.0
    // for faster run time, or maybe doubling it to 20.0 to ensure that
    // the resulting path is truly random.
    // For this reason, quality factor q introduced for
    // user to manipulate.
    nmoves = q*10.0 * n * n * Math.pow(Math.log(2.+n),2);

    while(nsuccess < nmoves)
    {
        success = backbite(n,path);
        if (success) nsuccess++;
        nattempts++;
    }

    // Now we apply the same number of attempts.
    // N.B.: if we just tested the number of successful moves then the
    // result would be biased. (i.e. not truly 'random'), because it
    // would be conditional on the last attempted move being successful
    for (i=0; i<nattempts; i++)
    {
        success = backbite(n,path);
    }
    return path;
}

function generate_hamiltonian_circuit(n,q){
    //run the hamiltonian path generator function to get an array of values for a path
    var path = generate_hamiltonian_path(n,q);
    var nsq = n*n;
    var success;
    var min_dist = 1 + (n % 2);

    //while path is not a circuit it does the backbite algorithm, checks to insure it's not already a circuit
    while (Math.abs(path[nsq-1][0] - path[0][0]) + Math.abs(path[nsq-1][1] - path[0][1]) != min_dist){
        //run the backbite algorithm to turn the path from the previous function to a circuit
        success = backbite(n,path);
    }
    return path;
}

function draw_path(ctx, path, y, square){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, y, y);
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * square, appleY * square, square, square);

    // add to the start of snake array the values from path
	snakeX.unshift(path[pos][0]);
	snakeY.unshift(path[pos][1]);

	if(snakeX[0] == appleX && snakeY[0] == appleY){
        // apple collected because they on the same grid square
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
		ctx.fillRect(snakeX[i] * square, snakeY[i] * square, square, square);
	}
	if (!apple){
        // because its continuing to grow either way it checks the apple isn't collected so it removes the last square from the chain
		snakeX.pop();
		snakeY.pop();
	}
	else{
        apples.length = 0;
        apples.push(appleX, appleY);
        if(progress == 400){
            // if score gets to 400 it stays there instead of continuing past
            progress = 400;
        }else{
            progress++;
            //console.log(progress);
        }
        // spawn new apple
		appleX = Math.floor(Math.random() * 20);
		appleY = Math.floor(Math.random() * 20);
    }
}

function progBar(){
    document.getElementById('progress').value = progress;
    document.getElementById('outOf').innerHTML = `${progress} out of 400`;
}

function update(ctx, path, y, square){
    draw_path(ctx, path, y, square);
    progBar();
}

function refresh_path(){
    //start here
    var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    // alert(x + ' x ' + y);
    y = Math.ceil(y *= 0.75);
    document.getElementById('path_canvas').width = y;
    document.getElementById('path_canvas').height = y;
    var square = y/20;
    var font = y*0.03;

    document.getElementById('bod').style.fontSize = font + 'px';

    var canvas = document.getElementById('path_canvas');
    var ctx = canvas.getContext('2d');
    var n = 20;
    var q = 1;
    var speed = 1;
    var path;

    //run the hamiltonian circuit function
    path = generate_hamiltonian_circuit(n ,q);

    console.log(path);

    //for drawing the game
    var interval = setInterval(function() {update(ctx, path, y, square); }, speed);
    return;
}