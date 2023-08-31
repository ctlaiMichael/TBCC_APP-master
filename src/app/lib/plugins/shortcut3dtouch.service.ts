import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
declare var shortcutItem: any;

@Injectable()
export class Shortcut3dtouchService extends CordovaService {

  /**
    * 禁止截圖
    */
  public initialize(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => {
          if (!!shortcutItem.initialize()) {
            return this.onDeviceReady
              .then(() => new Promise((resolve, reject) => shortcutItem.initialize(resolve, reject)));
          } else {
            // 沒有plugin
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
