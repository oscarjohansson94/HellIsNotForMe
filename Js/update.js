/* 
 * All functions called when state is updated
 */

/* 
 * Main function called
 */
function updateState(game) {

    updateLiquid(game.liquidGroup);

    // Scale health and energy bar deping on life
    game.healthBar.width = game.healthBar.maxWidth*Math.max(game.player.health, 0)/game.player.maxHealth;
    game.energyBar.width = game.energyBar.maxWidth*Math.max(game.player.energy, 0)/game.player.maxEnergy;


    updateEnemies(game);
    if(game.boss){
        game.boss.update(game);
    }
    if(game.player.portal && game.player.portal.tel) {
        game.physics.isoArcade.overlap(game.player, game.player.portal, function (){
            game.player.destroyPortal(game);
            game.player.portal.tel = false;
            game.player.body.velocity.x = 0;
            game.player.body.velocity.y = 0;
        });
    }
    // Check for border collision
    game.obstacleGroup.forEach(function(b) {
        if(game.boss) {
            game.physics.isoArcade.collide(b,game.boss);
        }
        if(!game.player.portal || (game.player.portal && !game.player.portal.tel)){
            game.physics.isoArcade.collide(b,game.player);
        }

        if(game.decoyActive){
            game.physics.isoArcade.collide(b,game.player.decoy, function() {
                game.player.decoy.destroy();
                game.decoyActive = false;}
            );
        }
    });

    game.player.update(game);
            if(game.player.portal && game.showRadius) {
                game.player.portal.radiuses.visible = true;
                game.player.portal.radiuses.forEach(function(r) {
                    r.theta += 0.005;
                    r.theta %= 360;
                    r.body.x = game.player.portal.body.x + r.radius*Math.cos(r.theta);
                    r.body.y = game.player.portal.body.y + r.radius*Math.sin(r.theta);
                });
            }
    if(!game.showRadius && game.player.portal){
                game.player.portal.radiuses.visible = false;
    }
    for(var i = 0; i < game.bulletGroup.length; i++) {
        var bullet = game.bulletGroup.getAt(i);
        game.physics.isoArcade.overlap(game.player, bullet, function (){
            game.bulletGroup.remove(i);
            bullet.destroy();
            game.player.takeDamage(15);
        });
        for(var j = 0; j < game.enemyGroup.length; j++) {
            var e = game.enemyGroup.getAt(j);
            if(e.moves) {
                game.physics.isoArcade.overlap(e, bullet, function (){
                    game.bulletGroup.remove(i);
                    game.enemyGroup.remove(j);
                    e.destroy();
                    bullet.destroy();
                });
            }
        }

        if(game.boss)
            game.physics.isoArcade.overlap(game.boss, bullet, function (){
                game.bulletGroup.remove(i);
                bullet.destroy();
                game.boss.health--;
            });
    }
    game.physics.isoArcade.collide(game.stair, game.player, function() {
        if(!game.locked){
            game.camera.fade('#000000');
            game.camera.onFadeComplete.add(function () {nextLevel(game)},this);
        }
    });
    if(game.key) {
        game.physics.isoArcade.overlap(game.key, game.player, function() {
            game.locked = false;
            game.key.destroy();
            game.stair.animations.play('Normal');
        });
    }
    sortGame(game);
    game.player.endOfFrame();
}

/*
 * Make the liquids move "naturally"
 */
function updateLiquid(liquidGroup) {
    liquidGroup.forEach(function (w) {
        w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
        w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
    });
}

/*
 * Move enemy
 */
