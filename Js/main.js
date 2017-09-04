var game = new Phaser.Game(800, 400,Phaser.CANVAS, 'test', null, true, false);

game.state.add('test', test_state);

game.state.start('test');
