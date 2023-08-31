import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';
import { PushService } from '@lib/plugins/push.service';
import { MsgOverviewService, BlockTypeObj } from '../shared/service/msg-overview.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AuthService } from '@core/auth/auth.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

export interface MsgSettingsNavParam {
  expandAccount?: boolean;
}

@Component({
  selector: 'app-msg-overview-settings-page',
  templateUrl: './msg-overview-settings-page.component.html',
  styleUrls: ['./msg-overview-settings-page.css']
})

export class MsgOverviewSettingsPageComponent implements OnInit {
  // 帶入plugin的值統整
  BlockType = {
    TCB_ACCOUNT: 'TCB_ACCOUNT', // 帳務通知
    TCB_ALERT_EXCHANGE: 'TCB_ALERT_EXCHANGE', // 匯率到價
    TCB_ALERT_FUND: 'TCB_ALERT_FUND', // 基金停利
    TCB_PROMOTE: 'TCB_PROMOTE' // 優惠
  };
  blockType: BlockTypeObj; // 帳務通知、匯率到價、基金停利、優惠
  expandAccount = false; // 展開帳務通知
  expandReminderNotice = false; // 展開提醒通知
  expandSilent = false; // 展開通知靜音

  constructor(
    private navigator: NavgatorService,
    private _logger: Logger,
    private push: PushService,
    private msgOverviewService: MsgOverviewService,
    private alert: AlertService,
    private auth: AuthService,
    private confirm: ConfirmService
  ) { }

  ngOnInit() {
    const OtpUserInfo = this.auth.getOtpUserInfo();
    const check_apply = OtpUserInfo.checkBoundIDStatus();
     if(check_apply.bound_id !== '4'){
        this.navigator.push('msg-overview');
      }
    this.blockType = this.msgOverviewService.getBlockType();
    this._logger.log(`blockType = ${JSON.stringify(this.blockType)}`);
    const navParam: MsgSettingsNavParam = this.navigator.getParams();
    this.expandAccount = !!navParam.expandAccount;
  }

  // OTP密碼通知
  onOtpAlertChange() {
    if (this.blockType.OTP_PWD_ALERT) {
//       (1)須確認為榜定之裝置才可綁定推播服務
//       (2)若為非綁定之裝置，須詢問是否做裝置綁定
//         ＊選擇是=>導頁至裝置綁定頁面
//         ＊選擇否=>顯示訊息:若不綁定裝置則無法綁定推播服務
      const OtpUserInfo = this.auth.getOtpUserInfo();
      const check_apply = OtpUserInfo.checkBoundIDStatus();
      this._logger.log('check_apply',check_apply);
      if(check_apply.bound_id !== '4'){
        this.confirm.show('OTP密碼通知設定須為裝置綁定，是否前往裝置綁定服務', { title: '裝置綁定服務',btnYesTitle:'是',btnNoTitle:'否'}).then(
          (suc)=>{
            this.navigator.push('device-bind');
          },
          (err)=>{
            this.alert.show('若不綁定裝置則無法綁定推播服務').then(
              resAlert => {
                this.blockType.OTP_PWD_ALERT=false;
              }
            );
          }
        );
      }else{
        this._logger.error('check_apply',check_apply);
        this._logger.log(`checkAllowOtp = ${this.auth.checkAllowOtp()}`);
        this._logger.log(`isAAcct = ${this.auth.getUserInfo().isAAcct}`);
        switch (this.auth.checkAllowOtp()) {
          case true:
            if (this.auth.getUserInfo().isAAcct === '1') {
              this.navigator.push('msg-overview-otp-term');
            } else {
              this.alert.show(`您須洽分行申請非約定轉帳機制，方可設定OTP通知功能。`).then(() => {
                setTimeout(()=>{
                  this.blockType.OTP_PWD_ALERT=false;
                },100);
              });
              return;
            }
            break;
          default:
            if (this.auth.getUserInfo().isAAcct === '1') {
              this.alert.show(`您須洽分行申請OTP轉帳機制，方可設定OTP通知功能。`).then(()=>{
                setTimeout(()=>{
                  this.blockType.OTP_PWD_ALERT=false;
                },100);
              });
              return;
            } else {
              this.alert.show(`您須洽分行申請OTP及非約定轉帳機制，方可設定OTP通知功能。`).then(()=>{
                setTimeout(()=>{
                  this.blockType.OTP_PWD_ALERT=false;
                },100);
              });
              return;
            }
        }
      }
    } else {
      this.push.setBlock('TCB_ACCOUNT_OTP', '3').then(res => {
        this._logger.log(`setBlock res = ${JSON.stringify(res)}`);
        let temp = this.msgOverviewService.checkPluginSuccess(res);
        if (!!temp) {
          this.alert.show(temp).then(() => {
            this.blockType.OTP_PWD_ALERT = !this.blockType.OTP_PWD_ALERT;
            return;
          });
        } else {
          this.updateBlockType();
        }
      });
    }
  }