function enemyMove(game, e) {
    distanceEnemyToPlayer = Math.sqrt(Math.pow(e.body.x - game.player.body.x, 2) +Math.pow(e.body.y - game.player.body.y, 2));
    if(game.decoyActive && game.player.decoy) {
        enemyToDecoyAngle = getAngle(game.player.decoy.body.y, e.body.y, game.player.decoy.body.x, e.body.x);
        distanceEnemyToDecoy = Math.sqrt(Math.pow(e.body.x - game.player.decoy.body.x, 2) +Math.pow(e.body.y - game.player.decoy.body.y, 2));
    } else {
        distanceEnemyToDecoy = Infinity;
    }
    enemyToPlayerAngle = getAngle(game.player.body.y, e.body.y, game.player.body.x, e.body.x);
    e.animations.play(e.name + getAnimationDirection(enemyToPlayerAngle), animationSpeed, true);

    if(distanceEnemyToPlayer > e.radius && distanceEnemyToDecoy > e.radius) {
        e.body.velocity.x = 0;
        e.body.velocity.y = 0;
    } else if(distanceEnemyToDecoy <= e.radius) {
        e.body.velocity.x = Math.cos(enemyToDecoyAngle) * e.speed;
        e.body.velocity.y = Math.sin(enemyToDecoyAngle) * e.speed;
    } else {
        e.body.velocity.x = Math.cos(enemyToPlayerAngle) * e.speed;
        e.body.velocity.y = Math.sin(enemyToPlayerAngle) * e.speed;
    }
}

/*
 * Handle enemy shooting
 */
function enemyShoot(game, tower) {
    distanceEnemyToPlayer = Math.sqrt(Math.pow(tower.body.x - game.player.body.x, 2) +Math.pow(tower.body.y - game.player.body.y, 2));
    if(game.decoyActive && game.player.decoy) {
        enemyToDecoyAngle = getAngle(game.player.decoy.body.y, tower.body.y, game.player.decoy.body.x, tower.body.x);
        distanceEnemyToDecoy = Math.sqrt(Math.pow(tower.body.x - game.player.decoy.body.x, 2) +Math.pow(tower.body.y - game.player.decoy.body.y, 2));
    } else {
        distanceEnemyToDecoy = Infinity;
    }
    enemyToPlayerAngle = getAngle(game.player.body.y, tower.body.y, game.player.body.x, tower.body.x);
    if(distanceEnemyToPlayer > tower.radius && distanceEnemyToDecoy > tower.radius) {
    } else{
        if(!tower.delayCounter){
            var bullet = game.add.isoSprite(tower.body.x,tower.body.y,0,'Bullet', 0);
            bullet.scale.setTo(0.4,0.4);
            game.physics.isoArcade.enable(bullet);
            bullet.duration = 60;
            bullet.speed = 100;
            bullet.alpha = 1;
            bullet.collideWorldBounds = true;
            bullet.body.allowGravity = false;
            bullet.anchor.set(0.5,0.5,0.5);


            var angle = 0;
            if(distanceEnemyToDecoy <= tower.radius) {
                angle = getAngle(bullet.body.y,game.player.decoy.body.y,bullet.body.x, game.player.decoy.body.x); 
            } else {
                angle = getAngle(bullet.body.y,game.player.body.y,bullet.body.x, game.player.body.x); 
            }
            bullet.body.velocity.x =  -Math.cos(angle) * 250;
            bullet.body.velocity.y =  -Math.sin(angle) * 250;
            game.bulletGroup.add(bullet);
            tower.delayCounter = tower.delay;
        }
    }
}

/*
 * Update enemies
 */
function updateEnemies(game) {

    // Update bat, expand for containers with enemies
    var distanceEnemyToPlayer;
    var distanceEnemyToDecoy;
    var enemyToPlayerAngle;
    var enemyToDecoyAngle;
    for( var i = 0; i < game.enemyGroup.length; i++) {
        var e = game.enemyGroup.getAt(i);
        if(e.moves) {
            enemyMove(game, e); 
        }
        if(e.shoots) {
            enemyShoot(game,e);
        }
        if(e.name == "Tower") {
            game.physics.isoArcade.collide(e, game.player);
        } else {
            game.physics.isoArcade.overlap(e, game.player, function() {
                game.player.takeDamage(0.7);
            });
        }

        if(e.delayCounter > 0){
            e.delayCounter--;
        }

        // Equation of circle to draw vision radius
        if(game.showRadius){
            e.radiuses.visible = true;
            e.radiuses.forEach(function(r) {
                r.theta += 0.005;
                r.theta %= 360;
                r.body.x = e.body.x + r.radius*Math.cos(r.theta);
                r.body.y = e.body.y + r.radius*Math.sin(r.theta);
            });

        }  else {
            e.radiuses.visible = false;
            if(game.player.portal) {
                game.player.portal.radiuses.visible = false;
            }
        }

    }
}

