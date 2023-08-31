/**
 * [VISA金融卡查詢]
 */
define([
	'app'
	,'service/loginServices'
	,'service/visaSearchServices'
	,'directive/billPeriodDirective'
],function(MainApp){
	//=====[VISAListCtrl START]=====//
MainApp.register.controller('visaListCtrl'
,function(
	$scope,$compile,$element,$rootScope,$log
	,loginServices,visaSearchServices
){
	//變數設定
	$scope.haveBoxStep = 0;
	$scope.showStep = 0;
	$scope.cardList = {};
	//$scope.cardList = [];               //改成array
	$scope.pageNumber = 1;              //新增頁碼
	$scope.pageNumberMax = 0;           //最大頁碼
	$scope.cardDetails = {};
	//$scope.cardDetails = [];            //改成array
	$scope.cardDetailpageNumber = 1;    //新增頁碼
	$scope.cardDetailpageNumberMax = 0; //最大頁碼


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

	//登入設定
	// $scope.isLogin = loginServices.checkLogin();
	$scope.isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if($scope.isLogin){
		_ajaxCheckEvent(true);
		visaSearchServices.getDataOnPage($scope.pageNumber,function(result,pageData){
			if(!result){
				visaSearchServices.getErrorMsg('FC0012_001');
				_ajaxCheckEvent(false);
				return false;
			}

			if(typeof result ==='object'){
				  $scope.cardList = result;
				 //$scope.cardList = $.map(result,function(value, index) {return [value];});
				// PAGEDATA
				if(typeof(pageData) == 'object')
				{
					//算出總頁數
					$scope.pageNumberMax = Math.ceil(pageData.totalRowCount/pageData.pageSize);
					if($scope.pageNumberMax >　1){
						$scope.pageNumber++;
						visaSearchServices.getDataOnPage($scope.pageNumber,$scope.addPageData);
					} else {
						_ajaxCheckEvent(false);
					}
				}
			}
			$scope.showStep = 1;
			$scope.haveBoxStep++;
			$scope.showPage(1);
		});
	}
	//若資料大於一頁則須反覆取資料直到結束
	$scope.addPageData = function(result,pageData){
		if(!result){
			visaSearchServices.getErrorMsg('FC0012_001');
			_ajaxCheckEvent(false);
			return false;
		}
		if(typeof result ==='object'){
			var data_start_index = Number(pageData.pageSize) * Number($scope.pageNumber);
			for(var item in result)
			{
				var newitemIndex = Number(item) + data_start_index;
				$scope.cardList[newitemIndex] = result[item];//加入原有資料集
			}
			//var addData = $.map(result,function(value, index) {return [value];});
			//$scope.cardList = $scope.cardList.concat(addData);

			// PAGEDATA
			if(typeof(pageData) == 'object')
			{
				var dataTotal = Number(pageData.pageSize) * $scope.pageNumber;
				//頁數的計算以第一次取回的 總數/每頁數量 結果為主
				if($scope.pageNumber < $scope.pageNumberMax)
				{
					$scope.pageNumber++;
					// $log.error('do Page:' + $scope.pageNumber);
					visaSearchServices.getDataOnPage($scope.pageNumber,$scope.addPageData);
				} else {
					$log.debug('END Page:' + $scope.pageNumber);
					_ajaxCheckEvent(false);
				}
			}
		}
	};

	//切換到結果頁
	$scope.periodPage = function(key){
		$scope.cardKey = key;
		$scope.showPage(2,'visa-period-directive');
	}
	//$scope.tempkey;
	$scope.resultPage = function(key,cardPeriod){
		_goToTop();
		$scope.cardDetails = false;
		_ajaxCheckEvent(true);
		$scope.cardDetailpageNumber = 1;    //新增頁碼
		$scope.cardDetailpageNumberMax = 0; //最大頁碼
		//$scope.tempkey = key;
		$scope.creditCard=$scope.cardList[key];
		var tmpCardNo=$scope.creditCard.creditCardID;
		visaSearchServices.getCardDataOnPage($scope.cardDetailpageNumber,cardPeriod,tmpCardNo,function(result,cardPeriod,pageData){
			if(!result){
				visaSearchServices.getErrorMsg('FC0012_002');
				_ajaxCheckEvent(false);
				return false;
			}
			$scope.cardDetails=result;

　　　　　　　$scope.showPage(3,'visa-result-directive');

			//資料超過一頁則繼續後台取
			$scope.cardDetailpageNumberMax = Math.ceil(pageData.totalRowCount/pageData.pageSize);
			if($scope.cardDetailpageNumberMax >　1){
				// console.error('START',$scope.cardDetailpageNumberMax );
				$scope.cardDetailpageNumber++;
				visaSearchServices.getCardDataOnPage($scope.cardDetailpageNumber,cardPeriod,tmpCardNo,$scope.addResultOnPage);
			} else {
				_ajaxCheckEvent(false);
			}

		});
	}
	//細節頁　取分頁功能
	$scope.addResultOnPage = function(result,cardPeriod,pageData){
		//$scope.creditCard=$scope.cardList[$scope.tempkey];
		var tmpCardNo=$scope.creditCard.creditCardID;
			if(!result){
				visaSearchServices.getErrorMsg('FC0012_002');
				return false;
			}
			if(typeof result.cardDetail ==='object')
			{
				var data_start_index = Number(pageData.pageSize) * Number($scope.cardDetailpageNumber);
				for(var item in result.cardDetail)
				{
					var newitemIndex = Number(item) + data_start_index;
					$scope.cardDetails.cardDetail[newitemIndex] = result.cardDetail[item];//加入原有資料集
				}

				//頁數的計算以第一次取回的 總數/每頁數量 結果為主
				if($scope.cardDetailpageNumber < $scope.cardDetailpageNumberMax)
				{
					$scope.cardDetailpageNumber++;
					// $log.error('do Page:' + $scope.cardDetailpageNumber);
					visaSearchServices.getCardDataOnPage($scope.cardDetailpageNumber,cardPeriod,tmpCardNo,$scope.addResultOnPage);
				} else {
					$log.debug('END Page:' + $scope.cardDetailpageNumber);
					_ajaxCheckEvent(false);
				}
			}
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
	//=====[VISAListCtrl END]=====//

});
