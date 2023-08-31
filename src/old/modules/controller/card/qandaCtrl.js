/**
 * [Q&ACtrl]
 */
define([
	'app'
	,'service/qandaServices'
],function(MainApp){
MainApp.register.controller('qandaCtrl'
, function(
	$scope,i18n
	,qandaServices
){
	//讀取資料
	$scope.qanda= qandaServices.getData();
	//點擊開啟視窗
	$scope.openInfo = function(qanda_data){
		if(typeof qanda_data !=='object'){
			MainUiTool.openDialog(i18n.getStringByTag('ERROR_MSG.NO_SEARCH'));
			return false;
		}
		document.getElementsByClassName('no_poppup_bbtn')[0].scrollTop = 0;
		MainUiTool.openPopupInformation({
			title: qanda_data.title,
			content:qanda_data.content
		});
	}
});
});