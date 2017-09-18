var animationSpeed = 7;
var showDebug = true;

function debug(game, player){
    if(showDebug){
        game.debug.body(player, 'rgba(189, 221, 235, 0.6)', false);
        game.obstacleGroup.forEach(function(tile){
            game.debug.body(tile, 'rgba(0, 255, 0, 0.9)', false);
        });
        game.debug.body(game.stair, 'rgba(255, 0, 0, 0.6)', false);
        if(game.player.target) 
            game.debug.body(game.player.target, 'rgba(255, 0, 0, 0.6)', false);
    }
}

tileEnum = {
    EMPTY: 0,
    FLOOR01: 1,
    LAVA: 2,
    BORDER: 3
}

enemyEnum = {
    EMPTY: 0,
    BAT: 1,
    STAIR: 2
}


function preloadState(game) {
    loadAssets(game);
    preloadGame(game);
}

function createState(game) {
    createGame(game);
    createBitmap(game);

    // Create player
    game.player = game.add.isoSprite(game.map.start.x * tileSize,game.map.start.y * tileSize,0, 'PlayerSprite',0);
    createPlayer(game.player);

    // Camera should follow player
    game.camera.follow(game.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    //Hud
    createHud(game,game.hudGroup);

    // Buttons
    createButtons(game, game.hudGroup);
    createText(game);
}

function updateState(game) {
    game.player.update(game);
    updateLiquid(game.liquidGroup);

    // Scale health and energy bar deping on life
    game.healthBar.width = game.healthBar.maxWidth*Math.max(game.player.health, 0)/game.player.maxHealth;
    game.energyBar.width = game.energyBar.maxWidth*Math.max(game.player.energy, 0)/game.player.maxEnergy;

    // Clear radius drawing
    game.bitmapData.clear();

    updateEnemies(game);
    // Check for border collision
    game.obstacleGroup.forEach(function(b) {
        game.physics.isoArcade.collide(b,game.player);
    });
    game.physics.isoArcade.collide(game.stair, game.player, function() {
        game.camera.fade('#000000');
        game.camera.onFadeComplete.add(function () {nextLevel(game)},this);
    })
    sortGame(game);
    game.player.endOfFrame();
}

function renderState(game) {
    debug(game, game.player);
    game.debug.text(game.time.fps, 2, 14, "#a7aebe");
}


/* 
 * sort to display correct object above other
 */
function sortGame(game) {
    game.world.bringToTop(game.enemyGroup);
    game.world.bringToTop(game.player);
    game.world.bringToTop(game.hudGroup);
    game.world.bringToTop(game.abilityGroup);
}



function generateMap(game) {
    for( var y = 1; y < game.nrTilesY - 1; y++) {
        for(var x = 1; x < game.nrTilesX - 1; x++){
            // Generate tile
            var tileType = game.map.tiles[y][x];
            var tile;
            if(tileType == tileEnum.FLOOR01) {
                tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', game.map.tiles[y][x] - 1, game.floorGroup);
                tile.anchor.set(0.5,1);
            } else if(tileType == tileEnum.LAVA) {
                tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', game.map.tiles[y][x] - 1, game.liquidGroup);
                tile.isoZ += 6;
                game.liquidGroup.add(tile);
                game.physics.isoArcade.enable(tile);
                tile.body.collideWorldBounds = true;
                tile.anchor.set(0.5,1);
                tile.body.immovable = true;
            } else if(tileType == tileEnum.BORDER){
                tile = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,null, 0, game.obstacleGroup);
                tile.enableBody = true;
                tile.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
                game.physics.isoArcade.enable(tile);
                tile.body.setSize(tileSize,tileSize+1,tileSize+1, 0 ,0, 0);
                tile.body.immovable = true;
                tile.body.collideWorldBounds = true;
                tile.anchor.set(0.5,1);
            } else {
                // EMPTY TILE
            }

            //Generate enemy{
            var enemyType = game.map.enemies[y][x];
            var enemy;
            if(enemyType == enemyEnum.BAT) {
                enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatSprite', 0, game.enemyGroup);
                enemy.radiusStart = 0;
                createBat(enemy);
                game.flyingGroup.add(enemy);
                game.enemyGroup.add(enemy);
            }
            else if(enemyType == enemyEnum.STAIR) {
                enemy = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,'Stair', 0);
                enemy.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
                game.physics.isoArcade.enable(enemy);
                enemy.scale.setTo(0.4, 0.4);
                enemy.body.immovable = true;
                enemy.body.collideWorldBounds = true;
                game.stair = enemy;
            }
        }
    }
}

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

    game.add.tween(game.textTitle).to( { alpha: 0.0 }, 500, "Linear", true, 2000);
    game.add.tween(game.textUnderTitle).to( { alpha: 0.0 }, 500, "Linear", true, 2000);
}


