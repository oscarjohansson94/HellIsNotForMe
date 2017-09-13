var test_state = {
    map: map03,
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
        this.load.image('Stair', '../Res/Images/SpriteSheet/Stair.png');

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
        floorGroup = game.add.group();
        enemyGroup = game.add.group(); 
        liquidGroup= game.add.group();
        hudGroup = game.add.group();
        borderGroup = game.add.group();
        walkingGroup = game.add.group();
        flyingGroup = game.add.group();
        abilityGroup = game.add.group();

        this.bitmapData = game.make.bitmapData(3000, 3000);
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
                    tile.anchor.set(0.5,1);
                } else if(tileType == tileEnum.LAVA) {
                    tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', this.map.tiles[y][x] - 1, liquidGroup);
                    tile.isoZ += 6;
                    liquidGroup.add(tile);
                    game.physics.isoArcade.enable(tile);
                    tile.body.collideWorldBounds = true;
                    tile.anchor.set(0.5,1);
                    tile.body.immovable = true;
                } else if(tileType == tileEnum.BORDER){
                    tile = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,null, 0, borderGroup);
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
                var enemyType = this.map.enemies[y][x];
                var enemy;
                if(enemyType == enemyEnum.BAT) {
                    enemy = game.add.isoSprite(x*tileSize - tileSize, y*tileSize - tileSize, 0, 'EnemyBatSprite', 0, enemyGroup);
                    enemy.radiusStart = 0;
                    createBat(enemy);
                    flyingGroup.add(enemy);
                    enemyGroup.add(enemy);
                }
                else if(enemyType == enemyEnum.STAIR) {
                    console.log("creating stair");
                    enemy = game.add.isoSprite(x*tileSize-tileSize,y*tileSize-tileSize, 0,'Stair', 0, borderGroup);
                    enemy.scale.setTo(0.4, 0.4);
                }
            }
        }

        // Create player
        player = game.add.isoSprite(this.map.start.x * tileSize,this.map.start.y * tileSize,0, 'PlayerSprite',0);
        createPlayer(player);

        // Create target
        player.target = new Phaser.Plugin.Isometric.Point3();

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
        player.Shield = game.add.isoSprite(0, 0,0,'Shield',0);
        player.Shield.visible = false;
        player.Shield.fixedToCamera = true;
        game.physics.isoArcade.enable(player.Shield);
        player.Shield.collideWorldBounds = true;
        player.Shield.scale.setTo(0.2, 0.2);
        abilityGroup.add(player.Shield);
    },
    update: function() {
        
        player.update(this.map);

        // Make the liquids move "naturally"
        liquidGroup.forEach(function (w) {
            w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // Scale health and energy bar deping on life
        healthBar.width = healthBar.maxWidth*Math.max(player.health, 0)/player.maxHealth;
        energyBar.width = energyBar.maxWidth*Math.max(player.energy, 0)/player.maxEnergy;

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
                    player.takeDamage(1);
                    e.animations.currentAnim.speed = animationSpeed * 10;
                }
            } else {
                e.body.velocity.x = Math.cos(enemyToPlayerAngle) * e.speed;
                e.body.velocity.y = Math.sin(enemyToPlayerAngle) * e.speed;
            }

            if(player.Shield.visible) {
                player.Shield.body.x = player.body.x+ 7;
                player.Shield.body.y = player.body.y + 10;
                player.Shield.body.z = player.body.z;
            }

            // Equation of circle to draw vision radius
            if(this.showRadius) {
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
                    this.bitmapData.draw(this.bitmapDataBrush, out.x, out.y);
                    theta += step;
                }

                e.radiusStart += 0.005;
                e.radiusStart %= 360;
            }
        }
        // Check for border collision
        borderGroup.forEach(function(b) {
            game.physics.arcade.overlap(b, player, 
                function() {
                    player.body.velocity.x = 0;
                    player.body.velocity.y = 0;
                    player.animations.play('IdlePlayer' + getAnimationDirection(player.angleToTarget), animationSpeed, true);
                    game.physics.isoArcade.collide(b,player);
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
        
        player.endOfFrame();
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
            player.Shield.visible = true;
            this.WButton.visible = false;
            this.WButtonPressed.visible = true;
        }
    },
    WbuttonUp: function() {
        if(this.WButton != null && this.WButtonPressed != null){
            this.WButton.visible = true;
            this.WButtonPressed.visible = false;
            player.Shield.visible = false;
        }
    }

};
