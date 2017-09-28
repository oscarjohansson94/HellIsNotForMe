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
    game.player.update(game);
    // Check for border collision
    game.obstacleGroup.forEach(function(b) {
        game.physics.isoArcade.collide(b,game.player);
        if(game.decoyActive){
            game.physics.isoArcade.collide(b,game.player.decoy, function() {
                game.player.decoy.destroy();
                game.decoyActive = false;}
            );
        }
    });

    game.physics.isoArcade.collide(game.stair, game.player, function() {
        game.camera.fade('#000000');
        game.camera.onFadeComplete.add(function () {nextLevel(game)},this);
    });
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
        distanceEnemyToPlayer = Math.sqrt(Math.pow(e.body.x - game.player.body.x, 2) +Math.pow(e.body.y - game.player.body.y, 2));
        if(game.decoyActive) {
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
        game.physics.isoArcade.overlap(e, game.player, function() {
            game.player.takeDamage(1);
        });


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
        }

    }
}

