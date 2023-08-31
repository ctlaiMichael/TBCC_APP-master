import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { DeviceService } from '@lib/plugins/device.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';
declare var plugin: any;

@Injectable()
export class PushService extends CordovaService {
  constructor(
    private deviceInfo: DeviceService,
    private _logger: Logger
  ) { super(); }

  /**
   * 回應碼 說明
   * 0000 成功
   * B0001 APP識別代碼為空
   * A0001 伺服器位置為空值
   * A0002 輸入資訊不足
   */

  /** 註冊推播
   * args array [ appId ,pushUrl ]
   */
  public init(): Promise<any> {
    let arg = [];
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => this.deviceInfo.devicesInfo())
        .then((devicesInfo) => {
		  logger.debug('devicesInfo:' + JSON.stringify(devicesInfo));
          let platform = devicesInfo.platform.toUpperCase();
          let version = devicesInfo.version;
          // 下列版本將push功能先關閉
          let blockVersion = ['13.1.2', '12.1.4', '13.1.3'];
          if (platform === 'ANDROID') {
            arg.push(environment.PUSH_ANDROID_APPID);
          } else if (platform === 'IOS' && !blockVersion.includes(version)) {
              arg.push(environment.PUSH_IOS_APPID);
          } else {
            return Promise.reject(false);
          }
          arg.push(environment.PUSH_URL);
          logger.debug('arg:' + JSON.stringify(arg));
          return new Promise((resolve, reject) => plugin.PushNotification.init(arg, resolve, reject));
        });
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve()));
    }
  }

  /** 設定個人推播
   * args array [ custId ,pushGuid ]
   */
  public setPushGuid(arg): Promise<any> {
    logger.debug('arg:' + JSON.stringify(arg));
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => plugin.PushNotification.setPushGuid(arg, resolve, reject)));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve()));
    }
  }

  /** 未登入 讀取公告訊息列表
   * 每個參數請帶字串
   * args array [ strMessageId, strMaxCount, strViaAccount, strBeginTime, strEndTime, strDir]
   * strMessageId : *int最大值 2147483647 固定帶入2147483647
   * strMaxCount  : 訊息的的筆數限制, 若未設定, 預設值為60, 不設定請帶0
   * strViaAccount: 發布訊息的類別帳號,可以多組,以半形逗號區隔; 若未設定,則會讀取所有類別的訊息,不設定請帶空字串"" *待確認: 可能會有行銷的type
   * strBeginTime : 查詢範圍的起始時間(yyyy/MM/dd hh:mm:ss), 不限制請帶空字串""
   * strEndTime   : 查詢範圍的結束時間(yyyy/MM/dd hh:mm:ss), 不限制請帶空字串""
   * strDir       : 0:往後抓資料, -1:往前抓資料 *-1:往前抓資料 固定帶入-1
   * return { rspCode:"0000", rspMsg:"success", data: Array }
   */
  public deviceGetMsgList(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let strMessageId = "2147483647";
          let strMaxCount = "0";
          let strViaAccount = "TCB_BROADCAST"; // 合庫報報(TCB_BROADCAST)
          let strBeginTime = "";
          let strEndTime = "";
          let strDir = "-1";
          let args = [strMessageId, strMaxCount, strViaAccount, strBeginTime, strEndTime, strDir];
          plugin.PushNotification.deviceGetMsgList(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            "rspCode": "0000",
            "rspMsg": "success",
            "data": [
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "111",
                "MessageID": "1111",
                "Title": "1408 BC push test from Hitrust 1",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "222",
                "MessageID": "2222",
                "Title": "1408 BC push test from Hitrust 2",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "33",
                "MessageID": "3333",
                "Title": "1408 BC push test from Hitrust 3 ",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "44",
                "MessageID": "4444",
                "Title": "1408 BC push test from Hitrust 4",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "55",
                "MessageID": "5555",
                "Title": "1408 BC push test from Hitrust 5",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "66",
                "MessageID": "6666",
                "Title": "1408 BC push test from Hitrust 6",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_TestNotify",
                "ChatID": "77",
                "MessageID": "7777",
                "Title": "1408 BC push test from Hitrust 7",
                "NotifyMode": 0,
                "DataTime": "2019/07/31 AM 11:13:49",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "ReadCount": 0
              }
            ]
          }
        )));
    }
  }

  /** 未登入 讀取公告訊息內容
   * 每個參數請帶字串
   * args array [ strMessageId ]
   * strMessageId : 訊息代碼
   * return { rspCode:"0000", rspMsg:"success", data: Object }
   */
  public deviceGetMsgContent(strMessageId: string): Promise<any> {
    this._logger.log(`deviceGetMsgContent strMessageId = ${strMessageId}`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let args = [strMessageId];
          plugin.PushNotification.deviceGetMsgContent(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          // {"rspCode":"9999","rspMsg":"網路連線逾時，請稍後再試","data":{}}
          {
            "rspCode": "0000",
            "rspMsg": "success",
            "data": {
              "SayPhone": "TCBProgram",
              "IsExpiry": false,
              "ViaAccount": "TCB_TestNotify",
              "ChatID": "",
              "MessageID": "1353",
              "Title": "1408 BC push test from Hitrust",
              "Content": "public content",
              "NotifyMode": 0,
              "DataTime": "2019/07/31 AM 11:13:49",
              "MsgReceiverType": 0,
              "ContentType": "0",
              "FunBody": "",
              "Funkey": "",
              "ReadCount": 0,
              "ReceiverCount": "179"
            }
          }
        )));
    }
  }

  /** 登入 讀取類別訊息標題的列表
   * args array [ strChatId, strMaxCount, strViaAccount, strBeginTime, strEndTime, strDir ]
   * strChatId : *int最大值 2147483647 固定帶入2147483647
   * strMaxCount  : 訊息的的筆數限制, 若未設定, 預設值為60, 不設定請帶0
   * strViaAccount: 發布訊息的類別帳號,可以多組,以半形逗號區隔; 若未設定,則會讀取所有類別的訊息,不設定請帶空字串""
   * strBeginTime : 查詢範圍的起始時間(yyyy/MM/dd hh:mm:ss), 不限制請帶空字串""
   * strEndTime   : 查詢範圍的結束時間(yyyy/MM/dd hh:mm:ss), 不限制請帶空字串""
   * strDir       : 0:往後抓資料, -1:往前抓資料 *-1:往前抓資料 固定帶入-1
   * return { rspCode:"0000", rspMsg:"success", data: Array }
   */
  public getBroadcastList(viaAccount?): Promise<any> {
    this._logger.log(`viaAccount = "${viaAccount}"`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let strChatId = '2147483647';
          let strMaxCount = '0';
          let strViaAccount = !!viaAccount ? viaAccount : 'TCB_ACCOUNT_OTP,TCB_ALERT_EXCHANGE,TCB_ALERT_FUND,TCB_PROMOTE';
          this._logger.log(`strViaAccount = "${strViaAccount}"`);
          let strBeginTime = '';
          let strEndTime = '';
          let strDir = '-1';
          let args = [strChatId, strMaxCount, strViaAccount, strBeginTime, strEndTime, strDir];
          plugin.PushNotification.getBroadcastList(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          // 有不在規格的類別
          // {
          //   "rspCode": "0000",
          //   "rspMsg": "success",
          //   "data": [
          //     {
          //       "SayPhone": "TCBProgram",
          //       "IsExpiry": false,
          //       "ViaAccount": "TCB_TestNotify",
          //       "ToPhone": "b121194483",
          //       "ChatID": "1223",
          //       "MessageID": "1358",
          //       "Title": "匯率到價CHF30.545匯率僅供參考",
          //       "Content": "",
          //       "NotifyMode": 0,
          //       "DataTime": "2019/08/01 AM 09:00:18",
          //       "MsgReceiverType": 0,
          //       "ContentType": "0",
          //       "IsRead": "1",
          //       "IsReadContent": "0",
          //       "ReadCount": 0,
          //       "ExtraMsg": "",
          //       "LinkApp": ""
          //     },
          //     {
          //       "SayPhone": "TCBProgram",
          //       "IsExpiry": false,
          //       "ViaAccount": "TCB_TestNotify",
          //       "ToPhone": "b121194483",
          //       "ChatID": "1223",
          //       "MessageID": "1358",
          //       "Title": "匯率到價CHF30.545匯率僅供參考",
          //       "Content": "",
          //       "NotifyMode": 0,
          //       "DataTime": "2019/08/01 AM 09:00:18",
          //       "MsgReceiverType": 0,
          //       "ContentType": "0",
          //       "IsRead": "1",
          //       "IsReadContent": "0",
          //       "ReadCount": 0,
          //       "ExtraMsg": "",
          //       "LinkApp": ""
          //     },
          //     {
          //       "SayPhone": "TCBProgram",
          //       "IsExpiry": false,
          //       "ViaAccount": "TCB_TestNotify",
          //       "ToPhone": "b121194483",
          //       "ChatID": "1223",
          //       "MessageID": "1358",
          //       "Title": "匯率到價CHF30.545匯率僅供參考",
          //       "Content": "",
          //       "NotifyMode": 0,
          //       "DataTime": "2019/08/01 AM 09:00:18",
          //       "MsgReceiverType": 0,
          //       "ContentType": "0",
          //       "IsRead": "1",
          //       "IsReadContent": "0",
          //       "ReadCount": 0,
          //       "ExtraMsg": "",
          //       "LinkApp": ""
          //     }
          //   ]
          // }

          // 各個類別
          {
            "rspCode": "0000",
            "rspMsg": "success",
            "data": [
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_ACCOUNT_OTP",
                "ToPhone": "b121194483",
                "ChatID": "111", // "279",
                "MessageID": "279",
                "Title": "TWD500到價通知1 TCB_ACCOUNT_OTP",
                "Content": "",
                "NotifyMode": 0,
                "DataTime": "2019/06/19 AM 11:08:33",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "0",
                "IsReadContent": "1",
                "ReadCount": 0
              }, {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_ACCOUNT_OTP",
                "ToPhone": "b121194483",
                "ChatID": "222",
                "MessageID": "279",
                "Title": "TWD500到價通知2 TCB_ACCOUNT_OTP",
                "Content": "",
                "NotifyMode": 0,
                "DataTime": "2019/06/19 AM 11:08:33",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "0",
                "IsReadContent": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_ALERT_FUND",
                "ToPhone": "b121194483",
                "ChatID": "333",
                "MessageID": "279",
                "Title": "TWD500到價通知3 TCB_ALERT_FUND",
                "Content": "",
                "NotifyMode": 0,
                "DataTime": "2019/06/19 AM 11:08:33",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "IsReadContent": "1",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_ALERT_EXCHANGE",
                "ToPhone": "b121194483",
                "ChatID": "444",
                "MessageID": "279",
                "Title": "TWD500到價通知4 TCB_ALERT_EXCHANGE",
                "Content": "",
                "NotifyMode": 0,
                "DataTime": "2019/06/19 AM 11:08:33",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "IsReadContent": "0",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_PROMOTE",
                "ToPhone": "b121194483",
                "ChatID": "555",
                "MessageID": "279",
                "Title": "TWD500到價通知5 TCB_PROMOTE",
                "Content": "",
                "NotifyMode": 0,
                "DataTime": "2019/06/19 AM 11:08:33",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "1",
                "IsReadContent": "0",
                "ReadCount": 0
              },
              {
                "SayPhone": "TCBProgram",
                "IsExpiry": false,
                "ViaAccount": "TCB_PROMOTE",
                "ToPhone": "b121194483",
                "ChatID": "666",
                "MessageID": "279",
                "Title": "TWD500到價通知6 TCB_PROMOTE",
                "Content": "",
                "NotifyMode": 0,
                "DataTime": "2019/06/19 AM 11:08:33",
                "MsgReceiverType": 0,
                "ContentType": "0",
                "IsRead": "0",
                "IsReadContent": "1",
                "ReadCount": 0
              }
            ]
          }

          // 連線逾時
          // { "rspCode": "9999", "rspMsg": "網路連線逾時，請稍後再試", "data": {} }

        )));
    }
  }

  /** 登入 讀取類別訊息內容
   * args array [ strChatId ]
   * strChatId: 讀取訊息所需要參考的 ChatId
   * return { rspCode:"0000", rspMsg:"success", data: Object }
   */
  public getBroadcastContent(strChatId: string): Promise<any> {
    this._logger.log(`getBroadcastContent strChatId = ${strChatId}`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let args = [strChatId];
          plugin.PushNotification.getBroadcastContent(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          // {"rspCode":"A0002","rspMsg":"輸入資訊不足(帳號)","data":{}}
          // {"rspCode":"9999","rspMsg":"網路連線逾時，請稍後再試","data":{}}
          {
            "rspCode": "0000",
            "rspMsg": "success",
            "data": {
              "SayPhone": "TCBProgram",
              "IsExpiry": false,
              "ViaAccount": "TCB_TestNotify",
              "ToPhone": "b121194483",
              "ChatID": "279",
              "MessageID": "279",
              "Title": "TWD500到價通知",
              "Content": "Content private",
              "NotifyMode": 0,
              "DataTime": "2019/06/19 AM 11:08:33",
              "MsgReceiverType": 0,
              "ContentType": "0",
              "FunBody": "",
              "Funkey": "",
              "IsRead": "1",
              "ReadCount": 0,
              "ReceiverCount": "1"
            }
          }
        )));
    }
  }

  /** 刪除訊息
   * args array [ strDelChatID, strDelViaAccount, strDelSummary ]
   * strDelChatID     : 若為 '-1', 表示要刪除所有資料, 若為多筆, 以半形逗號區隔
   * strDelViaAccount : 指定訊息類別,若為多筆,以半形逗號區隔, 若未設定,表示要刪除所有帳號 *應該用不到 待確認
   * strDelSummary    : 是否也一併刪除訊息彙總表中的項目, 1:要刪除, 0:不刪除 *直接帶1
   * return { rspCode:"0000", rspMsg:"success" }
   */
  public deleteMsg(strDelChatID): Promise<any> {
    this._logger.log(`strDelChatID = ${strDelChatID}`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let strDelViaAccount = "";
          let strDelSummary = "1";
          let args = [strDelChatID, strDelViaAccount, strDelSummary];
          plugin.PushNotification.deleteMsg(args, resolve, reject)
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve({
          "rspCode": "0000",
          "rspMsg": "success"
        })));
    }
  };

  // 用不到 用localstorage存
  /** 讀取類別帳號的封鎖狀態。
   * args array [strGetBlockListBlockType]
   * strGetBlockListBlockType : 指定的封鎖方式,若不設定或為0, 代表查詢所有封鎖。推播及封鎖狀態, 0:一般狀態, 1:使用者自訂聲音, 2:靜音, 3:不推播會回補, 4:完全封鎖
   * return { rspCode:"0000", rspMsg:"success", data: Array }
   */
  public getBlockList(strGetBlockListBlockType: string): Promise<any> {
    this._logger.log(`getBlockList strGetBlockListBlockType = ${strGetBlockListBlockType}`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let args = [strGetBlockListBlockType];
          plugin.PushNotification.getBlockList(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          {
            "rspCode": "0000",
            "rspMsg": "success",
            "data": []
          }
        )));
    }
  };

  // 推播及封鎖狀態 0 3 only
  /** 設定類別帳號的封鎖狀態。
   * args array [strSetBlockTarget, strSetBlockBlockType]
   * strSetBlockTarget    : 封鎖對象的代碼，例如訊息類別代碼
   * strSetBlockBlockType : 推播及封鎖狀態, 0:一般狀態, 1:使用者自訂聲音, 2: 靜音, 3:不推播會回補, 4:完全封鎖
   * return { rspCode:"0000", rspMsg:"success" }
   */
  public setBlock(strSetBlockTarget: string, strSetBlockBlockType: string): Promise<any> {
    this._logger.log(`strSetBlockTarget = ${strSetBlockTarget}，strSetBlockBlockType = ${strSetBlockBlockType}`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let args = [strSetBlockTarget, strSetBlockBlockType];
          plugin.PushNotification.setBlock(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          { "rspCode": "0000", "rspMsg": "success" }
        )));
    }
  };

  // 通知靜音
  /** 讀取 AppId 所對應的推播模式
   * return { data:{ NotifyType: "0" }, rspCode: "0000", rspMsg: "success"}
   */
  public getNotifyType(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          plugin.PushNotification.getNotifyType(resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          { "rspCode": "0000", "rspMsg": "success", "data": { "NotifyType": "2" } }
        )));
      // {"rspCode":"0004","rspMsg":"使用授權失敗! 請重新登入","data":{}}
    }
  };


  /** 設定 AppId 所對應的推播模式, 若設定值高於封鎖狀態, 則以此設定為主
   * args array [strSetNotifyType]
   * strSetNotifyType : 手機推播方式設定, 若數值高於封鎖設定, 則以此設定為主 0:一般(預設), 2:靜音, 3:不推播(用不到))
   * return { rspCode:"0000", rspMsg:"success" }
   */
  public setNotifyType(strSetNotifyType): Promise<any> {
    this._logger.log(`setNotifyType strSetNotifyType = ${strSetNotifyType}`);
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let args = [strSetNotifyType];
          plugin.PushNotification.setNotifyType(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          { rspCode: "0000", rspMsg: "success" }
        )));
    }
  };


  /** 讀取夜間靜音設定
   * return { data: { NightSilent: "0", EndTime: null, BeginTime: null }, rspCode: "0000", rspMsg: "success"}
   */
  public getNightSilent(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          plugin.PushNotification.getNightSilent(resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          { "rspCode": "0000", "rspMsg": "success", "data": { "NightSilent": "0" } }
        )));
    }
  };


  /** 設定夜間靜音
  * args array [strSetNightSilentNightSilent, strBeginTime, strEndTime]
  * strSetNightSilentNightSilent : 靜音模式, 0:不設靜音, 1:夜間靜音
  * strBeginTime : 靜音模式開始時間, 字串格式為[ 小時:分鐘 ] (如:21:00), 若未填則用程式預設時間
  * strEndTime   : 靜音模式結束時間, 字串格式為[ 小時:分鐘 ] (如:9:00) , 若未填則用程式預設時間
  * return { rspCode:"0000", rspMsg:"success" }
  */
  public setNightSilent(strSetNightSilentNightSilent: string, strBeginTime: string, strEndTime: string): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          let args = [strSetNightSilentNightSilent, strBeginTime, strEndTime];
          plugin.PushNotification.setNightSilent(args, resolve, reject);
        }));
    } else {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => resolve(
          { "rspCode": "0000", "rspMsg": "success" }
        )));
    }
  };

}
