import { Injectable } from '@angular/core';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { FQ000101ReqBody } from '@api/fq/fq000101/fq000101-req';
import { FQ000101ApiService } from '@api/fq/fq000101/fq000101-api.service';
import { AuthService } from '@core/auth/auth.service';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000101ReqBody } from '@api/f5/f5000101/f5000101-req';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FQ000306ApiService } from '@api/fq/fq000306/fq000306-api.service';
import { FQ000307ApiService } from '@api/fq/fq000307/fq000307-api.service';
import { FQ000306ReqBody } from '@api/fq/fq000306/fq000306-req';
import { FQ000307ReqBody } from '@api/fq/fq000307/fq000307-req';
import { FormateService } from '@shared/formate/formate.service';
import { logger } from '@shared/util/log-util';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { environment } from 'environments/environment';
import { FQ000116ReqBody } from '@api/fq/fq000116/fq000116-req';
import { FQ000116ApiService } from '@api/fq/fq000116/fq000116-api.service';
import { InAppBrowserService } from '@lib/plugins/in-app-browser/in-app-browser.service';
@Injectable()
export class EPayService {
  constructor(
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private fq000101: FQ000101ApiService,
    private f5000101: F5000101ApiService,
    private fq000306: FQ000306ApiService,
    private fq000307: FQ000307ApiService,
    private _formateService: FormateService,
    private fq000116: FQ000116ApiService,
    private inAppBrowser: InAppBrowserService
  ) { }

  sendFQ000101(type: string) {
    if (type == 'T') {
      return this.fq000101.getTrans()
        .then(
          (resObj) => {

            return Promise.resolve(resObj);
          })
        .catch(
          (errorObj) => {
            return Promise.reject(errorObj);
          });
    } else {
      return new Promise((resolve, reject) => {
        const form = new FQ000101ReqBody();
        form.custId = this.auth.getCustId();
        form.txnType = type;
        this.fq000101.send(form)
          .then(
            (fq000101res) => {
              logger.error("fq000101 success", fq000101res);
              resolve(fq000101res.body);
            }).catch(
              error => {
                logger.error("fq000101 error", error);
                reject(error);
              });
      });
    }

  }

  sendFQ000306(reqObj) {
    return new Promise((resolve, reject) => {
      const form = new FQ000306ReqBody();
      const custId = this.auth.getCustId();
      if (custId == '') {
        return false;
      }
      form.custId = custId;
      form.logId = reqObj.logId;
      form.mode = reqObj.mode;
      logger.debug('fq000306 form = ' + JSON.stringify(form));
      this.fq000306.send(form)
        .then(
          (fq000306res) => {
            resolve(fq000306res.body);
          }).catch(
            error => {
              reject(error);
            });
    });
  }

  sendFQ000307(qrcodeSN) {
    return new Promise((resolve, reject) => {
      const form = new FQ000307ReqBody();
      const custId = this.auth.getCustId();
      if (custId == '') {
        return false;
      }
      form.custId = custId;
      form.qrcodeSN = qrcodeSN;
      logger.debug('fq000307 form = ' + JSON.stringify(form));
      this.fq000307.send(form, { background: true })
        .then(
          (fq000307res) => {

            let output = EpayApiUtil.modifyResponse(fq000307res);
            resolve(output);
          }).catch(
            error => {
              reject(error);
            });
    });
  }
  /**
   * filterObj:{
   *  type:'in'=1 'out'=2 or  'in,out'=3
   *  currency: 'TWD' OR ' ' 非台幣 預設台幣
   * }
   * 
   */

