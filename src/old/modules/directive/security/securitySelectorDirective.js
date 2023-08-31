/**
 * [securityTypeSelectorDirective] 安控機制選擇
 */
define([
    'app'
	, 'modules/service/qrcodePay/securityServices'
], function (MainApp) {
    /**
     * [securityTypeSelectorDirective] 安控機制選擇
     */
    MainApp.register.directive('securitySelectorDirective', function (
		$window, $log, framework, securityServices
	) {
        var linkFun = function ($scope, iElm, iAttrs, controller) {
            $scope.sslkey ='';
            var securityTypes = [];
            if($scope.noSSL==null){
                $scope.noSSL = true;
            }
            if($scope.noOTP==null){
                $scope.noOTP = false;
            }
            // securityServices.updateSecurityTypes(function(types){
            //     securityTypes = types;
            //     $scope.defaultSecurityType = securityTypes[0];
            //     if (securityTypes.length == 2) {
            //         $scope.anotherSecurityType = securityTypes[1];
            //     }
            // });
            
            var updateMenu = function(){
                $scope.anotherSecurityType = securityTypes.slice();
                for( var i in securityTypes){
                    if((securityTypes[i].key==$scope.defaultSecurityType.key)
                        || ($scope.noSSL && (securityTypes[i].key=='SSL'))
                        || ($scope.noOTP && (securityTypes[i].key=='OTP'))
                    ){
                        $scope.anotherSecurityType.splice(i, 1);
                    }
                }
            }

            securityServices.updateSecurityTypes(function(types){
                // alert(JSON.stringify(types));
                securityTypes = types.slice();
                for( var i in securityTypes){
                    if( ($scope.noSSL && (securityTypes[i].key=='SSL'))
                    || ($scope.noOTP && (securityTypes[i].key=='OTP')) ){
                        securityTypes.splice(i, 1);
                    }
                }
                $scope.defaultSecurityType = securityTypes[0];
                updateMenu();
            })

            
            if (securityTypes.length >= 2) {
                updateMenu();
            }

            $scope.changeSecurity = function (type) {
                $scope.defaultSecurityType = type;
                updateMenu();
                $scope.onChangeSecurityType = false;
            }

            /**
			 * 點選切換安控機制
			 */
			$scope.clickChangeSceurityType = function (show) {
				$scope.onChangeSecurityType = show;
			}


        };
        return {
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            replace: false,
            templateUrl: 'modules/directive/security/securitySelector.html',
            link: linkFun
        };
    });
    //=====[securityTypeSelectorDirective END]=====//

});