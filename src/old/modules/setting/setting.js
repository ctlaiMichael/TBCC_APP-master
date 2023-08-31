//Added by Ivan 2018.5.10
define([
    'app', 'modules/service/qrcodePay/qrcodePayServices', 'modules/service/qrcodePay/securityServices'

], function (MainApp) {

    MainApp.register.controller('settingCtrl',
        function (
            $scope, framework, qrcodePayServices, $css, $state, qrCodePayTelegram, $stateParams, stringUtil, securityServices
        ) {
    $css.add('ui/css/setting.css');
    $scope.checkbox = false;
    $scope.checkbox2 = false;
    var element = document.getElementById("setting_body");
    if(element != null){    
        element.removeAttribute("class");
    }
    //android實體鍵盤返回鍵
     document.addEventListener("backbutton", onBackKeyDown, false);
     function onBackKeyDown() {
         
     }
     
     var myFunction = function (e) {

        console.log('event get');

        if(localStorage.getItem('pay_setting')=='0'){
            $scope.checkbox2 = false;
            $scope.$apply()
        } 

        window.removeEventListener("build", myFunction);
    }

    window.addEventListener('build', myFunction);

   
            

            
            var req = {}
            var form = {}

            setTimeout(function () {

                    if (localStorage.getItem('login_setting') == '1') {
                        $scope.checkbox = true;
                        $scope.$apply()

                    }
                   
                    if (localStorage.getItem('pay_setting') == '1') {
                        $scope.checkbox2 = true;
                        $scope.$apply()
                    }
            
                   
                    if (localStorage.getItem('loginname') != localStorage.getItem('comparename') && localStorage.getItem('loginuser') != localStorage.getItem('compareuser')) {
                        $scope.checkbox = false;
                        $scope.checkbox2 = false;
                        $scope.$apply()
                    }
                    $scope.$apply()

            },100)

                    plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'),localStorage.getItem('loginuser')], function(loginResult){

                        plugin.tcbb.fastAESDecode([localStorage.getItem('comparename'), localStorage.getItem('compareuser')], function(compareResult){
                    req = {
                        //functionType 0(解除註冊)
                        custId: compareResult.custId,
                        userId: compareResult.userId.toUpperCase(),
                        token:  localStorage.getItem('token'),
                        functionType: "0"
                    }
                    form = {
                        //functionType 2(解除交易啟用)
                        custId: compareResult.custId,
                        userId: compareResult.userId.toUpperCase(),
                        token: '',
                        functionType: "2"
        
                    }
                });
            })
            

            

            $scope.goAgree = function () {
                //取得生物辨識裝態
                HiBiometricAuth.getBiometricStatus(function (result) {
                    //取得成功
                    if (result.ret_code == 0) {
                        var dialog_success = function () {
                            localStorage.setItem('flag','1')
                            HiBiometricAuth.identifyByBiometric(function (res) {
                                if (res.ret_code == '0') {
                                    qrcodePayServices.getLoginInfo(function (info) {
                                        var securityTypes = [];
                                        var defaultTypes;
                                       
                                        if (info.AuthType.indexOf('2') > -1) {
                                            var cnEndDate = stringUtil.formatDate(info.cnEndDate);
                                            var todayDate = stringUtil.formatDate(new Date());
                                            if (info.cn == null || info.cn == '' || stringUtil.compareDate(todayDate, cnEndDate) == -1) {} else {
                                                securityTypes.push({
                                                    name: '憑證',
                                                    key: 'NONSET'
                                                });
                                                defaultTypes = {
                                                    name: '憑證',
                                                    key: 'NONSET'
                                                }
                                            }
        
                                        }
                                        if (info.AuthType.indexOf('3') > -1) {
                                            if (info.BoundID == 4 && info.OTPID == 2 && info.AuthStatus == 0 && info.PwdStatus == 0) {
                                                securityTypes.push({
                                                    name: 'OTP',
                                                    key: 'OTP'
                                                });
                                                defaultTypes = {
                                                    name: 'OTP',
                                                    key: 'OTP'
                                                }
                                            }
        
        
                                        }
                                        if (securityTypes.length == 0) {
                                            MainUiTool.openBioWrong({
                                                title: '錯誤',
                                                content: "您無可用的安控機制"
                                            });
                                            $scope.checkbox2 = false;
                                            localStorage.setItem("pay_setting", '0');
                                        } else if (securityTypes.length == 1) {
                                            if (defaultTypes.name == '憑證') {
                                                localStorage.setItem('cusOtp', '0');
                                                securityServices.send('qrcodePay/bi000101', form, {
                                                    name: '憑證',
                                                    key: 'NONSET'
                                                }, function (res, error) {
                                                    if (res.hostCode == 0) {
                                                        MainUiTool.openBiometry({
                                                            title: '台灣Pay交易設定成功',
                                                            content: "<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>下次交易即可以使用指紋/臉部驗證交易</p>"
                                                        });
                                                        localStorage.setItem('pay_setting', '1');
                                                        localStorage.setItem("defaultType",JSON.stringify({
                                                            name: '快速交易',
                                                            key: 'Biometric'
                                                        }))
                                                    } else if(error) {
                                                        framework.alert(error.respCodeMsg, function () {
                                                            // qrcodePayServices.closeActivity();
                                                            $scope.clickBack();
                                                            
                                                        });
                                                    }
                                                    else{
                                                        MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                                   
                                                    }
                                                })
                                               
                                            } 
                                            else {
                                                $state.go("otp", {});
                                            }
                                        } else if (securityTypes.length == 2) {
                                            $state.go("otp", {});
                                        }
                                    });
                                    
                                }
                               
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
                                $scope.checkbox2 = false;
                                localStorage.setItem("pay_setting", '0');
                                $scope.$apply()
        
                            },"請將您的指紋置於感應區域上")
                            
                        }
                        function dialog_cancel() {
                            $scope.checkbox2 = false;
                            localStorage.setItem("pay_setting", '0');
                            $scope.$apply()
                        }
        
                        localStorage.setItem('fromSetting', '1');
                 if (localStorage.getItem('login_setting') == '1' && (localStorage.getItem('pay_setting') == '0' || localStorage.getItem('pay_setting') == null)) {
                    //開啟生物辨識登入
                    plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'),localStorage.getItem('loginuser')], function(loginResult){
                        plugin.tcbb.fastAESDecode([localStorage.getItem('comparename'), localStorage.getItem('compareuser')], function(compareResult){
                        
                            if (loginResult.custId != compareResult.custId && loginResult.userId != compareResult.userId) {
                                if (document.getElementById("setting_biometric").checked == true) {
                                MainUiTool.openBiometricConfirm({
                                        title: '快速登入設定',
                                        content: "已有其他帳號註冊過生物辨識快速登入的功能，若您要註冊目前該帳號的生物辨識快速登入的功能，原有帳號需重新註冊啟用生物辨識快速登入的功能。",
                                        success: success,
                                        cancel: cancel
                                });
                                function success(){
                                    // var req = {
                                    //     custId: compareResult.custId,
                                    //     userId: compareResult.userId.toUpperCase(),
                                    //     token: localStorage.getItem('token'),
                                    //     functionType: "0"
                                    // }
                                    // HiBiometricAuth.disableBioService(function(result){
                                    // }, function(result){})
                                    // qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                    //     if(obj.hostCode == 0){
                                    //         localStorage.setItem("bioLogin",'0')
                                    //         localStorage.setItem("login_setting",'0')
                                    //         localStorage.setItem('fromFirst', '1');
                                    //         localStorage.setItem('fromPay', '0');
                                    //         localStorage.setItem('fromBoth', '0');
                                    //         $state.go("agreement", {});
                                    //     }
                                    //     else{
                                    //         MainUiTool.openBioWrong({title:'錯誤',content:obj.hostCodeMsg}); 
                       
                                    //     }
        
                                    // })
                                    $state.go("agreement", {});
                                    
                                }
                                function cancel(){
                                    $scope.checkbox = false;
                                    $scope.$apply()
                                }
                                
                                
                            }
                            if (document.getElementById("setting_pay").checked == true) {
                                MainUiTool.openBioWrong({
                                    title: '錯誤',
                                    content: "請先進行快速登入設定"
                                });
                                $scope.checkbox2 = false;
                                localStorage.setItem("pay_setting", '0');
                                $scope.$apply()
                            }
                        }
                            if (document.getElementById("setting_biometric").checked == false) {
                                //關閉快速登入
                                $scope.checkbox = false;
                                localStorage.setItem("login_setting", '0');
                                qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                    //alert(obj['bi0:hostCodeMsg']);
                                    if(obj.hostCode == 0){
                                            HiBiometricAuth.disableBioService(function (result) {
                                                localStorage.setItem('bioLogin', '0')
                                                localStorage.setItem('passLogin', '1')
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
                                    else{
                                        MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                   
                                    }
                                })
                            }
                            if (document.getElementById("setting_pay").checked == true) {
                                //開啟快速交易
                                localStorage.setItem('fromPay', '1');
                                localStorage.setItem('fromFirst', '0');
                                localStorage.setItem('fromBoth', '0');
                                MainUiTool.openBiometricConfirm({
                                    title: '台灣Pay交易設定',
                                    content: "您將啟用指紋/臉部辨識功能作為台灣Pay交易驗證",
                                    success: dialog_success,
                                    cancel: dialog_cancel
                                });
                                     
                            }
                        
                        
                        
                        })
                    })
                            
                            
                            
                           
                            
                        } else if (localStorage.getItem('login_setting') == '1' && localStorage.getItem('pay_setting') == '1') {
                            //有設定過快速
                            plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'),localStorage.getItem('loginuser')], function(loginResult){
        
                                plugin.tcbb.fastAESDecode([localStorage.getItem('comparename'), localStorage.getItem('compareuser')], function(compareResult){
                                    if (loginResult.custId != compareResult.custId && loginResult.userId != compareResult.userId) {
                                        if (document.getElementById("setting_biometric").checked == true) {
                                        MainUiTool.openBiometricConfirm({
                                                title: '快速登入設定',
                                                content: "已有其他帳號註冊過生物辨識快速登入的功能，若您要註冊目前該帳號的生物辨識快速登入的功能，原有帳號需重新註冊啟用生物辨識快速登入的功能。",
                                                success: success,
                                                cancel: cancel
                                        });
                                        function success(){
                                            // var req = {
                                            //     custId: compareResult.custId,
                                            //     userId: compareResult.userId.toUpperCase(),
                                            //     token: localStorage.getItem('token'),
                                            //     functionType: "0"
                                            // }
                                            // HiBiometricAuth.disableBioService(function(result){
                                            // }, function(result){})
                                            // qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                            //     if(obj.hostCode == 0){
                                            //         localStorage.setItem("bioLogin",'0')
                                            //         localStorage.setItem("login_setting",'0')
                                            //         localStorage.setItem('fromFirst', '1');
                                            //         localStorage.setItem('fromPay', '0');
                                            //         localStorage.setItem('fromBoth', '0');
                                            //         $state.go("agreement", {});
                                            //     }
                                            //     else{
                                            //         MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                               
                                            //     }
                                            // })
                                            $state.go("agreement", {});

                                            
                                        }
                                        function cancel(){
                                            $scope.checkbox = false;
                                            $scope.$apply()
                                        }
                                        
                                        
                                    }
                                    if (document.getElementById("setting_pay").checked == true) {
                                        MainUiTool.openBioWrong({
                                            title: '錯誤',
                                            content: "請先進行快速登入設定"
                                        });
                                        $scope.checkbox2 = false;
                                        localStorage.setItem("pay_setting", '0');
                                        $scope.$apply()
                                    }
                                }
                                    // 取消快速登入
                                    if (document.getElementById("setting_biometric").checked == false && document.getElementById("setting_pay").checked == false) {
                                        $scope.checkbox = false;
                                        localStorage.setItem("login_setting", '0');
                                        qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                            if(obj.hostCode == 0){
                                                HiBiometricAuth.disableBioService(function (result) {
                                                    localStorage.setItem('bioLogin', '0')
                                                    localStorage.setItem('passLogin', '1')
                                                    $scope.checkbox2 = false;
                                                    localStorage.setItem("pay_setting", '0');
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
                                            else{
                                                MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                           
                                            }
                                        })
                
                                    }
                                    // 取消快速登入並取消快速交易
                                    if(document.getElementById("setting_biometric").checked == false && document.getElementById("setting_pay").checked == true){
                                        qrCodePayTelegram.send('qrcodePay/bi000100', form, function (res, error) {
                                            console.log(res)
                                            if (res.hostCode == 0) {
                                                $scope.checkbox2 = false;
                                                localStorage.setItem("pay_setting", '0');
                                                localStorage.setItem("defaultType","");
                                                $scope.checkbox = false;
                                                localStorage.setItem("login_setting", '0');
                                                qrCodePayTelegram.send('qrcodePay/bi000100', req, function (obj) {
                                                    if(obj.hostCode == 0){
                                                        HiBiometricAuth.disableBioService(function (result) {
                                                            localStorage.setItem('bioLogin', '0');
                                                            localStorage.setItem('passLogin', '1');
                                                            localStorage.setItem("pay_setting", '0');
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
                                                    else{
                                                        MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                                
                                                    }
                                                });
                                            } else if(error) {
                                                console.log(error)
                                            }
                                            else{
                                                MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                           
                                            }
                                        })
                                    }
                                    //取消快速交易
                                    if (document.getElementById("setting_biometric").checked == true && document.getElementById("setting_pay").checked == false) {
                                        // qrCodePayTelegram.send('qrcodePay/bi000101', form, function (res, error) {
                                        //     if(res){
                                        //         $scope.checkbox2 = false;
                                        //         localStorage.setItem("pay_setting",'0'); 
                                        //     }
                                        // })
                                        qrCodePayTelegram.send('qrcodePay/bi000100', form, function (res, error) {
                                            console.log(res)
                                            if (res.hostCode == 0) {
                                                $scope.checkbox2 = false;
                                                localStorage.setItem("pay_setting", '0');
                                                localStorage.setItem("defaultType","")
                                            } else if(error) {
                                                console.log(error)
                                            }
                                            else{
                                                MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
                           
                                            }
                                        })
                
                                    }
                                })
                            })        
                            
                            
                        }
                         else {                
                                    if (document.getElementById("setting_biometric").checked == true) {
                                        localStorage.setItem('fromFirst', '1');
                                        localStorage.setItem('fromPay', '0');
                                        localStorage.setItem('fromBoth', '0');
                                        $state.go("agreement", {});
                                    }
                                    if (document.getElementById("setting_pay").checked == true) {
                                        MainUiTool.openBioWrong({
                                            title: '錯誤',
                                            content: "請先進行快速登入設定"
                                        });
                                        $scope.checkbox2 = false;
                                        localStorage.setItem("pay_setting", '0');
                                        $scope.$apply()
                                    }
                            
                        }
                    //取得裝態電文錯誤
                    } else if (result.ret_code == 1) {
                        MainUiTool.openBioWrong({
                            title: "錯誤",
                            content: "您的設備尚未設定生物辨識"
                        })
                        $scope.checkbox = false;
                        $scope.$apply();
                    } else {
                        MainUiTool.openBioWrong({
                            title: "錯誤",
                            content: "您的設備不支援快速登入(指紋/臉部)功能"
                        })
                        $scope.checkbox = false;
                        $scope.$apply();
                    }
                }, function (result) {
                    //錯誤代碼對應提示
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
                        $scope.checkbox = false;
                        $scope.$apply();
                    } else {
                        MainUiTool.openBioWrong({
                            title: "錯誤",
                            content: "您的設備不支援快速登入(指紋/臉部)功能"
                        })
                        $scope.checkbox = false;
                        $scope.$apply();
                    }
                })

            }

            $scope.clickBack = function () {
                // plugin.tcbb.returnHome(function(){} ,function(){});

                // plugin.bank.LoginClose(function(){} ,function(){});
                if (sessionStorage.getItem("goFromTaiwanpay") == "1") {
                    qrcodePayServices.closeActivity();
                } else {
                    plugin.bank.LoginClose(function () {}, function () {});
                }


            }

        })
})