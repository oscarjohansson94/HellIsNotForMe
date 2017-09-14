var test_state = {
    preload: function() {
        game.map = map03; // Change this to change map
        preloadState(game);
    },
    create: function() {
        createState(game);
    },
    update: function() {
        updateState(game);
    },
    render: function () {
        renderState(game);
    }
};
