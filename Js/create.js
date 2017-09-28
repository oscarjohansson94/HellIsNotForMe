/*
 * Place all functions being called during create phase
 * of state creation
 */

/*
 * Main function called by state
 */
function createState(game) {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.backgroundColor = "#fff4e0";
    createGame(game);
    createPlayerStairandInitEmptyWorld(game);
    game.time.events.loop(Phaser.Timer.SECOND * 0.5, function() {redrawMap(game);}, this);

    //Hud
    createHud(game,game.hudGroup);

    // Buttons
    createButtons(game, game.hudGroup);
    createText(game);
}


/*
 * Create the essential framework for the game
 */ 
function createGame(game) {
    // Set gravity
    game.physics.isoArcade.gravity.setTo(0, 0, -500);
    game.map = game.cache.getJSON('map');

    // Create groups
    game.floorGroup = game.add.group();
    game.enemyGroup = game.add.group(); 
    game.liquidGroup= game.add.group();
    game.hudGroup = game.add.group();
    game.obstacleGroup = game.add.group();
    game.walkingGroup = game.add.group();
    game.flyingGroup = game.add.group();
    game.abilityGroup = game.add.group();

    // Scale deping on game size
    game.scaleFactor = game.width / 1280;
    game.buttons =  [{unpressed: null, pressed: null},{unpressed: null, pressed: null},{unpressed: null, pressed: null},{unpressed: null, pressed: null}];
    game.buttonPosition = [{x: 22*game.scaleFactor,y:game.height - 109*game.scaleFactor},{x:140*game.scaleFactor ,y:game.height - 109*game.scaleFactor},{x: 254*game.scaleFactor ,y: game.height - 109*game.scaleFactor},{x: 369*game.scaleFactor  ,y: game.height - 109*game.scaleFactor}];

    // Name of buttons 
    game.buttonNames = ['Q','W','',''];

    // Increase world size
    game.nrTilesX = game.map.layers[0].width; 
    game.nrTilesY = game.map.layers[0].height;  
    var length = game.nrTilesY*tileSize; 
    var width = game.nrTilesX*tileSize; 
    var worldWidth = Math.sqrt(Math.pow(length, 2) + Math.pow(width, 2)); 
    game.world.setBounds(0, 0, length*2-4*tileSize, worldWidth*2-4*tileSize);
}

function createPlayerStairandInitEmptyWorld(game) {
    game.tiles = [];
    var heigth = game.map.layers[0].height;
    for( var y = 1; y < heigth - 1; y++) {
        game.tiles[y] = new Array(game.map.layers[0].width);
        for(var x = 1; x < game.map.layers[0].width - 1; x++){
            var objectType = game.map.layers[1].data[y*heigth+x];
            var object;
            if(objectType == objectEnum.STAIR) {
                object = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,'Stair', 0);
                object.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
                game.physics.isoArcade.enable(object);
                object.scale.setTo(0.4, 0.4);
                object.body.immovable = true;
                object.body.collideWorldBounds = true;
                game.stair = object;
            } else if(objectType ==  objectEnum.PLAYER) {

                game.player = game.add.isoSprite(x*tileSize - tileSize,y*tileSize - tileSize,0, 'PlayerSprite',0);
                createPlayer(game, game.player);
                // Camera should follow player
                game.camera.x = game.player.body.x;
                game.camera.y = game.player.body.y;
                game.camera.follow(game.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
            }
        }
    }
}

function createHud(game) {

    //Hud 
    game.hud = game.add.image(0,game.height-127*game.scaleFactor, 'Hud');
    game.hudGroup.add(game.hud);
    game.hud.fixedToCamera = true;
    game.hud.cropEnabled = true;
    game.hud.scale.setTo(game.scaleFactor,game.scaleFactor);

    // Healthbar
    game.healthBar = game.add.image(game.width - 343*game.scaleFactor,game.height - 108*game.scaleFactor, 'HealthBar');
    game.hudGroup.add(game.healthBar);
    game.healthBar.scale.setTo(game.scaleFactor, game.scaleFactor);
    game.healthBar.fixedToCamera = true;
    game.healthBar.cropEnabled = true;
    game.healthBar.maxWidth = game.healthBar.width;

    // Energybar
    game.energyBar = game.add.image(game.width - 343*game.scaleFactor,game.height - 54*game.scaleFactor, 'EnergyBar');
    game.energyBar.fixedToCamera = true;
    game.energyBar.cropEnabled = true;
    game.energyBar.scale.setTo(game.scaleFactor, game.scaleFactor);
    game.energyBar.maxWidth = game.energyBar.width;
    game.hudGroup.add(game.energyBar);
}


/*
 * Create buttons for HUD
 */
