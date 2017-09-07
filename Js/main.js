var game = new Phaser.Game(1280, 640,Phaser.AUTO, 'test', null, true, false);

game.state.add('test', test_state);

game.state.start('test');
