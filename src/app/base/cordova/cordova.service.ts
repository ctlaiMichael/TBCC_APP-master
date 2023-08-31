import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
@Injectable()
export class CordovaService {
  onDeviceReady: Promise<any>;

  constructor() {
    if (environment.NATIVE) {
      this.onDeviceReady = new Promise<any>((resolve, reject) => {
        document.addEventListener('deviceready', resolve, false);
      });
    } else {
      this.onDeviceReady = new Promise<any>((resolve, reject) => {
        resolve();
      });
    }

  }

}
