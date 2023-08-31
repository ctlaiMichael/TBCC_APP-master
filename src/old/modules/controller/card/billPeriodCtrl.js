/**
 * [信用卡帳單查詢]
 */
define([
	'app'
	,'service/loginServices'
	,'service/billPeriodServices'
	,'directive/billPeriodDirective'
	,'service/payCardFeeServices'
],function(MainApp){
	//=====[billPeriodSelectCtrl START]=====//
MainApp.register.controller('billPeriodSelectCtrl'
,function(
	$scope,$rootScope,$stateParams,$compile,$element,i18n
	,loginServices,billPeriodServices
	,$log,payCardFeeServices,sysCtrl
){
	//變數設定
	$scope.haveBoxStep = 0;
	$scope.showStep = 0;
	$scope.cardList = {};
	$scope.cardDetails = {};
    //列表頁頁碼
	$scope.pageNumber = 1;              //新增頁碼
	$scope.pageNumberMax = 0;           //最大頁碼
	$scope.cardDetailpageNumber = 1;    //新增頁碼
	$scope.cardDetailpageNumberMax = 0; //最大頁碼
	$scope.startGetPage = false;

	$scope.totalpayableAmt = 0;
	$scope.totallowestPayableAmt = 0;

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
				_goToTop();
			}
		}
	}

	//==標題==//
	var periods = (typeof $stateParams.period !== 'undefined' && $stateParams.period)
					? $stateParams.period : '0';
	var title_list = {
		'1' : 'PAGE_TITLE.BILLPERIOD1', //前期帳單
		'2' : 'PAGE_TITLE.BILLPERIOD2'  //前兩期帳單
	};
	if(typeof title_list[$stateParams.period] !== 'undefined'){
		$rootScope.head_fix_title = true;
		if(typeof title_list[$stateParams.period] !== 'undefined'){
			$rootScope.head_title = i18n.getStringByTag(title_list[$stateParams.period]);
		}

	}

	//登入設定
	// $scope.isLogin = loginServices.checkLogin();
	$scope.isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if($scope.isLogin){
		_ajaxCheckEvent(true);
		billPeriodServices.getDataOnPage($scope.pageNumber,function(result,jsonObj,pageData){
			
			if(!result){
				billPeriodServices.getErrorMsg('FC0010_002',jsonObj.respCodeMsg);
				_ajaxCheckEvent(false);
				return false;
			}
			if(typeof result ==='object'){
				$scope.cardList=result.cardDetail;

				if(typeof(pageData) == 'object')
				{
					//$scope.pageNumber = 1;
					//算出總頁數
					$scope.pageNumberMax = Math.ceil(pageData.totalRowCount/pageData.pageSize);
					if($scope.pageNumberMax >　1){
						$scope.pageNumber++;
						billPeriodServices.getDataOnPage($scope.pageNumber,$scope.addPageData);
					} else {
						_ajaxCheckEvent(false);
					}
				}
			}
			
			$scope.showStep = 1;
			$scope.haveBoxStep++;
			$scope.showPage(1);
			//查電文
			userModel = sysCtrl.getUserModel();
			payCardFeeServices.getPayAmt(userModel.userId,getPayAmt_method);
			
		});


		var getPayAmt_method = function(success,resultObj){
			// if(!success || resultObj.maxInstallmentAmt <= 0){
			// 	billServices.getErrorMsg('FC0009_001',resultObj.respCodeMsg);
			// 	return false;
			// }
			$scope.totalpayableAmt = resultObj.payableAmt;
			$scope.totallowestPayableAmt = resultObj.lowestPayableAmt;
			if (parseFloat($scope.totalpayableAmt) < parseFloat($scope.totallowestPayableAmt)){
				//$scope.totalpayableAmt = $scope.totallowestPayableAmt;
				$scope.totallowestPayableAmt = $scope.totalpayableAmt;
			}
			//$scope.returnStepView(1);
		}

		

	}

	$scope.addPageData = function(result,jsonObj,pageData){
		if(!result){
			billPeriodServices.getErrorMsg('FC0010_002',jsonObj.respCodeMsg);
			_ajaxCheckEvent(false);
			return false;
		};
		if(typeof result.cardDetail ==='object'){

			var data_start_index = Number(pageData.pageSize) * Number($scope.pageNumber);
			for(var item in result.cardDetail)
			{
				var newitemIndex = item + data_start_index;
				$scope.cardList[newitemIndex] = result.cardDetail[item];//加入原有資料集
			}

			// PAGEDATA
			if(typeof(pageData) == 'object')
			{
				var dataTotal = Number(pageData.pageSize) * $scope.pageNumber;
				//頁數的計算以第一次取回的 總數/每頁數量 結果為主
				if($scope.pageNumber < $scope.pageNumberMax)
				{
					$scope.pageNumber++;
					// $log.error('do Page:' + $scope.pageNumber);
					billPeriodServices.getDataOnPage($scope.pageNumber,$scope.addPageData);
				} else {
					_ajaxCheckEvent(false);
					$log.debug('END Page:' + $scope.pageNumber);
				}
			}
		}
	};


	//切換到結果頁
	$scope.resultPage = function(key){
		_goToTop();
		$scope.details = false;
		// console.warn('resultPage:'+key);
		_ajaxCheckEvent(true);
		$scope.cardDetailpageNumber = 1;    //新增頁碼
		$scope.cardDetailpageNumberMax = 0; //最大頁碼
		$scope.cardShow=$scope.cardList[key];
		var tmpCardNo=$scope.cardShow.creditCardNo;
		billPeriodServices.getCardData(periods,tmpCardNo,function(result,pageData){
			if(!result){
				billPeriodServices.getErrorMsg('FC0010_003');
				_ajaxCheckEvent(false);
				return false;
			}
			if(typeof result!=='object' || typeof result.cardDetail!=='object'){
				billPeriodServices.getErrorMsg('FC0010_003');
				_ajaxCheckEvent(false);
				return false;
			}

			$scope.details = result;
			$scope.showPage(2,'bill-detail-directive');

			//資料超過一頁則繼續後台取
			$scope.cardDetailpageNumberMax = Math.ceil(pageData.totalRowCount/pageData.pageSize);
			// console.error('max page:',$scope.cardDetailpageNumberMax);
			if($scope.cardDetailpageNumberMax >　1){
				// console.error('Start Page',$scope.cardDetailpageNumberMax);
				$scope.addResultOnPage();
			} else {
				_ajaxCheckEvent(false);
			}
		},$scope.cardDetailpageNumber);
	}
	//細節頁　取分頁功能
	$scope.addResultOnPage = function(){
		if($scope.cardDetailpageNumber >= $scope.cardDetailpageNumberMax){
			$log.debug('END Page:' + $scope.cardDetailpageNumber);
			_ajaxCheckEvent(false);
			return false;
		}
		$scope.cardDetailpageNumber++;

		var tmpCardNo=$scope.cardShow.creditCardNo;

		billPeriodServices.getCardData(periods,tmpCardNo,function(result,pageData){
			// console.error('page:',pageData);
			if(!result){
				billPeriodServices.getErrorMsg('FC0010_003');
				_ajaxCheckEvent(false);
				return false;
			}
			if(typeof result!=='object' || typeof result.cardDetail!=='object'){
				billPeriodServices.getErrorMsg('FC0010_003');
				_ajaxCheckEvent(false);
				return false;
			}
			if(typeof result.cardDetail ==='object')
			{
				var data_start_index = Number(pageData.pageSize) * Number($scope.cardDetailpageNumber);
				for(var item in result.cardDetail)
				{
					var newitemIndex = item + data_start_index;
					$scope.details.cardDetail[newitemIndex] = result.cardDetail[item];//加入原有資料集
					//這邊需重新結算
					// $scope.details.twdTotalAmt = (Number($scope.details.twdTotalAmt) +  Number(result.cardDetail[item].twdAmt)) + '';
				}

				var dataTotal = Number(pageData.pageSize) * $scope.pageNumber;
				//頁數的計算以第一次取回的 總數/每頁數量 結果為主
				$scope.addResultOnPage();
			}
		},$scope.cardDetailpageNumber);
	}


	function _ajaxCheckEvent(start){
		if (start) {
			$scope.startGetPage = true;
			$rootScope.isLoading = true;
		} else {
			$scope.startGetPage = false;
			$rootScope.isLoading = false;
			$rootScope.$broadcast('isLoading', false); // 強制關閉
		}
	}

	function _goToTop(){
		angular.element('section').scrollTop(0);
	}

});
	//=====[billPeriodSelectCtrl END]=====//

});

