/*
 * boss
 */
function createBoss(game) {
    game.boss.anchor.set(0.5, 0.5, 1.0);
    game.boss.animations.add('Idle', [0,1,2]);
    game.boss.animations.add('WalkLeft', [3,4,5,6,7,8,9]);
    game.boss.animations.add('WalkRight', [10,11,12,13,14,15,16]);
    game.boss.animations.add('Spell', [20,21,22,23,24,25,26,27]);
    game.boss.animations.play('Idle', 3, true);
    game.boss.healthBarBack = game.add.image(game.width/2 - 200*game.scaleFactor,10, 'HealthBar');
    game.boss.icon = game.add.image(game.width/2 - 270*game.scaleFactor,7, 'BossIcon');
    game.boss.icon.fixedToCamera = true;
    game.hudGroup.add(game.boss.icon);
    game.boss.healthBar =  game.add.image(game.width/2 - 200*game.scaleFactor,10, 'HealthBar');
    game.boss.healthBarBack.tint = 0x000000;
    game.boss.healthBar.scale.setTo(0.8,0.8);
    game.boss.healthBarBack.scale.setTo(0.78,0.8);
    game.hudGroup.add(game.boss.healthBarBack);
    game.hudGroup.add(game.boss.healthBar);
    game.boss.healthBar.fixedToCamera = true;
    game.boss.healthBarBack.fixedToCamera = true;
    game.boss.healthBar.maxWidth = game.healthBar.width;
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
        if(game && game.boss && game.boss.actionEnum && !game.deadBoss){

            game.boss.healthBar.width = game.boss.healthBar.maxWidth*Math.max(game.boss.health, 0)/game.boss.maxHealth;
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
                var animSpeed = 3 * game.boss.maxHealth/game.boss.health;
                if(game.boss.action == game.boss.actionEnum.IDLE1 ||
                    game.boss.action == game.boss.actionEnum.IDLE2) {
                    game.boss.animations.play('Idle', animSpeed, true);
                    game.boss.body.velocity.x = 0;
                    game.boss.actionDuration = 300*Math.random()*game.boss.health/game.boss.maxHealth;
                } else if(game.boss.action == game.boss.actionEnum.WALK) {
                    if(Math.random() > 0.5) {
                        game.boss.animations.play('WalkLeft', animSpeed, true);
                        game.boss.body.velocity.x = -50*game.boss.maxHealth/game.boss.health;
                    } else {
                        game.boss.animations.play('WalkRight', animSpeed, true);
                        game.boss.body.velocity.x = 50*game.boss.maxHealth/game.boss.health;
                    }
                    game.boss.actionDuration = 300*Math.random()*game.boss.health/game.boss.maxHealth;
                } else if(game.boss.action == game.boss.actionEnum.SPELL) {
                    game.boss.animations.play('Spell', animSpeed, true);
                    game.boss.body.velocity.x = 0;
                    game.boss.actionDuration = 150*game.boss.health/game.boss.maxHealth;
                }

                game.boss.actionCounter = 0;
            } else {
                game.boss.actionCounter++;
            }
            if(game.boss.health <= 0) {
                if(!game.deadBoss) {
                    game.deadBoss = game.add.isoSprite(game.boss.body.x, game.boss.body.y, 0, 'BossDead', 0); 
                    game.camera.follow(game.deadBoss, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
                    timer = game.time.create(false);
                    timer.loop(2000, function() {
                        game.camera.follow(game.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
                        timer.destroy();
                    }, this);
                    timer.start();
                    game.physics.isoArcade.enable(game.deadBoss);
                    game.deadBoss.body.collideWorldBounds = true;
                    game.deadBoss.body.velocity.x = -100;
                    game.deadBoss.body.velocity.y = -100;
                    game.add.tween(game.deadBoss).to({alpha: 0},1000, "Linear", true, 1000);
                    game.add.tween(game.deadBoss.body.velocity).to({x: -100, y: -100},3000, "Linear", true, 1000);
                    game.deadBoss.anchor.set(0.5,0.5,1.0);
                    game.boss.destroy();
                    game.locked = false;
                    game.stair.animations.play('Normal');
                    game.enemyGroup.forEach(function(e) {
                        e.destroy();
                    });
                    game.enemyGroup.destroy();
                    var nrTilesY = game.map.layers[0].height;
                    for(var y = 12; y <= 24; y++) {
                        for(var x = 6; x <= 23 ; x++) {
                            game.map.layers[0].data[y*nrTilesY+x] = tileEnum.FLOOR05;
                        }
                    }
                }
            }
        }
    }
}

