import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
declare var device: any;

@Injectable()
export class CurrentPositionService extends CordovaService {

  public getCurrentPosition(maxiMumAge?, timeOut?): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let obj = {
            latitude: '',
            longitude: '',
            accuracy: '',
            altitude: '',
            altitudeAccuracy: '',
            heading: '',
            speed: '',
            timestamp: '',

          };
          var onSuccess = function (position) {

            obj.latitude = position.coords.latitude;
            obj.longitude = position.coords.longitude;
            obj.altitude = position.coords.altitude;
            obj.accuracy = position.coords.accuracy;
            obj.altitudeAccuracy = position.coords.altitudeAccuracy;
            obj.heading = position.coords.heading;
            obj.speed = position.coords.speed;
            obj.timestamp = position.timestamp;
            resolve(obj)
          };

          // onError Callback receives a PositionError object
          //
          function onError(error) {
            // alert('code: '    + error.code    + '\n' +
            //       'message: ' + error.message + '\n');
            reject(error);
          }

          navigator.geolocation.getCurrentPosition(onSuccess, onError,
            { maximumAge: (!!maxiMumAge) ? maxiMumAge : 3000, timeout: (!!timeOut) ? timeOut : 2000,
             enableHighAccuracy: false });
        }));
    }
    else {
      return Promise.resolve({
        latitude: '24.1504536',
        longitude: '120.68325279999999',
        accuracy: '',
        altitude: '1788',
        altitudeAccuracy: '',
        heading: '',
        speed: '',
        timestamp: '1555480876992',
      });
    }
  }

}