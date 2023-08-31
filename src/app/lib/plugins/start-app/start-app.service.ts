/**
 * 開啟外部程式/網頁功能
 * iOS9之後app想調起高德地圖，必須在自己app設置中配置白名單。
  <config-file parent="LSApplicationQueriesSchemes" target="*-Info.plist">
      <array>
          <string>touchstocktbs</string>
      </array>
  </config-file>
 */
import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { DeviceService } from '../device.service';
import { StartAppOption } from './start-app-option';
import * as app from '@conf/external-app';
import { environment } from '@environments/environment';

import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { logger } from '@shared/util/log-util';

declare var startApp: any;

@Injectable()
export class StartAppService extends CordovaService {

  constructor(private device: DeviceService,
    private confirm: ConfirmService) {
    super();
  }
  /**
   * 開啟APP
   * @param appProfile App呼叫資訊
   */
  public startApp(appName: string): Promise<any> {
    return this.onDeviceReady
      .then(() => this.device.devicesInfo())
      .then(deviceInfo => {
        const appProfile: StartAppOption = app[appName];
        const self = this;
        logger.step('StartApp', 'appProfile:', appProfile);
        if (deviceInfo.platform.toLowerCase() === 'ios') {
          logger.step('StartApp', 'ios:', appProfile.ios);
          if (!environment.NATIVE) {
            logger.step('StartApp', 'window open', appProfile.ios.storeUrl);
            window.open(appProfile.ios.storeUrl);
            return;
          }
          return this.doStartApp(appProfile.ios.uri).catch(err => {
            logger.step('StartApp', 'startAppstartAppstartApp', appProfile.ios.storeUrl);
            return self.openUrl(appProfile.ios.storeUrl, appProfile);
          });
        } else if (deviceInfo.platform.toLowerCase() === 'android') {
          logger.step('StartApp', 'android:', appProfile.android);
          if (!environment.NATIVE) {
            logger.step('StartApp', 'window open', appProfile.android.storeUrl);
            window.open(appProfile.android.storeUrl);
            return;
          }
          return this.doStartApp({ 'application': appProfile.android.uri }).catch(err => {
            logger.step('StartApp', 'doStartAppdoStartAppdoStartApp', appProfile.android.storeUrl);
            return self.openUrl(appProfile.android.storeUrl, appProfile);
          });
        } else {
          return false;
        }
      });
  }
  /**
   * 開啟APP帶參數(旺旺產壽險)
   * @param appProfile App呼叫資訊
   */
  public startAppParam(appName: string, typename: string, data): Promise<any> {
    logger.error('StartApp', 'startAppParam', appName, app[appName], typename);
    let sendUrl='';
    return this.onDeviceReady
      .then(() => this.device.devicesInfo())
      .then(deviceInfo => {
        const appProfile: StartAppOption = app[appName];
        if (appProfile.other && appProfile.other[typename]) {
          logger.error('StartApp', 'app[appName]', app[appName], appProfile.other[typename]);
          sendUrl = appProfile.other.debit + data;
          logger.error(' appProfile.other.debit', appProfile.other.debit);
          if (!environment.NATIVE) {  // 模擬android
            window.open(sendUrl);
            return;
          }
          // build出來
          console.log('fullData',sendUrl);
          if (deviceInfo.platform.toLowerCase() == 'android') {
            console.log('android');
            startApp.set({
              'application': appProfile.android.uri,
              'action': 'ACTION_VIEW',
              'uri': sendUrl
            }).start();
          } else {  // ios
            console.log('ios');
            startApp.set(sendUrl).start(
              (S)=>{console.log('S',S); },(F)=>{console.log('F',F)}
            );
          }
        } else {
          return false;
        }
        // const self = this;
        // if (deviceInfo.platform.toLowerCase() === 'ios') {
        //   if (!environment.NATIVE) { //模擬ios
        //     logger.step('StartApp', 'startApp 80');
        //     window.open(appProfile.ios.storeUrl);
        //     return;
        //   }
        //   //build出來
        //   return this.doStartApp(appProfile.ios.uri).catch(err => {
        //     logger.step('StartApp', 'startAppstartAppstartApp', appProfile.ios.storeUrl);
        //     return self.openUrl(appProfile.ios.storeUrl, appProfile);
        //   })
        // } else if (deviceInfo.platform.toLowerCase() === 'android') {
        //   if (!environment.NATIVE) {  //模擬android
        //     window.open(appProfile.android.storeUrl);
        //     return;
        //   }
        //   //build出來
        //   return this.doStartApp({ 'application': appProfile.android.uri }).catch(err => {
        //     logger.step('StartApp', 'doStartAppdoStartAppdoStartApp', appProfile.android.storeUrl);
        //     return self.openUrl(appProfile.android.storeUrl, appProfile);
        //   })
        // } else {
        //   return false;
        // }
      });
  }

  startAppSet(uri): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof startApp.set(uri) === 'object') {
        resolve(startApp.set(uri));
      } else {
        reject(false);
      }
    });
  }

  doCheckApp(uri): Promise<any> {
    // 成功有安裝會回resoleve true 沒有是reject 回false 
    return new Promise((resolve, reject) =>
      startApp.set(uri).check(resolve, reject)
    );
  }

  doStartApp(uri): Promise<any> {
    logger.step('StartApp', 'doStartApp function', uri);
    return new Promise((resolve, reject) =>
      startApp.set(uri).start(resolve, reject)
    );
  }

  private showOptionMsg(option: StartAppOption): Promise<any> {
    const confirmOpt = new ConfirmOptions();
    confirmOpt.btnNoTitle = '取消';
    confirmOpt.btnYesTitle = '確定';
    confirmOpt.title = (!!option.title) ? option.title : 'POPUP.NOTICE.TITLE';
    return this.confirm.show(option.context, confirmOpt).then(() => {
      return;
    }).catch(() => {
      return Promise.reject('');
    });
  }

  /**
   * 開啟網頁
   * @param url 網址
   */
  public openUrl(url: string, option: StartAppOption): Promise<any> {
    if (!environment.NATIVE) {
      window.open(url);
      return;
    }
    return this.onDeviceReady
      .then(() => {
        if (!!option.context)
          return this.showOptionMsg(option);
        else
          return;
      })
      .then(() => this.device.devicesInfo())
      .then(deviceInfo => {
        if (deviceInfo.platform.toLowerCase() === 'ios') {
          logger.step('StartApp', 'openUrlopenUrlopenUrl', url);
          startApp.set(url).start(function () {
            return true;
          }, function () {
            return false;
          });
        } else if (deviceInfo.platform.toLowerCase() === 'android') {
          logger.step('StartApp', 'openUrlopenUrlopenUrl', url);
          location.href = url;
        } else {
          return false;
        }
      }).catch(() => {
        return Promise.resolve('');
      });
  }

}
