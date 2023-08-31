import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'environments/environment';
import { TelegramOption } from './telegram-option';
import { HandshakeService } from './handshake.service';
import { LoadingSpinnerService } from '@core/layout/loading/loading-spinner.service';
import { JsonConvertUtil } from '@shared/util/json-convert-util';
import { ReqHeader } from '@base/api/model/req-header';
import { timeout } from 'rxjs/operators';
import { FormateService } from '@shared/formate/formate.service';
import { CacheService } from '@core/system/cache/cache.service';
import { logger } from '@shared/util/log-util';
import { CommonUtil } from '@shared/util/common-util';
import { Subject } from 'rxjs/Subject';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

declare var $: any;

@Injectable()
export class TelegramService<T> {
  telegramSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private handshake: HandshakeService,
    private loading: LoadingSpinnerService,
    private log: Logger,
    private cache: CacheService,
    private formateService: FormateService
  ) {

  }
  errorHandle(serviceId: string, error) {
    this.loading.hide(serviceId);
    return Promise.reject(error);
  }

  /**
   * 發送Http Request
   * 依設定直接發送或取得模擬資料
   * @param serviceId 電文ID
   * @param data 上行資料
   * @param options 選
   */
  send(serviceId: string, data?: any, options?: TelegramOption): Promise<T> {

    // return this.checkIsMaintain('client')
    // .then(() => {
    // Success Start====
    this.log.step('Telegram', 'telegram start', serviceId, this.formateService.transClone(data), this.formateService.transClone(options));
    let header: ReqHeader;
    if (!!options && !!options.header) {
      header = options.header;
    }
    if (!options || !options.background) {
      this.loading.show(serviceId);
    }
    if (!!options && !!options.useCache) {
      const res = this.cache.load(serviceId + ':' + JSON.stringify(data));
      if (!!res) {
        logger.log('====load from cache====');
        this.loading.hide(serviceId);
        return Promise.resolve(this.formateService.transClone(res));
      }
    }
    // if (!data.header) {
    //   data.header = {};
    // }
    // data.header.uid = this.appConf.getAuthInfo().authId;
    // return this.post(apiUrl, data);
    this.telegramSubject.next();
    if (environment.ONLINE) {
      return this.handshake.send(serviceId, data, header).then((res) => {
        this.log.step('Telegram', 'handshake send end', serviceId, this.formateService.transClone(res));
        this.log.step('Telegram', 'handshake send str', JSON.stringify(res));
        this.loading.hide(serviceId);
        this.cahceRes(serviceId, data, res, options);
        return res;
      }, (err) => {
        this.log.step('Telegram', 'handshake send error end', serviceId, this.formateService.transClone(err));
        return this.checkIsMaintain('server').then(
          (checkIsMaintain_S) => {
            return this.errorHandle(serviceId, checkIsMaintain_S);
          },(checkIsMaintain_E)=>{ 
            return this.errorHandle(serviceId, checkIsMaintain_E);
          });
      });
    } else {
      const simulationTime = environment.SIMULATION_TIME;
      return CommonUtil.wait(simulationTime)
        .then(() => this.post(serviceId, data, header))
        .then((res) => {
          this.loading.hide(serviceId);
          this.cahceRes(serviceId, data, res, options);
          return res;
        });
    }

    // // Success End
    // }).catch((maintainErr) => {
    //   return Promise.reject(maintainErr);
    // });
  }

  /**
   * 暫存回傳資料
   * @param serviceId serviceId
   * @param data 上行data
   * @param res 回傳res
   * @param options TelegramOption
   */
  private cahceRes(serviceId: string, data: any, res: any, options: TelegramOption) {
    if (!!options && !!options.useCache) {
      this.cache.save(serviceId + ':' + JSON.stringify(data), this.formateService.transClone(res), options.cacheOpt);
    }
  }

  /**
   * 發送AJAX請求(for Simulation)
   * @param apiUrl API名稱
   * @param data 上傳資料
   */
  private post(serviceId: string, body: Object = {}, header?: ReqHeader): Promise<any> {
    // devicesInfo['serviceId'] = serviceId;
    const devicesInfo = {
      'udid': 'device.uuid',
      'appuid': 'device.appinfo.identifier',
      'model': 'device.model',
      'platform': 'android',
      'osversion': '9.8.7',
      'appversion': '3.14',
      'appinfo': { 'version': '' },
      'name': 'simulation',
      'manufacturer': 'device.manufacturer',
      'hack': false,
      'pushon': true,
      'tokenid': '123'
    };
    devicesInfo['serviceId'] = serviceId;
    // logger.debug('devicesInfo:' + JSON.stringify(devicesInfo));
    let headerobj = JsonConvertUtil.setTelegramHeader(devicesInfo);
    headerobj = { ...headerobj, ...header };
    // logger.debug('headerobj:' + JSON.stringify(headerobj));
    const jsonObj = JsonConvertUtil.converToXmlJson(serviceId, body, headerobj);
    this.log.step('Telegram', 'post start (simulation)', JSON.stringify(jsonObj));
    return this.http.post(
      `${environment.SERVER_URL}/${serviceId}`,
      JSON.stringify(jsonObj)
    ).pipe(timeout(environment.HTTP_TIMEOUT)).toPromise();
  }




  async checkIsMaintain(type): Promise<any> {
    let errorObj = new HandleErrorOptions('ERROR.NO_SERVICE', 'ERROR.INFO_TITLE');

    let isMaintain = true;

    let localAnno: any = {
      status: false,
      start: 0,
      end: 0,
      msg: '',
      data: {}
    };
    
    try {
      const now_time = DateUtil.transDate('NOW_TIME', 'timestamp');
      if (type == 'server') {
        let isInRange = false;
        let local_anno = await this.checkAnnoClient(now_time);
        if (typeof local_anno == 'object' && local_anno) {
          isMaintain = local_anno.maintain;
          isInRange = local_anno.isInRange;
          if (isMaintain) {
            errorObj.content = local_anno.msg;
          }
        }
        if (!isMaintain) { 
          let server_anno = await this.checkAnnoServer(now_time);
          logger.log('Anno', 'server', server_anno);
          if (typeof server_anno == 'object' && !!server_anno) {
            // server 停機公告整理
            isMaintain = server_anno.maintain;
            if (isMaintain) {
              errorObj.content = server_anno.msg;
            }
          }
        }


      } else {
        let local_anno = await this.checkAnnoClient(now_time);
        logger.log('Anno', 'local', local_anno);
        if (typeof local_anno == 'object' && local_anno) {
          // local 停機公告整理
          isMaintain = local_anno.maintain;
          if (isMaintain) {
            errorObj.content = local_anno.msg;
          }
        }
      }

      logger.warn('anno end');
      if (isMaintain) {
        return Promise.reject(errorObj);
      } else {
        return Promise.resolve();
      }  
    } catch (noMaintain) {
      return Promise.resolve();
    }

  }

  /**
   * client 停機公告
   * @param now_time
   */
  private checkAnnoClient(now_time): Promise<any> {
    return new Promise((resolve, reject) => {
      let output = {
        maintain: false,
        msg: 'ERROR.NO_SERVICE',
        time_s: 0,
        time_e: 0,
        isInRange: false
      };
      const range_time = 3600000 * 6; // 6H

      if (!now_time || now_time <= 0) {
        reject(output);
        return false;
      }

      const local_anno_path = './assets/data/terms/maintain.json';
      this.http.get(local_anno_path).toPromise().then(
        (local_anno) => {
          // local 停機公告整理
          logger.log('Anno', 'local', local_anno);
          if (typeof local_anno == 'object' && !!local_anno) {
            let tmp_d = FieldUtil.checkField(local_anno, 'date');
            let tmp_s = FieldUtil.checkField(local_anno, 'start');
            let tmp_e = FieldUtil.checkField(local_anno, 'end');
            let server_msg = FieldUtil.checkField(local_anno, 'msg');
            let server_time_s = DateUtil.transDate(tmp_s, 'timestamp');
            let server_time_e = DateUtil.transDate(tmp_e, 'timestamp');
            let server_time_d = DateUtil.transDate(tmp_d, 'date');

            let isServerMaintain = false;
            if (server_time_e != 0
              && now_time >= server_time_s
            ) {
              // 維護開始
              if (now_time <= server_time_e) {
                isServerMaintain = true;
                if (server_msg != '') {
                  output.msg = server_msg;
                }
              }
              // 維護超過預期
              let more_range = (now_time - server_time_e) / range_time;
              if (server_time_d == DateUtil.transDate(now_time, 'date')
                || (more_range > 0 && more_range <= 1)
              ) {
                output.isInRange = true;
              }
            }
            output.maintain = isServerMaintain;
            output.time_s = server_time_s;
            output.time_e = server_time_e;
            resolve(output);
          }
        }
      ).catch((errorClient) => {
        output.maintain = false;
        resolve(output);
      });

    });
  }

  /**
   * server停機公告
   * @param now_time
   */
  private checkAnnoServer(now_time): Promise<any> {
    return new Promise((resolve, reject) => {
      let output = {
        maintain: false,
        msg: 'ERROR.NO_SERVICE',
        time_s: 0,
        time_e: 0
      };

      if (!now_time || now_time <= 0) {
        reject(output);
        return false;
      }


      let server_url = environment.SERVER_URL;
      if (environment.PRODUCTION) {
        server_url = server_url.replace('NMobileBank', '');
      } else {
        server_url = server_url.replace(/MobileBankDev_P4|MobileBankDev_P2/g, '');
      }
      let server_anno_path = server_url + 'app_disabled.html';
      logger.warn('anno', server_anno_path);
      // this.http.post(server_anno_path, {}, httpOptions).pipe(timeout(environment.HTTP_TIMEOUT)).toPromise().then(
      //   (res) => {
      //     console.warn('anno post', res);
      //   }
      // ).catch((error) => {
      //   console.error('anno post', error);
      // });

      let client = new XMLHttpRequest();
      client.open('GET', server_anno_path);
      client.onreadystatechange = () => {
        if (!client || client.readyState != 4) {
          return false;
        }
        if (!!client && client.status == 200) {
            let server_anno={};
            if(typeof client.responseText == 'string'){
              try {
                server_anno=JSON.parse(client.responseText);
                if (typeof server_anno == 'object' && !!server_anno) {
                  let tmp_s = FieldUtil.checkField(server_anno, 'start');
                  let tmp_e = FieldUtil.checkField(server_anno, 'end');
                  // // test
                  // tmp_e = '2019/12/13 00:00:00';
                  let server_msg = FieldUtil.checkField(server_anno, 'msg');
                  let server_time_s = DateUtil.transDate(tmp_s, 'timestamp');
                  let server_time_e = DateUtil.transDate(tmp_e, 'timestamp');
                  let isServerMaintain = false;
                  if (server_time_e != 0 &&
                    now_time <= server_time_e && now_time >= server_time_s
                  ) {
                    isServerMaintain = true;
                    if (server_msg != '') {
                      output.msg = server_msg;
                    }
                  }
                  output.maintain = isServerMaintain;
                  output.time_s = server_time_s;
                  output.time_e = server_time_e;
                  resolve(output);
                  return true;
                }

              } catch(e) {
                reject(output);
                return false;
              }
            }
        } else {
          logger.log('Anno', 'server no', client);
          reject(client);
          return false;
        }
      };
      client.send();
    });
  }

}

