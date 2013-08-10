(function(){

    "use_strict";

    var canvas  = $('#canvas'),
    sizeDoc,
    context     = canvas.get()[0].getContext('2d'),
    canvasHeight= canvas.height(),
    sizeSprite  = 80,
    spritePos,
    x,
    y,
    len,
    row,
    count,
    space,
    scene                       = [],
    images                      = {
            'plainblock': new Image(),
            'dirtblock': new Image(),
            'doortallclosed': new Image(),
            'windowtall': new Image()
        },
    isLoad = (function(){
        var i,
        count = 0;
        for (i in images){
            count = count + 1;
        }
        return count;
    })(),
    image                       = new Image(),
    countLoad = function(){
        isLoad = isLoad - 1;
        if (isLoad === 0){
            drawToCanvas();
        }
    },
    drawToCanvas = function(){
        for ( x = 0, len = scene[0].length, space = 0, spritePos = 0; x < len; x = x + 1, space = space + sizeSprite ){
            context.drawImage(images[scene[0][1]], space, canvasHeight - sizeSprite, sizeSprite, sizeSprite);
        }
        for (y = 0, row = scene.length, spritePos = canvasHeight + 20; y < row; y = y + 1, spritePos = spritePos - 40){
            for (x = 0, len = scene[y].length, space = 0; x < len; x = x + 1, space = space + sizeSprite){
                context.drawImage(images[scene[y][x]], space, canvasHeight - spritePos, sizeSprite, sizeSprite);
            }
        }
    };

    scene.push(['plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','plainblock','dirtblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','plainblock','dirtblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','plainblock','dirtblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene.push(['plainblock', 'dirtblock', 'plainblock','plainblock','dirtblock','plainblock','plainblock', 'plainblock', 'dirtblock', 'plainblock','dirtblock','plainblock','plainblock','plainblock']);
    scene = scene.reverse();
    image.src                   = 'static/img/sprites/Plain Block.png';
    image.onload                = countLoad;
    images.plainblock.src       = 'static/img/sprites/Plain Block.png';
    images.plainblock.onload    = countLoad;
    images.dirtblock.src        = 'static/img/sprites/Dirt Block.png';
    images.dirtblock.onload     = countLoad;
    images.doortallclosed.src   = 'static/img/sprites/Door Tall Closed.png';
    images.doortallclosed.onload= countLoad;
    images.windowtall.src       = 'static/img/sprites/Window Tall.png';
    images.windowtall.onload    = countLoad;
    
    context.canvas.width        = sizeSprite * scene[0].length;
})();

