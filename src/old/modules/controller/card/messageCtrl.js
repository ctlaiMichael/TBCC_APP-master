/**
 * [messageCtrl]
 */
define([
	'app'
	,'service/messageServices'
],function(MainApp){
//=====[messageCtrl START]=====//
MainApp.register.controller('messageCtrl'
, function(
	$scope,$rootScope,$stateParams,$element,i18n
	,messageServices
){
	$scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams)
	{
		if(typeof $rootScope.head_pre_title !== 'undefined' && $rootScope.head_pre_title !== ''
			&& toState.name === 'message'
		){
			// console.error('show head_pre_title:',$rootScope.head_pre_title);
			$rootScope.head_title = $rootScope.head_pre_title;
			$rootScope.head_fix_title = true;
		}
	});
	$scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams)
	{
		$rootScope.head_fix_title = false;
	});

	$scope.message_title = i18n.getStringByTag('PAGE_TITLE.ERRORMESSAGE');//'錯誤訊息';
	$scope.message_btn = [];
	$scope.message_type = 'error';
	var error_set = $stateParams;

	if(typeof $stateParams.code !== 'undefined'){
		var default_set = messageServices.getMsg($stateParams.code);
		//console.log(default_set);
		if(typeof default_set.title !== 'undefined'){
			$scope.message_title = default_set.title;
		}
		if(typeof default_set.content !== 'undefined'){
			$scope.message_content = default_set.content;
		}
		if(typeof default_set.btn_list !== 'undefined'){
			$scope.message_btn = default_set.btn_list;
		}
	}
	if(typeof error_set.title !== 'undefined' && error_set.title !== ''){
		$scope.message_title = error_set.title;
	}
	if(typeof error_set.content !== 'undefined' && error_set.content !== ''){
		$scope.message_content = error_set.content;
	}
	if(typeof error_set.btn_list !== 'undefined'){
		$scope.message_btn = error_set.btn_list;
	}
	var check_class_list = ['error', 'warning', 'success'];
	if(typeof error_set.message_type !== 'undefined' && check_class_list.indexOf(error_set.message_type) > -1){
		$scope.message_type = error_set.message_type;
	}

	$scope.$watch('message_content', function (val) {
		$element.find('.msgBox').html(val);
		// $element.find('.input_single i.input_name').html(val);
	});


});
//=====[messageCtrl END]=====//


});