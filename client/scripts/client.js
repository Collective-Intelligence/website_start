/**
 *  Main client JavaScript container
 *  @author Una Ada (Trewbot) <una@phene.co>
 */

window._c = function(c){return document.getElementsByClassName(c);}
Element.prototype._c = function(c){return this.getElementsByClassName(c);}
//  Abbreviated function for HAndlebars template compiling
window._h = function(i){return Handlebars.compile(_i('template__'+i).innerHTML)};
window._i = function(i){return document.getElementById(i);}

//  Resize an element to show all of its content
Element.prototype.fitContent = function(){
    var l = ['change','cut','paste','drop','keydown'];
    for(var i in l) this.addEventListener(l[i], resize.bind(this), !1);
}
window.resize = function(){
    window.setTimeout((function(){
        var t = this,
            c = t.cloneNode();
        t.parentNode.insertBefore(c, t);
        c.style.height = 'auto';
        c.value = t.value;
        t.style.height = (c.scrollTop + c.scrollHeight + 20) + 'px';
        t.parentNode.removeChild(c);
    }).bind(this), 0);
}

//  Render a responder element to show click responses
Element.prototype.responsibleParent = function(){
    var t = this;
    if(t == null)
        return false;
    try{
        while(t.tagName.toLowerCase() !== 'html'){
            if(~t.className.indexOf('has-responder'))
                return t;
            t = t.parentElement;
        }
    }catch(e){}
    return false;
}
window.lastClick = {x:0,y:0};
window.addEventListener('click',function(e){
    window.lastClick.x = e.pageX;
    window.lastClick.y = e.pageY;
    var rsp = e.target.responsibleParent();
    if(rsp){
        var rpr = rsp._c('responder')[0],
            rct = rsp.getBoundingClientRect(),
            xPos = e.clientX - rct.left,
            yPos = e.clientY - rct.top,
            rad = Math.sqrt(Math.pow(rct.width,2) + Math.pow(rct.height,2));
        rpr.style.transition = "";
        rpr.style.webkitClipPath = "circle(0% at "+xPos+"px "+yPos+"px)";
        rpr.style.opacity = 1;
        window.setTimeout(function(){
            rpr.style.transitionDuration = "1.0s";
            rpr.style.webkitClipPath = "circle(" + rad + "px at "+xPos+"px "+yPos+"px)";
            rpr.style.opacity = 0;
        },10);
    }
});

HTMLTextAreaElement.prototype.insertAtCaret = function(text){
    text = text || '';
    if(document.selection){
        this.focus();
        var sel		= document.selection.createRange();
        sel.text	= text;
    }else if(this.selectionStart || this.selectionStart === 0){
        var start	= this.selectionStart,
            end		= this.selectionEnd;
        this.value = this.value.substring(0, start) + text + this.value.substring(end, this.value.length);
        this.selectionStart = start + text.length;
        this.selectionEnd = start + text.length;
    }else this.value += text;
};
Handlebars.registerHelper('ifCond', function(u,s,v,o){
    return eval(u + s + v) ? o.fn(this) : o.inverse(this);
});
Handlebars.registerHelper('strCompare', function(u,v,o){
    return u == v ? o.fn(this) : o.inverse(this);
});
Object.collect= function(){
    var ret = {},
        len = arguments.length;
    for(var i = 0; i < len; i++)
        for(p in arguments[i])
            if(arguments[i].hasOwnProperty(p))
                ret[p] = arguments[i][p];
    return ret;
};
Element.prototype.parentModule = function(){
    var t = this;
    if(t == null)
        return false;
    try{
        while(t.tagName.toLowerCase() !== 'html'){
            if(t.classList.contains('module'))
                return t;
            t = t.parentElement;
        }
    }catch(e){}
    return false;
}

/**
 *  Namespace for client scripts (abbreviated as _ci)
 *  @namespace CollectiveIntelligence
 */
