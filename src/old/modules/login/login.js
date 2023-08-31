//Added by Ivan 2018.5.10
define([
    'app', 'modules/service/qrcodePay/securityServices', 'modules/telegram/qrcodePay/qrcodePayTelegram'

], function (MainApp) {

    MainApp.register.controller('loginCtrl',
        function (
            $scope, framework, $css, qrCodePayTelegram, securityServices, $state, stringUtil
        ) {
            localStorage.setItem("mBank",'1')
            localStorage.setItem("twPay",'1')

            //$css.add('ui/css/login.css');
            $scope.inputType = 'password';
            $scope.inputType2 = 'password';
            $scope.inputType3 = 'password';

            if (device.platform=='Android') {
                $css.add('ui/css/android-fix.css');
            }
            var testCount = 0;
                 //android實體鍵盤返回鍵
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
            
        }

        console.log(device.version)

        function onLoad() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        
        // device APIs are available
        //
        function onDeviceReady() {
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
            document.addEventListener("menubutton", onMenuKeyDown, false);
            // Add similar listeners for other events
        }
        
        function onPause() {
            // Handle the pause event
            console.log("onPause")
        }
        
        function onResume() {
            // Handle the resume event
            console.log("onResume")

        }
        

        $scope.keyPress = function(event, custId, userId, password){
             if (event.keyCode == 13) { // Enter事件
                 $scope.login(custId, userId, password);
                 document.getElementById("user_login").focus(); // 失去鍵盤焦點 收起軟鍵盤
             }
        }
        
        plugin.tcbb.fastAESDecode([localStorage.getItem("loginname"),localStorage.getItem("loginuser")], function(result){
            console.log(result)
            var storage = window.localStorage;
            if (storage.getItem("isstorename") == "yes") {
                //    $("#remb_me").attr("checked", true);
                //    $("#login_name").val(storage.getItem("loginname"));
                $scope.custId = result.custId;
                $scope.checkbox_id = true;


            }
            if (storage.getItem("isstoreuser") == "yes") {
                //    $("#remb_me").attr("checked", true);
                //    $("#login_name").val(storage.getItem("loginname"));
                $scope.userId = result.userId;
                $scope.checkbox_user = true;
            }
           $scope.$apply()

        });

        if (localStorage.getItem('noSelect') == '1') {
            document.getElementById("login_select").style.display = "none";
        }


            $scope.isFast = '0';

            if (localStorage.getItem("loginErrorCount") == null) {
                var loginErrorCount = 0;
                localStorage.setItem("loginErrorCount", loginErrorCount);
            }

            if(localStorage.getItem('bioLogin')=='1'){
                var macValue;
                $scope.isFast = '1';
                document.getElementById("right_h2").style.backgroundColor = "#2CB2B2";
                document.getElementById("right_h2").style.color = "white";
                document.getElementById("left_h2").style.backgroundColor = "transparent";
                document.getElementById("left_h2").style.color = " #009274";
                if (localStorage.getItem('login_setting') == '1') {
                    plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'), localStorage.getItem('loginuser')], function(loginResult){

                        plugin.tcbb.fastAESDecode([localStorage.getItem('comparename'), localStorage.getItem('compareuser')], function(compareResult){

                            if (loginResult.custId != compareResult.custId && loginResult.userId != compareResult.userId) {
                        
                                MainUiTool.openBioWrong({
                                    title: "錯誤",
                                    content: "您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入"
                                })
                                $scope.password_login();
                                $scope.$apply();
        
                            } 
                            else {
                                HiBiometricAuth.requestBioService(function (result) {
                                    macValue = result.mac_value;
                                    var req = {
                                        custId: compareResult.custId,
                                        userId: compareResult.userId.toUpperCase(),
                                        mac: macValue,
                                    }
        
                                    securityServices.digitalEnvelop('123', function (obj) {
                                        qrCodePayTelegram.send('qrcodePay/bi000102', req, function (obj) {
                                            console.log(obj)
                                            if(obj!=false){
                                                
                                                plugin.tcbb.setF1000101Data(obj, function (res) {
                                                    var loginErrorCount = 0;
                                                    localStorage.setItem("loginErrorCount", loginErrorCount);
                                                    if (localStorage.getItem('noSelect') == '1') {
                                                        localStorage.setItem("twPay",'0')
		                                            	localStorage.setItem("mBank",'0')
                                                        $state.go("agreement", {});
                                                    } else {
                                                        localStorage.setItem('bioLogin','1')
                                                        localStorage.setItem('passLogin','0')
                                                        plugin.bank.LoginClose(function () {}, function () {});
                                                        localStorage.setItem("twPay",'0')
		                                            	localStorage.setItem("mBank",'0')
                                                        
        
                                                    }
        
                                                }, function (error) {
                                                    console.log(error);
                                                });
                                                //console.log(JSON.stringify(obj));
                                                //alert("成功");
					                            CelebrusInsertTool.celetbrslnsertClickEvent("login");
                                                CelebrusInsertTool.manualAddTextChange("PersonalEB_ID", "Personal_Bank_login", req.custId);
                                                CelebrusInsertTool.celetbrslnsertClickEvent("login_ok");
                                                plugin.tcbb.fastAESEncode([compareResult.custId, compareResult.userId], function(result){
                                                    var storage = window.localStorage;
                                                    storage.setItem("loginname", result.custId);
                                                    storage.setItem("loginuser", result.userId);
                                                })
                                                
        
                                            } else {
                                               
                                                    MainUiTool.openBioWrong({
                                                        title: '登入失敗',
                                                        content: sysCtrl.errorMessage
                                                    });
                                                    if(sysCtrl.errorMessage.indexOf('ERRBI_0001') > -1){
                                                        HiBiometricAuth.disableBioService(function (result) {
                                                            localStorage.setItem('bioLogin', '0')
                                                            localStorage.setItem("pay_setting", '0');
                                                            localStorage.setItem('login_setting','0');
                                                            localStorage.setItem('defaultType','')

                                                        }, function (result) {
                                                            console.log(result)
                                                            if (result.ret_code == '1') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "硬體設備不支援"
                                                                });
                            
                                                            } else if (result.ret_code == '2') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "生物辨識尚未啟用"
                                                                });
                            
                                                            } else if (result.ret_code == '3') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "生物辨識尚未設定"
                                                                });
                            
                                                            } else if (result.ret_code == '4') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "指紋異動"
                                                                });
                            
                                                            } else if (result.ret_code == '5') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "尚未產製設備信物"
                                                                });
                            
                                                            } else if (result.ret_code == '6') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "尚未啟用驗證服務"
                                                                });
                            
                                                            } else if (result.ret_code == '7') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "已啟用驗證服務"
                                                                });
                            
                                                            } else if (result.ret_code == '10') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "使用者取消驗證"
                                                                });
                            
                                                            } else if (result.ret_code == '11') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "驗證超過警告次數"
                                                                });
                            
                                                            } else if (result.ret_code == '12') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "驗證超過允許次數"
                                                                });
                            
                                                            } else if (result.ret_code == '13') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "驗證功能被鎖住"
                                                                });
                            
                                                            } else {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "系統錯誤"
                                                                });
                            
                                                            }
                            
                                                        })
                                                       
                                                    }
                                                    else if(sysCtrl.errorMessage.indexOf('ERRBI_0005') > -1){
                                                            localStorage.setItem('bioLogin', '0')                                                           
                                                            localStorage.setItem('defaultType','')
                                                            localStorage.setItem('loginuser','')
                                                            $scope.userId = ""
                                                    }
                                                    loginErrorCount = loginErrorCount + 1;
                                                    localStorage.setItem("loginErrorCount", loginErrorCount);
                                                    $scope.password_login();
                                                    $scope.$apply();
                                                
                                            }
                                        }, function (obj) {

                                        })
                                    }, function () {
                                        //digitalEnvelop error callback
                                    }, req.userId, req.custId)
        
        
        
        
                                }, function (result) {
                                    console.log(result)
                                    if(result.ret_code == '1'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                    else if(result.ret_code == '2'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                    else if(result.ret_code == '3'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                    else if(result.ret_code == '4'){
                                        var req = {
                                            custId: loginResult.custId,
                                            userId: loginResult.userId.toUpperCase(),
                                            token: localStorage.getItem('token'),
                                            functionType: "0"
                                        }
                                        MainUiTool.openBioWrong({title:'錯誤',content:"系統偵測到您的指紋有異動，請重新註冊生物辨識"}); 
                                        HiBiometricAuth.disableBioService(function(result){
                                        }, function(result){})
                                        qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                            if(obj.hostCode == 0){
                                                localStorage.setItem("bioLogin",'0')
                                                localStorage.setItem("login_setting",'0')
                                                $scope.password_login();
                                                $scope.$apply();
                                            }
                                            else{
                                                MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                           
                                            }
                                        })
                                        
                                    }
                                    else if(result.ret_code == '5'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                    else if(result.ret_code == '6'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                    else if(result.ret_code == '7'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                
                                    else if(result.ret_code == '13'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                   
                                    else if(result.ret_code == '10'){
                                    $scope.password_login();
                                    $scope.$apply();
                                    }
                                    else if(result.ret_code == '11'){
                                        if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
                                            MainUiTool.openBioWrong({title:'臉部辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>臉部辨識錯誤已達3次，請確認後再試</p>",});                                  }
                                        else{
                                            MainUiTool.openBioWrong({title:'指紋辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>指紋辨識錯誤已達3次，請確認後再試</p>",});          
                                        }
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    else if(result.ret_code == '12'){
                                        // if(localStorage.getItem("errorCount")=='1'){
                                            if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
                                                MainUiTool.openBioWrong({title:'臉部辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>臉部辨識錯誤已達5次，請重新設定或改用密碼登入</p>",});                                  }
                                             else{
                                                MainUiTool.openBioWrong({title:'指紋辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>指紋辨識錯誤已達5次，請重新設定或改用密碼登入</p>",});          
                                             }
                                             HiBiometricAuth.disableBioService(function(res){
                                                 console.log(res)
                                                },function(res){console.log(res)})
                                             localStorage.setItem('bioLogin','0')
                                             localStorage.setItem('login_setting','0')
                                             localStorage.setItem('pay_setting','0')
                                             localStorage.setItem("defaultType","")               
                                             $scope.password_login();
                                             $scope.$apply();
                                        // }
                                        // else{
                                        
                                        // }
                                    }
                                    else if (result.ret_code == '-1') {
                                        MainUiTool.openBioWrong({title:'錯誤',content:"資料驗證失敗，請重新設定指紋/臉部快速登入"}); 
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    
                                }, compareResult.custId + compareResult.userId.toUpperCase(),"請將您的指紋置於感應區域上")
                            }

                        
                        })

                    })


                } else {
                    HiBiometricAuth.getBiometricStatus(function (result) {
                        console.log(result)
                        if (result.ret_code == 0) {
                            $state.go("first", {});
                        } else if (result.ret_code == 1) {
                            MainUiTool.openBioWrong({
                                title: "錯誤",
                                content: "您的設備尚未設定生物辨識"
                            })
                            $scope.password_login();
                            $scope.$apply();
                        } else {
                            MainUiTool.openBioWrong({
                                title: "錯誤",
                                content: "您的設備不支援快速登入(指紋/臉部)功能"
                            })
                            $scope.password_login();
                            $scope.$apply();
                        }
                    }, function (result) {
                        console.log(result)
                        if (result.ret_code == 3) {
                        MainUiTool.openBioWrong({title:'指紋已鎖定或指紋未設定',content:"請重新開啟裝置畫面並輸入密碼解鎖或請確認是否已設定指紋",});
                        $scope.password_login();
                        $scope.$apply();          
                        }
                    })
                }


            }
            else{
                $scope.isFast = '0';
                document.getElementById("right_h2").style.backgroundColor = "transparent";
                document.getElementById("right_h2").style.color = "#009274";
                document.getElementById("left_h2").style.backgroundColor = "#2CB2B2";
                document.getElementById("left_h2").style.color = " white";
            }

            $scope.goNext = function () {
                $state.go("first", {});
            }

            $scope.password_login = function () {
                $scope.isFast = '0';
                document.getElementById("right_h2").style.backgroundColor = "transparent";
                document.getElementById("right_h2").style.color = "#009274";
                document.getElementById("left_h2").style.backgroundColor = "#2CB2B2";
                document.getElementById("left_h2").style.color = " white";
            }

            $scope.biometric_login = function () {

                plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'), localStorage.getItem('loginuser')], function(loginResult){

                    plugin.tcbb.fastAESDecode([localStorage.getItem('comparename'), localStorage.getItem('compareuser')], function(compareResult){
                        var macValue;
                        $scope.isFast = '1';
                        document.getElementById("right_h2").style.backgroundColor = "#2CB2B2";
                        document.getElementById("right_h2").style.color = "white";
                        document.getElementById("left_h2").style.backgroundColor = "transparent";
                        document.getElementById("left_h2").style.color = " #009274";
                        if (localStorage.getItem('login_setting') == '1') {
                            if (loginResult.custId != compareResult.custId && loginResult.userId != compareResult.userId) {
                                MainUiTool.openBioWrong({
                                    title: "錯誤",
                                    content: "您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入"
                                })
                                $scope.password_login();
                                $scope.$apply();
        
                            } else {
                                HiBiometricAuth.requestBioService(function (result) {
                                    macValue = result.mac_value;
                                    var req = {
                                        custId: compareResult.custId,
                                        userId: compareResult.userId.toUpperCase(),
                                        mac: macValue,
                                    }
        
                                    securityServices.digitalEnvelop('123', function (obj) {
                                        qrCodePayTelegram.send('qrcodePay/bi000102', req, function (obj) {
                                            console.log(obj)
                                            if (obj!=false) {
                                                plugin.tcbb.setF1000101Data(obj, function (res) {
                                                    var loginErrorCount = 0;
                                                    localStorage.setItem("loginErrorCount", loginErrorCount);
                                                    if (localStorage.getItem('noSelect') == '1') {
                                                        localStorage.setItem("twPay",'0')
		                                            	localStorage.setItem("mBank",'0')
                                                        $state.go("agreement", {});
                                                    } else {
                                                        localStorage.setItem('bioLogin','1')
                                                        localStorage.setItem('passLogin','0')
                                                        plugin.bank.LoginClose(function () {}, function () {});
                                                        localStorage.setItem("twPay",'0')
			                                            localStorage.setItem("mBank",'0')
        
                                                    }
        
                                                }, function (error) {
                                                    console.log(error);
                                                });
                                                //console.log(JSON.stringify(obj));
                                                //alert("成功");
                                                CelebrusInsertTool.celetbrslnsertClickEvent("login");
                                                CelebrusInsertTool.manualAddTextChange("PersonalEB_ID", "Personal_Bank_login", req.custId);
                                                CelebrusInsertTool.celetbrslnsertClickEvent("login_ok");
                                                plugin.tcbb.fastAESEncode([compareResult.custId, compareResult.userId], function(result){
                                                    var storage = window.localStorage;
                                                    storage.setItem("loginname", result.custId);
                                                    storage.setItem("loginuser", result.userId);
                                                })
        
                                            } else {
                                                
                                                    MainUiTool.openBioWrong({
                                                        title: '登入失敗',
                                                        content: sysCtrl.errorMessage
                                                    });
                                                    if(sysCtrl.errorMessage.indexOf('ERRBI_0001') > -1){
                                                        HiBiometricAuth.disableBioService(function (result) {
                                                            localStorage.setItem('bioLogin', '0')
                                                            localStorage.setItem("pay_setting", '0');
                                                            localStorage.setItem('login_setting','0');
                                                            localStorage.setItem('defaultType','')
                                                        }, function (result) {
                                                            console.log(result)
                                                            if (result.ret_code == '1') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "硬體設備不支援"
                                                                });
                            
                                                            } else if (result.ret_code == '2') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "生物辨識尚未啟用"
                                                                });
                            
                                                            } else if (result.ret_code == '3') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "生物辨識尚未設定"
                                                                });
                            
                                                            } else if (result.ret_code == '4') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "指紋異動"
                                                                });
                            
                                                            } else if (result.ret_code == '5') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "尚未產製設備信物"
                                                                });
                            
                                                            } else if (result.ret_code == '6') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "尚未啟用驗證服務"
                                                                });
                            
                                                            } else if (result.ret_code == '7') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "已啟用驗證服務"
                                                                });
                            
                                                            } else if (result.ret_code == '10') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "使用者取消驗證"
                                                                });
                            
                                                            } else if (result.ret_code == '11') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "驗證超過警告次數"
                                                                });
                            
                                                            } else if (result.ret_code == '12') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "驗證超過允許次數"
                                                                });
                            
                                                            } else if (result.ret_code == '13') {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "驗證功能被鎖住"
                                                                });
                            
                                                            } else {
                                                                MainUiTool.openBioWrong({
                                                                    title: '錯誤',
                                                                    content: "系統錯誤"
                                                                });
                            
                                                            }
                            
                                                        })
                                                       
                                                    }
                                                    else if(sysCtrl.errorMessage.indexOf('ERRBI_0005') > -1){
                                                        localStorage.setItem('bioLogin', '0')
                                                        localStorage.setItem('loginuser','')
                                                        $scope.userId = ""
                                                        localStorage.setItem('defaultType','')
                                                    }
                                                    loginErrorCount = loginErrorCount + 1;
                                                    localStorage.setItem("loginErrorCount", loginErrorCount);
                                                    $scope.password_login();
                                                    $scope.$apply();
                                                
                                            }
                                        }, function (result) {
                                            // if(result.ret_code == '1'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '2'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '3'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '4'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"指紋異動"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '5'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '6'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '7'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '10'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"使用者取消驗證"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '11'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過警告次數"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '12'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過允許次數"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else if(result.ret_code == '13'){
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                                            // else{
                                            //     MainUiTool.openBioWrong({title:'錯誤',content:"系統錯誤"}); 
                                            //     $scope.password_login();
                                            //     $scope.$apply();
                                            // }
                
                                        })
                                    }, function () {
                                        //digitalEnvelop error callback
                                    }, req.userId, req.custId)        
        
                                }, function (result) {
                                    console.log(result)
                                    if(result.ret_code == '1'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    else if(result.ret_code == '2'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    else if(result.ret_code == '3'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定"}); 
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    else if(result.ret_code == '4'){
                                        var req = {
                                            custId: loginResult.custId,
                                            userId: loginResult.userId.toUpperCase(),
                                            token: localStorage.getItem('token'),
                                            functionType: "0"
                                        }
                                        MainUiTool.openBioWrong({title:'錯誤',content:"系統偵測到您的指紋有異動，請重新註冊生物辨識"}); 
                                        HiBiometricAuth.disableBioService(function(result){
                                            qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                                if (obj.hostCode == 0) {
                                                    localStorage.setItem("bioLogin",'0')
                                                    $scope.password_login();
                                                    $scope.$apply();
                                                }
                                                else{
                                                    MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                               
                                                }
                                            })
                                        }, function(result){})
                                        $scope.password_login();
                                        $scope.$apply(); 
                                        
                                       
                                    }
                                    else if(result.ret_code == '5'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
                                        $scope.password_login();
                                        $scope.$apply(); 
                                    }
                                    else if(result.ret_code == '6'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
                                        $scope.password_login();
                                        $scope.$apply(); 
                                    }
                                    else if(result.ret_code == '7'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"});
                                        $scope.password_login();
                                        $scope.$apply(); 
        
                                    }
                                
                                    else if(result.ret_code == '13'){
                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
                                        $scope.password_login();
                                        $scope.$apply();
        
                                    }
                                    else if(result.ret_code == '10'){
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    else if(result.ret_code == '11'){
                                        if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
                                            MainUiTool.openBioWrong({title:'臉部辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>臉部辨識錯誤已達3次，請確認後再試</p>",});                                  }
                                        else{
                                            MainUiTool.openBioWrong({title:'指紋辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>指紋辨識錯誤已達3次，請確認後再試</p>",});          
                                        }
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                    else if(result.ret_code == '12'){
                                        // if(localStorage.getItem("errorCount")=='1'){
                                            if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
                                                MainUiTool.openBioWrong({title:'臉部辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>臉部辨識錯誤已達5次，請重新設定或改用密碼登入</p>",});                                  }
                                             else{
                                                MainUiTool.openBioWrong({title:'指紋辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>指紋辨識錯誤已達5次，請重新設定或改用密碼登入</p>",});          
                                             }
                                            //  HiBiometricAuth.disableBioService(function(res){
                                            //      console.log(res)
                                            //  },function(res){console.log(res)})
                                             localStorage.setItem('bioLogin','0')
                                             localStorage.setItem('login_setting','0')
                                             localStorage.setItem('pay_setting','0')
                                             localStorage.setItem("defaultType","")               
                                             $scope.password_login();
                                             $scope.$apply();
                                        // }
                                        // else{
                                        
                                        // }
                                    }
                                    else if (result.ret_code == '-1') {
                                        MainUiTool.openBioWrong({title:'錯誤',content:"資料驗證失敗，請重新設定指紋/臉部快速登入"}); 
                                        $scope.password_login();
                                        $scope.$apply();
                                    }
                                }, compareResult.custId + compareResult.userId.toUpperCase(),"請將您的指紋置於感應區域上")
                            }
                        } else {
                            HiBiometricAuth.getBiometricStatus(function (result) {
                                console.log(result)

                                if (result.ret_code == 0) {
                                    $state.go("first", {});
                                } else if (result.ret_code == 1) {
                                    MainUiTool.openBioWrong({
                                        title: "錯誤",
                                        content: "您的設備尚未設定生物辨識"
                                    })
                                    $scope.password_login();
                                    $scope.$apply();
                                } else {
                                    MainUiTool.openBioWrong({
                                        title: "錯誤",
                                        content: "您的設備不支援快速登入(指紋/臉部)功能"
                                    })
                                    $scope.password_login();
                                    $scope.$apply();
                                }
                            }, function (result) {
                                console.log(result)

                                if (result.ret_code == 13) {
                                    MainUiTool.openBioWrong({title:'指紋已鎖定',content:"請重新開啟裝置畫面並輸入密碼解鎖",});
                                    $scope.password_login();
                                    $scope.$apply();          
                                }
                                else if(result.ret_code == 3){
                                    MainUiTool.openBioWrong({title:'指紋未設定',content:"請確認是否已設定指紋",});
                                    $scope.password_login();
                                    $scope.$apply(); 
                                }
                                else if (result.ret_code == 1) {
                                    MainUiTool.openBioWrong({
                                        title: "錯誤",
                                        content: "您的設備尚未設定生物辨識"
                                    })
                                    $scope.password_login();
                                    $scope.$apply();
                                } else {
                                    MainUiTool.openBioWrong({
                                        title: "錯誤",
                                        content: "您的設備不支援快速登入(指紋/臉部)功能"
                                    })
                                    $scope.password_login();
                                    $scope.$apply();
                                }
                            })
                        }  
                    
                    
                    })
                })
                

            }

            $scope.seePassword = function () {
                if ($scope.inputType == 'password'){
                   $scope.inputType = 'text';
                }
                else{
                   $scope.inputType = 'password';
                }
            }
            $scope.seePassword2 = function () {
                if ($scope.inputType2 == 'password'){
                    $scope.inputType2 = 'text';
                }
                else{
                    $scope.inputType2 = 'password';
                }
            }
            $scope.seePassword3 = function () {
                if ($scope.inputType3 == 'password'){
                   $scope.inputType3 = 'text';
                }
                else{
                   $scope.inputType3 = 'password';
                }
            }


            $scope.clickBack = function () {
                plugin.tcbb.returnHome(function () {}, function () {});
                //framework.backToNative();
                localStorage.setItem('noSelect', '0');
                localStorage.setItem("mBank",'0')
                localStorage.setItem("twPay",'0')

            }
            $scope.login = function (custId, userId, password) {
                // plugin.tcbb.returnHome(function(){} ,function(){});
                //plugin.bank.close(function(){} ,function(){});
                //framework.backToNative();
                function checkInput(str,inputCol) {
                    // console.log(str);
                    var data = {
                        status: true,
                        msg: ''
                    };

                    if (inputCol=='custId' || inputCol=='password'){
                        if (str.length > 12) {
                            data.status = false;
                            data.msg = '身分證字號或密碼的長度有誤';
                            // console.log(data);
                            return data;
                        }
                    }
                    if (inputCol=='userId'){
                        if (str.length > 16) {
                            data.status = false;
                            data.msg = '網路連線代號的長度有誤';
                            // console.log(data);
                            return data;
                        }
                    }

                    for (i = 0; i < str.length; i++) {
                        var tmp_check = false;
                        var check_str = str.charCodeAt(i);
                        var tmp_desc = "";
                        // console.log(check_str);

                        // 英文數字特殊符號 // https://www.obliquity.com/computer/html/unicode0000.html
                        if (inputCol=='custId'){
                            tmp_desc = "身分證字號請勿輸入符號或非英數";
                            if ((check_str >= 48 && check_str <= 57) || 
                                (check_str >= 65 && check_str <= 90) ||
                                (check_str >= 97 && check_str <= 122)) {
                                tmp_check = true;
                            }
                        }
                        if (inputCol=='userId'){
                            tmp_desc = "網路連線代號請輸入英數或符號";
                            if (check_str >= 21 && check_str <= 126) {
                                tmp_check = true;
                            }
                        }
                        if (inputCol=='password'){
                            tmp_desc = "密碼請輸入英數或符號";
                            if (check_str >= 21 && check_str <= 126) {
                                tmp_check = true;
                            }
                        }
                        
                        if (!tmp_check) {
                            data.status = false;
                            data.msg = tmp_desc //'請勿輸入符號或非中英數';
                            break;
                        }
                    }                    
                    
                    // console.log(data);
                    return data;
                }
                var custIdResult = {};
                if (custId != null){
                    custIdResult = checkInput(custId,'custId');
                }
                var userIdResult = {};
                if (userId != null){
                    userIdResult = checkInput(userId,'userId');
                }
                var passwordResult = {};
                if (password != null){
                    passwordResult = checkInput(password,'password');
                }
                
                if (custId == null || custId == "") {
                    MainUiTool.openBioWrong({
                        title: '登入失敗',
                        content: '請輸入身分證字號'
                    });
                } else if (userId == "" || userId == null) {
                    MainUiTool.openBioWrong({
                        title: '登入失敗',
                        content: '請輸入網路連線代號'
                    });
                } else if (password == null || password == "") {
                    MainUiTool.openBioWrong({
                        title: '登入失敗',
                        content: '請輸入密碼'
                    });
                } else if (custId != null && custIdResult.status == false) {
                    // console.log(custId +'***'+ userId +'***'+ password);
                    MainUiTool.openBioWrong({
                        title: '檢核失敗',
                        content: custIdResult.msg //'請重新輸入身分證字號'
                    });
                } else if (userId != null && userIdResult.status == false) {
                    // console.log(custId +'***'+ userId +'***'+ password);
                    MainUiTool.openBioWrong({
                        title: '檢核失敗',
                        content: userIdResult.msg //'請重新輸入網路連線代號'
                    });
                } else if (password != "" && passwordResult.status == false) {
                    // console.log(custId +'***'+ userId +'***'+ password);
                    MainUiTool.openBioWrong({
                        title: '檢核失敗',
                        content: passwordResult.msg //'請重新輸入密碼'
                    });
                } 
                else {
                    $scope.login_disable = true
                        securityServices.digitalEnvelop(password, function (obj) {
                            console.log('success');
                            console.log(obj);
                                var req = {
                                    custId: custId,
                                    userId: userId.toUpperCase(),
                                    password: obj
                                }
                                if (password.length < 8) {
                                    req.lessPwdLength = "Y";
                                }

                            qrCodePayTelegram.send('qrcodePay/f1000101', req, function (obj) {
                                console.log(obj)
                                if (obj != false) {
                                    plugin.tcbb.setF1000101Data(obj, function (res) {
                                        var loginErrorCount = 0;
                                        if(localStorage.getItem("errorCount")=='1'){
                                            HiBiometricAuth.disableBioService(function(result){console.log(result)}, function(result){});
                                        }
                                        localStorage.setItem("errorCount",'0')
                                        
                                        localStorage.setItem("loginErrorCount", loginErrorCount);
                                        if (localStorage.getItem('noSelect') == '1') {
                                            localStorage.setItem("twPay",'0')
		                                    localStorage.setItem("mBank",'0')
                                            $state.go("agreement", {});
                                        } else {
                                            if(localStorage.getItem("errorCount")=='1'){
                                                HiBiometricAuth.disableBioService(function(result){console.log(result)}, function(result){
                                                    $scope.login_disable = false
                                                    console.log(result)
                                                    if(result.ret_code == '1'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '2'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '3'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '4'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"指紋異動"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '5'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '6'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '7'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '10'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"使用者取消驗證"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '11'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過警告次數"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '12'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證超過允許次數"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else if(result.ret_code == '13'){
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                                                    else{
                                                        MainUiTool.openBioWrong({title:'錯誤',content:"系統錯誤"}); 
                                                        $scope.password_login();
                                                        $scope.$apply();
                                                    }
                        
                                                })                   
                                            }
                                            if(localStorage.getItem("errorCount")=='1'){
                                                HiBiometricAuth.disableBioService(function(result){console.log(result)}, function(result){});
                                                
                                            }
                                            localStorage.setItem("errorCount",'0')
                                            localStorage.setItem('bioLogin','0')
                                            localStorage.setItem('passLogin','1')
                                            if (req.lessPwdLength && req.lessPwdLength === "Y") {
                                                framework.alert("密碼限制8-12碼，請修改密碼。", function () {
                                                    plugin.bank.LoginClose(function () {}, function () {});
                                                });

                                            } else {
                                                plugin.bank.LoginClose(function () {}, function () {});
                                            }
                                            localStorage.setItem("twPay",'0')
			                                localStorage.setItem("mBank",'0')
                                        }

                                    }, function (error) {
                                        console.log(error);
                                        $scope.login_disable = false

                                    });

                                    if(localStorage.getItem("loginname") != undefined){
                                        plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'), localStorage.getItem('loginuser')], function(result){
                                            if(custId != result.custId){
                                              localStorage.setItem("defaultType",'')
                                            }
                                        })
                                    }
                                    //console.log(JSON.stringify(obj));
                                    //alert("成功");
					                CelebrusInsertTool.celetbrslnsertClickEvent("login");
                                    CelebrusInsertTool.manualAddTextChange("PersonalEB_ID", "Personal_Bank_login", custId);
                                    CelebrusInsertTool.celetbrslnsertClickEvent("login_ok");
                                    var storage = window.localStorage;
                                    plugin.tcbb.fastAESEncode([$("#login_name").val(), $("#login_user").val()], function(result){
                                        storage.setItem("loginname", result.custId);
                                        storage.setItem("loginuser", result.userId);
                                    })
                                
                                    if (document.getElementById("checkbox_Id").checked == true) {
                                        storage.setItem("isstorename", "yes");
                                    } else {
                                        storage.setItem("isstorename", "");
                                    }
                                    if (document.getElementById("checkbox_User").checked == true) {
                                        storage.setItem("isstoreuser", "yes");
                                    } else {
                                        storage.setItem("isstoreuser", "");
                                    }
                                    if (localStorage.getItem('noSelect') == '1') {
                                        localStorage.setItem("twPay",'0')
		                                localStorage.setItem("mBank",'0')
                                        $state.go("agreement", {});
                                    }
                                } else {
                                        MainUiTool.openBioWrong({
                                            title: '登入失敗',
                                            content: sysCtrl.errorMessage
                                        });
                                        loginErrorCount = loginErrorCount + 1;
                                        localStorage.setItem("loginErrorCount", loginErrorCount);
                                        $scope.password_login();
                                        $scope.$apply();
                                        $scope.login_disable = false

                                
                                }

                            }, function (obj) {
                                console.log('failed');
                                console.log(obj);
                            })



                        }, function (obj) {
                            console.log('failed');
                            console.log(obj);
                        }, userId.toUpperCase(), custId)
                   
                }
            }


        })

})
