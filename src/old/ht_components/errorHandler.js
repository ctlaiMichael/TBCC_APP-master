angular.module('errorHandler', [])
	.service('errorHandler', function($rootScope, $log, dialog, i18n) {

    this.ShowSendPostError = function (msg, tag) {

        $log.debug(msg);

        var errormsg = '';
        if (i18n.getStringByTag(msg.result) != null && i18n.getStringByTag(msg.result) != '') {
            errormsg = i18n.getStringByTag(msg.result);
            dialog.alert('', errormsg);
        } else {
            dialog.alert('', i18n.getStringByTag(tag));
        }
    };

    this.ShowSendPostFail = function (msg) {

        $log.debug(msg);
        
        var failmsg = '';

        if (i18n.getStringByTag(msg.result) != null && i18n.getStringByTag(msg.result) != '') {
            failmsg = i18n.getStringByTag(msg.result);
            dialog.alert('', failmsg);
        } else {
            dialog.alert('', 'FAIL');
        }
    };
        
    this.GenerateOTPErrorCallback = function (jsonObj) {
        dialog.alert('', i18n.getStringByTag('OTP_GENERATE_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']');
    }

    this.SHA1ErrorCallback = function (jsonObj) {
        dialog.alert('', i18n.getStringByTag('PASSWORD_SHA1_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']');
    };

    this.BASE64ErrorCallback = function (jsonObj) {
        dialog.alert('', i18n.getStringByTag('PASSWORD_BASE64_ENCODE_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']');
    };

    this.SetSeedSuccessCallback = function (jsonObj) {
        $log.debug("Set OTP Success");
    };

    this.SetSeedErrorCallback = function (jsonObj) {
        dialog.alert('', i18n.getStringByTag('OTP_SET_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']');
    };

    this.QuerySeedErrorCallback = function (jsonObj) {
        dialog.alert('', i18n.getStringByTag('OTP_QUERY_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']');
    };

    this.UpdateSeedErrorCallback = function (jsonObj) {
        dialog.alert('', i18n.getStringByTag('OTP_UPDATE_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']');
    };

});
