var game = new Phaser.Game(640, 400, Phaser.AUTO);

game.state.add('test', test_state);

game.state.start('test');
