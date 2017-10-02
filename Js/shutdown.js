
/*
 * All functions called when a state shuts down
 * Help javascripts garbage collection to free memory
 */
function clear(game) {
    game.portalActive = null;
    if(game.player.shield)
        game.player.shield.destroy();
    if(game.player.fire)
        game.player.fire.destroy();
    if(game.player.decoy)
        game.player.decoy.destroy();
    if(game.player.target) 
        game.player.target.destroy();
    if(game.player.portal) 
        game.player.portal.destroy();
    game.player.destroy();
    game.floorGroup.destroy();
    game.enemyGroup.forEach(function(e) {
        e.radiuses.destroy();
    });
    game.enemyGroup.destroy();
    if(game.boss) {
        game.boss.destroy();
    }
    game.liquidGroup.destroy();
    game.hudGroup.destroy();
    game.obstacleGroup.destroy();
    game.walkingGroup.destroy();
    game.flyingGroup.destroy();
    game.abilityGroup.destroy();
    game.buttonState = null;
    game.textTitle.destroy();
    game.textUnderTitle.destroy();
    for(var  i = 0; i < game.buttons.length; i++) {
        if(game.buttons[i].pressed)
            game.buttons[i].pressed.destroy();
        else
            game.buttons[i].pressed = null;
        if(game.buttons[i].unpressed)
            game.buttons[i].unpressed.destroy();
        else
            game.buttons[i].unpressed = null;
        game.buttons[i] = null;
        game.buttonPosition[i].x = null;
        game.buttonPosition[i].y = null;
        game.buttonPosition[i] = null;
    }
    game.buttonNames = null;
    if(game.keyQ)
        game.keyQ = null;
    if(game.keyW)
        game.keyW = null;
    if(game.keyE)
        game.keyE = null;
    if(game.keyR)
        game.keyR = null;
    game.keyP = null;
    game.map = null;
}
