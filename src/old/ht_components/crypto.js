angular.module('crypto', [])
.service('crypto', function($log, framework) {

	//  CryptoJS參考資料
	//  https://blog.zhengxianjun.com/2015/05/javascript-crypto-js/
	var self = this;

	this.encrypto = function(key, str, successFunc, errorFunc){
		$log.debug('Encrypto begin');
		//$log.debug('key:'+key);
		//$log.debug('str:'+str);
		framework.cryptoProtectPassword(key, str, successFunc, errorFunc);

		$log.debug('Encrypto end');
	}


});