  sendF5000101(type: string, filterObj?) {
    return new Promise((resolve, reject) => {
      const form = new F5000101ReqBody();
      form.custId = this.auth.getCustId();
      form.type = type;
      this.f5000101.send(form).then(
        (sucess) => {
          sucess = this.f5000101.modifyTrans(sucess.body);
          if (filterObj != undefined && typeof filterObj == 'object' && filterObj
            && filterObj.hasOwnProperty('type') && filterObj.hasOwnProperty('currency')) {
            sucess = this.filterAccount(sucess, filterObj);
          }
          resolve(sucess);
        },
        (failed) => {
          reject(failed);
        }
      );
    });
  }
  filterAccount(dataObj, filterObj) {
    let tempInObj = [];
    let tempOutObj = [];
    // 過濾轉入
    if (filterObj.type == '1' || filterObj.type == '3') {
      dataObj.trnsInAccts.forEach(
        (trnsInAcct) => {
          if (filterObj.currency != '') {
            // 只有指定幣別帳戶
            if (trnsInAcct.trnsInCurr.indexOf(filterObj.currency) > -1) {
              tempInObj.push(trnsInAcct);
            }
          } else if (filterObj.currency == '') {
            // 只有外幣帳戶
            if (trnsInAcct.trnsInCurr.indexOf('TWD') == -1) {
              tempInObj.push(trnsInAcct);
            }
          }
        });
      dataObj.trnsInAccts = tempInObj;
    }
    // 過濾轉出
    if (filterObj.type == '2' || filterObj.type == '3') {
      dataObj.trnsOutAccts.forEach(
        (trnsOutAcct) => {

          if (filterObj.currency != '') {
            // 只有台幣帳戶
            if (trnsOutAcct.trnsOutCurr.indexOf(filterObj.currency) > -1) {
              tempOutObj.push(trnsOutAcct);
            }
          } else if (filterObj.currency == '') {
            // 只有外幣帳戶
            if (trnsOutAcct.trnsOutCurr.indexOf('TWD') == -1) {
              tempOutObj.push(trnsOutAcct);
            }
          }
        });
      dataObj.trnsOutAccts = tempOutObj;
    }
    return dataObj;
  }

  TransArray(data, transData) {
    // data.body.details = ObjectCheckUtil.modifyTransArray(data.body['details']['detail']);
    data = ObjectCheckUtil.modifyTransArray(transData);
    return data;
  }

  // 組退款結果頁DATA
  doRsultData(resObj, setData) {
    let info_data = [];
    let tmp_data: any;
    if (resObj.status) {
      // trunk 結果頁沒信卡判斷 待確認是否同詳細頁修改
      let isCard = true;
      if (setData.trnsAcct.length == '13') {
        isCard = false;
      }
      // 交易序號
      info_data.push({
        title: '交易序號',
        content: this._formateService.checkField(setData, 'trnsNo')
      });
      // 交易時間
      tmp_data = this._formateService.checkField(setData, 'trnsDate');
      info_data.push({
        title: '交易時間',
        content: this._formateService.transDate(tmp_data)
      });
      let money = this._formateService.checkField(setData, 'trnsAmount');
      if (!!money) {
        money = this._formateService.transMoney(money, 'TWD');
      }
      // 非信卡

      if (setData.mode == '0' && !isCard) {
        info_data.push({
          title: '店家名稱',
          content: this._formateService.checkField(setData, 'storeName')
        });
        info_data.push({
          title: '訂單編號',
          content: this._formateService.checkField(setData, 'orderNo')
        });
        info_data.push({
          title: '付款方式',
          content: '帳戶扣款'
        });
        info_data.push({
          title: '交易帳號',
          content: this._formateService.checkField(setData, 'trnsAcct')
        });
        info_data.push({
          title: '交易金額',
          content: money
        });

      }
      // 信卡
      if (isCard) {
        info_data.push({
          title: '付款方式',
          content: '信用卡'
        });
        info_data.push({
          title: '交易卡號',
          content: this._formateService.transAccount(this._formateService.checkField(setData, 'trnsAcct'), 'mask')
        });
        info_data.push({
          title: '交易授權碼',
          content: this._formateService.checkField(setData, 'authCode')
        });
        info_data.push({
          title: '交易金額',
          content: money
        });
      }


    } else {
      // 錯誤代碼
      info_data.push({
        title: 'EPAY.FIELD.hostCode',
        content: this._formateService.checkField(resObj, 'hostCode')
      });
      // 主機代碼訊息
      info_data.push({
        title: 'EPAY.FIELD.hostCodeMsg',
        content: this._formateService.checkField(resObj, 'hostCodeMsg')
      });
    }
    let output = {
      title: resObj.title, // 結果狀態
      content_params: {}, // 副標題i18n
      content: resObj.msg, // 結果內容
      classType: resObj.classType, // 結果樣式
      detailData: info_data,
      button: 'EPAY.FIELD.BACK_EPAY', // 返回合庫E Pay
      buttonPath: 'epay'
    };

    return output;
  }

  webToAppRes(body: FQ000116ReqBody) {
    this.fq000116.send(body)
      .then((data) => {
        const url = `${environment.FISC_URL}WebToAppRes?acqBank=${body.acqBank}&terminalId=${body.terminalId}&merchantId=${body.merchantId}&encRetURL=${body.encRetURL}&orderNumber=${body.orderNumber}&cardPlan=${body.cardPlan}&responseCode=${body.responseCode}&hostId=${data.body.hostId}&verifyCode=${data.body.verifyCode}`;
        this.inAppBrowser.open(url, '_system');
      }).catch((error) => {
        // this.loading.hide('Epay_analyze'); // 關閉解析中畫面
      });
  }
}
