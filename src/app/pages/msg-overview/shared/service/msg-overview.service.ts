import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Logger } from '@core/system/logger/logger.service';
// import { P1000001ApiService } from '@api/p1/p1000001/p1000001-api.service';
import { P1000001ReqBody } from '@api/p1/p1000001/p1000001-req';
import { AuthService } from '@core/auth/auth.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { P1000001ApiService } from '@api/p1/p1000001/p1000001-api.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';

export interface BlockTypeObj {
  OTP_PWD_ALERT: boolean; // OTP密碼通知
  TCB_ACCOUNT_FEREMIT: boolean; // 外匯存款入帳通知
  TCB_ACCOUNT_FDREGULAR: boolean; // 外匯定存到期通知
  TCB_PUSH_SETTING: boolean; // 通知提醒設定
  TCB_ACCOUNT: boolean; // 帳務通知
  TCB_ALERT_EXCHANGE: boolean; // 匯率到價
  TCB_ALERT_FUND: boolean; // 基金停損獲利
  TCB_PROMOTE: boolean; // 優惠
  notificationSilent: boolean; // 通知靜音設定
  daySilent: boolean; // 白天靜音
  nightSilent: boolean; // 晚上靜音
}

@Injectable()
export class MsgOverviewService {
  editableSubject: Subject<any> = new Subject<any>();
  activeBookMark2Subject: Subject<any> = new Subject<any>();
  constructor(
    private _logger: Logger,
    private p1000001: P1000001ApiService,
    private auth: AuthService,
    private session: SessionStorageService,
    private local: LocalStorageService
  ) { }

  /**
   * 取得帳號的封鎖狀態
   */
  getBlockType(): BlockTypeObj {
    let obj = this.local.getObj('BlockType');
    if (!!obj) {
      return obj;
    } else {
      const temp: BlockTypeObj = { // default blockType
        OTP_PWD_ALERT: false,
        TCB_ACCOUNT_FEREMIT: false,
        TCB_ACCOUNT_FDREGULAR: false,
        TCB_PUSH_SETTING: true,
        TCB_ACCOUNT: true,
        TCB_ALERT_EXCHANGE: true,
        TCB_ALERT_FUND: true,
        TCB_PROMOTE: true,
        notificationSilent: false, // 通知靜音設定
        daySilent: false, // 白天靜音
        nightSilent: false // 晚上靜音
      };
      this.saveBlockType(temp);
      return temp;
    }
  }

  /**
   * 儲存帳號的封鎖狀態
   * @param obj
   */
  saveBlockType(obj: BlockTypeObj) {
    this.local.setObj('BlockType', obj);
  }

  /**
   * 成功 -> 回資料obj，失敗 -> 回alert字串
   * @param obj { rspCode:"0000", rspMsg:"success", data: Object } success-> return data，!success -> return rspCode + rsoMsg
   */
  modifyPluginObj(obj) {
    this._logger.log(`modifyPluginObj ${JSON.stringify(obj)}`);
    if (!!obj.rspCode) {
      if (obj.rspCode == '0000') {
        return obj.data;
      } else {
        return `${obj.rspCode} ${obj.rspMsg}`;
      }
    } else {
      return null;
    }
  }

  /**
   * success -> return null; fail -> return alert 字串
   * @param obj { "rspCode": "0000", "rspMsg": "success" } 沒有 data
   */
  checkPluginSuccess(obj) {
    this._logger.log(`checkPluginSuccess ${JSON.stringify(obj)}`);
    if (!!obj.rspCode) {
      if (obj.rspCode == '0000') {
        return null;
      } else {
        return `${obj.rspCode} ${obj.rspMsg}`;
      }
    } else {
      return null;
    }
  }

  /**
     * 已讀訊息
     * @param chatId 多組可用半形逗號隔開
     */
  readMsg(chatId: string): Promise<any> {

    let reqObj: P1000001ReqBody = {
      custId: this.auth.getCustId(),
      pushGuid: this.session.getObj('userInfo')['pushGuid'],
      chatId: chatId
    }
    return this.p1000001.send(reqObj).then(res => {
      return !!res['body'] ? res['body'] : res;
    }).catch(err => {
      return Promise.reject(err);
    });
  }

}
