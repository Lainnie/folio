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
    me,
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
    Gameobject                  =   function(name, type, context){
                                    context.x           = typeof context.x !== 'undefined' ? context.x : null;
                                    context.y           = typeof context.y !== 'undefined' ? context.y : null;
                                    this.name   = name,
                                    this.type   = type,
                                    this.image  = context.image,
                                    this.where  = {
                                        'x': context.x,
                                        'y': context.y
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
                    if (scene[y][x].where.x !== null){
                        context.drawImage(scene[y][x].image, scene[y][x].where.x, scene[y][x].where.y, sizeSprite, sizeSprite);
                    }else{
                        context.drawImage(scene[y][x].image, space, canvasHeight - spritePos, sizeSprite, sizeSprite);
                    }
                    gametab[canvasHeight - spritePos][space] = scene[y][x].type;
                }
            }
        }
        scene = scenes[1];
        for (y = 0, row = scene.length, spritePos = canvasHeight + 80; y < row; y = y + 1, spritePos = spritePos - 40){
            for (x = 0, len = scene[y].length, space = 0; x < len; x = x + 1, space = space + sizeSprite){
                if (scene[y][x] !== undefined && scene[y][x] !== ''){
                    context.drawImage(scene[y][x].image, space, canvasHeight - spritePos, sizeSprite, sizeSprite);
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
        gametab[me.where.y][me.where.x] = 1;
        if (key === 37 && me.where.x > limit.xmin && gametab[me.where.y][me.where.x - sizeSprite] !== 'decor'){
            me.where.x -= sizeSprite;
        }
        else if (key === 38 && me.where.y > limit.ymin && gametab[me.where.y - 40][me.where.x] !== 'decor'){
            me.where.y -= sizeSprite - 40;
        }
        else if (key === 39 && me.where.x < limit.xmax && gametab[me.where.y][me.where.x + sizeSprite] !== 'decor'){
            me.where.x += sizeSprite;
        }
        else if (key === 40 && me.where.y < limit.ymax && gametab[me.where.y + 40][me.where.x] !== 'decor'){
            me.where.y += sizeSprite - 40;
        }
        if (gametab[me.where.y][me.where.x] === 'link'){
            setTimeout(function(){
                me.where.y += sizeSprite - 40;
            }, 100);
        }
        gametab[me.where.y][me.where.x] = 'perso';
    };

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
    me = makego('lainnie', 'me', {image:images.me, x:0, y:canvasHeight - 120});
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '',
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('doortallclosed', 'link', {image: images.doortallclosed}),
                makego('windowtall', 'decor', {image: images.windowtall}), '', '', '', '']);
    scene.push([
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('doortallclosed', 'link', {image: images.doortallclosed}),
                makego('windowtall', 'decor', {image: images.windowtall}), '', '', '', '',
                makego('treeshort', 'decor', {image: images.treeshort}), '',
                makego('treeshort', 'decor', {image: images.treeshort}), '', '', '', '']);
    scene.push([
                makego('treeshort', 'decor', {image: images.treeshort}), '',
                makego('treeshort', 'decor', {image: images.treeshort}), '', '', '', '', '', '', '', '',
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('doortallclosed', 'link', {image: images.doortallclosed}),
                makego('windowtall', 'decor', {image: images.windowtall})]);
    scene.push(['', '', '', '',
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('doortallclosed', 'link', {image: images.doortallclosed}),
                makego('windowtall', 'decor', {image: images.windowtall}), '', '', '', '',
                makego('treeshort', 'decor', {image: images.treeshort}), '',
                makego('treeshort', 'decor', {image: images.treeshort})]);
    scene.push(['', '', '', '',
                makego('treeshort', 'decor', {image: images.treeshort}), '',
                makego('treeshort', 'decor', {image: images.treeshort}), '', '', '', '', '', '', '']);
    scene.push([
                me, '', '', '', '', '', '', '', '', '', '', '', '', '']);
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
    scene.push(['', '', '', '', '', '', '',
                makego('roofsouthwest', 'decor', {image: images.roofsouthwest}),
                makego('roofsouth', 'decor', {image: images.roofsouth}),
                makego('roofsoutheast', 'decor', {image: images.roofsoutheast}), '', '', '', '']);
    scene.push([
                makego('roofsouthwest', 'decor', {image: images.roofsouthwest}),
                makego('roofsouth', 'decor', {image: images.roofsouth}),
                makego('roofsoutheast', 'decor', {image: images.roofsoutheast}), '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '',
                makego('roofsouthwest', 'decor', {image: images.roofsouthwest}),
                makego('roofsouth', 'decor', {image: images.roofsouth}),
                makego('roofsoutheast', 'decor', {image: images.roofsoutheast})]);
    scene.push(['', '', '', '',
                makego('roofsouthwest', 'decor', {image: images.roofsouthwest}),
                makego('roofsouth', 'decor', {image: images.roofsouth}),
                makego('roofsoutheast', 'decor', {image: images.roofsoutheast}), '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scenes.push(scene);

    context.canvas.width        = sizeSprite * scene[0].length;
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

