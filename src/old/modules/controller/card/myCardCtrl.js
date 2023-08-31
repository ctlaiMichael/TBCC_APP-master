/**
 * [我的信用卡]
 */
define([
	'app'
	,'service/loginServices'
	,'service/billPeriodServices'
],function(MainApp){
	//=====[billPeriodSelectCtrl START]=====//
MainApp.register.controller('myCardListCtrl'
,function($scope,$element,loginServices,billPeriodServices){
	//變數設定
	$scope.haveBoxStep = 0;
	$scope.showStep = 0;
	$scope.cardList = {};
	$element.find('.showstep').css('display','none');//預設隱藏畫面
    //列表頁頁碼
	$scope.pageNumber = 1;              //新增頁碼
	$scope.pageNumberMax = 0;           //最大頁碼		
	//登入設定
	// $scope.isLogin = loginServices.checkLogin();
	//==需要登入==//
	$scope.isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});

	if($scope.isLogin){
		billPeriodServices.getData(function(result,jsonObj,pageData){
			if(!result){
				billPeriodServices.getErrorMsg('FC0010_001');
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
					}
				}

			}

			$scope.showStep = 1;
			$scope.haveBoxStep++;
			$element.find('.showstep.step1').css('display','block');
			//success
		});
	}
	$scope.addPageData = function(result,jsonObj,pageData){

			if(!result){
				billPeriodServices.getErrorMsg('FC0010_001',jsonObj.respCodeMsg);
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
						billPeriodServices.getDataOnPage($scope.pageNumber,$scope.addPageData);
					}
				}										
			}				
	};	
});
	//=====[billPeriodSelectCtrl END]=====//

});

