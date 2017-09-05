var test_state = {
    debug: true,
    playerSpeed: 300,
    minTargetDistance: 10,
    animationSpeed: 7,
    animationProtection: 0,
    playerMoving: false,
    map: map02,
    nrTilesX: 0,
    nrTilesY: 0,
    liquidGroup: [],
    isoGroup: [],
    obstacleGroup: [],
    preload: function() {
        // Load sprite sheet containing all player movements
        this.load.spritesheet('PlayerSprite', '../Res/Images/SpriteSheet/PlayerAtlas.png', 162.83,212, 67); 

        // Load map tiles
        game.load.atlasJSONHash('tileset', '../Res/Images/Tiles/tiles.png', '../Res/Images/Tiles/tiles.json');

        game.time.advancedTiming = true;
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.iso.anchor.set(0.5, 0);


        // Increase world size
        this.nrTilesX = this.map[0].length; 
        this.nrTilesY = this.map.length;  
        var length = this.nrTilesY*tileSize; 
        var width = this.nrTilesX*tileSize; 
        var worldWidth = Math.sqrt(Math.pow(length, 2) + Math.pow(width, 2)); 
        game.world.setBounds(0, 0, worldWidth , worldWidth);

        // Isometric
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    },
    create: function() {
        game.physics.isoArcade.gravity.setTo(0, 0, -500);


        // Set background color
        game.stage.backgroundColor = "#000000";

        // Create groups
        floorGroup = game.add.group();
        obstacleGroup = game.add.group();
        liquidGroup= game.add.group();
        isoGroup = game.add.group();

        // Generate map

        for( var y = 1; y < this.nrTilesY - 1; y++) {
            for(var x = 1; x < this.nrTilesX - 1; x++){
                var tileType = this.map[y][x];
                var tile;
                if(tileType == 0) {
                    tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', this.map[y][x], floorGroup);
                } else if(tileType == 1) {
                    tile = game.add.isoSprite(x*tileSize,y*tileSize, 0,'tileset', this.map[y][x], liquidGroup);
                    tile.isoZ += 6;
                    liquidGroup.add(tile);
                    game.physics.isoArcade.enable(tile);
                    tile.body.collideWorldBounds = true;
                    tile.body.immovable = true;
                }
                tile.anchor.set(0.5, 1);
            }
        }

        // Create player
        player = game.add.isoSprite(100,100,0, 'PlayerSprite',0, obstacleGroup);

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


        // Create target
        target = new Phaser.Plugin.Isometric.Point3();

        // Start physics
        game.physics.isoArcade.enable(player);
        player.body.collideWorldBounds = true;

        // Camera should follow player
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    },
    update: function() {

        if(this.map[Math.round(player.body.y/tileSize)+1][Math.ceil(player.body.x /tileSize)+1] == 1){
            console.log("You are burning, man");
        }
        liquidGroup.forEach(function (w) {
            w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // Get angle between pointer and player
        game.iso.topologicalSort(isoGroup)
        var pointerAngle = Math.atan2(target.y - player.body.y, target.x - player.body.x);
        var pointerDistance = game.physics.arcade.distanceToPointer(player);

        // Correct for isometric plane
        var angleCorrection = -Math.PI/4;

        if(game.input.activePointer.isDown){
            game.iso.unproject(game.input.activePointer.position, target);
            this.playerMoving = true;
        }
        game.world.bringToTop(obstacleGroup);
        game.world.bringToTop(player);
        if(this.playerMoving) {
            var distancePlayerTarget = Math.sqrt(Math.pow(target.x - player.body.x, 2)+ Math.pow(target.y - player.body.y, 2));
            //var distancePlayerTarget = game.physics.isoArcade.distanceBetween(player, target);
            if(distancePlayerTarget <= this.minTargetDistance){
                this.playerMoving = false;
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                player.animations.play('IdlePlayer' + getAnimationDirection(pointerAngle), this.animationSpeed, true);
            } else {
                player.animations.play('RunPlayer' + getAnimationDirection(pointerAngle), this.animationSpeed, true);
                player.body.velocity.x = Math.cos(pointerAngle) * this.playerSpeed;
                player.body.velocity.y = Math.sin(pointerAngle) * this.playerSpeed;
            }
        }
    },
    render: function () {
        if(this.debug){
            floorGroup.forEach(function(tile) {
                game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
            });
            game.debug.body(player, 'rgba(189, 221, 235, 0.6)', false);
            game.debug.text(game.time.fps, 2, 14, "#a7aebe");
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
