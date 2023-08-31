import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
declare var cordova: any;

@Injectable()
export class TrustcertsService extends CordovaService {

  /* 使用條件：
   *   PRODUCTION === false
   *   SERVER_URL 是 https
   *   CERT_CHECK === false
  */


  public trustUnsecureCerts(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => {
          if (!!cordova.plugins.certificates.trustUnsecureCerts) {
            return this.onDeviceReady
              .then(() => new Promise((resolve, reject) => {
                if (environment.PRODUCTION === false &&
                  environment.CERT_CHECK === false &&
                  environment.SERVER_URL.indexOf('https://') > -1) {
                  cordova.plugins.certificates.trustUnsecureCerts(true);
                  resolve();
                } else {
                  resolve();
                }
              }));
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
