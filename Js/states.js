var state_boss = {
    preload: function() {
        game.mapName = '../Res/Maps/boss.json'; // Change this to change map
        game.nextState = 'state_win';
        game.locked = true;
        game.buttonState = [true, true, true, true];
        game.levelTitleText = "BOSS FIGHT";
        game.levelUnderTitleText = "Use the towers";
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

var state_fullscreen = {
    preload: function() {
        var style = { font: "30px Arial Black", fill: "#ffffff", align: "center", fontWeight: 'bold', stroke: '#000000', strokeThickness: 6 };
        var string1 = "Press 'F' for fullscreen and to continue";

        var text1 = game.add.text((game.width-string1.length*15) / 2, game.height/2, string1, style);
        game.keyF = game.input.keyboard.addKey(Phaser.Keyboard.F);
        game.keyF.onDown.add(function() {
            game.state.start("state_start");
            game.scale.startFullScreen(false);
        });
        timer = game.time.create(false);

        timer.loop(400, function() {
            if(text1.alpha == 1.0) {
                text1.alpha = 0.0;
            } else {
                text1.alpha = 1.0;
            }
        }
            , this);
        timer.start();
    },
    create: function() {
        game.stage.backgroundColor = "#000000";
    },
    update: function() {
    },
    shutdown: function() {
    },
    render: function () {
    }
};
var state_win = {
    preload: function() {
        game.load.spritesheet('win', '../Res/Images/SpriteSheet/winAnim.png', 79, 104, 2); 
    },
    create: function() {
        var style = { font: "30px Arial Black", fill: "#ffffff", align: "center", fontWeight: 'bold', stroke: '#000000', strokeThickness: 6 };

        game.keyO = game.input.keyboard.addKey(Phaser.Keyboard.O);
        game.keyO.onDown.add(function() {game.state.start('state_start')}, this);
        var string1 = "You defeated the final boss and escaped hell!";
        var string2 = "Congratulations, you won!";
        var string3 = "Press 'O' to restart the game";
        var text1 = game.add.text((game.width-string1.length*15) / 2, game.height*0.1, string1, style);
        var text2 = game.add.text((game.width -string2.length*15)/ 2, game.height*0.1+35, string2, style);
        var text3 = game.add.text((game.width -string3.length*15)/ 2, game.height-100, string3, style);
        text1.alpha = 0.0;
        text2.alpha = 0.0;
        text3.alpha = 0.0;
        game.add.tween(text1).to( { alpha: 1.0 }, 100, "Linear", true, 1000);
        game.add.tween(text2).to( { alpha: 1.0 }, 100, "Linear", true, 3000);
        game.add.tween(text3).to( { alpha: 1.0 }, 100, "Linear", true, 5000);
        var player = game.add.sprite(game.width/2, game.height/2, 'win', 0);
        player.animations.add('idle', [0,1]);
        player.animations.play('idle', 2, true);
    },
    update: function() {
    },
    shutdown: function() {
    },
    render: function () {
    }
};
var state_start = {
    preload: function() {
    },
    create: function() {
        game.stage.backgroundColor = "#000000";
        var style = { font: "48px Arial Black", fill: "#ffffff", align: "center", fontWeight: 'bold', stroke: '#000000', strokeThickness: 6 };
        var style1 = { font: "24px Arial Black", fill: "#ffffff", align: "center", fontWeight: 'bold', stroke: '#000000', strokeThickness: 6 };

        game.keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
        game.keyS.onDown.add(function() {game.state.start('state_level1')}, this);
        var string1 = "You wake up after a wild night out...";
        var string2 = "Only to find out: ";
        var string3 = "You're in hell...";
        var string4 = "The damp lighting, ugly interior, and the heat";
        var string5 = "You always liked skiing...";
        var string6 = "You slowly start to realise...";
        var string7 = "HELL IS NOT FOR ME"
        var string8 = "Time to escape!";
        var string9 = "Press 'S' to start the game";
        var text1 = game.add.text(game.width / 5, game.height*0.1, string1, style1);
        var text2 = game.add.text(game.width / 5, game.height*0.1+28, string2, style1);
        var text3 = game.add.text(game.width / 5 + string2.length*12, game.height*0.1+28, string3, style1);
        var text4 = game.add.text(game.width / 5, game.height*0.1+28*2, string4, style1);
        var text5 = game.add.text(game.width / 5, game.height*0.1+28*3, string5, style1);
        var text6 = game.add.text(game.width / 5, game.height*0.1+28*4, string6, style1);
        var text7 = game.add.text(game.width / 5, game.height*0.1+28*4+48, string7, style);
        var text8 = game.add.text(game.width / 5, game.height*0.1+28*4+48*2, string8, style1);
        var text9 = game.add.text(game.width / 5, game.height-50, string9, style1);
        text1.alpha = 0;
        text2.alpha = 0;
        text3.alpha = 0;
        text4.alpha = 0;
        text5.alpha = 0;
        text6.alpha = 0;
        text7.alpha = 0;
        text8.alpha = 0;
        text9.alpha = 0;
        game.add.tween(text1).to( { alpha: 1.0 }, 100, "Linear", true, 1000);
        game.add.tween(text2).to( { alpha: 1.0 }, 100, "Linear", true, 4000);
        game.add.tween(text3).to( { alpha: 1.0 }, 100, "Linear", true, 7000);
        game.add.tween(text4).to( { alpha: 1.0 }, 100, "Linear", true, 10000);
        game.add.tween(text5).to( { alpha: 1.0 }, 100, "Linear", true, 13000);
        game.add.tween(text6).to( { alpha: 1.0 }, 100, "Linear", true, 16000);
        game.add.tween(text7).to( { alpha: 1.0 }, 100, "Linear", true, 19000);
        game.add.tween(text8).to( { alpha: 1.0 }, 100, "Linear", true, 22000);
        game.add.tween(text9).to( { alpha: 1.0 }, 100, "Linear", true, 25000);
    },
    update: function() {
    },
    shutdown: function() {
    },
    render: function () {
    }
};
var state_level1 = {
    preload: function() {
        game.mapName = '../Res/Maps/map00.json'; // Change this to change map
        game.nextState = 'state_level2';
        game.locked = false;
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '01 - A walk in the park';
        game.levelUnderTitleText = 'Use the cursor';
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

var state_level2 = {
    preload: function() {
        game.mapName = '../Res/Maps/map01.json'; // Change this to change map
        game.nextState = 'state_level3';
        game.locked = false;
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
        game.mapName = '../Res/Maps/map03.json'; // Change this to change map
        game.nextState = 'state_level4';
        game.locked = false;
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '03 - Take a lava swim';
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

var state_level4 = {
    preload: function() {
        game.mapName = '../Res/Maps/map04.json'; // Change this to change map
        game.nextState = 'state_level5';
        game.locked = false;
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '04 - Your first encounter';
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

var state_level5 = {
    preload: function() {
        game.mapName = '../Res/Maps/map05.json'; // Change this to change map
        game.nextState = 'state_level6';
        game.locked = false;
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '05 - Second Encounter';
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

var state_level6 = {
    preload: function() {
        game.mapName = '../Res/Maps/map07.json'; // Change this to change map
        game.nextState = 'state_level7';
        game.locked = false;
        game.buttonState = [false, false, false, false];
        game.levelTitleText = '06 - Multiple Threats';
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
var state_level7 = {
    preload: function() {
        game.mapName = '../Res/Maps/map08.json'; // Change this to change map
        game.nextState = 'state_level8';
        game.locked = false;
        game.buttonState = [true, false, false, false];
        game.levelTitleText = '07 - In The Eyes Of The Enemy';
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
var state_level8 = {
    preload: function() {
        game.mapName = '../Res/Maps/map12.json'; // Change this to change map
        game.nextState = 'state_level9';
        game.locked = false;
        game.buttonState = [true, false, false, false];
        game.levelTitleText = '08 - The Red Bat';
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
var state_level9 = {
    preload: function() {
        game.mapName = '../Res/Maps/map11.json'; // Change this to change map
        game.nextState = 'state_level10';
        game.locked = false;
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '09 - Cold Feet';
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
var state_level10 = {
    preload: function() {
        game.mapName = '../Res/Maps/map10.json'; // Change this to change map
        game.nextState = 'state_level11';
        game.locked = false;
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '10 - Winter is coming';
        game.levelUnderTitleText = 'Damn you, global warming';
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
        game.mapName = '../Res/Maps/map06.json'; // Change this to change map
        game.nextState = 'state_level12';
        game.locked = false;
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '11 - Watch the edge';
        game.levelUnderTitleText = 'For real this time';
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
        game.mapName = '../Res/Maps/map09.json'; // Change this to change map
        game.nextState = 'state_level13';
        game.locked = false;
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '12 - Frozen';
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
var state_level13 = {
    preload: function() {
        game.mapName = '../Res/Maps/map13.json'; // Change this to change map
        game.nextState = 'state_level14';
        game.locked = false;
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '13 - Winter is over';
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
var state_level14 = {
    preload: function() {
        game.mapName = '../Res/Maps/map14.json'; // Change this to change map
        game.nextState = 'state_level15';
        game.locked = true;
        game.buttonState = [true, true, false, false];
        game.levelTitleText = '14 - Get the key';
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
var state_level15 = {
    preload: function() {
        game.mapName = '../Res/Maps/map15.json'; // Change this to change map
        game.nextState = 'state_level16';
        game.locked = true;
        game.buttonState = [true, true, true, false];
        game.levelTitleText = '15 - Decoy';
        game.levelUnderTitleText = 'Use E';
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
var state_level16 = {
    preload: function() {
        game.mapName = '../Res/Maps/map16.json'; // Change this to change map
        game.nextState = 'state_boss';
        game.locked = true;
        game.buttonState = [true, true, true, true];
        game.levelTitleText = '16 - Find the key';
        game.levelUnderTitleText = 'Use R';
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
