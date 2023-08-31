//Added by Ivan 2018.5.24
define([
    'app'
    ,'modules/service/qrcodePay/qrcodePayServices'
    ,'modules/service/qrcodePay/securityServices'

],function(MainApp){

MainApp.register.controller('agreementCtrl',
function(
	$scope,framework, qrcodePayServices,$css,$state,qrCodePayTelegram,stringUtil,securityServices
){
    $css.add('modules/biometric/agreement/agreement.css');
    $css.add('ui/css/login.css');
    $css.add('modules/biometric/first/first.css');
    var element = document.getElementById("setting_body");
    if(element){
         element.classList.add("setting_body");
    }
    
    if (device.platform=='Android') {
        $css.add('ui/css/android-fix.css');
    }

    localStorage.setItem('noSelect','0');

    // if(localStorage.getItem('fromFirst')=='1'){
    //     document.getElementById('second_agree').style.display = "none";
    // }
    // if(localStorage.getItem('fromPay')=='1'){
    //     document.getElementById('first_agree').style.display = "none";
    // }

    //android實體鍵盤返回鍵
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
           
        }
  


  
    $scope.goNext = function(){
        HiBiometricAuth.disableBioService(function(result){console.log(result)}, function(result){});
        if(document.getElementById("first_check").checked == false){
            MainUiTool.openBioWrong({title:'錯誤',content:'您尚未勾選同意'});
        }
        // else if(localStorage.getItem('fromPay')=='1' && document.getElementById("second_check").checked == false){
        //     MainUiTool.openDialog({title:'錯誤',content:'您尚未勾選同意'});
        // }
        // else if(localStorage.getItem('fromBoth')=='1' && (document.getElementById("second_check").checked == false || document.getElementById("first_check").checked == false)){
        //     MainUiTool.openDialog({title:'錯誤',content:'您尚未勾選同意'});
        // }
        else{
                var dialog_success = function (){
                    $state.go("setting",{});
                }
                HiBiometricAuth.generateBioToken(function(result){
                    plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'), localStorage.getItem('loginuser')], function(loginResult){
                        var req = {
                            custId : loginResult.custId,
                            userId : loginResult.userId.toUpperCase(),
                            token :result.device_token,
                            functionType:"1"
                         }        
                        localStorage.setItem('token',result.device_token);
                        qrCodePayTelegram.send('qrcodePay/bi000100', req, function(obj){            
                            console.log(obj);
                            console.log(obj['bi0:hostCodeMsg']);
                            //alert(obj['bi0:hostCodeMsg']);
                            if(obj.hostCode == 0){
                                HiBiometricAuth.enableBioService(function(result){
                                    if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
                                        MainUiTool.openBiometry({title:'臉部登入設定成功',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>下次登入即可以使用快速登入功能了喔！</p>",success: dialog_success}); 
                                    }
                                    else{
                                    MainUiTool.openBiometry({title:'指紋登入設定成功',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>下次登入即可以使用快速登入功能了喔！</p>",success: dialog_success}); 
            
                                    }
                                    localStorage.setItem('login_setting','1');
                                    localStorage.setItem('bioLogin','1')
                                    localStorage.setItem('passLogin','0')
                                    }, function(result){
                                        if(result.ret_code == '1'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                                            if (sessionStorage.getItem("goFromTaiwanpay") == "1") {
                                                qrcodePayServices.closeActivity();
                                            } else {
                                                plugin.bank.LoginClose(function () {}, function () {});
                                            } 
                                        }
                                        else if(result.ret_code == '2'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
                                        
                                        }
                                        else if(result.ret_code == '3'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定或生物辨識已被鎖定"}); 
                                        
                                        }
                                        else if(result.ret_code == '4'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"指紋異動"}); 
                                        
                                        }
                                        else if(result.ret_code == '5'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
                                            
                                        }
                                        else if(result.ret_code == '6'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
                                        
                                        }
                                        else if(result.ret_code == '7'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 
                                        
                                        }
                                        else if(result.ret_code == '10'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"使用者取消驗證"}); 
                                        
                                        }
                                        else if(result.ret_code == '11'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過警告次數"}); 
                                        
                                        }
                                        else if(result.ret_code == '12'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過允許次數"}); 
                                        
                                        }
                                        else if(result.ret_code == '13'){
                                            MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
                                        
                                        }
                                        else{
                                            MainUiTool.openBioWrong({title:'錯誤',content:"系統錯誤"}); 
                                            
                                        }
                                })
                            }
                            else if(obj.hostCodeMsg == '綁定設備超過上限'){
                                var dialogsuccess = function () {
                                    var req2 = {
                                        custId : loginResult.custId,
                                        userId : loginResult.userId.toUpperCase(),
                                        token :result.device_token,
                                        functionType:"3"
                                     }
                                     qrCodePayTelegram.send('qrcodePay/bi000100', req2, function(obj){ 
                                        if(obj.hostCode == 0){
                                            HiBiometricAuth.enableBioService(function(result){
                                                setTimeout(function(){
                                                    if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
                                                        MainUiTool.openBiometry({title:'臉部登入設定成功',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>下次登入即可以使用快速登入功能了喔！</p>",success: dialog_success}); 
                                                    }
                                                    else{
                                                        MainUiTool.openBiometry({title:'指紋登入設定成功',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>下次登入即可以使用快速登入功能了喔！</p>",success: dialog_success}); 
                            
                                                    }
                                                },100) 
                                                localStorage.setItem('login_setting','1');
                                                localStorage.setItem('bioLogin','1')
                                                localStorage.setItem('passLogin','0')
                                                }, function(result){
                                                    if(result.ret_code == '1'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                                                        if (sessionStorage.getItem("goFromTaiwanpay") == "1") {
                                                            qrcodePayServices.closeActivity();
                                                        } else {
                                                            plugin.bank.LoginClose(function () {}, function () {});
                                                        } 
                                                    }
                                                    else if(result.ret_code == '2'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '3'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定或生物辨識已被鎖定"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '4'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"指紋異動"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '5'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
                                                        
                                                    }
                                                    else if(result.ret_code == '6'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '7'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '10'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"使用者取消驗證"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '11'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過警告次數"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '12'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過允許次數"}); 
                                                    
                                                    }
                                                    else if(result.ret_code == '13'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
                                                    
                                                    }
                                                    else{
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"系統錯誤"}); 
                                                        
                                                    }
                                            })
                                        }
                                     }) 
                                }
                                function dialogcancel() {
                                    if (sessionStorage.getItem("goFromTaiwanpay") == "1") {
                                        qrcodePayServices.closeActivity();
                                    } else {
                                        plugin.bank.LoginClose(function () {}, function () {});
                                    }
                                }
                                MainUiTool.openBiometricConfirm({
                                    title: '快速登入重複啟用',
                                    content: "此帳號已於其它裝置啟用快速登入，是否解除舊裝置並改以此設備進行快速登入",
                                    success: dialogsuccess,
                                    cancel: dialogcancel
                                });
                            }
                            else{
                                MainUiTool.openBioWrong({title:'錯誤',content:obj.hostCodeMsg}); 
           
                            }
                           
                        })  
                        
                    });
                                  
                }, function(result){
                    console.log(result)
                    if(result.ret_code == '1'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                        if (sessionStorage.getItem("goFromTaiwanpay") == "1") {
                            qrcodePayServices.closeActivity();
                        } else {
                            plugin.bank.LoginClose(function () {}, function () {});
                        }
                    }
                    else if(result.ret_code == '2'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 

                    }
                    else if(result.ret_code == '3'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定或生物辨識已被鎖定"}); 
                    }
                    else if(result.ret_code == '4'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"指紋異動"}); 
                    }
                    else if(result.ret_code == '5'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 

                    }
                    else if(result.ret_code == '6'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 

                    }
                    else if(result.ret_code == '7'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 

                    }
                    else if(result.ret_code == '10'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"使用者取消驗證"}); 

                    }
                    else if(result.ret_code == '11'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過警告次數"}); 

                    }
                    else if(result.ret_code == '12'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過允許次數"}); 

                    }
                    else if(result.ret_code == '13'){
                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 

                    }
                    else{
                        MainUiTool.openBioWrong({title:'錯誤',content:"系統錯誤"}); 

                    }

                },"請將您的指紋置於感應區域上")                  
            
            

    }
    }

    $scope.goBack = function(){
        localStorage.setItem('fromFirst','0');
        localStorage.setItem('fromPay','0');
        localStorage.setItem('fromBoth','0');   
        localStorage.setItem('noSelect','0');
        //$state.go("login",{});
        localStorage.setItem("mBank",'0')
        localStorage.setItem("twPay",'0')
        if (sessionStorage.getItem("goFromTaiwanpay") == "1") {
            qrcodePayServices.closeActivity();
        } else {
            plugin.bank.LoginClose(function () {}, function () {});
        }
    }

})
}
)