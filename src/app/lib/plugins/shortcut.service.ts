import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { DeviceService } from '@lib/plugins/device.service';
import { logger } from '@shared/util/log-util';
declare var plugins: any;

@Injectable()
export class ShortcutService extends CordovaService {
  constructor(
    private deviceInfo: DeviceService
  ) { super(); }

  /**
    * 裝置是否支援Pinned Shortcuts
    */
  public isSupportsPinned(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => this.deviceInfo.devicesInfo())
        .then((devicesInfo) => {
          let platform = devicesInfo.platform.toUpperCase();
          if (platform === 'ANDROID') {
            // return Promise.resolve();
            return new Promise((resolve, reject) => plugins.Shortcuts.supportsPinned(resolve, reject));
          } else {
            // 非android,不支援建立捷徑
            let error = {
              'platform': platform,
              'msg': '您的裝置尚未開放建立捷徑功能'
            };
            return Promise.reject(error);
          }
        });
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve()));
    }
  }

  /**
    * 新增shortShortcuts到首頁
    */
  public addPinned(obj): Promise<any> {
    logger.debug('obj:' + JSON.stringify(obj));
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => plugins.Shortcuts.addPinned(obj, resolve, reject)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve()));
    }
  }

  /**
      * 新增shortShortcuts到首頁
      */
    public setDynamic(shortcuts:any[]): Promise<any> {
      //logger.debug('obj:' + JSON.stringify(obj));
      if (environment.NATIVE) {
        return this.onDeviceReady
          .then(() => new Promise((resolve, reject) => plugins.Shortcuts.setDynamic(shortcuts, resolve, reject)));
      } else {
        return this.onDeviceReady
          .then(() => new Promise((resolve, reject) => resolve()));
      }
    }
}
