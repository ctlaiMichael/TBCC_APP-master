cordova.define("com-hitrust-plugin-tcbb.plugin_news", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * menus plugin 最新消息
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};

//最新消息
//所有item共用一function, 由js click事件傳入type參數至plugin判斷
TcbbAPIs.prototype.news = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "News", "News", [type]);
};
////優惠活動資訊
//TcbbAPIs.prototype.news2 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "News", "News2");
//};
////信用卡活動訊息
//TcbbAPIs.prototype.news3 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "News", "News3");
//};
////合庫e證券
//TcbbAPIs.prototype.news4 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "News", "News4");
//};
////e-Bill全國繳費網
//TcbbAPIs.prototype.news5 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "News", "News5");
//};

module.exports = new TcbbAPIs();

});