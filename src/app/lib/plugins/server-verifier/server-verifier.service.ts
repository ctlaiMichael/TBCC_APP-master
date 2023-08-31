import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { CertInfo } from './cert-info';
import { environment } from '@environments/environment';
import { CERTS_INFO } from '@conf/cert';
declare var plugin: any;

@Injectable()
export class ServerVerifierService extends CordovaService {
  verify(): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => {
        if (environment.NATIVE && environment.CERT_CHECK) {
          plugin.verifyServer.check(environment.SERVER_URL, CERTS_INFO, resolve, reject);
        } else {
          resolve();
        }
      }));
  }
}
