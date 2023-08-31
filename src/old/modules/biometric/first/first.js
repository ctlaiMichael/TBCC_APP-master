//Added by Ivan 2018.5.24
define([
    'app'
    ,'modules/service/qrcodePay/qrcodePayServices'
],function(MainApp){

MainApp.register.controller('firstCtrl',
function(
	$scope,framework, qrcodePayServices,$css,$state
){
    $css.add('modules/biometric/first/first.css');
    localStorage.setItem('bioLogin','0')

     //android實體鍵盤返回鍵
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
            
		}

    $scope.goNext = function(){
        $state.go("agreement",{});
    }
    $scope.goLogin = function(){
        $state.go("login",{});
        localStorage.setItem("noSelect","1");
        localStorage.setItem("fromFirst","1");
    } 
    
    $scope.goBack = function(){
        $state.go("login",{});
    } 

})
}
)