  // 通知提醒設定
  onPushSetting() {
    this._logger.log(`this.blockType.TCB_PUSH_SETTING = ${this.blockType.TCB_PUSH_SETTING}`);
    this.updateBlockType();
    let strSetBlockTarget = `${this.BlockType.TCB_ACCOUNT},${this.BlockType.TCB_ACCOUNT},
      ${this.BlockType.TCB_ACCOUNT},${this.BlockType.TCB_ACCOUNT},`;
    let strSetBlockBlockType = '';
    if (this.blockType.TCB_PUSH_SETTING) {
      strSetBlockBlockType = '0';
    } else {
      strSetBlockBlockType = '3';
    }
    this.push.setBlock(strSetBlockTarget, strSetBlockBlockType).then(res => {
      this._logger.log(`push.setBlock res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp).then(() => {
          this.blockType.TCB_PUSH_SETTING = !this.blockType.TCB_PUSH_SETTING;
          this.updateBlockType();
        });
      }
    });
  }

  // 帳務通知
  onAccountChange() {
    this._logger.log(`this.blockType.TCB_ACCOUNT = ${this.blockType.TCB_ACCOUNT}`);
    this.updateBlockType();
    let strSetBlockTarget = this.BlockType.TCB_ACCOUNT;
    let strSetBlockBlockType = '';
    if (this.blockType.TCB_ACCOUNT) {
      strSetBlockBlockType = '0';
    } else {
      strSetBlockBlockType = '3';
    }
    this.push.setBlock(strSetBlockTarget, strSetBlockBlockType).then(res => {
      this._logger.log(`setBlock res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp).then(() => {
          this.blockType.TCB_ACCOUNT = !this.blockType.TCB_ACCOUNT;
          this.updateBlockType();
        });
      }
    });
  }

  // 外幣匯率到價設定
  goFundBalance() {
    if (this.blockType.TCB_PUSH_SETTING) {
      this.navigator.push('fund-balance-overview');
    }
  }

  // 基金停損獲利點設定
  goRateInfom() {
    if (this.blockType.TCB_PUSH_SETTING) {
      this.navigator.push('rate-inform-overview');
    }
  }

  // 優惠通知
  onPromoteChange() {
    this._logger.log(`this.blockType.TCB_PROMOTE = ${this.blockType.TCB_PROMOTE}`);
    this.updateBlockType();
    let strSetBlockTarget = this.BlockType.TCB_PROMOTE;
    let strSetBlockBlockType = '';
    if (this.blockType.TCB_PROMOTE) {
      strSetBlockBlockType = '0';
    } else {
      strSetBlockBlockType = '3';
    }
    this.push.setBlock(strSetBlockTarget, strSetBlockBlockType).then(res => {
      this._logger.log(`setBlock res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp).then(() => {
          this.blockType.TCB_PROMOTE = !this.blockType.TCB_PROMOTE;
          this.updateBlockType();
        });
      }
    });
  }

  // 通知靜音設定
  onNotificationSilentChange() {
    this._logger.log(`notificationSilent = ${this.blockType.notificationSilent}`);
    this.updateBlockType();
    let strSetNotifyType = '';
    // let strTime = '';
    if (this.blockType.notificationSilent) {
      strSetNotifyType = '2';
    } else {
      strSetNotifyType = '0';
    }
    this.push.setNotifyType(strSetNotifyType).then(res => {
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (temp) {
        this.alert.show(temp).then(() => {
          this.blockType.notificationSilent = !this.blockType.notificationSilent;
          this.updateBlockType();
        });
      }
    });
  }

  // 訊息接收時段
  onActiveChange(clickDay: boolean) {
    this._logger.log(`this.daySilent = ${this.blockType.daySilent}`);
    this._logger.log(`this.nightSilent = ${this.blockType.nightSilent}`);
    this.updateBlockType();
    let strSetNightSilentNightSilent = '0';
    let strBeginTime = '';
    let strEndTime = '';
    switch (this.blockType.daySilent) {
      case true:
        switch (this.blockType.nightSilent) {
          case true: // 24H都不接收
            strSetNightSilentNightSilent = '1';
            strBeginTime = '00:00';
            strEndTime = '23:59';
            break;
          case false: // 只有晚上接收
            strSetNightSilentNightSilent = '1';
            strBeginTime = '09:00';
            strEndTime = '21:00';
            break;
        }
        break;
      case false:
        switch (this.blockType.nightSilent) {
          case true: // 只有0900~2100接收
            strSetNightSilentNightSilent = '1';
            strBeginTime = '21:00';
            strEndTime = '09:00';
            break;
          case false: // 24H接收
            strSetNightSilentNightSilent = '0';
            strBeginTime = strEndTime = '';
            break;
        }
        break;
    }
    this.push.setNightSilent(strSetNightSilentNightSilent, strBeginTime, strEndTime).then(res => {
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (temp) {
        this.alert.show(temp).then(() => {
          if (clickDay) {
            this.blockType.daySilent = !this.blockType.daySilent;
          } else {
            this.blockType.nightSilent = !this.blockType.nightSilent;
          }
          this.updateBlockType();
        });
      }
    });

  }

  // testGetBlockListAccountExchange() {
  //   this.push.getBlockList(`${this.BlockType['TCB_ACCOUNT']},${this.BlockType['TCB_ALERT_EXCHANGE']}`).then(res => {
  //     this._logger.log(`getBlockList some res = ${JSON.stringify(res)}`);
  //   })
  // }

  // testGetBlockListAll() {
  //   this.push.getBlockList('0').then(res => {
  //     this._logger.log(`getBlockList all res = ${JSON.stringify(res)}`);
  //   })
  // }

  updateBlockType() {
    this.msgOverviewService.saveBlockType(this.blockType);
  }

  /**
   * 外匯匯款入/扣帳通知 || 外匯定存到期通
   */
  onAlertChange(type) { 
    this._logger.log(`this.blockType.TCB_ALERT_EXCHANGE = ${this.blockType.TCB_ALERT_EXCHANGE}}`);
    this.updateBlockType();
    let strSetBlockTarget;
    let strSetBlockBlockType = "";
    if(type=='1'){
      strSetBlockTarget='TCB_ACCOUNT_FEREMIT';  //外匯匯款入/扣帳通知
      if (this.blockType.TCB_ACCOUNT_FEREMIT) {
        strSetBlockBlockType = "0";
      } else {
        strSetBlockBlockType = "3";
      }
    }else{
      strSetBlockTarget='TCB_ACCOUNT_FDREGULAR';  //外匯定存到期通
      if (this.blockType.TCB_ACCOUNT_FDREGULAR) {
        strSetBlockBlockType = "0";
      } else {
        strSetBlockBlockType = "3";
      }
    }
   
    this.push.setBlock(strSetBlockTarget, strSetBlockBlockType).then(res => {
      this._logger.log(`setBlock res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp).then(() => {
          this.blockType.TCB_ALERT_EXCHANGE = !this.blockType.TCB_ALERT_EXCHANGE;
          this.updateBlockType();
        });
      }
    })
  }

 
}
