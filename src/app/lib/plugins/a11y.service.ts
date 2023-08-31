import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { logger } from '@shared/util/log-util';
declare var MobileAccessibility: any;
declare var device: any;

@Injectable()
export class A11yService extends CordovaService {
  public isA11yTurnOn(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          MobileAccessibility.usePreferredTextZoom(false);

          function isTalkBackRunningCallback(boolean) {
            let isTalkBack = false;
            if (boolean) {
              logger.debug('Screen reader: ON');
              isTalkBack = true;
              resolve(isTalkBack);
            } else {
              logger.debug('Screen reader: OFF');
              isTalkBack = false;
              resolve(isTalkBack);
            }
          }
          function isVoiceOverRunningCallback(boolean) {
            let isTalkBack = false;
            if (boolean) {
              logger.debug('Screen reader: ON');
              isTalkBack = true;
              resolve(isTalkBack);
            } else {
              logger.debug('Screen reader: OFF');
              isTalkBack = false;
              resolve(isTalkBack);
            }
          }
          if (device.platform.toUpperCase() === 'ANDROID') {
            MobileAccessibility.isTalkBackRunning(isTalkBackRunningCallback);
          }

          if (device.platform.toUpperCase() === 'IOS') {
            MobileAccessibility.isVoiceOverRunning(isVoiceOverRunningCallback);
          }

        }));
    } else {
      // 模擬器true開啟無障礙
      return Promise.resolve(false);
    }
  }


  // Android無障礙功能啟動判斷
  public isTalkBackRunning(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {

          function isTalkBackRunningCallback(boolean) {
            let isTalkBack = false;
            if (boolean) {
              logger.debug('Screen reader: ON');
              isTalkBack = true;
              resolve(isTalkBack);
            } else {
              logger.debug('Screen reader: OFF');
              isTalkBack = false;
              resolve(isTalkBack);
            }
          }
          MobileAccessibility.isTalkBackRunning(isTalkBackRunningCallback);
        }));
    } else {
      // 模擬器true開啟無障礙
      return Promise.resolve(false);
    }
  }
  // iOS無障礙功能啟動判斷
  public isVoiceOverRunning(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          function isVoiceOverRunningCallback(boolean) {
            let isTalkBack = false;
            if (boolean) {
              logger.debug('Screen reader: ON');
              isTalkBack = true;
              resolve(isTalkBack);
            } else {
              logger.debug('Screen reader: OFF');
              isTalkBack = false;
              resolve(isTalkBack);
            }
          }
          MobileAccessibility.isVoiceOverRunning(isVoiceOverRunningCallback);
        }));
    } else {
      // 模擬器true開啟無障礙
      return Promise.resolve(true);
    }
  }

}
