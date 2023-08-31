import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { DeviceService } from '@lib/plugins/device.service';
declare var OurCodeWorldpreventscreenshots: any;

@Injectable()
export class ScreenshotPreventionService extends CordovaService {
  constructor(
    private deviceInfo: DeviceService
  ) { super(); }

  /**
    * 禁止截圖
    */
  public disabledScreenshotPrevention(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => this.deviceInfo.devicesInfo())
        .then((devicesInfo) => {
          let platform = devicesInfo.platform.toUpperCase();
          if (platform === 'ANDROID' && !!OurCodeWorldpreventscreenshots.disable()) {
            return this.onDeviceReady
              .then(() => new Promise((resolve, reject) => OurCodeWorldpreventscreenshots.disable(resolve, reject)));
          } else {
            // !android or 沒有plugin
            return this.onDeviceReady
              .then(() => new Promise((resolve, reject) => resolve()));
          }
        });
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve()));
    }
  }

  /**
    * 開放截圖
    */
  public enabledScreenshotPrevention(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => this.deviceInfo.devicesInfo())
        .then((devicesInfo) => {
          let platform = devicesInfo.platform.toUpperCase();
          if (platform === 'ANDROID' && !!OurCodeWorldpreventscreenshots.enable()) {
            return this.onDeviceReady
              .then(() => new Promise((resolve, reject) => OurCodeWorldpreventscreenshots.enable(resolve, reject)));
          } else {
            // !android or 沒有plugin
            return this.onDeviceReady
              .then(() => new Promise((resolve, reject) => resolve()));
          }
        });
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve()));
    }
  }
}
