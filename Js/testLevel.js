var test_state = {
    minTargetDistance: 10,
    map: map02,
    nrTilesX: 0,
    nrTilesY: 0,
    bitmapData : null,
    bitmapDataBrush : null,
    keyQ: null,
    keyW: null,
    QButton: null,
    QButtonPressed: null,
    WButton: null,
    WButtonPressed: null,
    showRadius: false,
    Shield: null,
    radiusStart: 0,

    preload: function() {
        // Load sprite sheet containing all player movements
        this.load.spritesheet('PlayerSprite', '../Res/Images/SpriteSheet/PlayerAtlas.png', 162.83,212, 67); 
        this.load.spritesheet('EnemyBatSprite', '../Res/Images/SpriteSheet/EnemyBat.png', 272, 282, 28);
        this.load.spritesheet('FireSprite', '../Res/Images/SpriteSheet/fireAnimation.png', 142,238, 4); 
        this.load.image('HealthBar', '../Res/Images/SpriteSheet/healthBar.png');
        this.load.image('EnergyBar', '../Res/Images/SpriteSheet/energyBar.png');
        this.load.image('Hud', '../Res/Images/SpriteSheet/Hud.png');
        this.load.image('QButton', '../Res/Images/SpriteSheet/QButton.png');
        this.load.image('QButtonPressed', '../Res/Images/SpriteSheet/QButtonPressed.png');
        this.load.image('WButton', '../Res/Images/SpriteSheet/WButton.png');
        this.load.image('WButtonPressed', '../Res/Images/SpriteSheet/WButtonPressed.png');
        this.load.image('Shield', '../Res/Images/SpriteSheet/shield.png');

        // Load map tiles
        game.load.atlasJSONHash('tileset', '../Res/Images/Tiles/tiles.png', '../Res/Images/Tiles/tiles.json');

        game.time.advancedTiming = true;
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.iso.anchor.set(0.5, 0);

        // Increase world size
        this.nrTilesX = this.map.tiles[0].length; 
        this.nrTilesY = this.map.tiles.length;  
        var length = this.nrTilesY*tileSize; 
        var width = this.nrTilesX*tileSize; 
        var worldWidth = Math.sqrt(Math.pow(length, 2) + Math.pow(width, 2)); 
        game.world.setBounds(0, 0, length*2-4*tileSize, worldWidth*2-4*tileSize);

        // Isometric
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    },
    create: function() {
        // Set gravity
        game.physics.isoArcade.gravity.setTo(0, 0, -500);

        // Set background color
        game.stage.backgroundColor = "#000000";

        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.keyQ.onDown.add(this.QbuttonDown,this);
        this.keyQ.onUp.add(this.QbuttonUp,this);

        this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyW.onDown.add(this.WbuttonDown,this);
        this.keyW.onUp.add(this.WbuttonUp,this);

        // Create groups
        floorGroup = game.add.group(); // floors
        enemyGroup = game.add.group(); 
        liquidGroup= game.add.group();
        hudGroup = game.add.group();
        borderGroup = game.add.group();
        walkingGroup = game.add.group();
        flyingGroup = game.add.group();
        abilityGroup = game.add.group();

        this.bitmapData = game.make.bitmapData(2000, 1000);
        this.bitmapData.addToWorld();
        this.bitmapDataBrush = game.make.bitmapData(32, 32);
        this.bitmapDataBrush.circle(2, 2, 2, 'rgba(24,234,236,1)');
        // Generate map
        for( var y = 1; y < this.nrTilesY - 1; y++) {
            for(var x = 1; x < this.nrTilesX - 1; x++){
                // Generate tile
                var tileType = this.map.tiles[y][x];
                var tile;
                if(tileType == tileEnum.FLOOR01) {
                    tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', this.map.tiles[y][x] - 1, floorGroup);
                } else if(tileType == tileEnum.LAVA) {
                    tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', this.map.tiles[y][x] - 1, liquidGroup);
                    tile.isoZ += 6;
                    liquidGroup.add(tile);
                    game.physics.isoArcade.enable(tile);
                    tile.body.collideWorldBounds = true;
                    tile.body.immovable = true;
                } else if(tileType == tileEnum.BORDER){
                    tile = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,null, 0, borderGroup);
                    tile.enableBody = true;
                    tile.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
                    game.physics.isoArcade.enable(tile);
                    tile.body.setSize(tileSize,tileSize+1,tileSize+1, 0 ,0, 0);
                    tile.body.immovable = true;
                    tile.body.collideWorldBounds = true;
                }
                tile.anchor.set(0.5,1);

                //Generate enemy{
                var enemyType = this.map.enemies[y][x];
                var enemy;
                if(enemyType == enemyEnum.BAT) {
                    enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatSprite', 0, enemyGroup);
                    createBat(enemy);
                    flyingGroup.add(enemy);
                    enemyGroup.add(enemy);
                }
            }
        }



        // Create player
        player = game.add.isoSprite(this.map.start.x * tileSize,this.map.start.y * tileSize,0, 'PlayerSprite',0);
        createPlayer(player);

        // Create target
        target = new Phaser.Plugin.Isometric.Point3();

        // Camera should follow player
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


        // Scale deping on game size
        var scale = game.width / 1280;

        //Hud 
        hud = game.add.image(0,game.height-127*scale, 'Hud');
        hudGroup.add(hud);
        hud.fixedToCamera = true;
        hud.cropEnabled = true;
        hud.scale.setTo(scale,scale);

        // Healthbar
        healthBar = game.add.image(game.width - 343*scale,game.height - 108*scale, 'HealthBar');
        hudGroup.add(healthBar);
        healthBar.fixedToCamera = true;
        healthBar.cropEnabled = true;
        healthBar.scale.setTo(scale, scale);
        healthBar.maxWidth = healthBar.width;

        // Energybar
        energyBar = game.add.image(game.width - 343*scale,game.height - 54*scale, 'EnergyBar');
        hudGroup.add(energyBar);
        energyBar.fixedToCamera = true;
        energyBar.cropEnabled = true;
        energyBar.scale.setTo(scale, scale);
        energyBar.maxWidth = energyBar.width;

        // Buttons
        this.QButton = game.add.image(22*scale, game.height - 109*scale, 'QButton');
        this.QButton.fixedToCamera = true;
        this.QButton.cropEnabled = true;
        this.QButton.scale.setTo(scale, scale);
        this.QButtonPressed = game.add.image(22*scale, game.height - 109*scale, 'QButtonPressed');
        this.QButtonPressed.fixedToCamera = true;
        this.QButtonPressed.cropEnabled = true;
        this.QButtonPressed.scale.setTo(scale, scale);
        this.QButtonPressed.visible = false;
        hudGroup.add(this.QButton);
        hudGroup.add(this.QButtonPressed);
        this.WButton = game.add.image(140*scale, game.height - 109*scale, 'WButton');
        this.WButton.fixedToCamera = true;
        this.WButton.cropEnabled = true;
        this.WButton.scale.setTo(scale, scale);
        this.WButtonPressed = game.add.image(140*scale, game.height - 109*scale, 'WButtonPressed');
        this.WButtonPressed.fixedToCamera = true;
        this.WButtonPressed.cropEnabled = true;
        this.WButtonPressed.scale.setTo(scale, scale);
        this.WButtonPressed.visible = false;
        hudGroup.add(this.WButton);
        hudGroup.add(this.WButtonPressed);


        // EnergyShield
        this.Shield = game.add.isoSprite(0, 0,0,'Shield',0);
        this.Shield.visible = false;
        this.Shield.fixedToCamera = true;
        game.physics.isoArcade.enable(this.Shield);
        this.Shield.collideWorldBounds = true;
        this.Shield.scale.setTo(0.2, 0.2);
        abilityGroup.add(this.Shield);
    },
    update: function() {


        // TODO needs to handle player health regeneration better
        if(player.burning){
            fire.body.x = player.body.x;
            fire.body.y = player.body.y;
            player.health--;
        } else if(player.health < 100) {
            player.health++;
        }


        if(!this.Shield.visible && !player.burning && getTile(player.body.x, player.body.y, this.map) == tileEnum.LAVA){
            player.burning = true;
            fire = game.add.isoSprite(player.body.x,player.body.y,0, 'FireSprite',0);
            fire.scale.setTo(0.4, 0.4);
            fire.anchor.set(1,1);
            fire.animations.add('fire', [0,1,2,3]);
            fire.animations.play('fire',15, true);
            game.physics.isoArcade.enable(fire);
            fire.body.collideWorldBounds = true;
        } else if((player.burning && getTile(player.body.x, player.body.y, this.map) != tileEnum.LAVA) 
            || (this.Shield.visible && player.burning)){
            fire.destroy();
            player.burning = false;
        }


        // Make the liquids move "naturally"
        liquidGroup.forEach(function (w) {
            w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // Scale health and energy bar deping on life
        healthBar.width = healthBar.maxWidth*Math.max(player.health, 0)/player.maxHealth;
        energyBar.width = energyBar.maxWidth*Math.max(player.energy, 0)/player.maxEnergy;

        // Get angle between pointer and player
        var playerToTargetAngle = Math.atan2(target.y - player.body.y, target.x - player.body.x);
        var pointerDistance = game.physics.arcade.distanceToPointer(player);

        if(game.input.activePointer.isDown){
            game.iso.unproject(game.input.activePointer.position, target);
            player.moving = true;
        }
        if(player.moving) {
            var distancePlayerTarget = Math.sqrt(Math.pow(target.x - player.body.x, 2)+ Math.pow(target.y - player.body.y, 2));
            if(distancePlayerTarget <= this.minTargetDistance){
                player.moving = false;
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                player.animations.play('IdlePlayer' + getAnimationDirection(playerToTargetAngle), animationSpeed, true);
            } else { 
                player.animations.play('RunPlayer' + getAnimationDirection(playerToTargetAngle), animationSpeed, true);
                player.body.velocity.x = Math.cos(playerToTargetAngle) * player.speed;
                player.body.velocity.y = Math.sin(playerToTargetAngle) * player.speed;
            }
        }

        // Clear radius drawing
        this.bitmapData.clear();

        // Drain energy
        if(this.showRadius) {
            player.energy -= 0.1;
            if(player.energy <= 0){
                this.QbuttonUp();
            }

        } else if(player.energy < player.maxEnergy) {
            player.energy++;
        }

        // Update bat, expand for containers with enemies
        var distanceEnemyToPlayer;
        var enemyToPlayerAngle;
        var graphics = [];
        for( var i = 0; i < enemyGroup.length; i++) {
            var e = enemyGroup.getAt(i);
            distanceEnemyToPlayer = Math.sqrt(Math.pow(e.body.x - player.body.x, 2) +Math.pow(e.body.y - player.body.y, 2));

            enemyToPlayerAngle = Math.atan2(player.body.y - e.body.y, player.body.x - e.body.x);
            e.animations.play(e.name + getAnimationDirection(enemyToPlayerAngle), animationSpeed, true);

            if(distanceEnemyToPlayer > e.radius || distanceEnemyToPlayer < e.minAttackDistance) {
                e.body.velocity.x = 0;
                e.body.velocity.y = 0;
                if(distanceEnemyToPlayer <= e.minAttackDistance) {
                    player.health -= 2;
                    e.animations.currentAnim.speed = animationSpeed * 10;
                }
            } else {
                e.body.velocity.x = Math.cos(enemyToPlayerAngle) * e.speed;
                e.body.velocity.y = Math.sin(enemyToPlayerAngle) * e.speed;
            }

            if(this.Shield.visible) {
                this.Shield.body.x = player.body.x+ 7;
                this.Shield.body.y = player.body.y + 10;
                this.Shield.body.z = player.body.z;
            }

            // Equation of circle to draw vision radius
            if(this.showRadius) {
                var radius = e.radius;
                var theta = this.radiusStart;  // angle that will be increased each loop
                var h = e.body.x; // x coordinate of circle center
                var k = e.body.y; // y coordinate of circle center
                var step = 15;  // amount to add to theta each time (degrees)
                while(theta < this.radiusStart + 360)
                { 
                    var xx = h + radius*Math.cos(theta);
                    var yy = k + radius*Math.sin(theta);
                    var out = game.iso.project({x: xx, y: yy, z: 0});
                    this.bitmapData.draw(this.bitmapDataBrush, out.x, out.y);
                    theta += step;
                }

                this.radiusStart += 0.0008;
                this.radiusStart %= 360;
            }
        }

        // Check for border collision
        borderGroup.forEach(function(w) {
            game.physics.arcade.overlap(w, player, 
                function() {
                    player.body.velocity.x = 0;
                    player.body.velocity.y = 0;
                    player.animations.play('IdlePlayer' + getAnimationDirection(playerToTargetAngle), animationSpeed, true);
                    game.physics.isoArcade.collide(w,player);
                }
                , null, this);
        });

        // Die
        if(player.health <= 0){
            this.camera.fade('#000000');
            this.camera.onFadeComplete.add(this.fadeComplete,this);
        }

        game.world.bringToTop(enemyGroup);
        game.world.bringToTop(player);
        game.world.bringToTop(hudGroup);
        game.world.bringToTop(abilityGroup);
    },
    render: function () {
        if(debug){
            game.debug.body(player, 'rgba(189, 221, 235, 0.6)', false);
            borderGroup.forEach(function(tile){
                game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
            });
        }
        game.debug.text(game.time.fps, 2, 14, "#a7aebe");
    }, 
    fadeComplete: function(){
        game.state.restart();
    },
    QbuttonDown: function(){ 
        if(this.QButton != null && this.QButtonPressed != null){
            this.showRadius = true;
            this.QButton.visible = false;
            this.QButtonPressed.visible = true;
        }
    },
    QbuttonUp: function() {
        if(this.QButton != null && this.QButtonPressed != null){
            this.showRadius = false;
            this.QButton.visible = true;
            this.QButtonPressed.visible = false;
        }
    },    
    WbuttonDown: function(){ 
        if(this.WButton != null && this.WButtonPressed != null){
            this.Shield.visible = true;
            this.WButton.visible = false;
            this.WButtonPressed.visible = true;
        }
    },
    WbuttonUp: function() {
        if(this.WButton != null && this.WButtonPressed != null){
            this.WButton.visible = true;
            this.WButtonPressed.visible = false;
            this.Shield.visible = false;
        }
    }

};

/*
 * Get the right animation suffix depinding on angle
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
 */
function getTile(x, y, map) {
    return map.tiles[Math.ceil(y/tileSize - 0.5)+1][Math.ceil(x /tileSize  - 0.5)+1];
}