function createGame(game) {
    // Set gravity
    game.physics.isoArcade.gravity.setTo(0, 0, -500);

    // Set background color
    game.stage.backgroundColor = "#000000";
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
    game.buttonNames = ['Q','W','',''];
}

function createBitmap(game) {
    game.bitmapData = game.make.bitmapData(game.width*2, game.height*2);
    game.bitmapData.addToWorld();
    game.bitmapDataBrush = game.make.bitmapData(32, 32);
    game.bitmapDataBrush.circle(2, 2, 2, 'rgba(24,234,236,1)');
    generateMap(game);
}


function preloadGame(game) {
    game.time.advancedTiming = true;
    game.plugins.add(new Phaser.Plugin.Isometric(game));
    game.iso.anchor.set(0.5, 0);

    // Increase world size
    game.nrTilesX = game.map.tiles[0].length; 
    game.nrTilesY = game.map.tiles.length;  
    var length = game.nrTilesY*tileSize; 
    var width = game.nrTilesX*tileSize; 
    var worldWidth = Math.sqrt(Math.pow(length, 2) + Math.pow(width, 2)); 
    game.world.setBounds(0, 0, length*2-4*tileSize, worldWidth*2-4*tileSize);

    // Isometric
    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
}

function loadAssets(game){
    game.load.spritesheet('PlayerSprite', '../Res/Images/SpriteSheet/PlayerAtlas.png', 162.83,212, 67); 
    game.load.spritesheet('EnemyBatSprite', '../Res/Images/SpriteSheet/EnemyBat.png', 272, 282, 28);
    game.load.spritesheet('FireSprite', '../Res/Images/SpriteSheet/fireAnimation.png', 142,238, 4); 
    game.load.spritesheet('Shield', '../Res/Images/SpriteSheet/Shield.png', 201,100, 8); 
    game.load.image('HealthBar', '../Res/Images/SpriteSheet/healthBar.png');
    game.load.image('EnergyBar', '../Res/Images/SpriteSheet/energyBar.png');
    game.load.image('Hud', '../Res/Images/SpriteSheet/Hud.png');
    game.load.image('QButton', '../Res/Images/SpriteSheet/QButton.png');
    game.load.image('QButtonPressed', '../Res/Images/SpriteSheet/QButtonPressed.png');
    game.load.image('WButton', '../Res/Images/SpriteSheet/WButton.png');
    game.load.image('WButtonPressed', '../Res/Images/SpriteSheet/WButtonPressed.png');
    game.load.image('Stair', '../Res/Images/SpriteSheet/Stair.png');
    game.load.image('ButtonLocked', '../Res/Images/SpriteSheet/ButtonLocked.png');
    // Load map tiles
    game.load.atlasJSONHash('tileset', '../Res/Images/Tiles/tiles.png', '../Res/Images/Tiles/tiles.json');
}


/*
 * Create the player
 * void
 */
