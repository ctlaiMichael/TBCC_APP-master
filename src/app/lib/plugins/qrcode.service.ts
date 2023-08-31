/**
 * QRCode掃描Plugin 介接
 * bitpay/cordova-plugin-qrscanner
 * Possible Error Types
 * https://github.com/bitpay/cordova-plugin-qrscanner#error-handling
 * Status Object Properties
 * https://github.com/bitpay/cordova-plugin-qrscanner#status-object-properties
 */


import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { logger } from '@shared/util/log-util';
import { CommonUtil } from '@shared/util/common-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ScanErrorOptions } from '@base/options/scan-error-options';

declare let QRScanner: any;
declare let navigator: any;
declare let StatusBar: any;

@Injectable()
export class QrcodeService extends CordovaService {
  private retryData = {
    start: false,  // 測試狀態
    times: 0, // 重查次數
    maxTimes: 2 // 最大重查次數
  };

  /**
   * 開啟相機
   */
  public prepareCamera(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.doPrepare().then(
        (status) => {
          if (!!status) {
            if (status.authorized) {
              //  W00t, you have camera access and the scanner is initialized.
              //  QRscanner.show() should feel very fast.
              //  tslint:disable-next-line: no-shadowed-letiable
              // tslint:disable-next-line: no-shadowed-variable
              this.doShow().then(
                (showStatus) => {
                  //  相機開啟
                  logger.debug('showStatus', showStatus);
                  resolve(showStatus);
                }
              );
            } else if (
              status.prepared
              || status.showing
              || status.scanning
              || status.previewing
            ) {
              resolve(status);
              return true;
            } else if (status.denied) {
              //  取得相機權限
              this.openSettings();
              let error_obj = this.modifyErrorRes({
                code: 'MISS_CAMERA'
                , name: 'MISS_CAMERA'
              });
              reject(error_obj);
            } else {
              //  取得相機權限
              this.openSettings();
              let error_obj = this.modifyErrorRes({
                code: 'MISS_CAMERA'
                , name: 'MISS_CAMERA'
              });
              reject(error_obj);
            }
          } else {
            reject({
              'resultCode': 'MISS_PARAMS',
              'msg': 'ERROR.PLUGIN_ERROR' // 很抱歉，必要元件無法執行或異常！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。
            });
          }
        },
        (err) => {
          //  here we can handle errors and clean up any loose ends.
          logger.error('QRScanner.prepare', err);
          if (err.gotoSetFlag) {
            this.openSettings();
          }
          reject(err);
        }
      );
    });
  }

  /**
   * 狀態查詢
   */
  public getStatus(): Promise<any> {
    if (environment.NATIVE) {
      return new Promise((resolve, reject) => {
        QRScanner.getStatus(resolve);
      });
    } else {
      // not open
      let not_open = {
        'authorized': true,
        'denied': false,
        'restricted': false,
        'prepared': false,
        'scanning': false,
        'previewing': true,
        'showing': false,
        'lightEnabled': false,
        'canChangeCamera': false,
        'canOpenSettings': true,
        'canEnableLight': false,
        'currentCamera': 0
      };

      let have_open = {
        'authorized': true,
        'denied': false,
        'restricted': false,
        'prepared': true,
        'scanning': true,
        'previewing': true,
        'showing': true,
        'lightEnabled': true,
        'canChangeCamera': true,
        'canOpenSettings': true,
        'canEnableLight': true,
        'currentCamera': 0
      };

      return Promise.resolve(have_open);
    }
  }

  /**
   * 檢查相機是否開啟
   */
  public waitForReady(): Promise<any> {
    if (!this.retryData.start) {
      this.retryData.start = true;
      this.retryData.times = 0;
    }
    this.retryData.times++;
    return this.getStatus().then(status => {
      logger.step('Camera', 'waitForReady', status);
      if (status && status.showing) {
        return Promise.resolve();
      } else {
        logger.step('Camera', 'waitForReady retry', status);
        if (this.retryData.times >= this.retryData.maxTimes) {
          // 重新測試超過上限
          return Promise.reject(status);
        }
        return CommonUtil.wait(500)
          .then(() => this.waitForReady());
      }
    });
  }

  /**
    * 開啟嵌入式QRCode掃描(以前的 openEmbedQRCodeReader)
    * @param {*} success
    * @param {*} error
    * scan掃碼出來的response請至scanTimes處理
  */
  public openCamera(): Promise<any> {
    return this.onDeviceReady
      .then(() => this.prepareCamera())
      .then(() => this.scanTimes());
  }

  public imageScan(): Promise<any> {
    return new Promise((resolve, reject) => {
      logger.step('Camera', 'do imageScan');
      let errorCallBack = (error_data) => {
        let output = this.modifyErrorRes(error_data);
        reject(output);
        // todo
        this.resetStepBar();
      };
      let decodeQRCode = (imgPath) => {
        this.readQRCodeFromFile(imgPath).then(
          (result) => {
            if (!!result && !!result.value) {
              resolve(result.value);
              // todo
              this.resetStepBar();
            } else {
              errorCallBack({
                code: 'SCAN_IMAGE_ERROR',
                name: 'SCAN_IMAGE_ERROR'
              });
            }
          },
          (error_data) => {
            errorCallBack(error_data);
          });
      };

      let getPictureErr = (msg) => {
        if (msg == 'has no access to assets') {
          errorCallBack({ name: 'ALBUM_ACCESS_DENIED', code: 9 });
        } else if (msg == 'no image selected') {
          errorCallBack({ name: 'SCAN_CANCELED', code: 6 });
        } else {
          errorCallBack(msg);
        }
      };

      if (environment.NATIVE) {

        let pictureSource = navigator.camera.PictureSourceType;
        let destinationType = navigator.camera.DestinationType;
        navigator.camera.getPicture(decodeQRCode, getPictureErr, {
          quality: 20,
          destinationType: destinationType.DATA_URL,
          sourceType: pictureSource.SAVEDPHOTOALBUM
        });
      } else {
        // getPictureErr('has no access to assets');
        decodeQRCode('test');
      }
    });
  }


  onDone = (err, status) => {
    logger.debug('onDone !', err, status);
    if (err) {
      //  here we can handle errors and clean up any loose ends.
      logger.error('onDone', err);
      if (err.code === 1) {
        this.openSettings();
      }
    } else {
      if (typeof status !== 'undefined') {
        if (status.authorized) {
          //  W00t, you have camera access and the scanner is initialized.
          //  QRscanner.show() should feel very fast.
          //  tslint:disable-next-line: no-shadowed-letiable
          // tslint:disable-next-line: no-shadowed-variable
          QRScanner.show((status: any) => {
            //  相機開啟
            logger.debug('status', status);
          });
        } else if (status.denied) {
          //  取得相機權限
          this.openSettings();
        } else {
          //  取得相機權限
          this.openSettings();
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

  /**
   * QRScanner.scan
   */
  scanTimes() {
    return new Promise((resolve, reject) => {
      logger.step('Camera', 'do scanTimes');
      let callBackEvent = (prepareFail, prepareStatus) => {
        if (prepareFail) {
          let output = this.modifyErrorRes(prepareFail);
          reject(output);
          return false;
        }
        resolve(prepareStatus);
      };

      if (environment.NATIVE) {
        QRScanner.scan(callBackEvent);
      } else {
        let prepareFail = null;
        // prepareFail = this._testError(1); // 無權限
        // prepareFail = this._testError(6); // 取消掃碼
        let prepareStatus = '';
        // tslint:disable-next-line:max-line-length
        // prepareStatus = 'TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F01%2FV1%3FM1%3D39900%26D3%3DARZ2cPNsNyZi%26D10%3D901%26D11%3D00%2C46246226301561000210001001%3B01%2C46246226301561000210001002%26D12%3D20201231123030';
        // tslint:disable-next-line:max-line-length
        prepareStatus = '0002010102110216400396006100104004155395940061001041316315805006100104535960012tw.com.twqrp0176V1158Ac5CJ9NjpN1W00,00600626309800100190010002;02,006006263098001001900100025204599953039015802TW5911006TESTSHOP6011TAIPEI CITY610311464210002ZH0111FISC金融卡25256304DC34';
        callBackEvent(prepareFail, prepareStatus);
      }
    });
  }

  /**
   * 關閉Camera
   */
  closeCamera(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (environment.NATIVE) {
        QRScanner.destroy((status) => {
          logger.step('Camera', 'closeCamera', status);
          resolve(status);
        });
      } else {
        resolve({
          'authorized': true,
          'canChangeCamera': false,
          'canEnableLight': false,
          'canOpenSettings': true,
          'currentCamera': 0,
          'denied': false,
          'lightEnabled': false,
          'prepared': false,
          'previewing': false,
          'restricted': false,
          'scanning': true,
          'showing': true
        });
      }
    });
  }

  /**
  * 圖片掃描
  */
  readQRCodeFromFile(imgPath): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => QRScanner.readQRCodeFromImage(resolve, reject, imgPath)));
    } else {
      return new Promise((resolve, reject) => {
        // tslint:disable-next-line: max-line-length
        // resolve('TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F01%2FV1%3FM1%3D39900%26D3%3DARZ2cPNsNyZi%26D10%3D901%26D11%3D00%2C46246226301561000210001001%3B01%2C46246226301561000210001002%26D12%3D20201231123030');
        // tslint:disable-next-line: max-line-length
        resolve('0002010102110216400396006100104004155395940061001041316315805006100104535960012tw.com.twqrp0176V1158Ac5CJ9NjpN1W00,00600626309800100190010002;02,006006263098001001900100025204599953039015802TW5911006TESTSHOP6011TAIPEI CITY610311464210002ZH0111FISC金融卡25256304DC34');
      });
    }
  }

  /**
   * QRScanner.prepare (目前未使用)
   */
  doPrepare(): Promise<any> {
    return new Promise((resolve, reject) => {
      logger.step('Camera', 'do doPrepare');
      let callBackEvent = (prepareFail, prepareStatus) => {
        if (prepareFail) {
          let output = this.modifyErrorRes(prepareFail);
          reject(output);
          return false;
        }
        resolve(prepareStatus);
      };

      if (environment.NATIVE) {
        QRScanner.prepare(callBackEvent);
      } else {
        let prepareFail = null;
        // 未開啟權限
        // prepareFail = this._testError(1); // 無權限
        // prepareFail = this._testError(6); // 取消掃碼

        // 已開啟狀態
        let have_open = {
          'authorized': true,
          'canChangeCamera': true,
          'canEnableLight': true,
          'canOpenSettings': true,
          'currentCamera': 0,
          'denied': false,
          'lightEnabled': false,
          'prepared': true,
          'previewing': true,
          'restricted': false,
          'scanning': true,
          'showing': true
        };
        // 未開啟狀態
        let prepareStatus = {
          'authorized': true,
          'canChangeCamera': true,
          'canEnableLight': true,
          'canOpenSettings': true,
          'currentCamera': 0,
          'denied': false,
          'lightEnabled': false,
          'prepared': true,
          'previewing': true,
          'restricted': false,
          'scanning': false,
          'showing': false
        };
        callBackEvent(prepareFail, prepareStatus);
      }
    });
  }


  /**
   * QRScanner.show (目前未使用)
   */
  doShow(): Promise<any> {
    return new Promise((resolve, reject) => {
      let callBackEvent = (showStatus) => {
        resolve(showStatus);
      };

      if (environment.NATIVE) {
        QRScanner.show(callBackEvent);
      } else {
        callBackEvent({
          'authorized': true,
          'canChangeCamera': false,
          'canEnableLight': false,
          'canOpenSettings': true,
          'currentCamera': 0,
          'denied': false,
          'lightEnabled': false,
          'prepared': false,
          'previewing': false,
          'restricted': false,
          'scanning': false,
          'showing': true
        });
      }
    });
  }

  /**
   * 前往設定檔設定
   */
  openSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      logger.step('Camera', 'do openSettings');
      let callBackEvent = (prepareFail, prepareStatus) => {
        if (prepareFail) {
          let output = this.modifyErrorRes(prepareFail);
          reject(output);
          return false;
        }
        resolve(prepareStatus);
      };

      if (environment.NATIVE) {
        QRScanner.openSettings(callBackEvent);
      } else {
        let prepareFail = null;
        // prepareFail = this._testError(8); // 無法前往設定
        // 已開啟狀態
        let have_open = {
          'authorized': true,
          'canChangeCamera': true,
          'canEnableLight': true,
          'canOpenSettings': true,
          'currentCamera': 0,
          'denied': false,
          'lightEnabled': false,
          'prepared': true,
          'previewing': true,
          'restricted': false,
          'scanning': true,
          'showing': true
        };
        // 未開啟狀態
        let prepareStatus = {
          'authorized': true,
          'canChangeCamera': true,
          'canEnableLight': true,
          'canOpenSettings': true,
          'currentCamera': 0,
          'denied': false,
          'lightEnabled': false,
          'prepared': true,
          'previewing': true,
          'restricted': false,
          'scanning': false,
          'showing': false
        };
        callBackEvent(prepareFail, prepareStatus);
      }
    });
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
  // --------------------------------------------------------------------------------------------

  private modifyErrorRes(errorObj): ScanErrorOptions {
    logger.error('QRScanner Error', errorObj);
    let output: ScanErrorOptions = new ScanErrorOptions();
    output.resultData = errorObj;

    if (!!errorObj) {
      let err_code = FieldUtil.checkField(errorObj, 'code');
      let err_str = FieldUtil.checkField(errorObj, 'name');
      output.resultCode = err_code;
      let know_error = [
        'CAMERA_ACCESS_DENIED', // 權限不足請至設定開啟(1)
        'CAMERA_ACCESS_RESTRICTED', // 權限不足請至設定開啟(2)
        'BACK_CAMERA_UNAVAILABLE', // 相機無法正常開啟與顯示(3)
        'FRONT_CAMERA_UNAVAILABLE', // 相機無法正常開啟與顯示(4)
        'CAMERA_UNAVAILABLE', // 相機無法正常開啟與顯示(5)
        'SCAN_CANCELED', // 您已取消掃描
        'LIGHT_UNAVAILABLE', // 無法正常使用閃光燈(7)
        'OPEN_SETTINGS_UNAVAILABLE', // 很抱歉，無法正常前往系統設定！請自行前往設定開啟權限。(8)
        'ALBUM_ACCESS_DENIED', // 相簿無法正常開啟與顯示(9)
        'SCAN_IMAGE_ERROR', // QR Code掃描失敗(IMAGE)
        'UNEXPECTED_ERROR' // 發生非預期性錯誤
      ];
      if (know_error.indexOf(err_str) > -1) {
        output.msg = 'ERROR.SCAN.' + err_str;
      } else if (err_code == 'MISS_CAMERA') {
        output.msg = 'ERROR.SCAN.MISS_CAMERA';
      } else {
        // 其他錯誤
        if (err_str !== '') {
          output.msg = '掃描失敗' + '(' + err_str + ')';
        } else {
          output.msg = 'ERROR.SCAN.SCAN_ERROR_OTHER'; // QR Code掃描失敗！
        }
      }
      if (err_str === 'SCAN_CANCELED' || err_code == '6'
        || err_str === 'ALBUM_ACCESS_DENIED' || err_code == '9'
      ) {
        // 取消掃描
        output.cancelFlag = true;
      } else if (
        err_str === 'CAMERA_ACCESS_DENIED' || err_code == '1'
        || err_code === 'MISS_CAMERA'
      ) {
        // 開啟設定
        output.gotoSetFlag = true;
      }

    }

    return output;
  }


  /**
   * QRScanner 錯誤(測試用)
   */
  private _testError(code: string | number) {
    let check_code = code.toString();
    let output = { code: 0, name: 'UNEXPECTED_ERROR' };
    switch (check_code) {
      case '1':
        // 無權限：The user denied camera access.
        output = { code: 1, name: 'CAMERA_ACCESS_DENIED' };
        break;
      case '2':
        /**
         * Camera access is restricted
         * (due to parental controls, organization security configuration profiles, or similar reasons).
         */
        output = { code: 2, name: 'CAMERA_ACCESS_RESTRICTED' };
        break;
      case '3':
        // The back camera is unavailable.
        output = { code: 3, name: 'BACK_CAMERA_UNAVAILABLE' };
        break;
      case '4':
        // The front camera is unavailable.
        output = { code: 4, name: 'FRONT_CAMERA_UNAVAILABLE' };
        break;
      case '5':
        /**
         * The camera is unavailable because it doesn't exist or is otherwise unable to be configured. 
         * (Also returned if QRScanner cannot return one of the more specific BACK_CAMERA_UNAVAILABLE or FRON_CAMERA_UNAVAILABLE errors.)
         */
        output = { code: 5, name: 'CAMERA_UNAVAILABLE' };
        break;
      case '6':
        // 取消掃碼
        // Scan was canceled by the cancelScan() method. (Returned exclusively to the QRScanner.scan() method.)
        output = { code: 6, name: 'SCAN_CANCELED' };
        break;
      case '7':
        // The device light is unavailable because it doesn't exist or is otherwise unable to be configured.
        output = { code: 7, name: 'LIGHT_UNAVAILABLE' };
        break;
      case '8':
        // The device is unable to open settings.
        output = { code: 8, name: 'OPEN_SETTINGS_UNAVAILABLE' };
        break;
      case '0':
      default:
        // 非預期錯誤：An unexpected error. Returned only by bugs in QRScanner.
        output = { code: 0, name: 'UNEXPECTED_ERROR' };
        break;
    }

    return output;
  }


  resetStepBar(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (environment.NATIVE) {
        if (typeof StatusBar == 'object'
          && typeof StatusBar.hide == 'function'
          && typeof StatusBar.show == 'function'
        ) {
          StatusBar.hide();
          StatusBar.show();
          resolve();
        } else {
          reject('Miss Method');
        }
      } else {
        resolve();
      }
    });
  }

}


