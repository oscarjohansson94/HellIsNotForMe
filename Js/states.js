var state_level1 = {
    preload: function() {
        game.mapName = '../Res/Maps/map00.json'; // Change this to change map
        game.nextState = 'state_level2';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = "01 - First Level";
        game.levelUnderTitleText = "A Walk In The Park";
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
        game.mapName = '../Res/Maps/map01.json'; // Change this to change map
        game.nextState = 'state_level3';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '02 - Don\'t Fall Off The Edge';
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
}
var state_level3 = {
    preload: function() {
        game.mapName = '../Res/Maps/map02.json'; // Change this to change map
        game.nextState = 'state_level4';
        game.buttonState = [false, false, false, true];
        game.levelTitleText = '03 - Advanced Walking 101';
        game.levelUnderTitleText = 'Hell is suprisingly dull';
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
        game.mapName = '../Res/Maps/map03.json'; // Change this to change map
        game.nextState = 'state_level5';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '04 - Take a lava swim';
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
};

var state_level5 = {
    preload: function() {
        game.mapName = '../Res/Maps/map04.json'; // Change this to change map
        game.nextState = 'state_level6';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '05 - Your first encounter';
        game.levelUnderTitleText = 'First impression is everything';
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

var state_level6 = {
    preload: function() {
        game.mapName = '../Res/Maps/map05.json'; // Change this to change map
        game.nextState = 'state_level7';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '06 - Second Encounter';
        game.levelUnderTitleText = 'Try to avoid first impressions';
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

var state_level7 = {
    preload: function() {
        game.mapName = '../Res/Maps/map07.json'; // Change this to change map
        game.nextState = 'state_level8';
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '07 - Multiple Threats';
        game.levelUnderTitleText = '';
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
var state_level8 = {
    preload: function() {
        game.mapName = '../Res/Maps/map08.json'; // Change this to change map
        game.nextState = 'state_level9';
        game.buttonState = [true, false, false, false];
        game.levelTitleText = '08 - In The Eyes Of The Enemy';
        game.levelUnderTitleText = 'Use Q';
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
var state_level9 = {
    preload: function() {
        game.mapName = '../Res/Maps/map12.json'; // Change this to change map
        game.nextState = 'state_level10';
        game.buttonState = [true, false, false, false];
        game.levelTitleText = '09 - The Red Bat';
        game.levelUnderTitleText = 'Time to use Q and prioritize';
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
var state_level10 = {
    preload: function() {
        game.mapName = '../Res/Maps/map11.json'; // Change this to change map
        game.nextState = 'state_level11';
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '10 - Cold Feet';
        game.levelUnderTitleText = 'Use W';
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
var state_level11 = {
    preload: function() {
        game.mapName = '../Res/Maps/map10.json'; // Change this to change map
        game.nextState = 'state_level12';
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '11 - It almost looks like...';
        game.levelUnderTitleText = 'Could it be?';
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
var state_level12 = {
    preload: function() {
        game.mapName = '../Res/Maps/map06.json'; // Change this to change map
        game.nextState = 'state_level13';
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '12 - HELL FREEZES OVER';
        game.levelUnderTitleText = 'It finally happened';
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
var state_level13 = {
    preload: function() {
        game.mapName = '../Res/Maps/map09.json'; // Change this to change map
        game.nextState = 'state_level1';
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '13- Frozen';
        game.levelUnderTitleText = 'The cold never bothered me anyway';
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
