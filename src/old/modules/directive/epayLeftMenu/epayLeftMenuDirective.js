/**
 * [epayLeftMenuDirective] epay左側隱藏式選單
 */
define([
    'app'
    ,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/service/qrcodePay/securityServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
	,'modules/service/common/openAppUrlServices'
], function (MainApp) {
    MainApp.register.directive('epayLeftMenuDirective', function (
        $state, $rootScope, $compile
        , framework, stringUtil, $timeout
        ,qrcodePayServices
        ,securityServices
        ,qrCodePayTelegram
        ,openAppUrlServices
    ) {
        var linkFun = function ($scope, iElm, iAttrs, controller) {
            //==參數設定==//
            var epayScreenOk = function(res) {
                // console.log('epayScreenOk:'+JSON.stringify(res));
            }
            var epayScreenNg = function(res) {
                // console.log('epayScreenNg:'+JSON.stringify(res));
            }

            //android實體鍵盤返回鍵
            document.addEventListener("backbutton", onBackKeyDown, false);
            function onBackKeyDown() {
                console.log("");
            }
            var qrcodePayStores_URL = "https://www.taiwanpay.com.tw/content/info/use.aspx";
            $scope.menu = [
                {
                    url:"backTomainPage",
                    name:"登出"
                },
                {
                    url:"qrcodePayScanNew",
                    name:"掃描QRCode"
                },
                {
                    url:"qrcodePayBeScanShow",
                    name:"出示付款碼"
                },
                {
                    url:"qrcodeGetBeScanEdit",
                    name:"出示收款碼"
                },
                {
                    url:"referenceEdit",
                    name:"推薦人設定"
                },
                {
                    url:"qrcodePayTerms",
                    name:"開通SmartPay使用條款/設定帳號"
                },
                {
                    url:"cardAdd",
                    name:"信用卡新增/變更預設"
                },
                {
                    url:"qrcodePayStores",
                    name:"台灣Pay消費據點查詢"
                },
                {
                    url:"getBarcodeShow",
                    name:"發票載具號碼"
                },
                {
                    url:"transQueryTerms",
                    name:"交易紀錄/退貨"
                },
                {
                    url:"setting",
                    name:"快速登入/交易設定"
                },
                {
                    url:"backToTWPay",
                    name:"合庫E Pay"
                },
                {
                    url:"backTomBank",
                    name:"行動網銀"
                }
            ];


            //判斷轉帳機制種類的數量
            var hasSecurityType = function(securityTypes){
                if (securityTypes.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }

            var noSecurityAlert = function() {
                if ($scope.nowScreen == "qrcodePayScanNew") {
                    framework.closeEmbedQRCodeReader(function(){});
                }
                framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
                    $scope.clickMenuList(false);
                    if ($scope.nowScreen == "qrcodePayBeScanShow"){
                        if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
                            framework.enabledScreenshotPrevention(epayScreenOk,epayScreenNg);
                        }
                    }
					qrcodePayServices.closeActivity();
				});
            }

            

            //click item
            $scope.clickGO = function (goTarget) {
                // alert("now:"+ $scope.nowScreen + ' \n go:'+ goTarget);

                //特殊判斷
                var specialCheck = function() { 
                    if ($scope.nowScreen == "qrcodePayBeScanShow" && goTarget != 'qrcodePayBeScanShow') {
                        clearInterval($scope.interval); //結束限制三分鐘後離開頁面
                        $timeout.cancel($scope.mytimeout); //結束倒數秒數
                        if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
                            framework.enabledScreenshotPrevention(epayScreenOk,epayScreenNg);
                        }
                    }
                    if ($scope.nowScreen == "qrcodePayScanNew" && goTarget != 'qrcodePayScanNew') {
                        if (goTarget != 'qrcodePayBeScanShow') {
                            framework.closeEmbedQRCodeReader(function(){});
                        }
                    }
                }

                //登出
                if (goTarget=='backTomainPage') {
                    qrcodePayServices.logout(specialCheck);
                    return;
                }

                //行動網銀
                if (goTarget=='backTomBank') {
                    if(localStorage.getItem("mBank")!='1'){
                        specialCheck();
                        framework.mainPage();
						plugin.main.mobliebank(function () { }, function () { });
					}
                    return;
                }

                //特殊判斷
                specialCheck();
                
                //轉帳機制
                var securityTypesLeftMenu = [];          
                qrcodePayServices.getLoginInfo(function(res){
                    $scope.tempCustid = res.custId;
                    
                    if (localStorage.getItem('pay_setting') == '1' && (localStorage.getItem("loginname") == localStorage.getItem("comparename"))){
                        securityTypesLeftMenu.push({name:'快速交易', key:'Biometric'});
                    }
                    if ( res.AuthType.indexOf('2') > -1 ){
                        var cnEndDate = stringUtil.formatDate(res.cnEndDate);
                        var todayDate = stringUtil.formatDate(new Date());
                        if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
                        }else{
                            securityTypesLeftMenu.push({name:'憑證', key:'NONSET'});
                        }
                    } 
                    if (res.AuthType.indexOf('3') > -1){
                        if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
                            securityTypesLeftMenu.push({name:'OTP', key:'OTP'});	
                        }
                    }


                    //掃描QRCode
                    //temp
                    if (goTarget=='qrcodePay') {
                        $scope.clickMenuList(false);
                        if ($scope.nowScreen == "qrcodePayScanNew") {
                            return;
                        }
                        if (!hasSecurityType(securityTypesLeftMenu)) {
                            noSecurityAlert();
                            return;
                        }
                        $state.go(goTarget, {},{location: 'replace'});
                        return;
                    }
                    if (goTarget=='qrcodePayScanNew') {
                        $scope.clickMenuList(false);
                        if (!hasSecurityType(securityTypesLeftMenu)) {
                            noSecurityAlert();
                            return;
                        }
                        $state.go(goTarget, {},{location: 'replace'});
                        return;
                    }
                    if (goTarget=='cardAdd') {
                        qrcodePayServices.getLoginInfo(function(res){
                            var securityTypes = [];
                            if ( res.AuthType.indexOf('2') > -1 ){
                                var cnEndDate = stringUtil.formatDate(res.cnEndDate);
                                var todayDate = stringUtil.formatDate(new Date());
                                if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
                                }else{
                                    securityTypes.push({name:'憑證', key:'NONSET'});
                                }
                            } 
                            if (res.AuthType.indexOf('3') > -1){
                                if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
                                    securityTypes.push({name:'OTP', key:'OTP'});	
                                }
                            }
                            // 確認securityTypes是否有轉帳機制可以用
                            if (hasSecurityType(securityTypes)) {
                                goTarget='qrcodePayCardTerms';
                                $state.go(goTarget,{});
                            }else {
                                framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
                                    qrcodePayServices.closeActivity();
                                });
                            }
                        });
                        // $state.go(url,{});
                        return;
                    }
                    //出示付款碼
                    if (goTarget == 'qrcodePayBeScanShow') {
                        $scope.clickMenuList(false);
                        if ($scope.nowScreen == "qrcodePayBeScanShow") {
                            return;
                        }
                        if (!hasSecurityType(securityTypesLeftMenu)) {
                            noSecurityAlert();
                            return;
                        }
                        
                        clearInterval($scope.interval); //結束限制三分鐘後離開頁面
                        $timeout.cancel($scope.mytimeout); //結束倒數秒數
                        //安控
                        if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != ""){
                            $scope.defaultSecurityTypeLeftMenu = JSON.parse(localStorage.getItem('defaultType'))
                        }else{
                            $scope.defaultSecurityTypeLeftMenu = securityTypesLeftMenu[0];
                        }
                        // console.log(JSON.stringify($scope.defaultSecurityTypeLeftMenu));

                        var form = { txnType: 'T' };
                        form.custId = $scope.tempCustid;
                        // console.log(JSON.stringify(form));
                        qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res, resultHeader) {
                            // console.log(JSON.stringify(res));
                            // console.log(JSON.stringify(resultHeader));
                            if (res) {
                                if (typeof res.defaultTrnsOutAcct == "undefined" || res.defaultTrnsOutAcct == "") {
                                    framework.alert('取得預設轉出帳號失敗!', function () {return;});
                                } else {
                                    var form302 = {};
                                    form302.custId = $scope.tempCustid;
                                    form302.trnsfrOutAcct = res.defaultTrnsOutAcct;
                                    form302.trnsToken = "";
                                    // console.log(JSON.stringify(form302));
                                    securityServices.send('qrcodePay/fq000302', form302, $scope.defaultSecurityTypeLeftMenu, function (res, error) {
                                        // console.log(JSON.stringify(res));
                                        // console.log(JSON.stringify(error));
                                        if (res) {
                                            // console.log($scope.nowScreen);
                                            if ($scope.nowScreen == "qrcodePayScanNew") {
                                                framework.closeEmbedQRCodeReader(function(){
                                                    $state.go('qrcodePayBeScanShow', { result: res },{location: 'replace'});
                                                });
                                            }else {
                                                $state.go('qrcodePayBeScanShow', { result: res },{location: 'replace'});
                                            }
                                        } else {
                                            framework.alert(error.respCodeMsg, function () {
                                                framework.closeEmbedQRCodeReader(function(){
                                                    qrcodePayServices.closeActivity();
                                                });
                                                return;
                                            });
                                        }
                                    });
                                }
                            } else {
                                framework.alert(resultHeader.respCodeMsg, function () {
                                    framework.closeEmbedQRCodeReader(function(){
                                        qrcodePayServices.closeActivity();
                                    });
                                    return;
                                });
                            }
                        }, null, false);
                    } 
                    //推薦人設定
                    if (goTarget == "referenceEdit") {
                        if (!hasSecurityType(securityTypesLeftMenu)) {
                            noSecurityAlert();
                            return;
                        }
                        $scope.clickMenuList(false);
                        var form = {};
                        form.custId = $scope.tempCustid;
                        qrCodePayTelegram.send('qrcodePay/fq000109', form, function (res) {
                            if (res) {
                                var params = {result:res};
                                $state.go(goTarget,params,{location: 'replace'});
                            } 
                        }, null, false);
                    } 
                    //回合庫E pay
                    if (goTarget == 'backToTWPay') {
                        $scope.clickMenuList(false);
                        qrcodePayServices.closeActivity();
                        return;
                    } 
                    //台灣Pay消費據點查詢
                    if (goTarget == 'qrcodePayStores') {
                        $scope.clickMenuList(false);
                        openAppUrlServices.openWeb(qrcodePayStores_URL); 
                        qrcodePayServices.closeActivity();
                        return;
                    } 
                    //快速登入/交易設定
                    if (goTarget =='setting'){  
                        $scope.clickMenuList(false);
                        localStorage.setItem("goFromTaiwanpay","1");
                        $state.go(goTarget, {},{location: 'replace'});
                        return;
                    }
                    //開通SmartPay使用條款/設定帳號,發票載具號碼,交易紀錄/退貨,出示收款碼
                    if (goTarget =='qrcodePayTerms' || goTarget =='getBarcodeShow' || goTarget =='getBarcodeTerm' || goTarget =='transQueryTerms' || goTarget =='qrcodeGetBeScanEdit'){  
                        $scope.clickMenuList(false);
                        $state.go(goTarget, {},{location: 'replace'});
                        return;
                    }

                });
                
                
            }


            $scope.clickMenuList = function (show) {
                $scope.onepayLeftMenu = show;
            }

            


        };
        return {
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            replace: false,
            templateUrl: 'modules/directive/epayLeftMenu/epayLeftMenu.html',
            link: linkFun
        };
    });
    //=====[epayLeftMenuDirective END]=====//

});
