var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'test', null, false, false);

game.state.add('state_boss', state_boss);
game.state.add('state_start', state_start);
game.state.add('state_win', state_win);
game.state.add('state_fullscreen', state_fullscreen);
game.state.add('state_level1', state_level1);
game.state.add('state_level2', state_level2);
game.state.add('state_level3', state_level3);
game.state.add('state_level4', state_level4);
game.state.add('state_level5', state_level5);
game.state.add('state_level6', state_level6);
game.state.add('state_level7', state_level7);
game.state.add('state_level8', state_level8);
game.state.add('state_level9', state_level9);
game.state.add('state_level10', state_level10);
game.state.add('state_level11', state_level11);
game.state.add('state_level12', state_level12);
game.state.add('state_level13', state_level13);
game.state.add('state_level14', state_level14);
game.state.add('state_level15', state_level15);
game.state.add('state_level16', state_level16);

game.state.start('state_level16');
