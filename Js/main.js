var game = new Phaser.Game(1280, 640,Phaser.AUTO, 'test', null, true, false);

game.state.add('state_level1', state_level1);
game.state.add('state_level2', state_level2);
game.state.add('state_level3', state_level3);

game.state.start('state_level1');
