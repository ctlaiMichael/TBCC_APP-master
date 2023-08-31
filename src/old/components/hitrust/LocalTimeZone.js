define([], function() {
    function LocalTimeZone(){
        var offset = 0;
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (1000*offset));
        this.timevalue = nd;
    };

    LocalTimeZone.prototype.getTime = function() {
        if(this.timevalue != null) {
            return this.timevalue;
        }else {
            return "empty";
        }
    };

    return new LocalTimeZone();
});