function createPlayer(player) {

    player.scale.setTo(0.3,0.3);
    player.anchor.set(1,1);

    player.animations.add('IdlePlayerRight', [0,1,2,3]);
    player.animations.add('IdlePlayerLeft', [24,25,26,27]);
    player.animations.add('IdlePlayerBackLeft', [36,37,38,39]);
    player.animations.add('IdlePlayerFrontRight', [32,33,34,35]);
    player.animations.add('IdlePlayerFrontLeft', [44,45,46,47]);
    player.animations.add('IdlePlayerBackRight', [48,49,50,51]);
    player.animations.add('IdlePlayerFront', [57,58,59,60,61]);
    player.animations.add('IdlePlayerBack', [62,63,63,64,65]);
    player.animations.add('RunPlayerFrontLeft', [4,5,6,7]);
    player.animations.add('RunPlayerFrontRight', [8,9,10,11]);
    player.animations.add('RunPlayerBackRight', [12,13,14,15]);
    player.animations.add('RunPlayerFront', [16,17,18,19]);
    player.animations.add('RunPlayerBackLeft', [20,21,22,23]);
    player.animations.add('RunPlayerRight', [28,29,30,31]);
    player.animations.add('RunPlayerLeft', [40,41,42,43]);
    player.animations.add('RunPlayerBack', [52,53,54,55,56]);

    player.animations.play('IdlePlayerFront', 7, true);
    player.maxHealth = 100;
    player.health = 100;
    player.maxEnergy = 100;
    player.energy = 100;
    player.speed = 300;
    player.shield = false;
    player.burning = false;
    player.fire = null;
    player.damage = 0;
    player.angleToTarget = 0;
    player.energyDrain = 0;
    player.targetReached = false;
    player.target = game.add.isoSprite(0, 0,0, '', 0);
    player.target.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
    game.physics.isoArcade.enable(player.target);
    player.target.body.immovable = true;
    player.target.body.collideWorldBounds = true;
    player.target.anchor.set(0.5, 0.5, 0.5);
    player.target.body.setSize(10,10, 10);

    // EnergyShield
    player.Shield = game.add.isoSprite(0, 0,0,'Shield',0);
    player.Shield.animations.add('Idle', [0,1,2,3]);
    endAnim = player.Shield.animations.add('End', [7,6,5,4]);
    startAnim = player.Shield.animations.add('Start', [4,5,6,7]);
    startAnim.onLoop.add(function() {
        player.Shield.animations.play('Idle', 10, true);
    }, player.Shield);
    endAnim.onLoop.add(function() {
        player.Shield.visible = false;
        player.Shield.animations.stop();
    }, player.Shield);

    player.Shield.visible = false;
    player.Shield.fixedToCamera = true;
    game.physics.isoArcade.enable(player.Shield);
    player.Shield.collideWorldBounds = true;
    player.Shield.scale.setTo(0.5, 0.2);
    game.abilityGroup.add(player.Shield);

    player.takeDamage = function(damage) { 
        player.damage += damage;
    };

    player.reduceEnergy = function(energy) {
        player.energyDrain += energy;
    }

    player.updateFire = function(map) {
        if(player.burning){
            player.fire.body.x = player.body.x;
            player.fire.body.y = player.body.y;
            player.takeDamage(1);
        }

        if(!player.Shield.visible && !player.burning && getTile(player.body.x, player.body.y, game.map) == tileEnum.LAVA){
            player.burning = true;
            player.fire = createFire(game);

        } else if((game.player.burning && getTile(game.player.body.x, game.player.body.y, game.map) != tileEnum.LAVA) 
            || (player.Shield.visible && player.burning)){
            player.fire.destroy();
            player.burning = false;
        }
    };

    player.updateMove = function(){

        // Get angle between pointer and player

        if(player.target.body)
            player.angleToTarget = Math.atan2(player.target.body.y - player.body.y, player.target.body.x - player.body.x);
        if(game.input.activePointer.isDown) {
            var out = {x: 0, y: 0};
            game.iso.unproject(game.input.activePointer.position, out);
            if(getTile(out.x, out.y, game.map) != 0 && getTile(out.x, out.y, game.map) != 3) {
                player.target.body.x = out.x;
                player.target.body.y = out.y;
                player.moving = true;
            }

        }
        if(player.moving) {
            game.physics.isoArcade.collide(player,player.target, function() {player.targetReached = true;});
            if(player.targetReached){
                player.moving = false;
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                player.animations.play('IdlePlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
                player.targetReached = false;
            } else { 
                player.animations.play('RunPlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
                player.body.velocity.x = Math.cos(player.angleToTarget) * player.speed;
                player.body.velocity.y = Math.sin(player.angleToTarget) * player.speed;
            }
        }

    }

    player.updateRadius = function(game) {

        // Drain energy
        if(game.showRadius) {
            player.reduceEnergy(1);
            if(player.energy <= 0){
                ButtonUp(game, 0);
            }
        } 
    }
    player.updateShield = function() {
        if(player.Shield.visible) {
            player.reduceEnergy(1);
            player.Shield.body.x = player.body.x;
            player.Shield.body.y = player.body.y ;
            player.Shield.body.z = player.body.z + 25;
            if(player.energy <= 0) {
                ButtonUp(game,0);
            }
        }

    }

    player.checkDeath = function(game) {
        // Die
        if(player.health <= 0){
            game.camera.fade('#000000');
            game.camera.onFadeComplete.add(function () {die(game)},this);
        }
    }

    player.update = function(game) {
        if(game){
            player.updateMove();
            player.updateFire(game.map);
            player.updateShield();
            player.updateRadius(game);
            player.checkDeath(game);
        }
    }

    player.endOfFrame = function() {
        if(player.damage) {
            player.health -= player.damage;
            player.damage = 0;
        } else if(player.health < player.maxHealth) {
            player.health++;
        }
        if(player.energyDrain) {
            player.energy -= player.energyDrain;
            player.energyDrain = 0;
        } else if(player.energy < player.maxEnergy) {
            player.energy++;
        }
    }

    game.physics.isoArcade.enable(player);
    player.body.collideWorldBounds = true;
}

/* 
 * Create enemy of type BAT
 * void
 */
function createBat(enemy) {
    enemy.name = 'EnemyBat';
    enemy.scale.setTo(0.3,0.3);
    enemy.anchor.set(0.5, 0.5);
    enemy.animations.add('EnemyBatLeft', [0,1,2,3]);
    enemy.animations.add('EnemyBatFrontRight', [4,5,6]);
    enemy.animations.add('EnemyBatRight', [7,8,9,10]);
    enemy.animations.add('EnemyBatFrontLeft', [11,12,13]);
    enemy.animations.add('EnemyBatBackRight', [14,15,16]);
    enemy.animations.add('EnemyBatBack', [17,18,19,20]);
    enemy.animations.add('EnemyBatBackLeft', [21,22,23]);
    enemy.animations.add('EnemyBatFront', [24,25,26,27]);
    enemy.animations.play('EnemyBatBack', this.animationsSpeed, true);
    enemy.maxHealth = 100;
    enemy.health = 100;
    enemy.radius = 150;
    game.physics.isoArcade.enable(enemy);
    enemy.body.collideWorldBounds = true;
    enemy.minAttackDistance = 25;
    enemy.speed =  200;
}


/*
 * Get the right animation suffix depinding on angle
 * string
 */
function getAnimationDirection(angle) {
    var pi = Math.PI;
    if(angle >= -pi/8 && angle <= pi/8){
        return 'Right';
    } else if(angle >= pi/8 && angle <= 3*pi/8)  {
        return 'FrontRight';
    } else if(angle >= 3*pi/8 && angle <= 5*pi/8) {
        return 'Front';
    } else if(angle >= 5*pi/8 &&  angle <= 7*pi/8) {
        return 'FrontLeft';
    } else if((angle >= 7*pi/8 && angle <= 2*pi) || (angle <= -7*pi/8 && angle >= -2*pi)) {
        return 'Left';
    } else if(angle >= -7*pi/8 && angle <= -5*pi/8) {
        return 'BackLeft';
    } else if(angle >= -5*pi/8 && angle <= -3*pi/8) {
        return 'Back';
    } else if(angle >= -3*pi/8 && angle <= -pi/8) {
        return 'BackRight';
    }
}


/* 
 * Return type of tile 
 * TODO do this more isometric correct
 * int
 */
function getTile(x, y, map) {
    var xx = Math.ceil(x /tileSize  - 0.5)+1;
    var yy = Math.ceil(y/tileSize - 0.5)+1;
    if(yy >= 0 && yy < map.tiles.length && xx >= 0 && xx < map.tiles[0].length) {
        return map.tiles[yy][xx];
    } else {
        return 0;
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

/* functions to add buttons
 * This should be handld differently
 * TODO
 */

function ButtonDown(game, index) {
    game.buttons[index].pressed.visible = true;
    game.buttons[index].unpressed.visible = false;
    if(index == 0) {
        game.showRadius = true;
    } else if(index == 1) {
        game.player.Shield.visible = true;
        game.player.Shield.animations.play('Start', 28, true);
    }
}

function ButtonUp(game, index) {
    console.log(index)
    game.buttons[index].pressed.visible = false;
    game.buttons[index].unpressed.visible = true;
    if(index == 0) {
        game.showRadius = false;
    } else if(index == 1) {
        game.player.Shield.animations.play('End', 28, true);
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

function createButtons(game) {
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

// Make the liquids move "naturally"
function updateLiquid(liquidGroup) {
    liquidGroup.forEach(function (w) {
        w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
        w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
    });
}


function die(game){
    game.state.restart();
}

function updateEnemies(game) {

    // Update bat, expand for containers with enemies
    var distanceEnemyToPlayer;
    var enemyToPlayerAngle;
    for( var i = 0; i < game.enemyGroup.length; i++) {
        var e = game.enemyGroup.getAt(i);
        distanceEnemyToPlayer = Math.sqrt(Math.pow(e.body.x - game.player.body.x, 2) +Math.pow(e.body.y - game.player.body.y, 2));

        enemyToPlayerAngle = Math.atan2(game.player.body.y - e.body.y, game.player.body.x - e.body.x);
        e.animations.play(e.name + getAnimationDirection(enemyToPlayerAngle), animationSpeed, true);

        if(distanceEnemyToPlayer > e.radius || distanceEnemyToPlayer < e.minAttackDistance) {
            e.body.velocity.x = 0;
            e.body.velocity.y = 0;
            if(distanceEnemyToPlayer <= e.minAttackDistance) {
                game.player.takeDamage(1);
                e.animations.currentAnim.speed = animationSpeed * 10;
            }
        } else {
            e.body.velocity.x = Math.cos(enemyToPlayerAngle) * e.speed;
            e.body.velocity.y = Math.sin(enemyToPlayerAngle) * e.speed;
        }

        // Equation of circle to draw vision radius
        if(game.showRadius) {
            var radius = e.radius;
            var theta = e.radiusStart;  // angle that will be increased each loop
            var h = e.body.x; // x coordinate of circle center
            var k = e.body.y; // y coordinate of circle center
            var step = 15;  // amount to add to theta each time (degrees)
            while(theta < e.radiusStart + 360)
            { 
                var xx = h + radius*Math.cos(theta);
                var yy = k + radius*Math.sin(theta);
                var out = game.iso.project({x: xx, y: yy, z: 0});
                game.bitmapData.draw(game.bitmapDataBrush, out.x, out.y);
                theta += step;
            }
            e.radiusStart += 0.005;
            e.radiusStart %= 360;
        }
    }
}

function nextLevel(game) {
    game.state.start(game.nextState);
}

function clear(game) {
    game.bitmapData.destroy();
    game.bitmapDataBrush.destroy();
    if(game.player.shield)
        game.player.shield.destroy();
    if(game.player.fire)
        game.player.fire.destroy();
    if(game.player.target) 
        game.player.target.destroy();
    game.player.destroy();
    game.floorGroup.destroy();
    game.enemyGroup.destroy();
    game.liquidGroup.destroy();
    game.hudGroup.destroy();
    game.obstacleGroup.destroy();
    game.walkingGroup.destroy();
    game.flyingGroup.destroy();
    game.abilityGroup.destroy();
    game.buttonState = null;
    game.textTitle.destroy();
    game.textUnderTitle.destroy();
    for(var  i = 0; i < game.buttons.length; i++) {
        if(game.buttons[i].pressed)
            game.buttons[i].pressed.destroy();
        else
            game.buttons[i].pressed = null;
        if(game.buttons[i].unpressed)
            game.buttons[i].unpressed.destroy();
        else
            game.buttons[i].unpressed = null;
        game.buttons[i] = null;
        game.buttonPosition[i].x = null;
        game.buttonPosition[i].y = null;
        game.buttonPosition[i] = null;
    }
    game.buttonNames = null;
    if(game.keyQ)
        game.keyQ = null;
    if(game.keyW)
        game.keyW = null;
    if(game.keyE)
        game.keyE = null;
    if(game.keyR)
        game.keyR = null;


    game.map = null;
}
