//Game

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;
var game_score;
var flagpole;
var lives;
var platforms;
var birds;

function setup()
{
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 4;
    startGame();
    game_score = 0;
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [130, 0, 700, -1000, -1900, -2400];
    
    clouds = [
            {x_pos:0, y_pos:0, size:0},
            {x_pos:-1500, y_pos:100, size:0},
            {x_pos:-2000, y_pos:50, size:0},
            {x_pos:500, y_pos:10, size:0}
            ];
    
    mountains= [
            {x_pos:0, y_pos:0, size: 0},
            {x_pos:1000, y_pos:0, size:0},
            {x_pos:1500, y_pos:0, size:0},
            {x_pos:-800, y_pos: 0, size: 0},
            {x_pos:-1000, y_pos:0, size: 0},
            {x_pos:-1700, y_pos:0, size: 0},
            {x_pos:-2000, y_pos:0, size: 0}
            ];
    
    canyons = [
            {x_pos: 0, y_pos:0, size:100},
            {x_pos: 200,y_pos:0, size:100},
            {x_pos: 800,y_pos:0, size:100},
            {x_pos: -700,y_pos:0, size:100},
            {x_pos: -1200,y_pos:0, size:100},
            {x_pos: -1990,y_pos:0, size:100}
            ]
  
    collectables = [
            {x_pos: 200, y_pos: 100, size: 50, isFound:false},
            {x_pos: -700, y_pos: 100, size: 50, isFound:false},
            {x_pos: -900, y_pos: 100, size: 50, isFound:false},
            {x_pos: -1000, y_pos: 100, size: 50, isFound:false},
            {x_pos: -1600, y_pos: 100, size: 50, isFound:false},
            {x_pos: -2000, y_pos: 100, size: 50, isFound:false},
            {x_pos: -200, y_pos: 0, size: 50, isFound:false},
            {x_pos: -500, y_pos: 0, size: 50, isFound:false},
            {x_pos: -1700, y_pos: 0, size: 50, isFound:false}
            ]

    flagpole = {x_pos: -2100, isReached: false};
    
    lives -=1;
    
    platforms = [];
    platforms.push(createPlatform(0, floorPos_y-100,150));
    platforms.push(createPlatform(-1500, floorPos_y-100,150));
    platforms.push(createPlatform(-300, floorPos_y-100,150));
    
    birds = [];
    birds.push(new Bird(100, floorPos_y-300, 700));
    birds.push(new Bird(-1500, floorPos_y-250, 500));
    birds.push(new Bird(-200, floorPos_y-200, 900));
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    //Scrolling
    push();
    translate(scrollPos,0);
    
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
    // Draw canyons.
    for(var i = 0; i<canyons.length; i++)
    {
        drawCanyons(canyons[i]);
        checkCanyons(canyons[i]);
    }
    if(isPlummeting==true)
    {
        gameChar_y+=10;
    }
    
    //Losing lives
    if (gameChar_y > 574 && lives > 0)
    {
        startGame();
    }
    
	// Draw collectable items.
    for (var i = 0; i < collectables.length; i++)
    {
        if (collectables[i].isFound != true)
        {
            drawCollectables(collectables[i]);
            checkCollectables(collectables[i]);
        }
    }
    
    renderFlagpole(); 
    
    for (var i =0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    for (var i = 0; i < birds.length; i++)
    {
        birds[i].update();
        birds[i].draw();
    }
    
    //Flowers
    fill(0, 255, 0);
    rect(-100, floorPos_y-25, 8, 30);
    fill(255, 0, 0);
    ellipse(-96, floorPos_y-25, 15, 15);
    ellipse(-96, floorPos_y-35, 15, 25);
    ellipse(-105, floorPos_y-25, 25, 15);
    ellipse(-90, floorPos_y-25, 25, 15);
    ellipse(-105, floorPos_y-35, 15, 25);
    ellipse(-88, floorPos_y-35, 15, 25);
    fill(0, 255, 0);
    rect(-200, floorPos_y-25, 8, 30);
    fill(255, 255, 0);
    ellipse(-196, floorPos_y-25, 15, 15);
    ellipse(-196, floorPos_y-35, 15, 25);
    ellipse(-205, floorPos_y-25, 25, 15);
    ellipse(-190, floorPos_y-25, 25, 15);
    ellipse(-205, floorPos_y-35, 15, 25);
    ellipse(-188, floorPos_y-35, 15, 25);
    fill(0, 255, 0);
    rect(-600, floorPos_y-25, 8, 30);
    fill(0, 0, 255);
    ellipse(-596, floorPos_y-25, 15, 15);
    ellipse(-596, floorPos_y-35, 15, 25);
    ellipse(-605, floorPos_y-25, 25, 15);
    ellipse(-590, floorPos_y-25, 25, 15);
    ellipse(-605, floorPos_y-35, 15, 25);
    ellipse(-588, floorPos_y-35, 15, 25);
    fill(0, 255, 0);
    rect(-1000, floorPos_y-25, 8, 30);
    fill(255, 220, 215);
    ellipse(-996, floorPos_y-25, 15, 15);
    ellipse(-996, floorPos_y-35, 15, 25);
    ellipse(-1005, floorPos_y-25, 25, 15);
    ellipse(-990, floorPos_y-25, 25, 15);
    ellipse(-1005, floorPos_y-35, 15, 25);
    ellipse(-988, floorPos_y-35, 15, 25);
    fill(0, 255, 0);
    rect(-1500, floorPos_y-25, 8, 30);
    fill(255, 0, 0);
    ellipse(-1496, floorPos_y-25, 15, 15);
    ellipse(-1496, floorPos_y-35, 15, 25);
    ellipse(-1505, floorPos_y-25, 25, 15);
    ellipse(-1490, floorPos_y-25, 25, 15);
    ellipse(-1505, floorPos_y-35, 15, 25);
    ellipse(-1488, floorPos_y-35, 15, 25);
    fill(0, 255, 0);
    rect(-1700, floorPos_y-28, 8, 30);
    fill(255, 255, 0);
    ellipse(-1696, floorPos_y-25, 15, 15);
    ellipse(-1696, floorPos_y-35, 15, 25);
    ellipse(-1705, floorPos_y-25, 25, 15);
    ellipse(-1690, floorPos_y-25, 25, 15);
    ellipse(-1705, floorPos_y-35, 15, 25);
    ellipse(-1688, floorPos_y-35, 15, 25);
    
    pop();

    // Draw game character.
	drawGameChar();
    
    //Draw screen text
    //Scores
    fill(255);
    noStroke();
    text("Score: " + game_score, 20, 20);
    
    //Lives
    for(var i = 0; i < lives; i++)
    {   
        push();
        stroke(0);
        fill(255, 0, 0);
        rect([i]+10, 25, 35, 28);
        fill(0, 255, 0);
        rect([i]+10, 25, 25, 20);
        fill(0, 0, 255);
        rect([i]+10, 25, 15, 15);
        fill(255, 255, 0);
        rect([i]+10, 25, 8, 8);
        pop();
    }
    
        //Game Over
    if (lives < 1)
    {
        fill(255, 0,0);
        noStroke();
        textSize(25);
        text("Game over. Press space to continue!", 315, 60);
        return;
    }    
       //Level complete
    if (flagpole.isReached == true)
    {
        fill(255, 255, 0);
        noStroke();
        textSize(25)
        text("Level complete. Press space to continue!", 315, 60)
        return;
    }
    fill(255, 255, 0);
    ellipse(80, floorPos_y -350, 60, 60);
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y)
    {
        var isContact = false;
        for (var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {        
        gameChar_y += 5;
        isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }

    if(flagpole.isReached != true)
    {
        checkFlagpole();
    }
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if (keyCode == 37)
    {
        isLeft = true;
    }
    if (keyCode == 39)
    {
        isRight = true;
    }
      if(keyCode==32)
    {
        isFalling = true;
    }
    if (keyCode ==32 && gameChar_y == floorPos_y)
    {
        gameChar_y -=200;
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if (keyCode == 37)
    {
        isLeft = false;
    }
    if (keyCode == 39)
    {
        isRight = false;
    }
    if(keyCode==32)
    {
        isFalling = false;
        console.log("isFalling=" + isFalling);
    }
}

// Game character render function
// ------------------------------
// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
         //Body
        fill(139, 69, 19);
        ellipse(gameChar_x, gameChar_y-37, 40, 60);
        rect(gameChar_x, gameChar_y-67, 20, 60);
        ellipse(gameChar_x+15, gameChar_y-20, 20, 18);
        //Legs
        ellipse(gameChar_x-7, gameChar_y-8, 15, 20);
        ellipse(gameChar_x+9, gameChar_y-6, 15, 20);
        //Arms
        fill(160, 80, 25);
        ellipse(gameChar_x+13, gameChar_y -40, 10, 20);
        //Ears
        fill(139, 69, 19);
        triangle(gameChar_x+8, gameChar_y-77, gameChar_x-15, gameChar_y-50, gameChar_x+10, gameChar_y-50);
        triangle(gameChar_x+20, gameChar_y-77, gameChar_x+15, gameChar_y-50, gameChar_x-10, gameChar_y-50);
        //Eyes
        fill(0);
        ellipse(gameChar_x+5, gameChar_y-53, 5, 7);
        ellipse(gameChar_x-8, gameChar_y-53, 5, 7);
        //Nose
        triangle(gameChar_x-8, gameChar_y-47, gameChar_x-2, gameChar_y-37, gameChar_x+2, gameChar_y-47);
        stroke(0);
        line(gameChar_x+5, gameChar_y-38, gameChar_x-12, gameChar_y-38);
        //Teeth
        fill(255);
        stroke(255);
        rect(gameChar_x-10, gameChar_y-37, 5, 7);
        rect(gameChar_x-3, gameChar_y-37, 5, 7);
        stroke(0);
        line(gameChar_x-4, gameChar_y-37, gameChar_x-4, gameChar_y-29);
    }
	else if(isRight && isFalling)
	{
		// add your jumping-right code
         //Body
        fill(139, 69, 19);
        ellipse(gameChar_x, gameChar_y-37, 40, 60);
        rect(gameChar_x-20, gameChar_y-67, 20, 60);
        ellipse(gameChar_x-15, gameChar_y-20, 20, 18);
        //Legs
        ellipse(gameChar_x+7, gameChar_y-8, 15, 20);
        ellipse(gameChar_x-9, gameChar_y-6, 15, 20);
        //Arms
        fill(160, 80, 25);
        ellipse(gameChar_x-13, gameChar_y -40, 10, 20);
        //Ears
        fill(139, 69, 19);
        triangle(gameChar_x-8, gameChar_y-77, gameChar_x+15, gameChar_y-50, gameChar_x-10, gameChar_y-50);
        triangle(gameChar_x-20, gameChar_y-77, gameChar_x-15, gameChar_y-50, gameChar_x+10, gameChar_y-50);
        //Eyes
        fill(0);
        ellipse(gameChar_x-5, gameChar_y-53, 5, 7);
        ellipse(gameChar_x+8, gameChar_y-53, 5, 7);
        //Nose
        triangle(gameChar_x+8, gameChar_y-47, gameChar_x+2, gameChar_y-37, gameChar_x-2, gameChar_y-47);
        stroke(0);
        line(gameChar_x-4, gameChar_y-37, gameChar_x+12, gameChar_y-37);
          //Teeth
        fill(255);
        stroke(255);
        rect(gameChar_x+5, gameChar_y-36, 5, 7);
        rect(gameChar_x-2, gameChar_y-36, 5, 7);
        stroke(0);
        line(gameChar_x+4, gameChar_y-37, gameChar_x+4, gameChar_y-29);
	}
	else if(isLeft)
	{
		// add your walking left code
        //Body
        fill(139, 69, 19);
        ellipse(gameChar_x, gameChar_y-37, 40, 60);
        rect(gameChar_x, gameChar_y-67, 20, 60);
        ellipse(gameChar_x+15, gameChar_y-20, 20, 18);
        //Legs
        ellipse(gameChar_x-7, gameChar_y-8, 25, 10);
        ellipse(gameChar_x+9, gameChar_y-5, 25, 10);
        //Arms
        fill(160, 80, 25);
        ellipse(gameChar_x+10, gameChar_y -30, 7, 15);
        //Ears
        fill(139, 69, 19);
        triangle(gameChar_x+8, gameChar_y-77, gameChar_x-15, gameChar_y-50, gameChar_x+10, gameChar_y-50);
        triangle(gameChar_x+20, gameChar_y-77, gameChar_x+15, gameChar_y-50, gameChar_x-10, gameChar_y-50);
        //Eyes
        fill(0);
        ellipse(gameChar_x+5, gameChar_y-53, 5, 7);
        ellipse(gameChar_x-8, gameChar_y-53, 5, 7);
        //Nose
        triangle(gameChar_x-8, gameChar_y-47, gameChar_x-2, gameChar_y-37, gameChar_x+2, gameChar_y-47);
        stroke(0);
        line(gameChar_x+5, gameChar_y-38, gameChar_x-12, gameChar_y-38);
        //Teeth
        fill(255);
        stroke(255);
        rect(gameChar_x-10, gameChar_y-37, 5, 7);
        rect(gameChar_x-3, gameChar_y-37, 5, 7);
        stroke(0);
        line(gameChar_x-4, gameChar_y-37, gameChar_x-4, gameChar_y-29); 
	}
	else if(isRight)
	{
		// add your walking right code
        //Body
        fill(139, 69, 19);
        ellipse(gameChar_x, gameChar_y-37, 40, 60);
        rect(gameChar_x-20, gameChar_y-67, 20, 60);
        ellipse(gameChar_x-15, gameChar_y-20, 20, 18);
        //Legs
        ellipse(gameChar_x+7, gameChar_y-8, 25, 10);
        ellipse(gameChar_x-9, gameChar_y-5, 25, 10);
        //Arms
        fill(160, 80, 25);
        ellipse(gameChar_x-10, gameChar_y -30, 7, 15);
        //Ears
        fill(139, 69, 19);
        triangle(gameChar_x-8, gameChar_y-77, gameChar_x+15, gameChar_y-50, gameChar_x-10, gameChar_y-50);
        triangle(gameChar_x-20, gameChar_y-77, gameChar_x-15, gameChar_y-50, gameChar_x+10, gameChar_y-50);
        //Eyes
        fill(0);
        ellipse(gameChar_x-5, gameChar_y-53, 5, 7);
        ellipse(gameChar_x+8, gameChar_y-53, 5, 7);
        //Nose
        triangle(gameChar_x+8, gameChar_y-47, gameChar_x+2, gameChar_y-37, gameChar_x-2, gameChar_y-47);
        stroke(0);
        line(gameChar_x-4, gameChar_y-37, gameChar_x+12, gameChar_y-37);
          //Teeth
        fill(255);
        stroke(255);
        rect(gameChar_x+5, gameChar_y-36, 5, 7);
        rect(gameChar_x-2, gameChar_y-36, 5, 7);
        stroke(0);
        line(gameChar_x+4, gameChar_y-37, gameChar_x+4, gameChar_y-29);
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //Body
        fill(139, 69, 19);
        ellipse(gameChar_x, gameChar_y-37, 40, 70);
        //Legs
        ellipse(gameChar_x-10, gameChar_y-8, 12, 24);
        ellipse(gameChar_x+10, gameChar_y-8, 12, 24);
        //Arms
        ellipse(gameChar_x+10, gameChar_y-37, 30, 20);
        ellipse(gameChar_x-10, gameChar_y-37, 30, 20);
        //Ears
        triangle(gameChar_x-20, gameChar_y-77, gameChar_x-15, gameChar_y-50, gameChar_x+10, gameChar_y-50);
        triangle(gameChar_x+20, gameChar_y-77, gameChar_x+15, gameChar_y-50, gameChar_x-10, gameChar_y-50);
        //Eyes
        fill(0);
        ellipse(gameChar_x+8, gameChar_y-50, 5, 7);
        ellipse(gameChar_x-8, gameChar_y-50, 5, 7);
        //Nose
        triangle(gameChar_x-6, gameChar_y-45, gameChar_x, gameChar_y-35, gameChar_x+6, gameChar_y-45);
        stroke(0);
        line(gameChar_x+8, gameChar_y-35, gameChar_x-8, gameChar_y-35);
        //Teeth
        fill(255);
        stroke(255);
        rect(gameChar_x-5, gameChar_y-34, 5, 7);
        rect(gameChar_x, gameChar_y-34, 5, 7);
        stroke(0);
        line(gameChar_x, gameChar_y-35, gameChar_x, gameChar_y-27);
	}
	else
	{
		// add your standing front facing code
        //Body
        fill(139, 69, 19);
        ellipse(gameChar_x, gameChar_y-37, 40, 70);
        //Legs
        ellipse(gameChar_x-10, gameChar_y-5, 25, 15);
        ellipse(gameChar_x+10, gameChar_y-5, 25, 15);
        //Arms
        ellipse(gameChar_x+10, gameChar_y-30, 30, 15);
        ellipse(gameChar_x-10, gameChar_y-30, 30, 15);
        //Ears
        triangle(gameChar_x-20, gameChar_y-77, gameChar_x-15, gameChar_y-50, gameChar_x+10, gameChar_y-50);
        triangle(gameChar_x+20, gameChar_y-77, gameChar_x+15, gameChar_y-50, gameChar_x-10, gameChar_y-50);
        //Eyes
        fill(0);
        ellipse(gameChar_x+8, gameChar_y-50, 5, 7);
        ellipse(gameChar_x-8, gameChar_y-50, 5, 7);
        //Nose
        triangle(gameChar_x-6, gameChar_y-45, gameChar_x, gameChar_y-35, gameChar_x+6, gameChar_y-45);
        stroke(0);
        line(gameChar_x+8, gameChar_y-35, gameChar_x-8, gameChar_y-35);
        //Teeth
        fill(255);
        stroke(255);
        rect(gameChar_x-5, gameChar_y-34, 5, 7);
        rect(gameChar_x, gameChar_y-34, 5, 7);
        stroke(0);
        line(gameChar_x, gameChar_y-35, gameChar_x, gameChar_y-27);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {
        noStroke();
        fill(245,245,245);
        ellipse(clouds[i].x_pos+200, clouds[i].y_pos+100, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+170, clouds[i].y_pos+80, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+210, clouds[i].y_pos+80, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+160, clouds[i].y_pos+110, clouds[i].size+100, clouds[i].size+55);
        fill(245,245,245);
        ellipse(clouds[i].x_pos+300, clouds[i].y_pos+170, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+350, clouds[i].y_pos+170, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+370, clouds[i].y_pos+200, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+310, clouds[i].y_pos+200, clouds[i].size+100, clouds[i].size+55);
        ellipse(clouds[i].x_pos+260, clouds[i].y_pos+200, clouds[i].size+100, clouds[i].size+55);
        fill(255, 255, 0);
    } 
}

// Function to draw mountains objects.
function drawMountains()
{
    for (var i = 0; i <  mountains.length; i++)
    {
        fill(160,90,50);
        triangle(mountains[i].x_pos+380, mountains[i].y_pos+435, mountains[i].x_pos+580, mountains[i].y_pos+200, mountains[i].x_pos+750, mountains[i].y_pos+435);
        fill(255,222,173);
        ellipse(mountains[i].x_pos+650, mountains[i].y_pos+230, mountains[i].size+50, mountains[i].size+50);
        ellipse(mountains[i].x_pos+650, mountains[i].y_pos+280, mountains[i].size+70, mountains[i].size+60);
        ellipse(mountains[i].x_pos+590, mountains[i].y_pos+280, mountains[i].size+100, mountains[i].size+55);
        ellipse(mountains[i].x_pos+550, mountains[i].y_pos+275, mountains[i].size+100, mountains[i].size+55);
        ellipse(mountains[i].x_pos+590, mountains[i].y_pos+220, mountains[i].size+100, mountains[i].size+55);
        ellipse(mountains[i].x_pos+600, mountains[i].y_pos+250, mountains[i].size+100, mountains[i].size+55);
        ellipse(mountains[i].x_pos+565, mountains[i].y_pos+250, mountains[i].size+100, mountains[i].size+55);
        ellipse(mountains[i].x_pos+570, mountains[i].y_pos+270, mountains[i].size+100, mountains[i].size+55);
        fill(150,80,10);
        triangle(mountains[i].x_pos+480, mountains[i].y_pos+435, mountains[i].x_pos+650, mountains[i].y_pos+300, mountains[i].x_pos+840, mountains[i].y_pos+435);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
        //draw tree
        fill(165,42,42)
        rect(trees_x[i]+215, floorPos_y-91, 29.5, 91);
        fill(0,255,0)
        ellipse(trees_x[i]+215, floorPos_y-95, 60, 50);
        ellipse(trees_x[i]+220, floorPos_y-80, 60, 50);
        ellipse(trees_x[i]+215, floorPos_y-95, 60, 50);
        fill(0,230,0)
        ellipse(trees_x[i]+205, floorPos_y-95, 60, 50);   
        fill(0,250,0)
        ellipse(trees_x[i]+240, floorPos_y-90, 60, 50);
        ellipse(trees_x[i]+250, floorPos_y-90, 60, 50);
        ellipse(trees_x[i]+250, floorPos_y-93, 60, 50);
        fill(255,165,0)
        ellipse(trees_x[i]+210, floorPos_y-95, 9, 8);
        ellipse(trees_x[i]+230, floorPos_y-80, 9, 8);
        ellipse(trees_x[i]+215, floorPos_y-109, 9, 8);
        ellipse(trees_x[i]+260, floorPos_y-90, 9, 8);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyons(t_canyons)
{
    fill(47, 47, 255);
    rect(t_canyons.x_pos, floorPos_y, t_canyons.size*0+100, 200);
    fill(0, 0, 255);
    rect(t_canyons.x_pos, floorPos_y+70, t_canyons.size*0+100, 200);
    fill(0, 0, 130);
    rect(t_canyons.x_pos, floorPos_y+120, t_canyons.size*0+100, 200);
    //Fishes
    fill(255, 200, 60);
    ellipse(t_canyons.x_pos+15, floorPos_y+70, 15, 20);
    ellipse(t_canyons.x_pos+40, floorPos_y+70, t_canyons.size/2+10, 15);
    ellipse(t_canyons.x_pos+40, floorPos_y+70, t_canyons.size/2-40, 30);
    fill(50, 50, 50);
    ellipse(t_canyons.x_pos+60, floorPos_y+66, t_canyons.size/2-60, 5);
    ellipse(t_canyons.x_pos+60, floorPos_y+73, t_canyons.size/2-60, 5);
}

// Function to check character is over a canyon.
function checkCanyons(t_canyons)
{
    if(gameChar_world_x>=t_canyons.x_pos && (gameChar_y>=floorPos_y)&&(gameChar_world_x<=t_canyons.x_pos+t_canyons.size))
    {
        isPlummeting=true;
        gameChar_y+=10
        
    }
    else
    {
        isPlummeting=false
    }
}

// Collectable items render and check functions
// Function to draw collectable objects.

function drawCollectables(t_collectables)
{
    fill(0, 255, 0);
    triangle(t_collectables.x_pos+270, t_collectables.y_pos+270, t_collectables.x_pos+270, t_collectables.y_pos+250, t_collectables.x_pos+275, t_collectables.y_pos+260);
    fill(255, 128, 0);
    ellipse(t_collectables.x_pos+270, t_collectables.y_pos+294, t_collectables.size-40, t_collectables.size+10);
}

// Function to check character has collected an item.
function checkCollectables(t_collectables)
{
    //logic for collectable item
    //dist from item 529
    var dis=(dist(gameChar_world_x, gameChar_y, t_collectables.x_pos, t_collectables.y_pos));     
    if(dis<440 && dis > 420 && gameChar_y)
    {
        t_collectables.isFound = true;
        game_score +=1;
    }
}

//Creating flagpole
function renderFlagpole()
{
    push();
    stroke(0);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 150)
    
    if (flagpole.isReached)
    {
        noStroke();
        fill(255, 255, 0);
        rect(flagpole.x_pos, floorPos_y - 150, 50, 50);
        fill(0);
        ellipse(flagpole.x_pos+20, floorPos_y - 140, 10, 10);
        ellipse(flagpole.x_pos+40, floorPos_y - 130, 10, 10);
        fill(255);
        stroke(0);
        arc(flagpole.x_pos+25, floorPos_y-115, 30, 20, 0, PI + QUARTER_PI, CHORD);
    }
    else
    {
        noStroke();
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50); 
    }
    pop();
}
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d<50)
    {
        flagpole.isReached = true;
    } 
}

//Creating platforms
function createPlatform(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            stroke(0);
            strokeWeight(3);
            fill(255, 0, 0);
            rect(this.x, this.y, this.length, 20);
            fill(0, 255, 0);
            rect(this.x, this.y, this.length-100, 20);
            fill(0, 0, 255);
            rect(this.x+100, this.y, this.length-100, 20);  
        }, 
        checkContact: function(gc_x, gc_y)
        {
            //checks if game char is in contact with the platform
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if (d >=0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

//Creating birds
function Bird(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 2;
    
    this.draw = function()
    {
        noStroke();
        fill(105, 105, 105);
        ellipse(this.current_x, this.y -25, 40, 10);
        ellipse(this.current_x, this.y -20, 8, 15);
        ellipse(this.current_x+5, this.y -30, 8, 15);        
    }
    this.update = function()
    {
        this.current_x += this.incr;
        if(this.current_x < this.x)
        {
            this.incr = 2;
        }
        else if (this.current_x > this.x + this.range)
        {
            this.incr = -2;
        }
    }
}
