define([], function() {

    function HtCamera(){

    }

    function initOptions(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: false,  //Corrects Android orientation quirks
            targetHeight: 2048,
            targetWidth:  2048
        }
        return options;
    }

    /**
     * 打開相機
     * @param success callback funtion
     * @param fail callback funtion
     */
    HtCamera.prototype.openCamera = function(success,fail) {

        var srcType = Camera.PictureSourceType.CAMERA;
        var options = initOptions(srcType);
        var callBackSuccessEvent = function (res){
            success(res);
            //todo
            resetStepBar();
        }
        var callBackErrorEvent = function (res){
            fail(res);
            //todo
            resetStepBar();
        }

        navigator.camera.getPicture(callBackSuccessEvent, callBackErrorEvent, options);
    };
    /**
     * 選擇pic檔案
     * @param success
     * @param fail
     */
    HtCamera.prototype.selectPicFile = function(success,fail) {

        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = initOptions(srcType);
        var callBackSuccessEvent = function (res){
            success(res);
            //todo
           resetStepBar();
        }
        var callBackErrorEvent = function (res){
            fail(res);
            //todo
            resetStepBar();
        }

        navigator.camera.getPicture(callBackSuccessEvent, callBackErrorEvent, options);
    };

    var resetStepBar = function(){

            if (typeof StatusBar == 'object'
              && typeof StatusBar.hide == 'function'
              && typeof StatusBar.show == 'function'
            ) {
              StatusBar.hide();
              StatusBar.show();
            }
      }



    return new HtCamera();
});
