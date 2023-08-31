import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { OtpService } from '@shared/transaction-security/otp-popup/otp.service';
import { NocardAccountService } from '../../shared/service/nocard-account.service';
import { Logger } from '@core/system/logger/logger.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
  selector: 'app-nocard-confirm-page',
  templateUrl: './nocard-confirm-page.component.html',
  providers: [OtpService]
})
export class NocardConfirmPageComponent implements OnInit {

  @Input() confirmData;       // 來自編輯頁待確認之資料
  @Output() backToAdd: EventEmitter<any> = new EventEmitter<any>();    // 前往新增頁面
  firstTime: boolean = true;  // 是否為第一次申請
  custId: any;                // 使用者之身分證字號
  verifyMethod: string;          // 認證方式

  constructor(
    private navigator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
    private confirmService: ConfirmService,
    private otpService: OtpService,
    private nocardAccountService: NocardAccountService,
    private alertService: AlertService,
    private logger: Logger,
    private _handleError: HandleErrorService
  ) { }

  ngOnInit() {
    this.headerCtrl.setLeftBtnClick(() => {
      this.cancel();
    });

    this.firstTime = this.confirmData.firstTime;
    this.custId = this.confirmData.custId.substring(0, 4) + '***' + this.confirmData.custId.substring(7);

    if (!!this.confirmData.isATM) {
      this.verifyMethod = 'ATM認證';
    } else {
      this.verifyMethod = 'OTP認證';
    }

    /**=======================================ATM認證=======================================
     * 1. 確認按鈕事件：
     *    ---> 發送API電文，無卡帳號提款新增(ATM認證)，接收電文回傳資料。
     * 2. 轉跳至結果頁，將失敗/成功結果呈現出來。
     * =======================================OTP認證=======================================
     * 1. 確認按鈕事件：
     *    ---> 進行OTP認證，發送F1000105-API電文，OTP密碼請求，接收電文回傳資料：
     *         ---> 失敗：顯示提示訊息，點選確認後，停留在確認頁。
     *         ---> 成功：顯示OTP輸入畫面，發送API電文，無卡帳號提款新增(OTP認證)，接收電文回傳資料。
     * 2. 轉跳至結果頁，將失敗/成功呈現出來。
     *    ---> 失敗時，判斷驗證是否 < 5次，是，則再次進行OTP認證，(可再次點選確認按鈕)。
     *                                   否，顯示失敗訊息。
     ***************************************************************************************/
  }

