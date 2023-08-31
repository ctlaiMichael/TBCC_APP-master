//Added by Ivan 2018.5.24
define([
    'app'
    ,'modules/service/qrcodePay/qrcodePayServices'
],function(MainApp){

MainApp.register.controller('disagreementCtrl',
function(
	$scope,framework, qrcodePayServices,$css,$state
){
    $css.add('modules/biometric/disagreement/disagreement.css');
    $scope.goNext = function(){
        $state.go("otp",{});
    }

})
}
)