function createButtons(game) {

    // Add P as a pause button
    game.keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    game.keyP.onDown.add(function() {pause(game)}, this);
    game.keyF = game.input.keyboard.addKey(Phaser.Keyboard.F);
    game.keyF.onDown.add(function() {
        
    game.scale.startFullScreen(false);
    });

    // Add abilty keys if they are enabled
    for(var i = 0; i < 4; i++) {
        if(game.buttonState[i]){
            var pressed = game.add.image(game.buttonPosition[i].x,game.buttonPosition[i].y, game.buttonNames[i] + 'ButtonPressed');
            var unpressed = game.add.image(game.buttonPosition[i].x,game.buttonPosition[i].y, game.buttonNames[i] + 'Button');
            pressed.fixedToCamera = true;
            unpressed.fixedToCamera = true;
            pressed.cropEnabled = true;
            unpressed.cropEnabled = true;
            pressed.scale.setTo(game.scaleFactor, game.scaleFactor);
            unpressed.scale.setTo(game.scaleFactor, game.scaleFactor);
            pressed.visible = false;
            game.buttons[i].pressed = pressed;
            game.buttons[i].unpressed = unpressed;
            game.hudGroup.add(game.buttons[i].pressed);
            game.hudGroup.add(game.buttons[i].unpressed);
            if(game.buttonNames[i] == 'Q') {
                game.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
                game.keyQ.onDown.add(function() {ButtonDown(game, 0);}, this);
                game.keyQ.onUp.add(function() {ButtonUp(game, 0);},this);
            } else if(game.buttonNames[i] == 'W') {
                game.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
                game.keyW.onDown.add(function(){ButtonDown(game,1);},this);
                game.keyW.onUp.add(function(){ButtonUp(game,1);},this);
            } else if(game.buttonNames[i] == 'E') {
            } else if(game.buttonNames[i] == 'R') {
            }
        } else {
            var locked = game.add.image(game.buttonPosition[i].x,game.buttonPosition[i].y, 'ButtonLocked');
            locked.fixedToCamera = true;
            locked.cropEnabled = true;
            locked.scale.setTo(game.scaleFactor, game.scaleFactor);
            game.buttons[i].unpressed = locked;
            game.hudGroup.add(game.buttons[i].unpressed);
        }
    }    
}


/* 
 * Create intro title text
 */
function createText(game) {
    var style = { font: "30px Arial Black", fill: "#ffffff", align: "center", fontWeight: 'bold', stroke: '#000000', strokeThickness: 6 };
    var style2 = { font: "18px Arial Black", fill: "#ffffff", align: "center", fontWeight: 'bold', stroke: '#000000', strokeThickness: 6 };

    game.textTitle = game.add.text(game.width / 2, game.height*0.1, game.levelTitleText, style);
    game.textTitle.anchor.set(0.5);
    game.textTitle.alpha = 1.0;
    game.textTitle.fixedToCamera = true;
    game.textUnderTitle = game.add.text(game.width / 2, game.height*0.1 + 30, game.levelUnderTitleText, style2);
    game.textUnderTitle.anchor.set(0.5);
    game.textUnderTitle.alpha = 1.0;
    game.textUnderTitle.fixedToCamera = true;

    var word_l = game.levelTitleText.length + game.levelUnderTitleText.length;
    var time = 1000*(word_l/5)/(150/60);
    game.add.tween(game.textTitle).to( { alpha: 0.0 }, 500, "Linear", true, time);
    game.add.tween(game.textUnderTitle).to( { alpha: 0.0 }, 500, "Linear", true, time);
}


/* 
 * Redraw map to only display objects visible
 * to the player
 */
function redrawMap(game) {
    var out = {x: 0, y: 0};
    out.x = Math.ceil(game.player.body.x /tileSize  - 1)+1;
    out.y = Math.ceil(game.player.body.y/tileSize - 1)+1;
    var nrTilesX = game.map.layers[0].width;
    var nrTilesY = game.map.layers[0].height;
    var dist = 18;
    var xstart = Math.round(Math.max(1,out.x - dist));
    var ystart = Math.round(Math.max(1, out.y - dist));
    var xend = Math.round(Math.min(game.nrTilesX-1, out.x + dist));
    var yend = Math.round(Math.min(game.nrTilesY-1, out.y + dist));

    if(game.lastPlayerPos) {
        for(var y = game.lastPlayerPos.ys; y <= game.lastPlayerPos.ye; y++) {
            for(var x = game.lastPlayerPos.xs; x <= game.lastPlayerPos.xe; x++) {
                if(game.tiles[y] && game.tiles[y][x] ){
                    // && (y < ystart || y > yend || x < xstart || x > xend)){
                    game.tiles[y][x].destroy();
                }
            }
        }
    }
    for(var y = ystart; y <= yend; y++) {
        for(var x = xstart; x <= xend; x++) {
            if(game.tiles[y]) {
                // && (!game.lastPlayerPos ||  y < game.lastPlayerPos.ys || y >game.lastPlayerPos.ye || x <game.lastPlayerPos.xs || x > game.lastPlayerPos.xe)){
                game.tiles[y][x] = createTile(x,y,game);
            }
            if(game.map.layers[1].data[y*nrTilesY+x] == objectEnum.BAT) {
                game.map.layers[1].data[y*nrTilesY+x] = objectEnum.EMPTY;
                enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatSprite', 0, game.enemyGroup);
                createEnemy(enemy, 'EnemyBat', 100, 150, 75, 250, true);
            }
            else if(game.map.layers[1].data[y*nrTilesY+x] == objectEnum.BATRED) {
                console.log("creating red bat");
                game.map.layers[1].data[y*nrTilesY+x] = objectEnum.EMPTY;
                enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatRedSprite', 0, game.enemyGroup);
                //enemy.tint = Math.random() * 0xffffff;
                createEnemy(enemy, 'EnemyBatRed', 100, 90, 75, 400, true);
            } 

        }
    }
    game.lastPlayerPos = {ys: ystart, ye: yend, xs: xstart, xe: xend};
}

