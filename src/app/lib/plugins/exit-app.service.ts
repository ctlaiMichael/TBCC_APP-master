import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from '@environments/environment';
declare var cordova: any;

@Injectable()
export class ExitAppService extends CordovaService {

  public exit(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady.then(() => { cordova.plugins.exit(); });
    } else {
      window.close();
    }
  }

}
