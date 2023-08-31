import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
declare var navigator: any;

@Injectable()
export class NetworkInfoService extends CordovaService {

  public checkConnection(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          const networkState = navigator.connection.type;
          const returnInfo = networkState.replace('Connection.', '').toUpperCase();
          resolve({
            'status': returnInfo
          });
        }));
    } else {
      return Promise.resolve({
        'status': 'WIFI'
      });
    }
  }


}
