/**
 *  Main client JavaScript container
 *  @author Una Ada (Trewbot) <una@phene.co>
 */

window._c = function(c){return document.getElementsByClassName(c);}
//  Abbreviated function for HAndlebars template compiling
window._h = function(i){return Handlebars.compile(_i('template__'+i).innerHTML)};
window._i = function(i){return document.getElementById(i);}

Element.prototype._c = function(c){return this.getElementsByClassName(c);}
Element.prototype.fitContent = function(){
    var l = ['change','cut','paste','drop','keydown'];
    for(var i in l) this.addEventListener(l[i], resize.bind(this), !1);
}
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
            width: 210
        },
        {
            center: true,
            containts: [
                "test4"
            ],
            width: 500
        },
        {
            contains: [
                "test5",
                "test6"
            ],
            width: 210
        }
    ],
    /**
     *  @function ui.buildModule Wrappr for buildign modules
     *  @arg {String} name Name of the module to be built
     *  @return {String} HTML string for the built module
     */
    buildModule(name){
        return _ci.m[name].template(Object.collect(_ci.m[name],{id:name}));
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

    next();
});

window.addEventListener('load',()=>page());
