var test_state = {
    playerSpeed: 300,
    minPointerDistance: 30,
    animationSpeed: 7,
    preload: function() {
        // Sprite sheet containing all player movements
        this.load.spritesheet('PlayerSprite', '../Res/Images/SpriteSheet/PlayerAtlas.png', 162.83,212, 67); 

        //Map
        this.game.load.tilemap('MyTilemap', '../Res/Images/Maps/firstLevel.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', '../Res/Images/Tiles/fourtiles.png');
    },
    create: function() {

        // Set map
        map = this.game.add.tilemap('MyTilemap');
        map.addTilesetImage('tiles', 'tiles');

        terrainLayer = map.createLayer('MyTerrain');
        terrainLayer.resizeWorld();
        terrainLayer.wrap = true;

        lavaLayer = map.createLayer('Lava');
        lavaLayer.resizeWorld();
        lavaLayer.wrap = true;


        // Set background color
        game.stage.backgroundColor = "#FFFFFF";

        // Set Player
        player = this.game.add.sprite(100,100, 'PlayerSprite');
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.scale.setTo(0.3,0.3);
        player.animations.add('PlayerIdleRight', [0,1,2,3]);
        player.animations.add('PlayerRunFrontLeft', [4,5,6,7]);
        player.animations.add('PlayerRunFrontRight', [8,9,10,11]);
        player.animations.add('PlayerRunBackRight', [12,13,14,15]);
        player.animations.add('PlayerRunFront', [16,17,18,19]);
        player.animations.add('PlayerRunBackLeft', [20,21,22,23]);
        player.animations.add('PlayerIdleLeft', [24,25,26,27]);
        player.animations.add('PlayerRunRight', [28,29,30,31]);
        player.animations.add('PlayerIdleFrontRight', [32,33,34,35]);
        player.animations.add('PlayerIdleBackLeft', [36,37,38,39]);
        player.animations.add('PlayerRunLeft', [40,41,42,43]);
        player.animations.add('PlayerIdleFrontLeft', [44,45,46,47]);
        player.animations.add('PlayerIdleBackRight', [48,49,50,51]);
        player.animations.add('PlayerRunBack', [52,53,54,55,56]);
        player.animations.add('PlayerIdleFront', [57,58,59,60,61]);
        player.animations.add('PlayerIdleBack', [62,63,63,64,65]);
        player.animations.play('PlayerIdleFront', 7, true);

        // Set physics
        game.physics.enable(player, Phaser.Physics.ARCADE);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add label
        degreeLabel = game.add.text(20,20, "");

        // Camera
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        map.setCollisionBetween(0, 10000, true, lavaLayer);
    },
    update: function() {
        game.physics.arcade.collide(player,lavaLayer);
        // Get angle between pointer and player
        var pointerAngle = game.physics.arcade.angleToPointer(player);
        var pointerDistance = game.physics.arcade.distanceToPointer(player);
        var minPointerDistance = 30;


        if(pointerDistance >= this.minPointerDistance){
            if(game.input.activePointer.isDown){
                // If mouse is pressed, run
                player.animations.play('PlayerRun' + getAnimationDirection(pointerAngle), this.animationSpeed, true);
                player.body.velocity.x = Math.cos(pointerAngle) * this.playerSpeed;
                player.body.velocity.y = Math.sin(pointerAngle) * this.playerSpeed;
            } else {
                // If mouse is not pressed, idle
                player.animations.play('PlayerIdle' + getAnimationDirection(pointerAngle), this.animationSpeed, true);
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
            }
        } else {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.animations.play('PlayerIdleFront', this.animationSpeed, true);
        }
        degreeLabel.setText(pointerAngle);
    }
};

/*
 * Get the right animation suffix depinding on angle
 */
function getAnimationDirection(angle) {
    var pi = 3.1415;
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
