/**
 * [信用卡帳單查詢-未列帳單]
 */
define([
	'app'
	,'service/loginServices'
	,'service/unrecordedServices'
	,'directive/billPeriodDirective'
],function(MainApp){
	//=====[unrecordedSelectCtrl START]=====//
MainApp.register.controller('unrecordedSelectCtrl'
,function(
	$scope,$compile,$element,$rootScope
	,loginServices,unrecordedServices
){
	//變數設定
	$scope.haveBoxStep = 0;
	$scope.showStep = 0;
	$scope.cardList = {};
	$scope.cardDetail = {};
	$element.find('.showstep').css('display','none');//預設隱藏畫面
	$scope.showPage = function(step,directive_name){
		if($scope.haveBoxStep < step && typeof directive_name === 'string'){
			var tmp_html = '<div class="showstep step'+step+'"><'+directive_name+'/></div>';
			$element.append($compile(tmp_html)($scope));
			$scope.haveBoxStep++;
		}
		$scope.showStep = step;
		$element.find('.showstep').css('display','none');
		$element.find('.showstep.step'+step).css('display','');
		//==左選單改變==//
		if($rootScope.changeHeaderLeft && step===1){
			$rootScope.changeHeaderLeft = null;
		}else if(!$rootScope.changeHeaderLeft && step!==1){
			$rootScope.changeHeaderLeft = function(){
				$scope.showPage($scope.showStep-1);
			}
		}
	}
	//登入設定
	// $scope.isLogin = loginServices.checkLogin();
	$scope.isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if($scope.isLogin){
		unrecordedServices.getData(function(result,jsonObj){
			if(!result){
				unrecordedServices.getErrorMsg('FC0011_001',jsonObj.respCodeMsg);
				return false;
			}
			if(typeof result.cardList ==='object'){
				$scope.cardList=result.cardList;
			}
			if(typeof result.cardDetail ==='object'){
				$scope.cardDetail=result.cardDetail;
			}
			$scope.showStep = 1;
			$scope.haveBoxStep++;
			$scope.showPage(1);
		});
	}

	//切換到結果頁
	$scope.resultPage = function(key){
		if(typeof $scope.cardDetail[key] !=='object'){
			unrecordedServices.getErrorMsg('FC0011_002');
			return false;
		}
		if(typeof $scope.cardDetail[key]['details'] === 'undefined' || $scope.cardDetail[key]['details'].length <= 0){
			unrecordedServices.getErrorMsg('FC0011_002');
			return false;
		}

		$scope.cardShow= $scope.cardDetail[key];
		$scope.creditCardNo=$scope.cardList[key];
		$scope.details = $scope.cardDetail[key];
		$scope.details.cardDetail = $scope.details.details;
		$scope.showPage(2,'bill-detail-directive');
	}

});
	//=====[unrecordedSelectCtrl END]=====//

});