_ci         = (CollectiveIntelligence = new(function(){
    /**
     *  @function time
     *  @arg {Number} unix Unix timestamp in milliseconds.
     *  @arg {Boolean} HE Toggle using Human Era dates.
     *  @return {String} Abbreviated string describing the relative date.
     */
    this.time	= function(unix, HE=!1){
        var ago = ~~(+new Date/1e3)-(unix/1e3),
            num = {1:'',60:' second',3600:' minute',
                    86400:' hour',2678400:' day'},
            k	= Object.keys(num),
            s;
        for(var i in num)
            if(ago<+i) return ago>0
                ?(s=~~(ago/k[k.indexOf(""+i)-1]))+num[i]+(s!=1?'s':'')
                :'Right Now!';
        var stamp = new Date(+unix);
        return ['Jan','Feb','Mar','Apr','May','Jun',
                'Jul','Aug','Sep','Oct','Nov','Dec'][stamp.getMonth()]
                +' '+stamp.getDate()+', '+(stamp.getFullYear()+(HE?1e4:0));
    };

    /*
     *  Update any element with className "timestamp" as a timestamp; elements
     *  should have a "unix-time" attribute with a unix time in milliseconds.
     */
    setInterval(function(){
        var ts = document.getElementsByClassName('timestamp');
        for(let i in ts)
            if(typeof ts[i].getAttribute == 'function'
            && !isNaN(parseInt(ts[i].getAttribute('unix-time'))))
                ts[i].innerHTML = _ci.time(ts[i].getAttribute('unix-time'));
    },1e3);
})());
_ci.tp      = (_ci.templates = {    //  Handlebars templates
    account     : _h('account'),
    curation    : _h('curation'),
    delegation  : _h('delegation'),
    dropdown    : _h('dropdown'),
    dropdown2   : _h('dropdown2'),
    sidebar     : _h('sidebar'),
    tokens      : _h('tokens'),

    test        : _h('test')
});
_ci.m       = (_ci.modules = {      //  Module information
    test1   : {
        name: "Test Module 1",
        template: _ci.tp.test
    },
    test2   : {
        name: "Test Module 2",
        template: _ci.tp.test
    },
    test3   : {
        name: "Test Module 3",
        template: _ci.tp.test
    },
    test4   : {
        name: "Test Module 4",
        template: _ci.tp.test
    },
    test5   : {
        name: "Test Module 5",
        template: _ci.tp.test
    },
    test6   : {
        name: "Test Module 6",
        template: _ci.tp.test
    }
});
_ci.t       = (_ci.theme = {        //  Maniplate the page theme
    isMenuOpen    : false,          //  If sidebar menu is open
    menu(){                         //  Toggle sidebar menu open/close
        _c("side")[0].style.left = !(this.isMenuOpen = !this.isMenuOpen)
            ?"-220px"
            :"-20px";
        _c("side")[0].style.transitionTimingFunction = !this.isMenuOpen
            ? "cubic-bezier(0.7, 0.0, 1.0, 1.0)"
            : "cubic-bezier(0.5, 0.0, 0.0, 1.5)";
    },
    side(ctx,next){
        _ci.u.getSession(function(sess){
            _ci.session = sess;
            var o = {
                sections: [
                    {
                        links: [
                            {
                                name: "Dashboard",
                                url: "/"
                            },
                            {
                                name: "Curation",
                                url: "/curation"
                            },
                            {
                                name: "Goups",
                                url: "/groups"
                            },
                            {
                                name: "Debates",
                                url: "/debates"
                            },
                            {
                                name: "Delegations",
                                url: "/delegations"
                            },
                            {
                                name: "Rewards",
                                url: "/rewards"
                            },
                            {
                                name: "Account",
                                url: "/account"
                            },
                            {
                                name: "Settings",
                                url: "/settings"
                            }
                        ]
                    }
                ]
            };
            _c('side__content')[0].innerHTML = _ci.tp.sidebar(o);
            next();
        });
    }
});
_ci.u       = (_ci.users = {        //  Account information and interaction
    /**
     *  @function getSession
     *  @arg {Function} next Callback function, should have
     *  @return {Object} Object containing data about current session
     */
    getSession(next){
        next({});
    }
});
_ci.ui      = (_ci.interface = {    //  User interface rendering and events
    /*
     *  Default column arrangement, overridden by user settings
     *      `center` if the column should be centered in the screen, only one
     *          column can have this flag, ignored if the total width of all
     *          columns is wider than the screen
     *      `contains` an array of all modules contained in the column
     *      `width` the width of the column in pixels
     */
    columns : [
        {
            contains: [
                "test1",
                "test2",
                "test3"
            ],
            width: 300
        },
        {
            center: true,
            contains: [
                "test4"
            ],
            width: 500
        },
        {
            contains: [
                "test5",
                "test6"
            ],
            width: 300
        }
    ],
    moduleDrag : {
        offsets : {x:0,y:0},
        target : 0,
        //  Timer id stored for convenience
        timer : 0,
        width: 0,
        /**
         *  @function ui.moduleDrag.mouseDown Start timer to begin drag
         *  @arg {Event} e mouseDown event
         */
        mouseDown(e){
            _ci.ui.moduleDrag.timer = window.setTimeout(_ci.ui.moduleDrag.startDrag,1e3);
            window.addEventListener("mouseup",_ci.ui.moduleDrag.mouseClear);
            window.setTimeout(()=>{
                window.addEventListener("mousemove",_ci.ui.moduleDrag.mouseClear);
            },20);
            let el = e.target.parentModule(),
                br = el.getBoundingClientRect();
            el.style.left = br.left + "px";
            el.style.top = br.top + "px";
            _ci.ui.moduleDrag.offset = {
                x: e.pageX-br.left,
                y: e.pageY-br.top
            };
            _ci.ui.moduleDrag.target = el;
            _ci.ui.moduleDrag.width = br.width;
            el.style.width = br.width + "px";
        },
        /**
         *  @function ui.moduleDrag.mouseClear Clear all mouse events
         */
        mouseClear(){
            window.clearTimeout(_ci.ui.moduleDrag.timer);
            window.removeEventListener("mouseup",_ci.ui.moduleDrag.mouseClear);
            window.removeEventListener("mousemove",_ci.ui.moduleDrag.mouseClear);
        },
        /**
         *  @function ui.moduleDrag.startDrag Handler for dragging modules
         */
        startDrag(){
            window.removeEventListener("mouseup",_ci.ui.moduleDrag.mouseClear);
            window.removeEventListener("mousemove",_ci.ui.moduleDrag.mouseClear);
            window.addEventListener("mousemove",_ci.ui.moduleDrag.drag);
            window.addEventListener("mouseup",_ci.ui.moduleDrag.endDrag);
            let e = _ci.ui.moduleDrag.target;
            e.style.width = _ci.ui.moduleDrag.width + "px";
            e.classList.add("is-lifted");
            e.classList.add("is-dragging");
        },
        /**
         *  @function ui.moduleDrag.drag Handle dragging module
         *  @arg {Event} e movemoce event
         */
        drag(e){
            let el = _ci.ui.moduleDrag.target;
            el.style.width = _ci.ui.moduleDrag.width + "px";
            for(let i in _ci.ui.columns){
                let br = _i("column-"+i).getBoundingClientRect();
                if(e.pageX > br.left && e.pageX < br.left + br.width)
                    el.style.width = _ci.ui.columns[i].width + "px";
            }
            el.style.left = e.pageX - _ci.ui.moduleDrag.offset.x + "px";
            el.style.top = e.pageY - _ci.ui.moduleDrag.offset.y + "px";
        },
        /**
         *  @function ui.moduleDrag.endDrag Handler for after element is dragged
         *  @arg {Event} e dragEnd event
         */
        endDrag(){
            window.removeEventListener("mousemove",_ci.ui.moduleDrag.drag);
            window.removeEventListener("mouseup",_ci.ui.moduleDrag.endDrag);
            _ci.ui.moduleDrag.target.classList.remove("is-lifted");
            _ci.ui.moduleDrag.target.classList.remove("is-dragging");
        }
    },
    /**
     *  @function ui.buildModule Wrappr for buildign modules
     *  @arg {String} name Name of the module to be built
     *  @return {String} HTML string for the built module
     */
    buildModule(name){
        return _ci.m[name].template(Object.collect(_ci.m[name],{id:name}));
    },
    /**
     *  @function ui.load Load the basic UI structure
     *  @arg {Object} options Settings for the rendering based on page to load
     */
    load(options){
        var left = 0;
        //  Check if #body exists or not
        if(!_i('body')) document.body.insertAdjacentHTML('beforeend', '<div id="body"></div>');
        //  If #body is empty, add columns
        if(_i('body').innerHTML == '')
            for(var i in _ci.ui.columns){
                _i('body').innerHTML += `<div class="column" id="column-${i}" style="left:calc(${left}px + ${i*2}rem);width:${_ci.ui.columns[i].width}px"></div>`;
                left += _ci.ui.columns[i].width;
            }
        for(var i in _ci.ui.columns)
            for(var j in _ci.ui.columns[i].contains)
                if(!_i("module-"+_ci.ui.columns[i].contains[j]))
                    _i("column-"+i).insertAdjacentHTML('beforeend', _ci.ui.buildModule(_ci.ui.columns[i].contains[j]));
        _ci.ui.loadSearch();
        _ci.ui.update();
    },
    /**
     *  @function ui.loadSearch Handle events on search bar
     */
    loadSearch(){
        _c('search__input')[0].addEventListener('focus',function(){
            window.setTimeout(function(){
                _c('button search has-responder')[0].className = 'button search is-lifted';
            },200);
        });
        _c('search__input')[0].addEventListener('blur',function(){
            _c('button search is-lifted')[0].className = 'button search has-responder';
        });
    },
    /**
     *  @function ui.update Updates the UI based on current conditions
     */
    update(){
        var ctr,left;
        for(var i in _ci.ui.columns)
            if(_ci.ui.columns[i].center) ctr = _i('body')._c('column')[i].getBoundingClientRect();
        _i('body').style.left = Math.max(40,((window.innerWidth / 2) - (ctr.width / 2) - (ctr.left - _i('body').getBoundingClientRect().left))) + 'px';
    }
});

/**
 *  Twitter Snowflake implementation
 *  @namespace Snowflake
 *  References:
 *      https://github.com/twitter/snowflake
 *      https://github.com/Welogix-Tech/node-snowflake
 *      https://discordapp.com/developers/docs/reference#snowflakes
 */
window.Snowflake = new (function(epoch){
    // TODO: Actually write an implementation here!
})(1514786400000);  // Set epoch to first millisecond of 2018


//  Page.js implementations
page('*',_ci.t.side)
page('/', (ctx,next)=>{
    _ci.ui.load({
        modules: ["test1","test2","test3","test4","test5","test6"]
    });
    next();
});

window.addEventListener('load',()=>page());
