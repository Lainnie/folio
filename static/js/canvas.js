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
    lenw,
    row,
    count,
    gameLoop,
    space,
    scene                       = [],
    scenes                      = [],
    gametab                     = {},
    here                        = { 'x': 0, 'y': canvasHeight - 120},
    limit                       = {'xmin': 0, 'xmax': canvas.width() - 80, 'ymin': -40, 'ymax': 240},
    images                      = {
            'me':               new Image(),
            'plainblock':       new Image(),
            'dirtblock':        new Image(),
            'doortallclosed':   new Image(),
            'doortallopen':     new Image(),
            'windowtall':       new Image(),
            'treeshort':        new Image(),
            'wallblocktall':    new Image(),
            'roofsouthwest':    new Image(),
            'roofsoutheast':    new Image(),
            'roofsouth':        new Image(),
            'grassblock':       new Image()
        },
    types                       = {
            'decor':            'decor',
            'mob':              'mob',
            'me':               'me'
    }
    gameobjects                 = {
    },
    Gameobject                  =   function(name, type, image){
                                    this.name   = name,
                                    this.type   = type,
                                    this.image  = image,
                                    this.where  = {
                                        'x': null,
                                        'y': null
                                    }
                                },
    makego      = function(name, type, image){
        return new Gameobject(name, type, image);
    },
    isLoad      = (function(){
        var i,
        count = 0;
        for (i in images){
            count = count + 1;
        }
        return count;
    })(),
    countLoad   = function(){
        isLoad = isLoad - 1;
        if (isLoad === 0){
            gameLoop = setInterval(init, 1000 / 60);
        }
    },
    drawToCanvas = function(){
        var scene = [],
        start = true;
        scene = scenes[0];
        for ( x = 0, len = scene[0].length, space = 0, spritePos = 0; x < len; x = x + 1, space = space + sizeSprite ){
            context.drawImage(images.dirtblock, space, canvasHeight - sizeSprite, sizeSprite, sizeSprite);
        }
        for (y = 0, row = scene.length, spritePos = canvasHeight + 20; y < row; y = y + 1, spritePos = spritePos - 40){
            for (x = 0, len = scene[y].length, space = 0; x < len; x = x + 1, space = space + sizeSprite){
                context.drawImage(images.grassblock, space, canvasHeight - spritePos, sizeSprite, sizeSprite);
            }
        }
        for (y = 0, row = scene.length, spritePos = canvasHeight + 40; y < row; y = y + 1, spritePos = spritePos - 40){
            for (x = 0, len = scene[y].length, space = 0; x < len; x = x + 1, space = space + sizeSprite){
                if (scene[y][x] !== undefined && scene[y][x] !== ''){
                    context.drawImage(images[scene[y][x]], space, canvasHeight - spritePos, sizeSprite, sizeSprite);
                    gametab[canvasHeight - spritePos][space] = 'decor';
                }
            }
        }
        gametab[here.y][here.x] = 'perso';
        context.drawImage(test.image, here.x, here.y, sizeSprite, sizeSprite);
        scene = scenes[1];
        for (y = 0, row = scene.length, spritePos = canvasHeight + 80; y < row; y = y + 1, spritePos = spritePos - 40){
            for (x = 0, len = scene[y].length, space = 0; x < len; x = x + 1, space = space + sizeSprite){
                if (scene[y][x] !== undefined && scene[y][x] !== ''){
                    context.drawImage(images[scene[y][x]], space, canvasHeight - spritePos, sizeSprite, sizeSprite);
                }
            }
        }
    },
    init = function(){
        context.clearRect(0, 0, canvas.width(), canvas.height());
        drawToCanvas();
    },
    moveornot = function(evt){
        var key = evt.keyCode,
        c = $('#wrap_canvas');

        gametab[here.y][here.x] = 1;
        if (key === 37 && here.x > limit.xmin && gametab[here.y][here.x - sizeSprite] !== 'decor'){
            here.x -= sizeSprite;
        }
        else if (key === 38 && here.y > limit.ymin && gametab[here.y - 40][here.x] !== 'decor'){
            here.y -= sizeSprite - 40;
        }
        else if (key === 39 && here.x < limit.xmax && gametab[here.y][here.x + sizeSprite] !== 'decor'){
            here.x += sizeSprite;
        }
        else if (key === 40 && here.y < limit.ymax && gametab[here.y + 40][here.x] !== 'decor'){
            here.y += sizeSprite - 40;
        }
        gametab[here.y][here.x] = 'perso';
    };

    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', 'windowtall', 'doortallclosed', 'windowtall', '', '', '', '']);
    scene.push(['windowtall', 'doortallclosed', 'windowtall', '', '', '', '', 'treeshort', '', 'treeshort', '', '', '', '']);
    scene.push(['treeshort', '', 'treeshort', '', '', '', '', '', '', '', '', 'windowtall', 'doortallclosed', 'windowtall']);
    scene.push(['', '', '', '', 'windowtall', 'doortallclosed', 'windowtall', '', '', '', '', 'treeshort', '', 'treeshort']);
    scene.push(['', '', '', '', 'treeshort', '', 'treeshort', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scenes.push(scene);

    for (y = limit.ymin, len = limit.ymax; y <= len; y = y + 40){
        gametab[y] = {};
        for (x = limit.xmin, lenw = limit.xmax; x <= lenw; x = x + 80){
            gametab[y][x] = 1;
        }
    }
    scene = [];

    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', 'roofsouthwest', 'roofsouth', 'roofsoutheast', '', '', '', '']);
    scene.push(['roofsouthwest', 'roofsouth', 'roofsoutheast', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', 'roofsouthwest', 'roofsouth', 'roofsoutheast']);
    scene.push(['', '', '', '', 'roofsouthwest', 'roofsouth', 'roofsoutheast', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scenes.push(scene);

    /**
    * Init image
    */
    images.me.src               = 'static/img/sprites/Boy.png';
    images.me.onload            = countLoad;
    images.me.id                = 'me';
    images.grassblock.src       = 'static/img/sprites/Grass Block.png';
    images.grassblock.onload    = countLoad;
    images.roofsoutheast.src    = 'static/img/sprites/Roof South East.png';
    images.roofsoutheast.onload = countLoad;
    images.roofsouth.src        = 'static/img/sprites/Roof South.png';
    images.roofsouth.onload     = countLoad;
    images.roofsouthwest.src    = 'static/img/sprites/Roof South West.png';
    images.roofsouthwest.onload = countLoad;
    images.treeshort.src        = 'static/img/sprites/Tree Short.png';
    images.treeshort.onload     = countLoad;
    images.plainblock.src       = 'static/img/sprites/Plain Block.png';
    images.plainblock.onload    = countLoad;
    images.dirtblock.src        = 'static/img/sprites/Dirt Block.png';
    images.dirtblock.onload     = countLoad;
    images.wallblocktall.src    = 'static/img/sprites/Wall Block Tall.png';
    images.wallblocktall.onload = countLoad;
    images.doortallclosed.src   = 'static/img/sprites/Door Tall Closed.png';
    images.doortallclosed.onload= countLoad;
    images.doortallopen.src     = 'static/img/sprites/Door Tall Open.png';
    images.doortallopen.onload  = countLoad;
    images.windowtall.src       = 'static/img/sprites/Window Tall.png';
    images.windowtall.onload    = countLoad;
    context.canvas.width        = sizeSprite * scene[0].length;
    var test = makego('lainnie', 'me', images.me);
    console.log(test);
    /**
    * Event handler
    */
    $('#wrap_canvas').css({ position: 'relative', top: $('#page').height() / 1.4 - canvas.height()});
    $(window).resize(function(){
        $('#wrap_canvas').css({ position: 'relative', top: $('#page').height() / 1.4 - canvas.height()});
    });
    $(document).keyup(function(evt){
        var key = evt.keyCode,
        c = $('#wrap_canvas');

        if (key === 13){
            if (c.css('display') === 'none'){
                $(document).bind('keyup', moveornot);
                gameLoop = setInterval(init);
            }else{
                $(document).unbind('keyup', moveornot);
                clearInterval(gameLoop);
            }
            c.fadeToggle('slow');
        }
    });
    $(document).bind('keyup', moveornot);
})();

