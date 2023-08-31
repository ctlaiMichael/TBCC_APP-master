import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'environments/environment';
import { TelegramOption } from './telegram-option';

import { DeviceService } from '@lib/plugins/device.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { timeout } from 'rxjs/operators';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class HandshakeTelegramService<T> {
  temp_hitrust_auth: string;
  temp_auth_token: string;
  reqUrl: string;

  constructor(
    private http: HttpClient,
    private crypto: CryptoService      // plugin test
  ) {
    this.temp_hitrust_auth = sessionStorage.temp_hitrust_auth || '';
    this.temp_auth_token = sessionStorage.temp_auth_token || '';
    this.reqUrl = '';
  }

  reset() {
    this.temp_hitrust_auth = '';
    this.temp_auth_token = '';
  }

  /**
   * 發送Http Request
   * 依設定直接發送或取得模擬資料
   * @param apiUrl API路徑
   * @param data 上行資料
   * @param options 選
   */
  send(apiUrl: string, data?: any, options?: TelegramOption): Promise<T> {

    return this.post(apiUrl, data);

  }

  /**
   * 發送AJAX請求
   * @param apiUrl API名稱
   * @param data 上傳資料
   */
  private post(path: string, body: Object = {}): Promise<any> {

    // return this.deviceInfo.devicesInfo()
    //   .then((devicesInfo) => {
    //     // logger.debug("a.devicesInfo:"+JSON.stringify(devicesInfo));
    //     return this.crypto.InitPhoneData(devicesInfo);
    //   }
    //   )
    //   .then((InitPhoneRes) => {
    //     // logger.debug("b.InitPhoneRes:"+JSON.stringify(InitPhoneRes));
    //     return this.crypto.GetServerToken();
    //   }
    //   )
    return this.crypto.GetServerToken()
      .then((GetServerTokenRes) => {
        if (!this.temp_hitrust_auth) {
          this.temp_hitrust_auth = GetServerTokenRes.value;
          sessionStorage.temp_hitrust_auth = this.temp_hitrust_auth;
        }
        return this.crypto.GenerateSessionID();
      }
      )
      .then((GenerateSessionIDRes) => {
        logger.debug("d.GenerateSessionIDRes:"+JSON.stringify(GenerateSessionIDRes));
        if (!this.temp_auth_token) {
          this.temp_auth_token = GenerateSessionIDRes.value;
          sessionStorage.temp_auth_token = this.temp_auth_token;
        }
        // logger.debug("d.temp_hitrust_auth:"+this.temp_hitrust_auth);
        // logger.debug("d.temp_auth_token:"+this.temp_auth_token);
        let httpOptions = {
          headers: new HttpHeaders()
            .set('hitrust_auth', this.temp_hitrust_auth)
            .set('auth_token', this.temp_auth_token)
        };

        let tempBody = '';
        tempBody = JSON.stringify(body);
        switch (path.toLowerCase()) {
          case 'register':
            this.reqUrl = `${environment.SERVER_URL}/${environment.REGISTER}`;
            break;
          case 'handshake':
            this.reqUrl = `${environment.SERVER_URL}/${environment.HAND_SHAKE}`;
            break;
          case 'exchangekey':
            this.reqUrl = `${environment.SERVER_URL}/${environment.EXCHANGE_KEY}`;
            break;
          default:
            httpOptions = {
              headers: new HttpHeaders()
                .set('hitrust_auth', this.temp_hitrust_auth)
                .set('auth_token', this.temp_auth_token)
                .set('Content-type', 'application/json; charset=UTF-8')
            };
            let xx: any;
            xx = body;
            tempBody = xx.form;
            this.reqUrl = `${environment.SERVER_URL}${environment.API_URL}`;
            break;
        }

        // logger.debug('HandshakeTelegramService telegram reqUrl:' + this.reqUrl);
        // logger.debug('HandshakeTelegramService telegram tempBody:' + typeof tempBody + '  '  + tempBody);
        // logger.debug('HandshakeTelegramService telegram header:' + JSON.stringify(httpOptions));

        return this.http.post(
          this.reqUrl,
          tempBody,
          httpOptions
        ).pipe(timeout(environment.HTTP_TIMEOUT)).toPromise(); // .timeout(environment.HTTP_TIMEOUT).toPromise();

      }
      )
      .catch(err => {
        logger.error('err :', err);
        return Promise.reject(err);
      });
  }

}

