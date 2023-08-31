define([], function() {
    function Geolocation() {
        this.watchID = null;
    };

    Geolocation.prototype. getCurrentPosition = function(success, error, options){
        navigator.geolocation.getCurrentPosition(success, error, options);
    };

    Geolocation.prototype.watchPosition = function(success, error, options){
        this.clearWatch();
        //var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
        this.watchID = navigator.geolocation.watchPosition(success, error, options);
    };

    Geolocation.prototype.clearWatch = function(){
        if (this.watchID != null) {
            navigator.geolocation.clearWatch(watchID);
            this.watchID = null;
        }
    };

    return new Geolocation();
});