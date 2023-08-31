/**
 * [處理Router設定]
 * @author [weiwei , 2016.11.08]
 * @return {
 *	router : object //angular router
 *	ui_router : object //angular ui-router
 * }
 * [angular-router 與 ui-router比較]
 * http://ithelp.ithome.com.tw/articles/10159149
 * http://huangtengfei.com/2015/10/the-useage-of-ng-route-and-ui-router/
 * http://yijiebuyi.com/blog/3aab7ad8bccb22b4a881849c0593d5e2.html
 */
define([], function()
{
	return {
		//==angular router處理==//
		'router' : function(dependencies){
			return {
				resolver: ['$q','$rootScope', function($q, $rootScope)
				{
					var deferred = $q.defer();

					require(dependencies, function()
					{
						$rootScope.$apply(function()
						{
							deferred.resolve();
						});
					});

					return deferred.promise;
				}]
			};
		},

		//==ui router處理==//
		'ui_router' : function(dependencies,state_set){
			if(typeof dependencies === 'string'){
				dependencies = [dependencies];
			}
			var resolveObj = {}
			if(typeof state_set.resolve !== 'undefined'){
				resolveObj = state_set.resolve;
			}
			resolveObj['loadCtrl'] = ['$q','$rootScope', function($q, $rootScope)
			{
				var deferred = $q.defer();

				require(dependencies, function()
				{
					$rootScope.$apply(function()
					{
						deferred.resolve();
					});
				});
				return deferred.promise;
			}];

			return resolveObj;
		}
	}
});