
/*
 * Create the player
 * Will create a player "class"
 * void
 */
function createPlayer(game, player) {

    // TODO base this on scaleFactor
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
    player.decoy = null;
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
    player.createDecoy = function(game) {
        player.decoy = game.add.isoSprite(player.body.x,player.body.y,0,'Decoy', 0);
        game.physics.isoArcade.enable(player.decoy);
        player.decoy.duration = 60;
        player.decoy.speed = 100;
        player.decoy.alpha = 1;
        player.decoy.collideWorldBounds = true;
        player.decoy.body.allowGravity = false;
        player.decoy.anchor.set(0.5,0.5,0.5);
        var out = {x: 0, y: 0};
        game.iso.unproject(game.input.activePointer.position, out);
        var angle = getAngle(player.body.y, out.y, player.body.x, out.x); 
        player.decoy.body.velocity.x =  -Math.cos(angle) * 250;
        player.decoy.body.velocity.y =  -Math.sin(angle) * 250;
    }

    player.createPortal = function(game) {
        game.player.portal = game.add.isoSprite(player.body.x, player.body.y, 0, 'Portal', 0);
        game.player.portal.tel = false;
        game.physics.isoArcade.enable(player.portal);
        game.player.portal.radius = 300;
        game.player.portal.collideWorldBounds = true;
        game.player.portal.body.allowGravity = false;
        game.player.portal.anchor.set(0.5,0.5,0.5);
        game.player.portal.radiuses = game.add.group();
        game.player.portal.radiuses.visible = false;
        var theta = 0;  // angle that will be increased each loop
        var h = game.player.portal.body.x; // x coordinate of circle center
        var k = game.player.portal.body.y; // y coordinate of circle center
        var step = 15;  // amount to add to theta each time (degrees)
        while(theta < 360)
        { 
            var xx = game.player.portal.radius*Math.cos(theta);
            var yy = game.player.portal.radius*Math.sin(theta);
            var out = game.iso.project({x: xx, y: yy, z: 0});
            var sprite = game.add.isoSprite(player.portal.body.x+xx,player.portal.body.y+yy, 0, 'Radius');
            sprite.alpha = 0.85;
            sprite.scale.setTo(0.3,0.3);
            sprite.radius = game.player.portal.radius;
            sprite.theta = theta;
            sprite.tint = 0x00fffa;
            game.physics.isoArcade.enable(sprite);
            sprite.body.collideWorldBounds = true;
            theta += step;
            game.player.portal.radiuses.add(sprite);
        }
    }

    player.updateFire = function(map) {
        if(player.burning){
            player.fire.body.x = player.body.x;
            player.fire.body.y = player.body.y;
            player.takeDamage(1);
        }

        if(!player.Shield.visible && !player.burning && lavaSet.has(getTile(player.body.x, player.body.y, game.map))){
            player.burning = true;
            player.fire = createFire(game);

        } else if((game.player.burning && !lavaSet.has(getTile(game.player.body.x, game.player.body.y, game.map))) 
            || (player.Shield.visible && player.burning)){
            player.fire.destroy();
            player.burning = false;
        }
    };

    player.updateMove = function(){
        if((!player.portal || (player.portal && !player.portal.tel))&& getTile(player.body.x, player.body.y, game.map) == tileEnum.EMPTY) {
            game.add.tween(player.scale).to({x:0, y:0},400, "Linear",true);
            game.camera.fade('#000000');
            game.camera.onFadeComplete.add(function () {die(game)},this);
        }
        if(game.input.activePointer.isDown) {
            var out = {x: 0, y: 0};
            game.iso.unproject(game.input.activePointer.position, out);
            if(getTile(out.x, out.y, game.map) != tileEnum.EMPTY && getTile(out.x, out.y, game.map) != tileEnum.BORDER) {
                player.target.body.x = out.x;
                player.target.body.y = out.y;
                player.moving = true;
            }
        }
        if(player.moving) {
            var target;
            var speed;
            if(game.player.portal && game.player.portal.tel) {
                target = game.player.portal;
                speed = 2000;
                    player.angleToTarget = Math.atan2(player.portal.body.y - player.body.y, player.portal.body.x - player.body.x);
            } else {
                if(player.target.body)
                    player.angleToTarget = Math.atan2(player.target.body.y - player.body.y, player.target.body.x - player.body.x);
                speed = player.speed;
                target = player.target;
            }
            game.physics.isoArcade.overlap(player,target, function() {player.targetReached = true;});
            if(player.targetReached){
                player.moving = false;
                if(getTile(player.body.x, player.body.y, game.map) != tileEnum.ICE){
                    player.body.velocity.x = 0;
                    player.body.velocity.y = 0;
                }
                player.animations.play('IdlePlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
                player.targetReached = false;
            } else { 
                player.animations.play('RunPlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
                player.body.velocity.x = Math.cos(player.angleToTarget) * speed;
                player.body.velocity.y = Math.sin(player.angleToTarget) * speed;
            }
        }

    }

    player.destroyPortal = function(game) {
        game.portalActive = false;
        game.player.portal.tel = false;

        player.portal.radiuses.forEach(function(r) {
            r.destroy();
        });
        player.portal.radiuses.destroy();
        player.portal.destroy();

    }

    player.updatePortal = function(game) {
        if(game.portalActive && game.player.portal) {
            distancePlayerToPortal = Math.sqrt(Math.pow(game.player.portal.body.x - game.player.body.x, 2) +Math.pow(game.player.portal.body.y - game.player.body.y, 2));
            if(distancePlayerToPortal > game.player.portal.radius) {
                player.destroyPortal(game);

            }
        }
    }

    player.activePortal = function(game) {
        player.portal.tel = true;
        game.player.moving = true;
    }
    player.updateDecoy = function(game) {
        if(game.decoyActive) {
            game.player.decoy.duration--;
            if(game.player.decoy.duration <= 0) {
                game.player.decoy.destroy();
                game.decoyActive = false;
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
                ButtonUp(game,1);
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
            player.updateDecoy(game);
            player.updatePortal(game);
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


