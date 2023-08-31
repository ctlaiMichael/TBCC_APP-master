//Added by Ivan 2018.5.24
define([
    'app', 'modules/service/qrcodePay/qrcodePayServices', 'modules/service/qrcodePay/securityServices', 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

    MainApp.register.controller('otpCtrl',
        function (
            $scope,$stateParams, framework, qrcodePayServices, $css, framework, $state, qrCodePayTelegram, securityServices,stringUtil,boundle
        ) {
            $css.add('modules/biometric/otp/otp.css');
             //android實體鍵盤返回鍵
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
            
		}
            
        var t = 301
        var timer = setInterval(function () {
                if(t>0){
                    t -= 1;
                    if(document.getElementById('otp_count') != null){
                        document.getElementById('otp_count').innerHTML = t+"秒";
                    }
                }
                else{
                        　document.getElementById('resend').disabled=false;　
                        　document.getElementById('resend').style.color = "#009274";　
                          clearInterval(timer)
                }
        }, 1000)

            var custId,userId;


            var form = {}
            plugin.tcbb.fastAESDecode([localStorage.getItem('comparename'), localStorage.getItem('compareuser')], function(result){
                custId = result.custId
                userId = result.userId

                form = {
                    custId:result.custId,
                }
                qrcodePayServices.getLoginInfo(function (info) {                
                    localStorage.setItem('cusOtp', '1');
                    securityServices.send('qrcodePay/bi000101', form,{
                        name: 'OTP',
                        key: 'OTP'
                    }, function (res, error) {
                        if (res.hostCode == '0') {
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
    
                    });
                });
            });

        

            

            $scope.resend = function () {
                document.getElementById('resend').disabled=true;　
                document.getElementById('resend').style.color = "gray";
                var t = 301
                var timer = setInterval(function () {
                    if(t>0){
                        t -= 1;
                        if(document.getElementById('otp_count') != null){
                            document.getElementById('otp_count').innerHTML = t+"秒";
                        }
                    }
                    else{
                        　   document.getElementById('resend').disabled=false;　
                        　   document.getElementById('resend').style.color = "#009274";　
                             clearInterval(timer)
                    
                    }
                }, 1000)
                     
                    qrcodePayServices.getLoginInfo(function (info) {                
                        localStorage.setItem('cusOtp', '1');
                        securityServices.send('qrcodePay/bi000101', form,{
                            name: 'OTP',
                            key: 'OTP'
                        }, function (res, error) {
                            console.log(res)
                            if (res) {
                                MainUiTool.openBiometry({title:'台灣Pay交易設定成功',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>下次交易即可以使用指紋/臉部驗證交易</p>"}); 
                            } else {
                                framework.alert(error.respCodeMsg, function () {
                                    qrcodePayServices.closeActivity();
                                });
                            }
        
                        });
                    });
               
                
            }


            $scope.bio_dialog = function () {
                var dialog_success = function (){
                    localStorage.setItem('pay_setting','1');
                    localStorage.setItem("defaultType",JSON.stringify({
                        name: '快速交易',
                        key: 'Biometric'
                    }))
                    $state.go("setting",{});
                    clearInterval(timer)
                }
                var rquId = qrCodePayTelegram.getRquId('qrcodePay/bi000101');
                securityServices.digitalEnvelop($scope.otp_number, function (signedText) {
                    //取得加密內容
                    //alert("signedText" + signedText);
                    // qrcodeTelegramServices.sendTelegram('qrcodePay/fq000105',set_telegram, header, backgroundMode);

                    qrCodePayTelegram.send('qrcodePay/bi000101', form, function (res, error) {
                        console.log(res)
                        if (res.hostCode == 0) {
                            MainUiTool.openBiometry({
                                title: '台灣Pay交易設定成功',
                                content: "<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>下次交易即可以使用指紋/臉部驗證交易</p>"
                                ,success:dialog_success
                            });
                            
                        } else if(error) {
                            framework.alert(error.respCodeMsg, function () {
                                // qrcodePayServices.closeActivity();
                                $scope.clickBack();
                                
                            });
                        }
                        else{
                            MainUiTool.openBioWrong({title:'錯誤',content:res.hostCodeMsg}); 
       
                        }
                    }, {
                        rquId: rquId,
                        SecurityType: '3',
                        SecurityPassword: signedText,
                        Acctoken: localStorage.getItem('accessToken')
                    });

                }, function (error) {
                    //加密失敗
                    framework.alert('加密失敗', function () {
                        errorFunc(error);
                    });

                },userId, custId)
            }


            $scope.clickBack = function () {
                $state.go("setting", {});
                clearInterval(timer)
                localStorage.setItem("mBank",'0')
                localStorage.setItem("twPay",'0')

            }
        })
})
