import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from '@environments/environment';
declare var trustedDevice: any;

@Injectable()
export class TrustedDeviceService extends CordovaService {

  detection(): Promise<any> {
    if (environment.NATIVE) {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => trustedDevice.isTrusted(resolve, reject)));
    }else{
      return Promise.resolve(true);
    } 
  }

}
