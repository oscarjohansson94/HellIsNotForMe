animationSpeed = 7;
debug = false;

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
    player.minTargetDistance = 10;
    player.target =  null;
    player.damage = 0;
    player.angleToTarget = 0;
    player.energyDrain = 0;

    // Create target
    player.target = new Phaser.Plugin.Isometric.Point3();

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
    abilityGroup.add(player.Shield);
    player.game = game;

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

        if(!player.Shield.visible && !player.burning && getTile(player.body.x, player.body.y, map) == tileEnum.LAVA){
            player.burning = true;
            player.fire = createFire(player.body.x, player.body.y);

        } else if((player.burning && getTile(player.body.x, player.body.y, map) != tileEnum.LAVA) 
            || (player.Shield.visible && player.burning)){
            player.fire.destroy();
            player.burning = false;
        }
    };

    player.updateMove = function(){

        // Get angle between pointer and player
        player.angleToTarget = Math.atan2(player.target.y - player.body.y, player.target.x - player.body.x);

        if(game.input.activePointer.isDown){
            game.iso.unproject(game.input.activePointer.position, player.target);
            player.moving = true;
        }
        if(player.moving) {
            player.distanceToTarget = Math.sqrt(Math.pow(player.target.x - player.body.x, 2)+ Math.pow(player.target.y - player.body.y, 2));
            if(player.distanceToTarget <= player.minTargetDistance){
                player.moving = false;
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                player.animations.play('IdlePlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
            } else { 
                player.animations.play('RunPlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
                player.body.velocity.x = Math.cos(player.angleToTarget) * player.speed;
                player.body.velocity.y = Math.sin(player.angleToTarget) * player.speed;
            }
        }

    }
    player.updateShield = function() {
        if(player.Shield.visible) {
            console.log("Reduce energy");
            player.reduceEnergy(1);
            player.Shield.body.x = player.body.x;
            player.Shield.body.y = player.body.y ;
            player.Shield.body.z = player.body.z + 25;
            if(player.energy <= 0) {
                WbuttonUp();
            }
        }

    }

    player.update = function(map) {
        if(map){
            player.updateMove();
            player.updateFire(map);
            player.updateShield();
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
    return map.tiles[Math.ceil(y/tileSize - 0.5)+1][Math.ceil(x /tileSize  - 0.5)+1];
}


/*
 * Create fire
 * fire object
 */
function createFire(){
    fire = game.add.isoSprite(player.body.x,player.body.y,0, 'FireSprite',0);
    fire.scale.setTo(0.4, 0.4);
    fire.anchor.set(1,1);
    fire.animations.add('fire', [0,1,2,3]);
    fire.animations.play('fire',15, true);
    game.physics.isoArcade.enable(fire);
    fire.body.collideWorldBounds = true;
    return fire;
}
function QbuttonDown(){ 
    if(player.game.QButton != null && player.game.QButtonPressed != null){
        game.showRadius = true;
        player.game.QButton.visible = false;
        player.game.QButtonPressed.visible = true;
    }
}
function QbuttonUp() {
    if(player.game.QButton != null && player.game.QButtonPressed != null){
        game.showRadius = false;
        player.game.QButton.visible = true;
        player.game.QButtonPressed.visible = false;
    }
}
function WbuttonDown(){ 
    if(player.game.WButton != null && player.game.WButtonPressed != null){
        player.Shield.visible = true;
        player.Shield.animations.play('Start', 28, true);
        player.game.WButton.visible = false;
        player.game.WButtonPressed.visible = true;
    }
}
function WbuttonUp() {
    if(player.game.WButton != null && player.game.WButtonPressed != null){
        player.game.WButton.visible = true;
        player.game.WButtonPressed.visible = false;
        player.Shield.animations.play('End', 28, true);
    }
}

function createHud(game, hudGroup, scale) {

    //Hud 
    game.hud = game.add.image(0,game.height-127*scale, 'Hud');
    hudGroup.add(game.hud);
    game.hud.fixedToCamera = true;
    game.hud.cropEnabled = true;
    game.hud.scale.setTo(scale,scale);

    // Healthbar
        game.healthBar = game.add.image(game.width - 343*scale,game.height - 108*scale, 'HealthBar');
    hudGroup.add(game.healthBar);
    game.healthBar.scale.setTo(scale, scale);
    game.healthBar.fixedToCamera = true;
    game.healthBar.cropEnabled = true;
    game.healthBar.maxWidth = game.healthBar.width;

    // Energybar
    game.energyBar = game.add.image(game.width - 343*scale,game.height - 54*scale, 'EnergyBar');
    game.energyBar.fixedToCamera = true;
    game.energyBar.cropEnabled = true;
    game.energyBar.scale.setTo(scale, scale);
    game.energyBar.maxWidth = game.energyBar.width;
    hudGroup.add(game.energyBar);
}

function createButtons(game, hudGroup, scale) {
    game.QButton = game.add.image(22*scale, game.height - 109*scale, 'QButton');
    game.QButton.fixedToCamera = true;
    game.QButton.cropEnabled = true;
    game.QButton.scale.setTo(scale, scale);
    game.QButtonPressed = game.add.image(22*scale, game.height - 109*scale, 'QButtonPressed');
    game.QButtonPressed.fixedToCamera = true;
    game.QButtonPressed.cropEnabled = true;
    game.QButtonPressed.scale.setTo(scale, scale);
    game.QButtonPressed.visible = false;
    hudGroup.add(game.QButton);
    hudGroup.add(game.QButtonPressed);
    game.WButton = game.add.image(140*scale, game.height - 109*scale, 'WButton');
    game.WButton.fixedToCamera = true;
    game.WButton.cropEnabled = true;
    game.WButton.scale.setTo(scale, scale);
    game.WButtonPressed = game.add.image(140*scale, game.height - 109*scale, 'WButtonPressed');
    game.WButtonPressed.fixedToCamera = true;
    game.WButtonPressed.cropEnabled = true;
    game.WButtonPressed.scale.setTo(scale, scale);
    game.WButtonPressed.visible = false;
    hudGroup.add(game.WButton);
    hudGroup.add(game.WButtonPressed);
}



