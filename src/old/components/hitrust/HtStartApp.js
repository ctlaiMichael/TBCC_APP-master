define([], function() {

    function HtStartApp(){
        var f = this;
        f.sApp = {};
    }
    /**
     * 設定呼叫外部APP的方法
     * @param object
     * {
         "iOS": {"scheme": "scheme string"},
         "Android": {"params": {
           "package": "package name"
         }}
       }
       ex:
       {
         "iOS": {"scheme": "comtcbcrmapp://"},
         "Android": {"params": {
           "package": "com.tcb.crm.app"
         }}
       }

     * @param fail callback funtion
     */
    HtStartApp.prototype.set = function(obj,do_type) {
        if(typeof do_type === 'undefined'){
          do_type = false;
        }
        // if(typeof obj.iOS === 'undefined' || typeof obj.Android === 'undefined'){
        //   return false;
        // }
        // if(typeof obj.iOS.scheme !== 'string' || typeof obj.Android.scheme !== 'string'){
        //   return false;
        // }
        var platform = device.platform;
        var iOS_set = obj.iOS.scheme;
        var android_set = {
          "package" : obj.Android.scheme,
          "action"  : "ACTION_VIEW"
        };
        // if(do_type){
        //     android_set = {
        //       "uri" : obj.Android.scheme
        //     };
        // }

        if(platform == 'iOS'){
          this.sAPP = startApp.set(iOS_set);
        }else if(platform == 'Android'){
          this.sAPP = startApp.set(android_set);
        }
        return platform;
    };

    /**
     * 檢查APP Android專用
     * @param success
     * @param fail
     */
    HtStartApp.prototype.check = function(success,fail) {
        this.sAPP.check(success, fail);
    };

    /**
     * 啟動外部APP Android專用
     * @param success
     * @param fail
     */
    HtStartApp.prototype.start = function(success,fail) {
        this.sAPP.start(success, fail);
    };

    /**
     * 啟動及檢查APP ios專用
     * @param success
     * @param fail
     */
    HtStartApp.prototype.go = function(success,fail) {
      this.sAPP.go(success, fail);
  };


    return new HtStartApp();
});
