cordova.define("com-hitrust-plugin-tcbb.plugin_finance", function(require, exports, module) {
/*!
 * Module dependencies.
 */
/**
 * menus plugin 金融資訊
 */
var exec = cordova.require('cordova/exec');

var TcbbAPIs = function() {};


TcbbAPIs.prototype.finance = function(type, successCallback, errorCallback){
    exec(successCallback, errorCallback, "FinanceInfo", "Finance", [type]);
};

////黃金存摺牌價
//TcbbAPIs.prototype.finance1 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance1",);
//};
////外幣匯率
//TcbbAPIs.prototype.finance2 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance2");
//};
////台幣存款利率
//TcbbAPIs.prototype.finance3 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance3");
//};
////台幣放款利率
//TcbbAPIs.prototype.finance4 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance4");
//};
////外幣存款利率
//TcbbAPIs.prototype.finance5 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance5");
//};
////外幣放款利率
//TcbbAPIs.prototype.finance6 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance6");
//};
////票券利率
//TcbbAPIs.prototype.finance7 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance7");
//};
////債券利率
//TcbbAPIs.prototype.finance8 = function(successCallback, errorCallback){
//    exec(successCallback, errorCallback, "FinanceInfo", "Finance8");
//};

module.exports = new TcbbAPIs();

});