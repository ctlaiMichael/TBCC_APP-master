cordova.define("com-hitrust-plugin-tcbb.plugin_bank", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * menus plugin 行動網銀
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};


TcbbAPIs.prototype.bank = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "MobileBank", "Bank", [type]);
};

TcbbAPIs.prototype.scan = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "MobileBank", "Scan");
};

TcbbAPIs.prototype.close = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "MobileBank", "Close");
};

module.exports = new TcbbAPIs();

});