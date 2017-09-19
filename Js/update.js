/* 
 * All functions called when state is updated
 */

/* 
 * Main function called
 */
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

