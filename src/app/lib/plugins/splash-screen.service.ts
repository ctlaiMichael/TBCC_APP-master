import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
declare var navigator: any;

@Injectable()
export class SplashScreenService extends CordovaService {

  public hide(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          navigator.splashscreen.hide();
          resolve();
        }));
    } else {
      return Promise.resolve();
    }
  }
}
