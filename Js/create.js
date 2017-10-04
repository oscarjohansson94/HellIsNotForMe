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
    game.bulletGroup = game.add.group();

    // Scale deping on game size
    game.scaleFactor = game.width / 1280;
    game.buttons =  [{unpressed: null, pressed: null},{unpressed: null, pressed: null},{unpressed: null, pressed: null},{unpressed: null, pressed: null}];
    game.buttonPosition = [{x: 22*game.scaleFactor,y:game.height - 109*game.scaleFactor},{x:140*game.scaleFactor ,y:game.height - 109*game.scaleFactor},{x: 254*game.scaleFactor ,y: game.height - 109*game.scaleFactor},{x: 369*game.scaleFactor  ,y: game.height - 109*game.scaleFactor}];

    // Name of buttons 
    game.buttonNames = ['Q','W','E','R'];

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
            if(objectType == objectEnum.STAIR || objectType == objectEnum.LOCKEDSTAIR){
                game.stair = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,'Stair', 0);
                game.stair.scale.setTo(0.4, 0.4);
                game.stair.animations.add('Normal', [0]);
                game.stair.animations.add('Locked', [1]);
                if(objectType == objectEnum.STAIR) {
                    game.stair.animations.play('Normal', 0, false);
                } else if(objectType == objectEnum.LOCKEDSTAIR) {
                    game.stair.animations.play('Locked', 0, false);
                }
                game.stair.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
                game.physics.isoArcade.enable(game.stair);
                game.stair.body.immovable = true;
                game.stair.body.collideWorldBounds = true;
            }else if(objectType ==  objectEnum.PLAYER) {

                game.player = game.add.isoSprite(x*tileSize - tileSize,y*tileSize - tileSize,0, 'PlayerSprite',0);
                createPlayer(game, game.player);
                // Camera should follow player
                game.camera.x = game.player.body.x;
                game.camera.y = game.player.body.y;
                game.camera.follow(game.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
            }
            else if(objectType == objectEnum.KEY) {
                object = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'Key', 0);
                game.physics.isoArcade.enable(object);
                object.body.immovable = true;
                object.body.collideWorldBounds = true;
                game.key = object;
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

    game.pauseButton = game.add.image(game.scaleFactor * 1200,10*game.scaleFactor, 'Pause');
    game.resetButton = game.add.image(game.scaleFactor*1146, 10*game.scaleFactor, 'Reset');
    game.pauseButton.fixedToCamera = true;
    game.resetButton.fixedToCamera = true;
    game.pauseButton.inputEnable = true;
    game.pauseButton.events.onInputDown.add(function() {console.log("p");pause(game);}, this);

    game.resetButton.events.onInputDown.add(function() {console.log("p");pause(game);}, this);
    game.hudGroup.add(game.pauseButton);
    game.hudGroup.add(game.resetButton);
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
                game.keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
                game.keyE.onDown.add(function(){ButtonDown(game,2);},this);
                game.keyE.onUp.add(function(){ButtonUp(game,2);},this);
            } else if(game.buttonNames[i] == 'R') {
                game.keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
                game.keyR.onDown.add(function(){ButtonDown(game,3);},this);
                game.keyR.onUp.add(function(){ButtonUp(game,3);},this);
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
                game.tiles[y][x] = createTile(x,y,game);
            }
            if(game.map.layers[1].data[y*nrTilesY+x] == objectEnum.BAT) {
                game.map.layers[1].data[y*nrTilesY+x] = objectEnum.EMPTY;
                enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatSprite', 0, game.enemyGroup);
                createEnemy(enemy, 'EnemyBat', 100, 150, 75, 250, true, 0xd700f9,true,false,0.3,0);
            }
            else if(game.map.layers[1].data[y*nrTilesY+x] == objectEnum.BATRED) {
                game.map.layers[1].data[y*nrTilesY+x] = objectEnum.EMPTY;
                enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatRedSprite', 0, game.enemyGroup);
                createEnemy(enemy, 'EnemyBatRed', 100, 90, 75, 400, true, 0xff3a3a,true,false,0.3,0);
            }  else if(game.map.layers[1].data[y*nrTilesY+x] == objectEnum.TOWER) {
                game.map.layers[1].data[y*nrTilesY+x] = objectEnum.EMPTY;
                enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'Tower', 0, game.enemyGroup);
                createEnemy(enemy, 'Tower', 100, 200, 75, 400, false, 0xffa500,false,true,0.8, 50);
            }  else if(game.map.layers[1].data[y*nrTilesY+x] == objectEnum.BOSS) {
                game.map.layers[1].data[y*nrTilesY+x] = objectEnum.EMPTY;
                game.boss = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'Boss', 0);
                createBoss(game);
            }  
        }
    }
    game.lastPlayerPos = {ys: ystart, ye: yend, xs: xstart, xe: xend};
}


