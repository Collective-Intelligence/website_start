/**
 *  Main client JavaScript container
 *  @author Una Ada (Trewbot) <una@phene.co>
 */

/**
 *  Namespace for client scripts (abbreviated as _ci)
 *  @namespace CollectiveIntelligence
 */
window._ci = (CollectiveIntelligence = new(function(){
    /**
     *  @function time
     *  @arg {Number} unix Unix timestamp in milliseconds.
     *  @arg {Boolean} HE Toggle using Human Era dates.
     *  @return {String} Abbreviated string describing the relative date.
     */
    this.time	= function(unix, HE=!1){
        var ago = ~~(+new Date/1e3)-(unix/1e3),
            num = {1:'',60:' second',3600:' minute'
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
            if(!isNaN(parseInt(ts[i].getAttribute('unix-time'))))
                ts[i].innerHTML = _ci.time(ts[i].getAttribute('unix-time'));
    },1e3);
})());

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
