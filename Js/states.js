var state_level1 = {
    preload: function() {
        game.mapName = '../Res/Images/Tiles/test200200.json'; // Change this to change map
        game.nextState = 'state_level2';
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '01 - Jonas Inspiration';
        game.levelUnderTitleText = 'Bli imponerade, hoebroe';
        preloadState(game);
    },
    create: function() {
        createState(game);
    },
    update: function() {
        updateState(game);
    },
    shutdown: function() {
        clear(game);
    },
    render: function () {
        renderState(game);
    }
};
var state_level2 = {
    preload: function() {
        game.mapName = '../Res/Images/Tiles/test2020.json'; // Change this to change map
        game.nextState = 'state_level3';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '02 - Take a lava swim';
        game.levelUnderTitleText = 'I dare you';
        preloadState(game);
    },
    create: function() {
        createState(game);
    },
    update: function() {
        updateState(game);
    },
    shutdown: function() {
        clear(game);
    },
    render: function () {
        renderState(game);
    }
}
var state_level3 = {
    preload: function() {
        game.mapName = '../Res/Images/Tiles/test2020.json'; // Change this to change map
        game.nextState = 'state_level4';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '03 - Your first encounter';
        game.levelUnderTitleText = 'How does my hair look?';
        preloadState(game);
    },
    create: function() {
        createState(game);
    },
    update: function() {
        updateState(game);
    },
    shutdown: function() {
        clear(game);
    },
    render: function () {
        renderState(game);
    }
};
var state_level4 = {
    preload: function() {
        game.mapName = '../Res/Images/Tiles/test2020.json'; // Change this to change map
        game.nextState = 'state_level1';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '04 - Don\'t fall off the edge';
        game.levelUnderTitleText = 'Just kidding';
        preloadState(game);
    },
    create: function() {
        createState(game);
    },
    update: function() {
        updateState(game);
    },
    shutdown: function() {
        clear(game);
    },
    render: function () {
        renderState(game);
    }
};
