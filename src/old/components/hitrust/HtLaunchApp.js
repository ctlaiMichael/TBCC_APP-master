define([], function() {

    function HtLaunchApp(){

    }

    /**
     *openUrl
     * @param url
     * @param success
     * @param error
     */
    HtLaunchApp.prototype.openUrl = function(url,success,error) {

        try{
            var hWin = window.open(url,"_system");
            hWin.onload = success;
        }catch(e){
            error(e);
        }
    };

    /**
     *
     * @param number
     * @param success
     * @param error
     */
    HtLaunchApp.prototype.openTel = function(number,success,error) {

        try{
            var hWin = window.open("tel:"+number,"_system");
            hWin.onload = success;
        }catch(e){
            error(e);
        }
    };

    /**
     *
     * @param number
     * @param success
     * @param error
     */
    HtLaunchApp.prototype.openSms = function(text,success,error) {

        try{
            var hWin = window.open("sms:"+text,"_system");
            hWin.onload = success;
        }catch(e){
            error(e);
        }
    };

    /**
     *
     * @param number
     * @param success
     * @param error
     */
    HtLaunchApp.prototype.openMail = function(text,success,error) {

        try{
            var hWin = window.open("mailto:"+text,"_system");
            hWin.onload = success;
        }catch(e){
            error(e);
        }
    };


    return new HtLaunchApp();
});
