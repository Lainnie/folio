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
    inmove                      = false,
    speedMove                   = 4,
    frame                       = 1000 / 60,
    scene                       = [],
    scenes                      = [],
    mobs                        = [],
    entities                    = [],
    gametab                     = {},
    here                        = { 'x': 0, 'y': canvasHeight - 120},
    limit                       = {'xmin': 0, 'xmax': canvas.width() - 80, 'ymin': -40, 'ymax': 240},
    images                      = {
            'me':               new Image(),
            'selector':         new Image(),
            'mobbug':           new Image(),
            'rock':             new Image(),
            'plainblock':       new Image(),
            'dirtblock':        new Image(),
            'doortallclosed':   new Image(),
            'doortallopen':     new Image(),
            'windowtall':       new Image(),
            'treeshort':        new Image(),
            'treeugly':         new Image(),
            'treetall':         new Image(),
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
                                    context.url         = typeof context.url !== 'undefined' ? context.url : null;
                                    this.name   = name,
                                    this.type   = type,
                                    this.image  = context.image,
                                    this.where  = {
                                        'x': context.x,
                                        'y': context.y
                                    },
                                    this.lastWhere = {
                                        'x': context.x,
                                        'y': context.y
                                    },
                                    this.url    = context.url,
                                    this.move   = false,
                                    this.update = function(){
                                        if (this.where.x < limit.xmin){
                                            this.where.x = limit.xmin;
                                        }else if (this.where.x > limit.xmax){
                                            this.where.x = limit.xmax;
                                        }else if (this.where.y < limit.ymin){
                                            this.where.y = limit.ymin;
                                        }else if (this.where.y > limit.ymax){
                                            this.where.y = limit.ymax;
                                        }
                                        if (gametab[this.where.y] && gametab[this.where.y][this.where.x] && gametab[this.where.y][this.where.x].type == 'decor') {
                                            this.where.y = this.lastWhere.y;
                                            this.where.x = this.lastWhere.x;
                                            //console.log(gametab[this.where.y][this.where.x]);
                                        }
                                    };
                                },
    resize      = (function(){
        $('#canvas').css({ position: 'relative', top: $(document).height() / 1.4 - canvas.height()});
    });
    makego      = function(name, type, image){
        var object = new Gameobject(name, type, image);
        entities.push(object);
        return object;
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
            gameLoop = setInterval(init, frame);
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
                    gametab[canvasHeight - spritePos][space] = scene[y][x];
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
    update = function(){
        var i, len;

        for (i = 0, len = entities.length; i < len; i = i + 1){
            entities[i].update();
        }
    }
    init = function(){
        context.clearRect(0, 0, canvas.width(), canvas.height());
        update();
        drawToCanvas();
    },
    movemob = function(){
        for (i = 0, len = mobs.length; i < len; i = i + 1){
            moveornot(mobs[i]);
        }
    },
    isLink = function(){
        if(gametab[me.where.y][me.where.x] &&  gametab[me.where.y][me.where.x] instanceof Gameobject && gametab[me.where.y][me.where.x].type === 'link'){
            setTimeout(function(){
                var url = gametab[me.where.y][me.where.x].url;
                init();
                me.where.y += sizeSprite - 40;
                console.log('Voulez vous aller sur la page ' + url + ' ?');
                init();
            }, frame);
        }

    },
    hit = function(movable){
        var here = gametab[movable.where.y][movable.where.x];
        //console.log(here, here.type, movable.type);
        if (here != 1 && here.type === 'me' && movable.type === 'enemy'){
            console.log(movable, here);
        }
        else if (here != 1 && here.type === 'enemy' && movable.type === 'me'){
            console.log(movable, here);
        }
    },
    moveornot = function(evt){
        var key = evt && evt.keyCode ? evt.keyCode : Math.floor((Math.random() * (40 - 37 + 1)) + 37),
        movable = evt && evt.keyCode ? me : evt,
        move = null,
        inmove = false,
        stop = 0,
        block = 20,
        c = $('#wrap_canvas');

        if (movable == undefined || movable.move === true) { return false; }
        if (key < 37 || key > 40) { return false; }
        if ( movable.where.y < limit.ymin || movable.where.y > limit.ymax) { return false; }
        if ( movable.where.x < limit.xmin || movable.where.x > limit.xmax) { return false; }
        gametab[movable.where.y][movable.where.x] = 1;
        if (key === 37){
            movable.move = true;
            movable.lastWhere.x = movable.where.x;
            movable.lastWhere.y = movable.where.y;
            move = setInterval(function(){
                movable.where.x -= speedMove;
                init();
                isLink();
                stop = stop + 1;
                if (stop >= block){
                    clearInterval(move);
                    movable.move = false;
                }
            }, frame);
        }
        else if (key === 38){
            movable.move = true;
            movable.lastWhere.x = movable.where.x;
            movable.lastWhere.y = movable.where.y;
            move = setInterval(function(){
                movable.where.y -= speedMove / 2;
                init();
                isLink();
                stop = stop + 1;
                if (stop >= block){
                    clearInterval(move);
                    movable.move = false;
                }
            }, frame);
        }
        else if (key === 39){
            movable.move = true;
            movable.lastWhere.x = movable.where.x;
            movable.lastWhere.y = movable.where.y;
            move = setInterval(function(){
                movable.where.x += speedMove;
                init();
                isLink();
                stop = stop + 1;
                if (stop >= block){
                    clearInterval(move);
                    movable.move = false;
                }
            }, frame);
        }
        else if (key === 40){
            movable.move = true;
            movable.lastWhere.x = movable.where.x;
            movable.lastWhere.y = movable.where.y;
            move = setInterval(function(){
                movable.where.y += speedMove / 2;
                init();
                isLink();
                stop = stop + 1;
                if (stop >= block){
                    clearInterval(move);
                    movable.move = false;
                }
            }, frame);
        }
        hit(movable);
        gametab[movable.where.y][movable.where.x] = movable;
        init();
    };

    /**
    * Init image
    */
    images.me.src               = 'static/img/sprites/Boy.png';
    images.me.onload            = countLoad;
    images.me.id                = 'me';
    images.mobbug.src           = 'static/img/sprites/Enemy Bug.png';
    images.mobbug.onload        = countLoad;
    images.rock.src             = 'static/img/sprites/Rock.png';
    images.rock.onload          = countLoad;
    images.selector.src         = 'static/img/sprites/Selector.png';
    images.selector.onload      = countLoad;
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
    images.treeugly.src        = 'static/img/sprites/Tree Ugly.png';
    images.treeugly.onload     = countLoad;
    images.treetall.src         = 'static/img/sprites/Tree Tall.png';
    images.treetall.onload      = countLoad;
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

    /**
     * Create Perso
     */
    me = makego('lainnie', 'me', {image:images.me, x:0, y:canvasHeight - 120});

    /**
     * Create mob
     */
    mobs.push(makego('mobbug', 'enemy', {image: images.mobbug, x: 880, y: canvasHeight - 360}));
    mobs.push(makego('mobbug', 'enemy', {image: images.mobbug, x: 400, y: canvasHeight - 360}));
    mobs.push(makego('mobbug', 'enemy', {image: images.mobbug, x: 160, y: canvasHeight - 120}));

    /**
     *  Stock objects
     */

    /**
     * Create Scene
     */
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push(['', '', '',
                makego('rock', 'decor', {image: images.rock}),
                mobs[0], mobs[1], mobs[2], '', '', '', '', '', '', '']);
    scene.push(['', '', '', '', '', '', '',
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('selector', 'link', {image: images.selector, url: '/work'}),
                makego('windowtall', 'decor', {image: images.windowtall}), '', '', '', '']);
    scene.push([
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('selector', 'link', {image: images.selector, url: '/about'}),
                makego('windowtall', 'decor', {image: images.windowtall}), '', '', '', '',
                makego('treetall', 'decor', {image: images.treetall}), '',
                makego('treetall', 'decor', {image: images.treetall}), '', '', '', '']);
    scene.push([
                makego('treeugly', 'decor', {image: images.treeugly}), '',
                makego('treeugly', 'decor', {image: images.treeugly}), '', '', '', '', '', '', '', '',
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('selector', 'link', {image: images.selector, url: '/'}),
                makego('windowtall', 'decor', {image: images.windowtall})]);
    scene.push(['', '', '', '',
                makego('windowtall', 'decor', {image: images.windowtall}),
                makego('selector', 'link', {image: images.selector, url: '/contact'}),
                makego('windowtall', 'decor', {image: images.windowtall}), '', makego('rock', 'decor', {image: images.rock}), '', '',
                makego('treeshort', 'decor', {image: images.treeshort}), '',
                makego('treeshort', 'decor', {image: images.treeshort})]);
    scene.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    scene.push([
                me, '', '', '', '', '', '', '', '', '', makego('rock', 'decor', {image: images.rock}), '', '', '']);
    scenes.push(scene);
    for (y = limit.ymin, len = limit.ymax; y <= len; y = y + 1){
        gametab[y] = {};
        for (x = limit.xmin, lenw = limit.xmax; x <= lenw; x = x + 1){
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
                '',
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
    $('#canvas').css({ position: 'relative', top: $(document).height() / 1.4 - canvas.height()});
    /**
    * Event handler
    */
    $(document).keyup(function(evt){
        var key = evt.keyCode,
        speed = 'fast',
        ca = $('#wrap_canvas'),
        co = $('#page');

        if (key === 13){
            if (ca.css('display') === 'none'){
                $(document).bind('keyup', moveornot);
                $(window).bind('resize', resize);
                gameLoop = setInterval(init);
                co.fadeToggle(speed, function(){
                    ca.fadeToggle(speed);
            });
            }else{
                $(document).unbind('keyup', moveornot);
                $(window).unbind('resize', resize);
                clearInterval(gameLoop);
                ca.fadeToggle(speed, function(){
                    co.fadeToggle(speed);
            });
            }
        }
    });
    setInterval(movemob, 500);
    $(document).bind('keyup', moveornot);
    $(window).bind('resize', resize);
})();

