//Added by Ivan 2018.5.24
define([
    'app', 'modules/service/qrcodePay/qrcodePayServices', 'modules/service/qrcodePay/securityServices', 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

    MainApp.register.controller('otpCardBindingCtrl',
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


            
            var method = boundle.getData('cardTxnType');
            var card = boundle.getData('cardInfo');
            var form2 = { };
            qrcodePayServices.getLoginInfo(function (info) { 
                custId = info.custId
                userId = info.userId
                    form2.custId = custId;
                if(method == "B"){//綁定卡片：B
                    form2.txnType = "B";
                    form2.cardNo = card.cardNo;
                    form2.cardType = card.cardType;
                    form2.expiredDate = card.expiredDate;
                    form2.checkId = card.checkId;
                    
                }else if(method == "S"){//設定預設卡片：S
                    form2.txnType = "S";
                    form2.defaultCreditCard = card.cardNo;

                }else if(method == "D"){//解除綁定卡片  D
                    form2.txnType = "D";
                    form2.cardNo = card.cardNo;
                    form2.defaultCreditCard = card.cardNo;
                }else if(method == "A"){
                    form2.txnType = "A";
                    form2.cardNo = card.cardNo;
                    form2.cardType = card.cardType;
                    form2.expiredDate = card.expiredDate;
                    form2.checkId = card.checkId;
                    form2.defaultCreditCard = card.cardNo;
                }
                qrcodePayServices.getLoginInfo(function (info) {                
                    localStorage.setItem('cusOtp', '1');
                    securityServices.send('qrcodePay/fq000113', form2,{
                        name: 'OTP',
                        key: 'OTP'
                    }, function (res, error) {
                        if (res) {
                            var params={
                                result : res
                            }
                            //綁定成功
                            console.log('res:'+ res);
                            $state.go("cardBinding",params, {});
                        } else {
                            framework.alert(resultHeader.respCodeMsg, function () {
                                framework.closeEmbedQRCodeReader(function(){
                                    qrcodePayServices.closeActivity();
                                });
                                return;
                            });
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
                        securityServices.send('qrcodePay/fq000113', form2,{
                            name: 'OTP',
                            key: 'OTP'
                        }, function (res, error) {
                            console.log(res)
                            if (res) {
                                var params={
                                    result : res
                                }     
                                //綁定成功
                                console.log('res:'+ res);
                                $state.go("cardBinding",params, {});
                            } else {
                                framework.alert(resultHeader.respCodeMsg, function () {
                                    framework.closeEmbedQRCodeReader(function(){
                                        qrcodePayServices.closeActivity();
                                    });
                                    return;
                                });
                            }
        
                        });
                    });
            }

            $scope.clickBinding = function () {
                var rquId = qrCodePayTelegram.getRquId('qrcodePay/fq000113');
                securityServices.digitalEnvelop($scope.otp_number, function (signedText) {
                    qrCodePayTelegram.send('qrcodePay/fq000113', form2, function (res, resultHeader) {
                        if(res.result!='0'){
                            framework.alert(error.respCodeMsg, function () {
                                $scope.clickBackCard();
                            });
                        }
                        
                        if (res) {
                            var params={
                                result : res
                            }
                                          
                            //綁定成功
                            console.log('res:'+ res);
                            $state.go("cardBinding",params, {});
                            
    
                        } else {
                            framework.alert(resultHeader.respCodeMsg, function () {
                                framework.closeEmbedQRCodeReader(function(){
                                    qrcodePayServices.closeActivity();
                                });
                                return;
                            });
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



            $scope.clickBackCard = function () {
                $state.go("cardAdd", {});
                clearInterval(timer)

            }

        })
})