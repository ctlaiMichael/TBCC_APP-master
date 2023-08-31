/**
 * [紅利Ctrl]
 */
define([
	'app'
	,'service/loginServices'
	,'service/dividendServices'
],function(MainApp){
//=====[dividendCtrl START]=====//
MainApp.register.controller('dividendCtrl'
, function(
	$scope,$state,$compile,$element
	,loginServices,dividendServices
){
	//==變數設定==//
	$scope.max_num = dividendServices.getDividendSet('min_num'); //最低可替換
	$scope.factor_num = dividendServices.getDividendSet('factor_num'); //替換
	$scope.transfer_money = dividendServices.getDividendSet('transfer_money'); //每factor_num可換點數
	$scope.dividend_point = 0; //持有紅利
	$scope.dividend_trans = ''; //兌換點數
	$scope.money = 0; //兌換現金
	//==顯示設定==//
	$scope.showClass = 1; //不允許輸入input
	$scope.isShow = true; //允許顯示設定頁面
	$scope.showBoxStep = 0; //顯示階段
	$scope.haveBoxStep = 1; //顯示階段

	//==錯誤訊息設定==//
	var setErrorMsg = function(type,message,submessage)
	{
		if(typeof type != 'number' || type > 2){
			type = 2;
		}
		$scope.showClass = type;
		if(typeof submessage === 'undefined'){
			submessage = '';
		}
		$scope.dividend_message = dividendServices.getErrorMsg(message,submessage,true);
	}

	/**
	 * [checkDividend 檢查紅利]
	 * @return {[type]} [description]
	 */
	var checkDividend = function()
	{
		var check = dividendServices.checkDividend(-1,$scope.dividend_point);
		if(check===0){
			setErrorMsg(0,'');
		}else if($scope.dividend_point <= 0){
			$scope.isShow = false;
			dividendServices.getErrorMsg('FC0003_004');
		}else{
			setErrorMsg(1,'FC0003_002');
		}
	}

	//==登入處理 START==//
	$scope.isLogin = loginServices.checkLogin({
		showLoginMenu : true
	});
	if($scope.isLogin)
	{
		//==取得電文==//
		dividendServices.getDividendTelegram(function(dividend_point,jsonObj){
			$scope.dividend_point = dividend_point;
			if(!dividend_point && dividend_point !== 0){
				$scope.dividend_point = 0;
				MainUiTool.openDialog(jsonObj.respCodeMsg);
			}
			checkDividend();
			$scope.showBoxStep = 1;
		});
	}
	//==登入處理 END==//

	//==確認兌換==//
	$scope.setTransfer = function(dividend_trans)
	{
		setErrorMsg(0,'');
		var result = dividendServices.getDividendTrans(dividend_trans);
		if(!result.status){
			setErrorMsg(2,result.msg);
			return false;
		}
		$scope.dividend_trans = result.data.dividend_trans;
		$scope.money = result.data.money;

		var check = dividendServices.checkDividend(result.data.dividend_trans,$scope.dividend_point);
		switch(check){
			case 0 :
				//success
			break;
			case 1 :
				setErrorMsg(2,'FC0003_001'); //兌換點數需大於XX點
				return false;
			break;
			case 2 :
				setErrorMsg(2,'FC0003_003',"("+$scope.dividend_point+")"); //請勿超過持有紅利XX點
				return false;
			break;
			case 3 :
				setErrorMsg(2,'FC0003_002'); //點數不足，無法兌換
				return false;
			break;
			default:
				setErrorMsg(2,'FC0003_006','ERROR:'+check); //點數判斷異常error
				return false;
			break;
		}

		if($scope.haveBoxStep < 2){
			var chart = angular.element(document.createElement('dividend-check-directive'));
			var el = $compile( chart )( $scope );
			$element.append(chart);
			$scope.insertHere = el;
			$scope.haveBoxStep++;
		}
		$scope.showBoxStep = 2;
	}

	//==取消==//
	$scope.cancelBack = function(){
		$scope.showBoxStep = 1;
	}

	//==電文兌換確認==//
	$scope.submitBtn = function()
	{
		$scope.showBoxStep = 3;
		var success_dividend = function(success,jsonObj){
			if(success){
				$state.go('dividend.success',jsonObj);
			}else{
				dividendServices.getErrorMsg('FC0003_005',jsonObj.respCodeMsg);
			}
		}
		var result = dividendServices.sendDividendTelegram($scope.dividend_trans,success_dividend);
		if(!result.status){
			$scope.showBoxStep = 1;
			setErrorMsg(2,result.msg);
		}
	}

});
//=====[dividendCtrl END]=====//


//=====[dividendSuccessCtrl START]=====//
MainApp.register.controller('dividendSuccessCtrl'
, function($scope,$state,$stateParams)
{
	 //持有紅利
	$scope.dividend_point = (typeof $stateParams.dividend !== 'undefined')
							? $stateParams.dividend
							: 0;
	 //兌換點數
	$scope.dividend_trans = (typeof $stateParams.transfer !== 'undefined')
							? $stateParams.transfer
							: 0;
	 //兌換現金
	$scope.money = (typeof $stateParams.money !== 'undefined')
					? $stateParams.money
					: 0;
});
//=====[dividendSuccessCtrl END]=====//

//=====[dividendCheckDirective 兌換確認頁]=====//
MainApp.register.directive('dividendCheckDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/dividend/check.html',
		replace: false, //是否把directive刪掉
		link: function($scope, iElm, iAttrs, controller) {

			//console.log($scope.dividend_trans);
		}
	}
});
//=====[dividendCheckDirective 兌換確認頁 END]=====//


});