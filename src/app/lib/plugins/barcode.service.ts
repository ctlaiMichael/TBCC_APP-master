import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { logger } from '@shared/util/log-util';
declare let QRScanner: any;

@Injectable()
// 請改用qrcode.service
export class BarcodeService extends CordovaService {
  /**
    * 開啟嵌入式QRCode掃描
    * @param {*} success
    * @param {*} error
  */
  public openCamera(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => this.scanTimes().then(
          res => {
            return Promise.resolve(res);
          },
          error => {
            return Promise.reject(error);
          }
        ));
    } else {
      return new Promise((resolve, reject) => {
        resolve('123456789');
      });
    }
  }

  onDone = (err, status) => {
    logger.debug('onDone !', err, status);
    if (err) {
      // here we can handle errors and clean up any loose ends.
      logger.error('onDone', err);
      if (err.code == 1) {
        QRScanner.openSettings();
      }
    } else {
      if (typeof status !== 'undefined') {
        if (status.authorized) {
          // W00t, you have camera access and the scanner is initialized.
          // QRscanner.show() should feel very fast.
          // tslint:disable-next-line: no-shadowed-variable
          QRScanner.show((status: any) => {
            // 相機開啟
            logger.debug('status', status);
          });
        } else if (status.denied) {
          // 取得相機權限
          QRScanner.openSettings();
        } else {
          // 取得相機權限
          QRScanner.openSettings();
        }
      }
    }
  }

  /**
   * 掃描
   */
  scan(): Promise<any> {
    return this.onDeviceReady
      .then(() => this.scanTimes().then(
        res => {
          return Promise.resolve(res);
        },
        error => {
          return Promise.reject(error);
        }
      ));
  }

  scanTimes() {
    // tslint:disable-next-line: no-unused-expression
    return new Promise((resolve, reject) => {
      QRScanner.prepare(this.onDone);
      QRScanner.scan((err: any, content: any) => {
        if (err) { reject(err); }
        resolve(content);
      });
    });
  }

  showScanner(): Promise<any> {
    return new Promise((resolve, reject) => {
      QRScanner.show(resolve);
    });
  }

  prepareScanner(): Promise<any> {
    return new Promise((resolve, reject) => {
      QRScanner.prepare((err, status) => {
        logger.debug('onDone !', err, status);
        if (!!err) {
          // here we can handle errors and clean up any loose ends.
          logger.error('onDone', err);
          if (err.code == 1) {
            QRScanner.openSettings();
          }
          reject(err);
        } else {
          if (status.authorized) {
            // W00t, you have camera access and the scanner is initialized.
            // QRscanner.show() should feel very fast.
            // tslint:disable-next-line: no-shadowed-variable
            resolve(status);

          } else {
            // 取得相機權限
            QRScanner.openSettings();
            reject();
          }

        }
      });
    });

    // QRScanner.show(function (status) {
    //   logger.debug('QRScanner show status = ' + status);
    // });
  }

  prepare() {
    this.prepareScanner()
      .then(() => this.showScanner())
  }
  /**
   * 關閉Camera
   */
  closeCamera(): Promise<any> {
    return this.destroyScanner()
      .then(destroyStatus => {
        const Img_1: any = document.getElementById('barcodeImg1');
        Img_1.src = 'assets/images/barcode1.png';
        const Img_2: any = document.getElementById('barcodeImg2');
        Img_2.src = 'assets/images/barcode2.png';
        const Img_3: any = document.getElementById('barcodeImg3');
        Img_3.src = 'assets/images/barcode3.png';
      })
  }

  destroyScanner(): Promise<any> {
    return new Promise((resolve, reject) => {
      QRScanner.destroy(resolve);
    });
  }

  hideScanner(): Promise<any> {
    return new Promise((resolve, reject) => {
      QRScanner.hide(resolve);
    });
  }

  pausePreviewScanner(): Promise<any> {
    return new Promise((resolve, reject) => {
      QRScanner.pausePreview(resolve);
    });
  }
}


