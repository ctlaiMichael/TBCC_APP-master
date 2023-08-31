/**
 * 雲端發票
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';

// ---------------- API Start ---------------- //
import { FQ000101ReqBody } from '@api/fq/fq000101/fq000101-req';
import { FQ000101ApiService } from '@api/fq/fq000101/fq000101-api.service';

import { FQ000305ReqBody } from '@api/fq/fq000305/fq000305-req';
import { FQ000305ApiService } from '@api/fq/fq000305/fq000305-api.service';
import { FQ000406ReqBody } from '@api/fq/fq000406/fq000406-req';
import { FQ000406ApiService } from '@api/fq/fq000406/fq000406-api.service';

import { FQ000301ReqBody } from '@api/fq/fq000301/fq000301-req';
import { FQ000301ApiService } from '@api/fq/fq000301/fq000301-api.service';
import { FQ000403ReqBody } from '@api/fq/fq000403/fq000403-req';
import { FQ000403ApiService } from '@api/fq/fq000403/fq000403-api.service';
import { FQ000401ReqBody } from '@api/fq/fq000401/fq000401-req';
import { FQ000401ApiService } from '@api/fq/fq000401/fq000401-api.service';
import { FQ000405ReqBody } from '@api/fq/fq000405/fq000405-req';
import { FQ000405ApiService } from '@api/fq/fq000405/fq000405-api.service';

@Injectable()
export class InvoiceService {
  constructor(
    private _logger: Logger,
    private _formateService: FormateService,
    private _checkService: CheckService
    , private localStorage: LocalStorageService
    , private auth: AuthService
    // ---------------- API Start ---------------- //
    , private fq000101: FQ000101ApiService // QR Code轉出帳號查詢
    , private fq000305: FQ000305ApiService // 愛心碼登錄
    , private fq000406: FQ000406ApiService // 愛心碼查詢
    , private fq000301: FQ000301ApiService // 手機載具註冊
    , private fq000403: FQ000403ApiService // 手機條碼查詢
    , private fq000401: FQ000401ApiService // 手機條碼註冊
    , private fq000405: FQ000405ApiService // 忘記手機條碼驗證碼
  ) { }

  /**
   * QR Code轉出帳號查詢
   * @param type
   */
  sendFQ000101(type: string) {
    return new Promise((resolve, reject) => {
      const form = new FQ000101ReqBody();
      form.custId = this.auth.getCustId();
      form.txnType = type;
      this.fq000101.send(form)
        .then(
          (fq000101res) => {
            resolve(fq000101res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 手機載具註冊
   * @param reqObj
   */
  sendFQ000301(reqObj) {
    return new Promise((resolve, reject) => {
      const form = new FQ000301ReqBody();
      form.custId = this.auth.getCustId();
      form.mobileBarcode = reqObj.mobileBarcode;
      form.loveCode = reqObj.loveCode;
      form.socialWelfareName = reqObj.socialWelfareName;
      form.defaultBarcode = reqObj.defaultBarcode;
      logger.debug('301:' + JSON.stringify(form));
      this.fq000301.send(form)
        .then(
          (fq000301res) => {
            resolve(fq000301res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 查詢手機條碼
   * @param reqObj
   */
  sendFQ000403(reqObj: any) {
    return new Promise((resolve, reject) => {
      const form = new FQ000403ReqBody();
      form.phoneNo = reqObj['phoneNo'];
      form.verifyCode = reqObj['verifyCode'];
      this.fq000403.send(form)
        .then(
          (fq000403res) => {
            resolve(fq000403res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 手機條碼註冊
   * @param reqObj
   */
  sendFQ000401(reqObj: any) {
    return new Promise((resolve, reject) => {
      const form = new FQ000401ReqBody();
      form.email = reqObj['email'];
      form.phoneNo = reqObj['phoneNo'];

      this.fq000401.send(form)
        .then(
          (fq000401res) => {
            resolve(fq000401res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 忘記手機條碼驗證碼
   * @param reqObj
   */
  sendFQ000405(reqObj: any) {
    return new Promise((resolve, reject) => {
      const form = new FQ000405ReqBody();
      form.email = reqObj['email'];
      form.phoneNo = reqObj['phoneNo'];

      this.fq000405.send(form)
        .then(
          (fq000405res) => {
            resolve(fq000405res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 愛心碼登錄
   * @param reqObj
   */
  sendFQ000305(reqObj) {
    return new Promise((resolve, reject) => {
      const form = new FQ000305ReqBody();
      form.custId = this.auth.getCustId();
      form.mobileBarcode = reqObj.mobileBarcode;
      form.loveCode = reqObj.loveCode;
      form.socialWelfareName = reqObj.socialWelfareName;
      form.defaultBarcode = reqObj.defaultBarcode;
      logger.debug('fq000305 form = ' + JSON.stringify(form));
      this.fq000305.send(form)
        .then(
          (fq000305res) => {
            resolve(fq000305res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 愛心碼查詢
   * @param keyword
   */
  sendFQ000406(keyword: string) {
    return new Promise((resolve, reject) => {
      const form = new FQ000406ReqBody();
      form.keyword = keyword;
      this.fq000406.send(form)
        .then(
          (fq000406res) => {
            resolve(fq000406res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  /**
   * 收到中台回覆後，將雲端發票extend回覆資料到response
   * @param res 下行電文
   */
  convertRes(res) {
    let reslut;
    try {
      let resData = JSON.parse(res.resData);
      try {
        res = { ...res, ...resData };
        if (res.code != "200") {
          res.trnsRsltCode = "1";
          res.respCode = "1";
          res.hostCode = res.code;
          res.respCodeMsg = res.msg;
        } else {
          res.trnsRsltCode = "0";
          res.respCode = "0";
        }
        reslut = res;
      } catch (err) {
        reslut = "雲端發票資料有誤";
      }
    } catch (e) {
      reslut = "雲端發票資料有誤";
    }
    return reslut;
  }

}
