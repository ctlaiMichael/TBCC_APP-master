cordova.define("com-hitrust-plugin-tcbb.tcbb", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * 合庫行動網銀plugin
 * @class plugin.tcbb
 * @author Devin Lin
 * @version 1.1.0
 * @description 此模組相依於com-hitrust-plugin-tcbb
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};
/**
 * plugin選項 ↑{@link plugin.tcbb}
 * @function doLogin
 * @memberof plugin.tcbb
 * @param {plugin.tcbb~dologinCbSuccess} successCallback
 * @param {plugin.tcbb~cbError}           errorCallback
 * @description 呼叫 合庫login 視窗
 *
 *@example
 var onSuccess = function (rtnObj) {
                alert("success;"+rtnObj.value.userID);
            };
 var onError = function (error) {
                alert("openTel failed: " + error.error);
            }
 plugin.tcbb.doLogin(onSuccess,onError);
 */
TcbbAPIs.prototype.doLogin = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Tcbb", "doLogin", []);
};

/**
 * @description 回首頁
 * @function returnHome
 * @memberof plugin.tcbb
 * @param successCallback not used,feature
 * @param errorCallback   not used,feature
 * @example
 * plugin.tcbb.returnHome(onSuccess,onError);
 */
TcbbAPIs.prototype.returnHome = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Tcbb", "returnHome", []);
};
/**
 * @description 取得sessionId
 * @function getSessionID
 * @memberof plugin.tcbb
 * @param {plugin.tcbb~getSessionIDCbSuccess} successCallback
 * @param {plugin.tcbb~uCBError} errorCallback 
 * @example
 var onSuccess = function (rtnObj) {
                console.log("sessionID:"+rtnObj.value);
            };

 plugin.tcbb.getSessionID(onSuccess,onError);
 */
TcbbAPIs.prototype.getSessionID = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Tcbb", "getSessionID", []);
};

/**
 * @description 登出
 * @function doLogout
 * @memberof plugin.tcbb
 * @param {plugin.tcbb~doLogout} successCallback
 * @param {plugin.tcbb~uCBError} errorCallback
 * @example
 var onSuccess = function (rtnObj) {
            console.log("error:"+rtnObj.error);
        };

 plugin.tcbb.getSessionID(onSuccess,onError);
 */
TcbbAPIs.prototype.doLogout = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Tcbb", "doLogout", []);
};

/**
 * @description 全景元件呼叫
 * @function doCGUMethod
 * @memberof plugin.tcbb
 * @param {array} arrayArgus [method,arg1,arg2....]
 * @param {string} arrayArgus.method ['PureSign','${secret}','${plain_text}'],['CertEncrypt','${cert}','${plain_text}',0],['CertGetSerialNumber','${cert}'],['CertGetKeySize','${cert}']
 * @param {plugin.tcbb~doCGUCbSuccess} successCallback
 * @param {plugin.tcbb~uCBError} errorCallback   
 * @example
 var onSuccess = function (rtnObj) {
            console.log("error:"+rtnObj.error);
        };

 plugin.tcbb.doCGUMethod(['CertEncrypt','cert's content...','plainText'],onSuccess,onError);
 */
TcbbAPIs.prototype.doCGUMethod = function(arrayArgus,successCallback, errorCallback){
    exec(successCallback, errorCallback, "Tcbb", "doCGUMethod", arrayArgus);
};

/**
 * @description 成功登入後,取得F1000101's data
 * @function getF1000101Data
 * @memberof plugin.tcbb
 * @param {plugin.tcbb~getF1000101DataCbSuccess} successCallback
 * @param {plugin.tcbb~uCBError} errorCallback   
 * @example
 var onSuccess = function (rtnObj) {
            console.log("error:"+rtnObj.error);
        };

 plugin.tcbb.getF1000101Data(onSuccess,onError);
 */
TcbbAPIs.prototype.getF1000101Data = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Tcbb", "getF1000101Data", []);
};

/**
 *  getF1000101Data 成功Callback
 * @callback plugin.tcbb~getF1000101DataCbSuccess
 * @param {object} rtnObj {value:{F1000101 Object},error:0}
 */

/**
 *  doCGUMethod 成功Callback
 * @callback plugin.tcbb~doCGUCbSuccess
 * @param {object} rtnObj {value:"method's result",error:0}
 */

/**
 *  dologin 成功Callback
 * @callback plugin.tcbb~dologinCbSuccess
 * @param {object} rtnObj {value:{userID:身份證字號,userCode:網路連線代號},error:0}
 */

/**
 *  doLogout 成功Callback
 * @callback plugin.tcbb~doLogoutCbSuccess
 * @param {object} rtnObj {error:0}
 */

/**
 *  getSessionId 成功Callback
 * @callback plugin.tcbb~getSessionIDCbSuccess
 * @param {object} rtnObj {value:sessionID,error:0} 未登入為空值,登入為sessionID
 */

/**
 *  失敗Callback
 * @callback plugin.tcbb~cbError
 * @param {object} rtnObj {error:錯誤代碼,value:{errorMsg:錯誤迅息,showMsg:是否顥示錯誤訊息}}<br/>
 * error=-1:未登入,-99:unexpected exception<br/>
 * showMsg=true:需顥示,false:不需顥示
 * */
 
 /**
 *  一般失敗Callback
 * @callback plugin.tcbb~uCBError
 * @param {object} rtnObj {error:"錯誤代碼",value:"錯誤迅息"}<br/>
 * error=-99:unexpected exception
 **/

module.exports = new TcbbAPIs();

});
