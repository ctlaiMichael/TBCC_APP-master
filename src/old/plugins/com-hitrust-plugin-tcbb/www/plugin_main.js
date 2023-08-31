cordova.define("com-hitrust-plugin-tcbb.plugin_main", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * 首頁plugin
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};

TcbbAPIs.prototype.showToast = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "showToast", []);
};



TcbbAPIs.prototype.news = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "News", []);
};
TcbbAPIs.prototype.financeinfo = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Financeinfo", []);
};
TcbbAPIs.prototype.funds = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Funds", []);
};
TcbbAPIs.prototype.hospital = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Hospital", []);
};
TcbbAPIs.prototype.mobliebank = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Mobliebank", []);
};
TcbbAPIs.prototype.servicesite = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Servicesite", []);
};
TcbbAPIs.prototype.insurance = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Insurance", []);
};
TcbbAPIs.prototype.creadit = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Creadit", []);
};
TcbbAPIs.prototype.easy = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "NativeMain", "Easy", []);
};


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

module.exports = new TcbbAPIs();

});