var animationSpeed = 7;
var showDebug = false;
var tileSize = 34;

function debug(game, player){
    if(showDebug){
        game.debug.body(player, 'rgba(189, 221, 235, 0.6)', false);
        if(game.boss)
        game.debug.body(game.boss, 'rgba(189, 221, 235, 0.6)', false);
        game.obstacleGroup.forEach(function(tile){
            game.debug.body(tile, 'rgba(0, 255, 0, 0.9)', false);
        });
        game.enemyGroup.forEach(function(e){
            game.debug.body(e, 'rgba(0, 255, 0, 0.9)', false);
        });
        if(game.stair) 
            game.debug.body(game.stair, 'rgba(255, 0, 0, 0.6)', false);
        if(game.player.target) 
            game.debug.body(game.player.target, 'rgba(255, 0, 0, 0.6)', false);
        if(game.enemyGroup)
            game.enemyGroup.forEach(function(e) {
                if(e.radiusSprite) {
                    game.debug.body(e.radiusSprite, 'rgba(255, 0, 0, 0.6)', false);
                }
            });
    }
}

var tileEnum = {
    EMPTY: 0,
    BORDER: 1,
    FLOOR01: 4,
    FLOOR02: 7,
    FLOOR03: 8,
    FLOOR04: 9,
    FLOOR05: 10,
    FLOOR06: 12,
    LAVA01: 5,
    LAVA02: 6,
    LAVA03: 11,
    START: 13,
    ICE: 19
}

var lavaSet = new Set([tileEnum.LAVA01, tileEnum.LAVA02, tileEnum.LAVA03]);
var floorSet = new Set([tileEnum.ICE, tileEnum.START,tileEnum.FLOOR01,tileEnum.FLOOR02,tileEnum.FLOOR03,tileEnum.FLOOR04,tileEnum.FLOOR05,tileEnum.FLOOR06]); 

var objectEnum = {
    EMPTY: 0,
    BAT: 3,
    BOSS: 2,
    PLAYER: 15,
    STAIR: 16,
    LOCKEDSTAIR: 17,
    BATRED: 20,
    KEY: 14,
    TOWER: 18
}

function renderState(game) {
    debug(game, game.player);
    game.debug.text(game.time.fps, 2, 14, "#a7aebe");
}


/* 
 * sort to display correct object above other
 */
function sortGame(game) {
    if(game.decoyActive && game.player.decoy)
        game.world.bringToTop(game.player.decoy);
    game.world.bringToTop(game.player);
    game.world.bringToTop(game.enemyGroup);
    game.world.bringToTop(game.hudGroup);
    game.world.bringToTop(game.abilityGroup);
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
function getTile(inx, iny, map) {
    var xx = Math.ceil(inx /tileSize  - 1)+2;
    var yy = Math.ceil(iny/tileSize - 1)+2;
    var height = map.layers[0].height;
    if(yy >= 0 && yy < height && xx >= 0 && xx < map.layers[0].width) {
        return map.layers[0].data[yy*height + xx];
    } else {
        return 0;
    }
}



/*
 * Functions to add buttons
 */

function ButtonDown(game, index) {
    if(!game.paused) {
        game.buttons[index].pressed.visible = true;
        game.buttons[index].unpressed.visible = false;
        if(index == 0) {
            game.showRadius = true;
        } else if(index == 1) {
            game.player.Shield.visible = true;
            game.player.Shield.animations.play('Start', 28, true);
        } else if(index == 2) {
            if(game.player.energy >= 50) {
                game.player.reduceEnergy(50);
                game.decoyActive = true;
                game.player.createDecoy(game);
            }
        } else if(index == 3) {
            if(game.portalActive) {
                game.player.activePortal(game);
            } else {
                game.portalActive = true;
                game.player.createPortal(game);
            }
        }
    }
}

function ButtonUp(game, index) {
    if(!game.paused) {
        game.buttons[index].pressed.visible = false;
        game.buttons[index].unpressed.visible = true;
        if(index == 0) {
            game.showRadius = false;
        } else if(index == 1) {
            game.player.Shield.animations.play('End', 28, true);
        } else if(index == 2) {
        }
    }
}

function pause(game) {
    game.paused = !game.paused;
}



function die(game){
    game.state.restart();
}

function nextLevel(game) {
    game.state.start(game.nextState);
}

function getAngle(y1, y2, x1, x2) {
    return Math.atan2(y1 - y2, x1 - x2);
}
