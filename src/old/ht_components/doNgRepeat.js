/**
 * [處理ng-repeat事件]
 *
 * https://docs.angularjs.org/api/ng/directive/ngRepeat
 * 		$index	number	索引
 * 		$first	boolean	第一個element
 * 		$middle	boolean	中間element
 * 		$last	boolean	最後一個element
 * 		$even	boolean	偶數列
 * 		$odd	boolean	奇數列
 *
 * @author [weiwei , 2016.11.19]
 * @return object
 *
 * [after ng-repeat]
 * html:
 * 	<div ng-repeat="" after-repeat-directive=""></div>
 * directive:
 * 	MainApp.register.directive('afterRepeatDirective',doNgRepeat.afterRepeat('afterRepeatDirective'));
 * controller:
	//==onCardDataFinish START [卡片選擇 after ng-repeat event]==//
	$scope.$on('onAfterRepeatFinish',doNgRepeat.afterRepeatEvent(function()
	{
	}));
	//==onCardDataFinish END==//
 *
 */
define([], function()
{
	var mainClass = {};
	/**
	 * [afterRepeat 針對after ng-repeat執行的method]
	 * 請於controller內呼叫afterRepeatEvent
	 * @param  {[type]} directive [directive名稱(小駝峰格式)]
	 * @return directive method
	 */
	mainClass.afterRepeat = function(directive){
		return function($timeout){
			// console.log(directive+' step1');
			var linkFun = function(scope,element,attr){
				if(scope.$last === true){ //最後產生的repeat element才執行
					$timeout(function(){
						// console.log(directive+' step2');
						scope.$emit(attr[directive]);
					});
				}
			}
			return {
				restrict : 'A',
				link : linkFun
			}
		}
	}


	/**
	 * [afterRepeatEvent description]
	 * @param  {[type]} do_method [description]
	 * @return {[type]}           [description]
	 */
	mainClass.afterRepeatEvent = function(do_method){
		if(typeof do_method !== 'function'){
			return function(){};
		}
		return function(ngRepeatFinishedEvent){
			do_method();
		}
	}


	return mainClass;
});