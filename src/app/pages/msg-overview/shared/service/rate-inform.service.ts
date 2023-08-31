import { Injectable } from '@angular/core';
import { P1000002ApiService } from '@api/p1/p1000002/p1000002-api.service';
import { Logger } from '@core/system/logger/logger.service';
import { AuthService } from '@core/auth/auth.service';
import { FB000201ApiService } from '@api/fb/fb000201/fb000201-api.service';
import { P1000002ReqBody } from '@api/p1/p1000002/p1000002-req';
import { RateInformObj } from '@pages/msg-overview/rate-inform-page/rate-inform-page.component';

@Injectable()
export class RateInformService {

  constructor(
    private p1000002: P1000002ApiService,
    private fb000201: FB000201ApiService,
    private _logger: Logger,
    private auth: AuthService
  ) { }

  /**
   * 到價通知 標題 買賣別
   * @param type: 'ForeignExchange' | 'TWDExchange '; // 買賣別
   */
  showTypeTitle(originText: string) {
    switch (originText) {
      case 'ForeignExchange':
        return '賣外幣';
      case 'TWDExchange':
        return '買外幣';
      default:
        return originText;
    }
  }

  /**
   * 到價通知 內容 買賣別
   * @param type: 'ForeignExchange' | 'TWDExchange '; // 買賣別
   */
  showTypeRow(originText: string) {
    switch (originText) {
      case 'ForeignExchange':
        return '外幣兌換新台幣';
      case 'TWDExchange':
        return '新台幣兌換外幣';
      default:
        return originText;
    }
  }

  /**
   * 到價通知 內容 買賣別
   * @param exchangeType: 'PROMPT' | 'CASH'; // 種類
   */
  showExchangeType(originText: string) {
    switch (originText) {
      case 'PROMPT':
        return '即期匯率';
      case 'CASH':
        return '現鈔匯率';
      default:
        return originText;
    }
  }

  /**
   * 顯示條件
   * @param originText condition: 'Big' | 'Small'; // 條件
   */
  showCondition(originText: string) {
    switch (originText) {
      case 'Big':
        return '高於';
      case 'Small':
        return '低於';
      default:
        return originText;
    }
  }

  /**
   * 取得幣別
   */
  getCurrency(): Promise<any> {
    return this.fb000201.getData();
  }

  /**
   * 新增到價通知
   */
  add_edit_RateInform(isEdit: boolean, rateInformObj: RateInformObj): Promise<any> {
    let reqObj: P1000002ReqBody = {
      custId: this.auth.getCustId(),
      editType: isEdit ? "edit" : "add",
      id: isEdit ? rateInformObj.id : "",
      currency: rateInformObj.currency,
      type: rateInformObj.type,
      exchangeType: rateInformObj.exchangeType,
      condition: rateInformObj.condition,
      exchange: rateInformObj.exchange,
      frequency: rateInformObj.frequency
    };
    this._logger.log(`add_edit_RateInform reqObj = ${JSON.stringify(reqObj)}`);
    return this.p1000002.send(reqObj).then(res => {
      this._logger.log(`add_edit_RateInform res = ${JSON.stringify(res)}`);
      return res;
    }).catch(err => {
      this._logger.log(`add_edit_RateInform err = ${JSON.stringify(err)}`);
      return Promise.reject(err);
    });
  }

  /**
   * 刪除到價通知
   * @param id 編號
   */
  delRateInform(id: string) {
    let reqObj: P1000002ReqBody = {
      custId: this.auth.getCustId(),
      editType: 'del',
      id: id,
      currency: '',
      type: '',
      exchangeType: '',
      condition: '',
      exchange: '',
      frequency: ''
    };
    this._logger.log(`delRateInform reqObj = ${JSON.stringify(reqObj)}`);
    return this.p1000002.send(reqObj).then(res => {
      this._logger.log(`delRateInform res = ${JSON.stringify(res)}`);
      return res;
    }).catch(err => {
      this._logger.log(`delRateInform err = ${JSON.stringify(err)}`);
      return Promise.reject(err);
    });
  }

  /**
   * 查詢到價通知
   */
  queryRateInform() {
    let reqObj: P1000002ReqBody = {
      custId: this.auth.getCustId(),
      editType: "qry",
      id: "",
      currency: "",
      type: "",
      exchangeType: "",
      condition: "",
      exchange: "",
      frequency: ""
    };
    this._logger.log(`queryRateInform reqObj = ${JSON.stringify(reqObj)}`);
    return this.p1000002.send(reqObj).then(res => {
      this._logger.log(`queryRateInform res = ${JSON.stringify(res)}`);
      return res;
    }).catch(err => {
      this._logger.log(`queryRateInform err = ${JSON.stringify(err)}`);
      return Promise.reject(err);
    });
  }

  /**
   * 對errCode做處理，errCode為空->return null，else->return 對應錯誤
   * @param p1000002res p1000002下行
   */
  modify_p1000002(p1000002res): any {
    if (!!p1000002res.errCode) {
      switch (p1000002res.errCode) {
        case '5555':
          return '到價通知不得超過五筆';
        case '9999':
          return '未知異常';
        default:
          return p1000002res.errCode;
      }
    }
    return null;
  }

}