function createBoss(game) {
    game.boss.anchor.set(0.5, 0.5, 1.0);
    game.boss.animations.add('Idle', [0,1,2]);
    game.boss.animations.add('WalkLeft', [3,4,5,6,7,8,9]);
    game.boss.animations.add('WalkRight', [10,11,12,13,14,15,16]);
    game.boss.animations.add('Spell', [20,21,22,23,24,25,26,27]);
    game.boss.animations.play('Idle', 3, true);
    game.boss.healthBar =  game.add.image(game.width/2 - 200*game.scaleFactor,0, 'HealthBar');
    game.boss.healthBar.scale.setTo(0.8,0.8);
    game.hudGroup.add(game.boss.healthBar);
    game.boss.healthBar.fixedToCamera = true;
    game.boss.healthBar.maxWidth = game.healthBar.width;
    console.log(game.healthBar.width);
    game.boss.maxHealth = 10;
    game.boss.health = 10;
    game.physics.isoArcade.enable(game.boss);
    game.boss.body.collideWorldBounds = true;
    game.boss.body.setSize(50,50,100);
    game.boss.body.offset.setTo(100,100,0);
    game.boss.actionEnum = {
        IDLE1: 0,
        WALK: 1,
        IDLE2: 2,
        SPELL: 3
    }
    game.boss.action = game.boss.actionEnum.IDLE1;
    game.boss.actionCounter = 0;
    game.boss.actionDuration = 200;
    game.boss.update = function(game) {
        if(game && game.boss && game.boss.actionEnum){
            game.boss.healthBar.width = game.boss.healthBar.maxWidth*Math.max(game.boss.health, 0)/game.boss.maxHealth;
            console.log(game.boss.healthBar.maxWidth, game.boss.health, game.boss.healthBar.width, game.boss.maxHealth);
            if(game.boss.actionCounter > game.boss.actionDuration) {
                //do action

                if(game.boss.action == game.boss.actionEnum.SPELL) {
                    var nr = Math.round(Math.random()*2) + 1;
                    var tx = 0;
                    var ty = 0;
                    var nrTilesX = game.map.layers[0].width;
                    var nrTilesY = game.map.layers[0].height;
                    if(Math.random() < 0.5) {
                        for(var i = 0; i < nr; i++) {
                            tx = Math.round(Math.random() * 17) + 6;
                            ty = Math.round(Math.random() * 12) + 12;
                            game.map.layers[0].data[ty*nrTilesY+tx] = tileEnum.LAVA02;
                        }
                    } else {
                        for(var i = 0; i < nr; i++) {
                            tx = Math.round(Math.random() * 17) + 6;
                            ty = Math.round(Math.random() * 12) + 12;
                            if(Math.random() < 0.5) {
                                game.map.layers[1].data[ty*nrTilesY+tx] = objectEnum.BAT;
                            } else {
                                game.map.layers[1].data[ty*nrTilesY+tx] = objectEnum.BATRED;
                            }
                        }
                    }
                }
                game.boss.action++;
                game.boss.action %= 4;
                if(game.boss.action == game.boss.actionEnum.IDLE1 ||
                    game.boss.action == game.boss.actionEnum.IDLE2) {
                    game.boss.animations.play('Idle', 3, true);
                    game.boss.body.velocity.x = 0;
                    game.boss.actionDuration = 300*Math.random();
                } else if(game.boss.action == game.boss.actionEnum.WALK) {
                    if(Math.random() > 0.5) {
                        game.boss.animations.play('WalkLeft', 3, true);
                        game.boss.body.velocity.x = -50;
                    } else {
                        game.boss.animations.play('WalkRight', 3, true);
                        game.boss.body.velocity.x = 50;
                    }
                    game.boss.actionDuration = 300*Math.random();
                } else if(game.boss.action == game.boss.actionEnum.SPELL) {
                    game.boss.animations.play('Spell', 3, true);
                    game.boss.body.velocity.x = 0;
                    game.boss.actionDuration = 150;
                }

                game.boss.actionCounter = 0;
            } else {
                game.boss.actionCounter++;
            }
        }
    }
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
        tile = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, -20,null, 0, game.obstacleGroup);
        tile.enableBody = true;
        tile.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
        game.physics.isoArcade.enable(tile);
        tile.body.setSize(tileSize,tileSize+5,tileSize*2, 0 ,0, 0);
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
function createEnemy(enemy, name, health, radius, size,speed, flying, color,moves,shoots,scale, shootingDelay) {
    enemy.name = name;
    enemy.scale.setTo(scale,scale);
    enemy.anchor.set(0.5, 0.5, 0.5);
    if(flying){
        enemy.animations.add(name  + 'Left', [0,1,2,3]);
        enemy.animations.add(name + 'FrontRight', [4,5,6]);
        enemy.animations.add(name + 'Right', [7,8,9,10]);
        enemy.animations.add(name + 'FrontLeft', [11,12,13]);
        enemy.animations.add(name + 'BackRight', [14,15,16]);
        enemy.animations.add(name + 'Back', [17,18,19,20]);
        enemy.animations.add(name + 'BackLeft', [21,22,23]);
        enemy.animations.add(name + 'Front', [24,25,26,27]);
        enemy.animations.play(name + 'Back', this.animationsSpeed, true);
    }
    enemy.maxHealth = health;
    enemy.delay = shootingDelay;
    enemy.delayCounter = 0;
    enemy.moves = moves;
    game.physics.isoArcade.enable(enemy);
    if(!enemy.moves){
        enemy.body.immovable = true;
    }
    enemy.shoots = shoots;
    enemy.health = health;
    enemy.radius = radius;
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
        sprite.tint = color;
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
