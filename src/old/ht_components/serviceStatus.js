angular.module('serviceStatus', [])
.service('errorHandler', function($rootScope, $log, i18n) {

    var mainClass = this;

    this.showMsg = function(msg){
        MainUiTool.openDialog(msg);
    }

    this.ShowSendPostError = function (msg, tag) {
        $log.debug(msg);
        var errormsg = '';
        if (i18n.getStringByTag(msg.result) != null && i18n.getStringByTag(msg.result) != '') {
            errormsg = i18n.getStringByTag(msg.result);
            mainClass.showMsg(errormsg);
        } else {
            mainClass.showMsg(i18n.getStringByTag(tag));
        }
    };

    this.ShowSendPostFail = function (msg) {
        $log.debug(msg);
        var failmsg = '';
        if (i18n.getStringByTag(msg.result) != null && i18n.getStringByTag(msg.result) != '') {
            failmsg = i18n.getStringByTag(msg.result);
            mainClass.showMsg(failmsg);
        } else {
            mainClass.showMsg('FAIL');
        }
    };

    this.GenerateOTPErrorCallback = function (jsonObj) {
        var msg = i18n.getStringByTag('OTP_GENERATE_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']';
        mainClass.showMsg(msg);
    }

    this.SHA1ErrorCallback = function (jsonObj) {
        var msg = i18n.getStringByTag('PASSWORD_SHA1_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']';
        mainClass.showMsg(msg);
    };

    this.BASE64ErrorCallback = function (jsonObj) {
        var msg = i18n.getStringByTag('PASSWORD_BASE64_ENCODE_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']';
        mainClass.showMsg(msg);
    };

    this.SetSeedSuccessCallback = function (jsonObj) {
        $log.debug("Set OTP Success");
    };

    this.SetSeedErrorCallback = function (jsonObj) {
        var msg = i18n.getStringByTag('OTP_SET_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']';
        mainClass.showMsg(msg);
    };

    this.QuerySeedErrorCallback = function (jsonObj) {
        var msg = i18n.getStringByTag('OTP_QUERY_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']';
        mainClass.showMsg(msg);
    };

    this.UpdateSeedErrorCallback = function (jsonObj) {
        var msg = i18n.getStringByTag('OTP_UPDATE_ERROR')
            + '[' + jsonObj.error + ':' + jsonObj.message + ']';
        mainClass.showMsg(msg);
    };

})
.service('serviceStatus', function ($rootScope, $log, telegram, i18n, errorHandler,framework,$http, sysCtrl) {
        var self = this;
        this.serverReady = false; // !!sessionStorage.temp_hitrust_auth && !!sessionStorage.temp_auth_token;

        //==參數設定==//
        var DebugMode = framework.getConfig("OFFLINE", 'B');
        var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

        var register_function = framework.getConfig("REGISTER");
        var handShake_function = framework.getConfig("HAND_SHAKE");
        var exchangeKey_function = framework.getConfig("EXCHANGE_KEY");
        var crypto_enable = framework.getConfig("CRYPTO", 'B');
        var about_version = framework.getAbout('Release');
        var use_internel_publickey = framework.getConfig('USE_INTERNEL_PUBLIC_KEY', 'B');

        var checkServer_cb = {};
        var checkServer_error = function(res){};

        var checkServerFail = function (res) {
            var msg = '';
            if (typeof res.result != 'undefined') {
                msg = ':'+res.result;
            }
            errorHandler.showMsg('Register Fail' + msg);
            self.serverReady = false;
            checkServer_error(res);
        };
        var error = function (res) {
            var msg = '';
            if (typeof res.result != 'undefined') {
                msg = ':'+res.result;
            }
            errorHandler.showMsg('Register Error' + msg);
            self.serverReady = false;
            checkServer_error(res);
        };

        var initEnvFinished = function (res) {
            self.serverReady = true;
            checkServer_cb(res);
        };

        var rehandshakeTimeOut = function(){
            $log.debug('session timeout!');
            self.serverReady = false;
            telegram.deleteSession();
        }

        var checkExchangeKeySuccess = function (res) {
            if (res.result == 0) {
                var otpEnable = framework.getConfig("OTP_ENABLE", 'B');
                //取得binding count 與 offline otp seed
                if(otpEnable){
                    if (res.data.para_seed != undefined || res.data.Para_seed != undefined) {
                        plugin.otp.setDeviceSeed(res.data.para_seed,
                            errorHandler.SetSeedSuccessCallback, errorHandler.SetSeedErrorCallback);
                    } else {
                        plugin.otp.queryDeviceSeed(queryDeviceSeedSuccessCallBack, errorHandler.QuerySeedErrorCallback);
                    }
                }
                self.serverReady = true;
                //通知listener 與server間的通訊環境已建立
                checkServer_cb(res);
                sysCtrl.handShakeTimer.doHandShakeAs(rehandshakeTimeOut);
            } else {
                $log.debug(res);
                self.serverReady = false;
                var er_msg = '';
                if (typeof res.msg != 'undefined') {
                    er_msg = ':'+res.msg;
                }
                errorHandler.showMsg(i18n.getStringByTag('SERVICE_STOP') +  er_msg);
                $log.debug('SERVICE_STOP:checkExchangeKeySuccess');
            }
        };

        function queryDeviceSeedSuccessCallBack(jsonObj) {
            if (jsonObj.value == false) {
                var success = function (msg) {
                    $log.debug(msg);
                    plugin.otp.setDeviceSeed(msg.data.para1,
                        errorHandler.SetSeedSuccessCallback, errorHandler.SetSeedErrorCallback);
                }
                var error = function (msg) {
                    $log.debug(msg);
                }
                var fail = function (msg) {
                    $log.debug(msg);
                }
                telegram.get('/rest/app/otp/getoffline', success, error, fail);
            }
        }

        var checkHandShakeSuccess = function (res) {
            if (res.result == 0) {
                if(use_internel_publickey){
                    plugin.crypto.ExchangeKeyEx(function (jsonObj) {
                        var sendObj = {};
                        sendObj.para1 = jsonObj.value;

                        //將session Key丟回給server
                        telegram.sendJson(exchangeKey_function, sendObj, checkExchangeKeySuccess, error, checkServerFail);

                    }, function () {

                    });
                }else{
                    plugin.crypto.ExchangeKey(res.data.para_key, function (jsonObj) {
                        var sendObj = {};
                        sendObj.para1 = jsonObj.value;

                        //將session Key丟回給server
                        telegram.sendJson(exchangeKey_function, sendObj, checkExchangeKeySuccess, error, checkServerFail);

                    }, function () {

                    });
                }
            } else {
                self.serverReady = false;
                var er_msg = '';
                if (typeof res.msg != 'undefined') {
                    er_msg = ':'+res.msg;
                }
                errorHandler.showMsg(i18n.getStringByTag('SERVICE_STOP') +  er_msg);
                $log.debug('SERVICE_STOP:checkHandShakeSuccess');
            }
        };

        var checkServerSuccess = function (res) {
            if (res.result == 0) {

                plugin.crypto.Handshake(res.data, function (jsonObj) {
                    $log.debug("Handshake" + JSON.stringify(jsonObj));
                    var sendObj = JSON.parse(jsonObj.value);

                    telegram.sendJson(handShake_function, sendObj, checkHandShakeSuccess, error, checkServerFail);

                }, function (jsonObj) {

                });
            } else {
                self.serverReady = false;
                var er_msg = '';
                if (typeof res.msg != 'undefined') {
                    er_msg = ':'+res.msg;
                }
                errorHandler.showMsg(i18n.getStringByTag('SERVICE_STOP') +  er_msg);
                $log.debug('SERVICE_STOP:checkServerSuccess');
            }

        };

        this.checkServer = function (onSuccess,onError) {
            if(typeof onError === 'function'){
                checkServer_error = onError;
            }
            checkServer_cb = onSuccess;

            //  Austin Test
            // self.serverReady = true;
            //產生第一筆電文:註冊設備
            if (!self.serverReady && crypto_enable) {

                var sendObj = {};
                if(OpenNactive){
                    sendObj.udid = device.udid;
                    sendObj.appuid = device.appinfo.identifier;
                    //sendObj1.appuid = "com.hitrust.helloapns";
                    sendObj.model = device.model;
                    sendObj.platform = device.platform;
                    sendObj.osversion = device.version;
                    sendObj.appversion = device.appinfo.version+'.'+about_version;
                    sendObj.name = device.hostname;

                    sendObj.manufacturer = device.manufacturer;
                }
                //這個值是假的 需要待修改
                sendObj.hack = false;

                //這個值是假的 需要待修改
                sendObj.pushon = true;
                
                if ($rootScope.pushtoken != null ||
                    $rootScope.pushtoken != undefined) {
                    sendObj.tokenid = $rootScope.pushtoken;
                    $log.debug('pushtoken:' + sendObj.tokenid);
                }else{
                    sendObj.tokenid = '123';//not used
                }

                telegram.sendJson(register_function, sendObj, checkServerSuccess, error, checkServerFail);


            } else {
                onSuccess();
            }

        }

        this.reCheckServer = function (onSuccess) {
            self.serverReady = false;
            self.checkServer(onSuccess);
        }

        this.reCheckServerbackhome = function () {

            var onsuccess = function () {
                errorHandler.showMsg(i18n.getStringByTag('SESSION_KEY_IS_DIE'));
                sysCtrl.clean();
                framework.redirect("#/home", false);
                $(".login_frame").fadeOut(100);
            };

            this.reCheckServer(onsuccess);
        };

        this.getAppVersion = function(cbSuccess){
            $http.get(cordova.file.dataDirectory+"www/resource/about.xml").then(function (response) {
            //$http.get("resource/about.xml").then(function (response) {
                var about = framework.x2js.convertXmlStr2JSon(response.data);
                cbSuccess(about.About.Release);
            }, function (e) {
                $log.debug(e);
                cbSuccess("");
            });

        }


})