  // 確定
  confirm() {
    if (!this.confirmData.isATM) {
      // 發送f1000105電文，請求OTP密碼驗證
      this.confirmData.otpObj = {
        custId: this.confirmData.custId,
        fnctId: 'FN000103',
        OutCurr: '',
        depositMoney: '0',
        depositNumber: '0',
        transTypeDesc: ''
      };
      this.otpService.show('', { reqData: this.confirmData.otpObj, transAccountType: '' }).then(
        (res) => {
          // 發送fn000103電文，提款帳號異動-OTP
          this.nocardAccountService.otpBindingAcctNo(this.confirmData, res).then(
            (otpData) => {
              // TODO: 待確認兩筆以上是否無誤
              this.logger.debug('otpBindingAcctNo otpData', otpData);
              let resultObj = {
                'iconType': -1,              // icon圖示: 0-失敗 1-成功 2-驚嘆號
                'transType': 'accountSet',   // 如果是預約無卡帶'reserve'，否則隨便帶，不會對其他值對檢核
                'resultTitle': '設定結果',    // 結果頁，icon下方標題
                'showAccountList': true,
                'resultContent': [],         // 結果頁，內容，如果為逐筆帳號用陣列的方式儲存，否則直接用string儲存顯示內容
                // 'oneButton': 1
                // 結果頁面是否只顯示一個button，value帶0 -> 只顯示"返回無卡提款"，value帶1 -> 只顯示"服務據點"
                // 如果結果頁需要兩個btn(固定為"返回無卡提款"與"服務據點")，則不要將oneButton加入resultObj
              };

              resultObj = this.nocardAccountService.checkSuccess(resultObj, otpData);
              this.navigator.push('nocardresultkey', resultObj);
            },
            (error) => {
              this.logger.debug('otpBindingError:', error);
              let content: string;
              // === OTP新增提款帳號錯誤 === //
              if (error.hasOwnProperty('resultData')) {
                error = error.resultData.body;
                if (error.hasOwnProperty('respCode')) {
                  /* O0010: OTP驗證失敗 (錯誤次數<5) 顯示提示驗證失敗訊息
                   * O9999、T9999: 驗證逾時 顯示提示訊息後需重新發送 fn100105
                   * O0011: OTP已被鎖定(錯誤次數>=5) 直接轉到錯誤畫面
                   */
                  error.respCode = error.respCode.substring(7);
                  switch (error.respCode) {
                    case 'O0010':
                      content = 'OTP簡訊碼驗證失敗，請重新輸入';
                      // content = error.respCodeMsg;
                      this.alertService.show(content, { title: '錯誤' });
                      break;
                    case 'O0011':
                      let resultObj = {
                        'iconType': 0,                    // icon圖示: 0-失敗 1-成功 2-驚嘆號
                        'transType': 'accountSet',        // 如果是預約無卡帶'reserve'，否則隨便帶，不會對其他值對檢核
                        'resultTitle': '設定結果',         // 結果頁，icon下方標題
                        'showAccountList': false,
                        'resultContent': '很抱歉，您OTP簡訊碼驗證錯誤次數已達上限且已鎖定簡訊服務，請持身分證件及網路銀行原留印鑑至本行任一分行臨櫃辦理OTP解鎖。',
                        'oneButton': 0
                        // 結果頁面是否只顯示一個button，value帶0 -> 只顯示"返回無卡提款"，value帶1 -> 只顯示"服務據點"
                        // 如果結果頁需要兩個btn(固定為"返回無卡提款"與"服務據點")，則不要將oneButton加入resultObj
                      };

                      this.navigator.push('nocardresultkey', resultObj);
                      break;
                    case 'O9999':
                      // err.content = '驗證逾時';
                      content = error.respCodeMsg;
                      this.alertService.show(content, { title: '錯誤', btnTitle: '重新發送' }).then(() => { this.confirm(); });
                      break;
                    case 'T9999':
                      // err.content = '驗證逾時';
                      content = error.respCodeMsg;
                      this.alertService.show(content, { title: '錯誤', btnTitle: '重新發送' }).then(() => { this.confirm(); });
                      break;
                    default:
                      // content = error.respCodeMsg;
                      // this.alertService.show(content, { title: '錯誤' });
                      let errorObj = {
                        type: 'result',
                        title: 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
                        button: '返回無卡提款',
                        backType: 'nocard',
                        content: error.respCodeMsg,
                        resultCode: error.respCode
                      };
                      this._handleError.handleError(errorObj);
                  }
                }
              } else {
                content = error.content;
                this.alertService.show(content, { title: '錯誤' });
              }
            });
        },
        (err) => {
          this.logger.debug('otpSerError:', err);
        });

    } else {
      // 發送fn000101電文，提款帳號異動-ATM
      this.nocardAccountService.atmBindingAcctNo(this.confirmData).then(
        (atmData) => {
          // TODO: 待確認兩筆以上是否無誤

          this.logger.debug('atmBindingAcctNo atmData:', atmData);
          let resultObj = {
            'iconType': -1,              // icon圖示: 0-失敗 1-成功 2-驚嘆號
            'transType': 'accountSet',   // 如果是預約無卡帶'reserve'，否則隨便帶，不會對其他值對檢核
            'resultTitle': '設定結果',    // 結果頁，icon下方標題
            'showAccountList': true,
            'resultContent': [],         // 結果頁，內容，如果為逐筆帳號用陣列的方式儲存，否則直接用string儲存顯示內容
            // 'oneButton': 1
            // 結果頁面是否只顯示一個button，value帶0 -> 只顯示"返回無卡提款"，value帶1 -> 只顯示"服務據點"
            // 如果結果頁需要兩個btn(固定為"返回無卡提款"與"服務據點")，則不要將oneButton加入resultObj
          };

          resultObj = this.nocardAccountService.checkSuccess(resultObj, atmData);
          this.navigator.push('nocardresultkey', resultObj);
        },
        (error) => {
          this.logger.debug('atmBindingError:', error);
          let errorObj = {
            type: 'result',
            title: 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
            button: '返回無卡提款',
            backType: 'nocard',
            content: error.info_data.respCodeMsg,
            resultCode: error.info_data.respCode
          };
          this._handleError.handleError(errorObj);
        });
    }
  }

  // 回上一步
  cancel() {
    this.confirmService
      .show('如取消編輯，您的資料將遺失，請問您是否確定要取消編輯？', {
        title: '提醒您'
      })
      .then(
        () => {
          this.navigator.push('nocard');
        },
        err => { }
      );
  }
}
