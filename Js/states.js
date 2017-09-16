var state_level1 = {
    preload: function() {
        game.map = map01; // Change this to change map
        game.nextState = 'state_level2';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '01 - First Level';
        game.levelUnderTitleText = 'A Walk In The Park';
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
        game.map = map02; // Change this to change map
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
        game.map = map03; // Change this to change map
        game.nextState = 'state_level1';
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
