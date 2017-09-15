var state_level1 = {
    preload: function() {
        game.map = map01; // Change this to change map
        game.nextState = 'state_level2';
        game.buttonState = [false, false, false, false];
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
        game.buttonState = [true, false, false, false];
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
        game.buttonState = [true, true, false, false];
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
};;
