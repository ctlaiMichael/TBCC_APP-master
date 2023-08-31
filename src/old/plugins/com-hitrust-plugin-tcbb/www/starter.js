cordova.define("com-hitrust-plugin-tcbb.starter", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * menus plugin
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};

//最新消息
TcbbAPIs.prototype.news = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "News", [type]);
};
//金融資訊
TcbbAPIs.prototype.financeinfo = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "Financeinfo", [type]);
};
//醫療服務
TcbbAPIs.prototype.hospital = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "Hospital", [type]);
};
//行動網銀類別頁
TcbbAPIs.prototype.mobliebank_type = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "MobliebankType");
};
//行動網銀
TcbbAPIs.prototype.mobliebank = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "Mobliebank", [type]);
};
//服務據點
TcbbAPIs.prototype.servicesite = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "Servicesite", [type]);
};
//產壽險服務
TcbbAPIs.prototype.insurance = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Starter", "Insurance", [type]);
};

module.exports = new TcbbAPIs();

});