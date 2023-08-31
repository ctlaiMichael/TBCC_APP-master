/**
 * Created by kie0723 on 2016/5/31.
 */

angular.module('deviceInfo', [])
.service('deviceInfo', function(framework) {
    var self = this;
    this.uuid = '';
    this.platform = '';
    this.model = '';
    this.version = '';
    this.deviceName = '';
    this.clientOS = '';
    this.wlVersion = '';
    this.appVersion = '';
    this.appBuild = '';

    var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

    var onSuccess = function (res) {
        self.uuid = res.deviceID;
    }
    var onFailure = function () {
        self.uuid = "unknow";
    }
    var getClientOS = function(platform){
        if("iOS" == platform){
            return '01';
        }else if("Android" == platform){
            return '02';
        }
        return '00';
    }

    if ('undefined' != (typeof device)){
        self.platform = device.platform;
        self.clientOS = getClientOS(device.platform);
        self.model = device.model;
        self.version = device.version;
        if ('undefined' != (typeof WL)){
            WL.Device.getID({onSuccess:onSuccess,onFailure:onFailure });
            this.wlVersion = WL.Client.getAppProperty("APP_VERSION");
        }else{
            if(OpenNactive){
                self.uuid = device.uuid;
                // plugin.tcbb.getMobileNo(function(mobileNo){
                //     self.uuid = mobileNo;
                // },function(error){
                //     self.uuid = device.uuid;
                //     framework.alert('getMobileNo Error:'+JSON.stringify(error));	
                // });
            } else {
                self.uuid = device.uuid;
            }
            //self.uuid = device.uuid;
        }
        if('undefined' != (typeof device.appinfo)){
            self.appVersion = (typeof device.appinfo.version !== 'undefined')
                                ? device.appinfo.version : "";
        }

    }

    if ('undefined' != (typeof AppVersion)){
        this.appBuild = AppVersion.build;
    }

    if (('undefined' != (typeof cordova))&&('undefined' != (typeof cordova.plugins))&&('undefined' != (typeof cordova.plugins.deviceName))){
        self.deviceName = cordova.plugins.deviceName.name;
    }


});
