/*
 * Place all code being called during preload phase
 * of state creation
 */


/* 
 * First function called by a state
 * Load asset and preload game
 */

function preloadState(game) {
    loadAssets(game);
    preloadGame(game);
}

/*
 * Load external assets
 */
function loadAssets(game){

    // Load game sprites
    game.load.spritesheet('PlayerSprite', '../Res/Images/SpriteSheet/PlayerAtlas.png', 162.83,212, 67); 
    game.load.spritesheet('EnemyBatSprite', '../Res/Images/SpriteSheet/EnemyBat.png', 272, 282, 28);
    game.load.spritesheet('EnemyBatRedSprite', '../Res/Images/SpriteSheet/EnemyBatRed.png', 272, 282, 28);
    game.load.spritesheet('FireSprite', '../Res/Images/SpriteSheet/fireAnimation.png', 142,238, 4); 
    game.load.spritesheet('Shield', '../Res/Images/SpriteSheet/Shield.png', 201,100, 8); 
    game.load.spritesheet('Boss', '../Res/Images/SpriteSheet/bossAtlas.png', 350,300, 30); 
    game.load.spritesheet('Stair', '../Res/Images/SpriteSheet/stairAtlas.png', 256,400, 2);

    // Load images
    game.load.image('HealthBar', '../Res/Images/SpriteSheet/healthBar.png');
    game.load.image('EnergyBar', '../Res/Images/SpriteSheet/energyBar.png');
    game.load.image('Hud', '../Res/Images/SpriteSheet/Hud.png');
    game.load.image('QButton', '../Res/Images/SpriteSheet/QButton.png');
    game.load.image('QButtonPressed', '../Res/Images/SpriteSheet/QButtonPressed.png');
    game.load.image('WButton', '../Res/Images/SpriteSheet/WButton.png');
    game.load.image('WButtonPressed', '../Res/Images/SpriteSheet/WButtonPressed.png');
    game.load.image('EButton', '../Res/Images/SpriteSheet/EButton.png');
    game.load.image('EButtonPressed', '../Res/Images/SpriteSheet/EButtonPressed.png');
    game.load.image('RButton', '../Res/Images/SpriteSheet/RButton.png');
    game.load.image('RButtonPressed', '../Res/Images/SpriteSheet/RButtonPressed.png');
    game.load.image('ButtonLocked', '../Res/Images/SpriteSheet/ButtonLocked.png');
    game.load.image('Radius', '../Res/Images/SpriteSheet/Radius.png');
    game.load.image('Bullet', '../Res/Images/SpriteSheet/bullet.png');
    game.load.image('Decoy', '../Res/Images/SpriteSheet/decoy.png');
    game.load.image('Portal', '../Res/Images/SpriteSheet/teleport.png');
    game.load.image('Tower', '../Res/Images/SpriteSheet/Tower.png');
    game.load.image('Pause', '../Res/Images/SpriteSheet/pause.png');
    game.load.image('Reset', '../Res/Images/SpriteSheet/reset.png');
    game.load.image('Key', '../Res/Images/SpriteSheet/key.png');
    game.load.image('BossIcon', '../Res/Images/Tiles/boss.png');

    // Load json file with map layout
    game.load.json('map', game.mapName);

    // Load map tiles
    game.load.spritesheet('tiles', '../Res/Images/SpriteSheet/tiles.png', 62,32, 19); 
} 

/* 
 * Enable isometric graphic
 */
function preloadGame(game) {
    game.time.advancedTiming = true;
    game.plugins.add(new Phaser.Plugin.Isometric(game));
    game.iso.anchor.set(0.5, 0);
    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
}
