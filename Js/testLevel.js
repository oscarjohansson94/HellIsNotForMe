var test_state = {
    debug: false,
    playerSpeed: 300,
    minTargetDistance: 10,
    animationSpeed: 7,
    animationProtection: 0,
    playerMoving: false,
    preload: function() {
        // Load sprite sheet containing all player movements
        this.load.spritesheet('PlayerSprite', '../Res/Images/SpriteSheet/PlayerAtlas.png', 162.83,212, 67); 

        // Load map tiles
        game.load.atlasJSONHash('tileset', '../Res/Images/Tiles/IsoFloor01.png', '../Res/Images/Tiles/IsoFloor01.json');

        // Increase world size
        game.world.setBounds(0, 0, 2520, 1260);
    },
    create: function() {

        // Set background color
        game.stage.backgroundColor = "#000000";

        // Isometric
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.iso.anchor.setTo(0.5, 0.2);

        // Create groups
        floorGroup = game.add.group();
        obstacleGroup = game.add.group();

        // Enable physics for groups
        obstacleGroup.enableBody = true;
        obstacleGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
        floorGroup.enableBody = true;
        floorGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

        // Set physics
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

        // Generate map
        var tileSizeX = 36;
        var tileSizeY = 36;
        for( var y = tileSizeY; y <= game.physics.isoArcade.bounds.frontY - tileSizeY; y += tileSizeY) {
            for(var x = tileSizeX; x <= game.physics.isoArcade.bounds.frontX - tileSizeX; x += tileSizeX){
                tile = game.add.isoSprite(x,y, 0,'tileset','floor', floorGroup);
                tile.anchor.set(0.5, 1);
            }
        }

        // Create player
        player = game.add.isoSprite(100,100,0, 'PlayerSprite',0, obstacleGroup);

        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.scale.setTo(0.3,0.3);

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

        player.body.collideWorldBounds = true;

        // Create target
        target = new Phaser.Plugin.Isometric.Point3();

        // Start physics
        game.physics.isoArcade.enable(player);

        // Camera should follow player
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    },
    update: function() {
        // Get angle between pointer and player
        var pointerAngle = Math.atan2(target.y - player.body.y, target.x - player.body.x);
        var pointerDistance = game.physics.arcade.distanceToPointer(player);

        // Correct for isometric plane
        var angleCorrection = -Math.PI/4;

        if(game.input.activePointer.isDown){
            game.iso.unproject(game.input.activePointer.position, target);
            this.playerMoving = true;
        }
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
