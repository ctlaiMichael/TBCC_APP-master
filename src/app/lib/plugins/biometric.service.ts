import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { SessionStorageService } from '@lib/storage/session-storage.service';
declare var HiBiometricAuth: any;

@Injectable()
export class BiometricService extends CordovaService {
  constructor(private session: SessionStorageService, ) {
    super();
    document.addEventListener('pause', () => {
      this.session.setObj('bioDevicePause', true);
    }, false);

    document.addEventListener('resume', () => {
      this.session.setObj('bioDevicePause', false);
    }, false);
  }

  /**
    * 裝置是否支援生物辨識
    * 回應資料:
    * ret_code - 回傳值
    * err_msg - 系統錯誤訊息
    * value - 種類
    */

  public getBiometricStatus(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => HiBiometricAuth.getBiometricStatus(resolve, reject)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve({
          'ret_code': '0',
          'err_msg': '',
          'value': '',
        })));
    }
  }

  /**
  * 產製並儲存此裝置生物辨識信物
  * @param promptMessage popup msg
  * 回應資料:
  * ret_code - 回傳值
  * err_msg - 系統錯誤訊息
  * device_id - 設備識別碼
  * device_token - 設備註冊信物
  * bio_status - 啟用狀態
  */
  public generateBioToken(promptMessage): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          HiBiometricAuth.generateBioToken(resolve, (error) => {
            const isPause = this.session.get('bioDevicePause');
            if (!!isPause && isPause != 'false') {
              // reject(error);
            } else {
              reject(error);
            }
          }, promptMessage);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            'bio_status': 2,
            'device_id': '91E29A6A-74FC-467B-A9D5-536FB0404CB9',
            'device_os': 'IN',
            // tslint:disable-next-line: max-line-length
            'device_token': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1qbLTky8fM659sHBG+MVQPKZqkw5OEcth8ME3nzbz2xGadt819hFx6U8tDoWuMapLc1RPAZ1/u97nWs0NrVC6waDK5os20W2…',
            'device_version': '12.1',
            'err_msg': '',
            'ret_code': 0
          }
        )));
    }
  }

  /**
  * 啟用生物辨識驗證服務
  * @param listener
  * 回應資料:
  * ret_code - 回傳值
  * err_msg - 系統錯誤訊息
  * bio_status - 啟用狀態
  */
  public enableBioService(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => HiBiometricAuth.enableBioService(resolve, reject)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            'bio_status': 2,
            'err_msg': '',
            'ret_code': 0
          }
        )));
    }
  }

  /**
     * 停用生物辨識驗證服務
     * @param listener
     * 回應資料:
     * ret_code - 回傳值
     * err_msg - 系統錯誤訊息
     * bio_status - 啟用狀態
     */
  public disableBioService(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => HiBiometricAuth.disableBioService(resolve, reject)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            'bio_status': 9,
            'err_msg': '',
            'ret_code': 0
          }
        )));
    }
  }

  /**
     * 指紋辨識使用
     * @param txData custId + userId
     * @param promptMessage popup msg
     * 回應資料:
     * ret_code - 回傳值
     * err_msg - 系統錯誤訊息
     * device_id - 設備識別碼
     * mac_value - 驗證值
     */
  public requestBioService(promptMessage, txData): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          HiBiometricAuth.requestBioService(resolve, (error) => {
            const isPause = this.session.get('bioDevicePause');
            if (!!isPause && isPause != 'false') {
              // reject(error);
            } else {
              reject(error);
            }
          }, txData, promptMessage);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            'device_id': '91E29A6A-74FC-467B-A9D5-536FB0404CB9',
            'err_msg': '',
            'ret_code': 0,
            // tslint:disable-next-line: max-line-length
            'mac_value': '52F04D77C68E705073531196E04FD0041C97FABFEC3C910DA1B7C2B1CD868D69208E41508DD4DA1702803C72D570BC1C1BE1BBFDF9AD785FD05E549A957E90E6216EB8649544…'
          }
        )));
    }
  }

  /**
     * 查詢生物辨識驗證服務資訊
     * @param listener
     * 回應資料:
     * ret_code - 回傳值
     * err_msg - 系統錯誤訊息
     * device_id - 設備識別碼
     * device_token - 設備註冊信物
     * bio_status - 啟用狀態
     */
  public gueryBioService(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => HiBiometricAuth.gueryBioService(resolve, reject)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            bio_status: 1,
            err_msg: '',
            ret_code: 0,
            device_id: '5DBF5F38-F99F-4E0E-96C8-3B62EABF458E',
            device_token: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwFviOy…O8YtW/9qWzwwd5BXlag8cGuoZnRwaHRmR3VpOu2wyzwIDAQAB'
          }
        )));
    }
  }

  /**
   * 指紋辨識使用
   * @param txData custId + userId
   * @param promptMessage popup msg
   * 回應資料:
   * ret_code - 回傳值
   * err_msg - 系統錯誤訊息
   * device_id - 設備識別碼
   * mac_value - 驗證值
   */
  public identifyByBiometric(promptMessage): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => HiBiometricAuth.identifyByBiometric(resolve, reject, promptMessage)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
        )));
    }
  }
}