/* 
 * Create and return a tile
 */
function createTile(x, y, game) {
    var tile;
    var height = game.map.layers[0].height;
    var tileType = game.map.layers[0].data[y*height + x];
    if(floorSet.has(tileType)) {
        tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tiles', tileType-1, game.floorGroup);
        tile.anchor.set(0.5,1);
    }else if(lavaSet.has(tileType)) {
        tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tiles', tileType-1, game.liquidGroup);
        tile.isoZ += 6;
        game.liquidGroup.add(tile);
        game.physics.isoArcade.enable(tile);
        tile.body.collideWorldBounds = true;
        tile.anchor.set(0.5,1, 0);
        tile.body.immovable = true;
    } else if(tileType == tileEnum.BORDER){
        tile = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,null, 0, game.obstacleGroup);
        tile.enableBody = true;
        tile.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
        game.physics.isoArcade.enable(tile);
        tile.body.setSize(tileSize,tileSize+5,tileSize+5, 0 ,0, 0);
        tile.body.immovable = true;
        tile.body.collideWorldBounds = true;
        tile.anchor.set(0.5,1, 0);
    } else if (tileType == tileEnum.EMPTY) {
    } else {
        console.log("UNKNOWN TILE", tileType);
    }
    return tile;
}

/* 
 * Create enemy of type BAT
 * void
 */
function createEnemy(enemy, name, health, radius, size,speed, flying) {
    enemy.name = name;
    enemy.scale.setTo(0.3,0.3);
    enemy.anchor.set(0.5, 0.5, 0.5);
    enemy.animations.add(name  + 'Left', [0,1,2,3]);
    enemy.animations.add(name + 'FrontRight', [4,5,6]);
    enemy.animations.add(name + 'Right', [7,8,9,10]);
    enemy.animations.add(name + 'FrontLeft', [11,12,13]);
    enemy.animations.add(name + 'BackRight', [14,15,16]);
    enemy.animations.add(name + 'Back', [17,18,19,20]);
    enemy.animations.add(name + 'BackLeft', [21,22,23]);
    enemy.animations.add(name + 'Front', [24,25,26,27]);
    enemy.animations.play(name + 'Back', this.animationsSpeed, true);
    enemy.maxHealth = health;
    enemy.health = health;
    enemy.radius = radius;
    game.physics.isoArcade.enable(enemy);
    enemy.body.collideWorldBounds = true;
    enemy.body.setSize(size,size,size);
    enemy.speed =  speed;
    enemy.radiusStart = 0;
    enemy.radiuses = game.add.group();
    enemy.radiuses.visible = false;
    if(flying)
        game.flyingGroup.add(enemy);
    game.enemyGroup.add(enemy);
    var theta = enemy.radiusStart;  // angle that will be increased each loop
    var h = enemy.body.x; // x coordinate of circle center
    var k = enemy.body.y; // y coordinate of circle center
    var step = 15;  // amount to add to theta each time (degrees)
    while(theta < enemy.radiusStart + 360)
    { 
        var xx = radius*Math.cos(theta);
        var yy = radius*Math.sin(theta);
        var out = game.iso.project({x: xx, y: yy, z: 0});
        var sprite = game.add.isoSprite(enemy.body.x+xx,enemy.body.y+yy, 0, 'Radius');
        sprite.alpha = 0.85;
        sprite.scale.setTo(0.3,0.3);
        sprite.radius = enemy.radius;
        sprite.theta = theta;
        game.physics.isoArcade.enable(sprite);
        sprite.body.collideWorldBounds = true;
        theta += step;
        enemy.radiuses.add(sprite);
    }
}

/*
 * Create fire
 * fire object
 */
function createFire(game){
    fire = game.add.isoSprite(game.player.body.x,game.player.body.y,0, 'FireSprite',0);
    fire.scale.setTo(0.4, 0.4);
    fire.anchor.set(1,1);
    fire.animations.add('fire', [0,1,2,3]);
    fire.animations.play('fire',15, true);
    game.physics.isoArcade.enable(fire);
    fire.body.collideWorldBounds = true;
    return fire;
}
