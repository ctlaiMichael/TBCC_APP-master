/**
 * [Template Directive] 提供一些模板
 */
define([
	'app'
	,'ht_components/doNgRepeat'
],function(MainApp,doNgRepeat){

/**
 * [templateProgressBar] 進度條
 * @param  {number}	$scope.showBoxStep		[當前step]
 * @param  {object}	$scope.templateProgressBar	[templateProgressBar設定]
 * 					bar : {step:name} //進度條設定
 *      			event : 進度條click事件，沒有就不會執行
 *
 */
MainApp.register.directive('tempProgressBar', function(){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		if(typeof $scope.templateProgressBar !== 'object'){
			$scope.templateProgressBar = {bar:{},event:false};
		}
		if(typeof $scope.showBoxStep === 'undefined'){
			$scope.showBoxStep = 1;
		}
		//==onProgressBarFinish START [卡片選擇 after ng-repeat event]==//
		$scope.$on('onProgressBarFinish',doNgRepeat.afterRepeatEvent(function()
		{
			//==返回事件==//
			angular.element(iElm).find('ul li').click(function()
			{
				var step = angular.element(this).data('step');
				if(step < $scope.showBoxStep){
					$scope.showBoxStep = step;
					$scope.$apply();
					if(typeof $scope.templateProgressBar.event === 'function')
					{
						$scope.templateProgressBar.event(step); //其他event
					}
				}
			});
		}));
		//==onProgressBarFinish END==//

	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		replace: false,
		templateUrl: 'modules/template/templates/progress_bar.html',
		link: linkFun
	};
});
MainApp.register.directive('afterProgressBar',doNgRepeat.afterRepeat('afterProgressBar'));
//=====[tempProgressBar END]=====//


/**
 * [tempAgreeInformation] 同意條款
 * @param  {object}	$scope.tempAgreeInformation	[tempAgreeInformation設定]
 * 					{title:'' , content : ''}
 *
 */
MainApp.register.directive('tempAgreeInformation', function(){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		if(typeof $scope.templateAgreeInformation !== 'object'){
			$scope.templateAgreeInformation = {};
		}
		$scope.templateAgreeList = [];
		angular.forEach($scope.templateAgreeInformation, function(element) {
			$scope.templateAgreeList.push(element);
		});
		// console.log('len:'+Object.keys($scope.templateAgreeInformation).length);

		//==onAgreeInformationFinish START [卡片選擇 after ng-repeat event]==//
		$scope.$on('onAgreeInformationFinish',doNgRepeat.afterRepeatEvent(function()
		{
			angular.element(iElm).find('.agreeBox label b').click(function()
			{
				var agree_key = angular.element(this).data('agree');
				var agree_obj = (typeof $scope.templateAgreeInformation[agree_key] !== 'undefined')
								? $scope.templateAgreeInformation[agree_key]
								: {};
				//==彈跳資訊頁開啟==//
				document.getElementById('MainBox').style.overflowY = 'hidden';
				MainUiTool.openPopupInformation({
					title: agree_obj.title,
					content:agree_obj.content
				});

				//==checked後的不用再點==//
				var check_box = angular.element(this).closest('.agreeBox').find('input[type=checkbox]');
				if(check_box.length === 1){
					var check_flag = check_box.prop('checked');
					if(check_flag){
						//已checked點標題不取消
						//(因為css設定label綁定input,<b>在label內，所以透過此方法處理)
						check_box.prop('checked',false);
					}
				}


			});
		}));
		//==onAgreeInformationFinish END==//
	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		replace: false,
		templateUrl: 'modules/template/templates/agree_information.html',
		link: linkFun
	};
});
MainApp.register.directive('afterAgreeInformation',doNgRepeat.afterRepeat('afterAgreeInformation'));
//=====[tempAgreeInformation END]=====//

});
