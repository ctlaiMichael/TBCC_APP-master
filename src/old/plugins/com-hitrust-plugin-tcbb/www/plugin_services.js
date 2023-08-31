cordova.define("com-hitrust-plugin-tcbb.plugin_services", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * menus plugin 服務據點
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};


TcbbAPIs.prototype.services = function(type, title, successCallback, errorCallback){
    exec(successCallback, errorCallback, "ServicesSiteInfo", "Services", [type, title]);
};

module.exports = new TcbbAPIs();

});