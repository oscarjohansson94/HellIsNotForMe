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
