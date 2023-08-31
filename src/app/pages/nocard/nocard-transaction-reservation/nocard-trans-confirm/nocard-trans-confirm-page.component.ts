import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { NocardTransService } from '../../shared/service/nocard-trans.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-nocard-trans-confirm-page',
  templateUrl: './nocard-trans-confirm-page.component.html',
})
export class NocardTransConfirmComponent implements OnInit {

  @Input() nocardTransConfirm;  // 取得編輯資料
  @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁

  // == 首頁物件 == //
  headerObj = {
    title: 'FUNC_SUB.CARDLESS.RESERVE_TRANS',
    leftBtnIcon: 'back',
  };

  /**
	 * 轉帳頁面切換
	 * ('originalPage':原始預約無卡提款-編輯頁，'confirmPage':預約無卡提款-確認頁)
	 */
  showPage = 'confirmPage';

  loginRemember: any;           // 登入資訊-取得是否啟用生物辨識
  ftloginRemember: any;         // 快速登入資訊-儲存生物辨識資訊

  onlineBankPwd = '';           // 網銀密碼
  withdrawPwd = '';             // 自設密碼
  passCount = 0;                // 必填欄位是否已填(欄位計數器)
  cancelBioBtn = 0;             // 啟用生物辨識時，當該值不為零，表示使用者取消使用生物辨識
  hasBioService = false;        // 是否有生物辨識

  // 錯誤檢核提示
  errorMsg = {
    onlineBankPwd: ''           // 網銀密碼
  };

  // 生物辨識錯誤次數
  bioErrorCount: number;

  // 網銀密碼錯誤次數
  commErrorCount: number;

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navigator: NavgatorService,
    private confirm: ConfirmService,
    private authService: AuthService,
    private tcbb: TcbbService,
    private alert: AlertService,
    public formateService: FormateService,
    private localStorageService: LocalStorageService,
    private nocardTransService: NocardTransService,
    private _handleError: HandleErrorService,
    private logger: Logger
  ) {

    // 為獲取是否起用生物辨識，先取得登入資訊storage
    const tempRem = this.localStorageService.getObj('Remember');
    if (!!tempRem && tempRem.hasOwnProperty('userData') && tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
      this.tcbb.fastAESDecode([tempRem.userData.custId, tempRem.userData.userId])
        .then((res_Dncode) => {
          tempRem.userData = res_Dncode;
          this.loginRemember = tempRem;
        }, (error_Dncode) => {
          this._handleError.handleError(error_Dncode);
        }
      );
    }

    // 取得快登資訊
    const tempFtData = this.localStorageService.getObj('Compare');
    if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
      this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
        (res_Dncode) => {
          tempFtData.comparecustId = res_Dncode.custId;
          tempFtData.compareuserId = res_Dncode.userId;
          this.ftloginRemember = tempFtData;
        },
        (error_Dncode) => {
          this._handleError.handleError(error_Dncode);
        }
      );
    }
   }

  ngOnInit() {
    // === 初始化計數器 === //
    this.cancelBioBtn = 0;
    this.bioErrorCount = 0;
    this.commErrorCount = 0;

    if (!!this.nocardTransConfirm['withdrawPwd']) {
      for (let count = 0; count < this.nocardTransConfirm['pwdLength']; count++) {
        this.withdrawPwd = this.withdrawPwd + '*';
      }
    }

    this._headerCtrl.setLeftBtnClick( () => {
      // 是否確認取消編輯
      this.cancelEdit();
    });
  }

  // 確認按鈕事件
  nextStep() {
    // 檢核欄位資料
    this.nocardTransService.checkData(this.onlineBankPwd, this.commErrorCount).then(
      (resData) => {
        this.logger.debug('resData:', resData);
        if (resData.hasOwnProperty('commErrorCount')) {
          this.errorMsg = resData['errorMsg'];
          this.commErrorCount = resData['commErrorCount'];
          // 若網銀密碼錯誤達5次，轉跳至結果頁並預約失敗
          if (this.commErrorCount >= 5) {
            let failedData = {
              transType: 'reserve',
              resultTitle: '預約失敗',
              transRslt: 'failed',
              oneButton: 0,
              resultContent: '網銀登入密碼錯誤次數已達上限且已鎖定網銀服務，請持身分證件及網路銀行原留印鑑至本行任一分行臨櫃辦理解鎖。'
            };
            this.navigator.push('nocardresultkey', failedData);
          }

          if (resData.hasOwnProperty('passCount') && resData['passCount'] !== 0) {
            this.passCount = resData['passCount'];
            // passCount為1時，表示必填欄位已填
            if ( this.passCount === 1 ) {
              let outputData = this.sortOutData(this.nocardTransConfirm);
              // 發送電文，預約無卡提款交易預約
              this.nocardTransService.makeReservation(outputData).then(
                (res) => {
                  this.logger.debug('makeReservation res', res);
                  let resultData = res;
                  if (!!res['trnsTxNo']) {
                    resultData['transType'] = 'reserve';
                    resultData['transRslt'] = 'success';
                    resultData['resultTitle'] = '預約成功';
                    resultData['resultContent'] = '請於交易有效時間內至有提供無卡提款服務的ATM，依畫面指示輸入合庫銀行代號「006」、「提款序號」、「提款金額」及「自設提款密碼」進行無卡提款。';
                    resultData['iconType'] = 1;                         // icon圖示，0-失敗、1-成功
                    resultData['bankId'] = this.nocardTransConfirm.bankId;
                  }
                  this.navigator.push('nocardresultkey', resultData);
                },
                (err) => {
                  this.logger.debug('makeReservation err', err);
                  let errorObj = {
                    type: 'result',
                    title: 'FUNC_SUB.CARDLESS.RESERVE_TRANS',
                    button: '返回無卡提款',
                    backType: 'nocard',
                    content: err.info_data.respCodeMsg,
                    resultCode: err.info_data.respCode
                  };
                  this._handleError.handleError(errorObj);
              });
            }
          }
        } // end of hasOwnProperty('commErrorCount')
      } // end of nocardTransService.checkData
    );
  }

  // 取消按鈕事件
  cancel() {
    // 是否確認取消編輯
      this.cancelEdit();
  }

  // 跳出popup是否返回
  cancelEdit() {
    this.confirm.show('如取消編輯，您的資料將遺失' + '\n' + '請問您是否確定要取消編輯?', {
      title: '提醒您'
    }).then(
      () => {
        // 確定
        this.navigator.push('nocard');
      },
      () => {
      }
    );
  }

  // 判斷是否啟用生物辨識
  getBioService() {
    // 判斷是否有啟用生物辨識，有則使用生物辨識，否則一般網銀認證方式
    if (this.loginRemember.ftlogin.type === 'biometric' && this.cancelBioBtn === 0) {
      this.hasBioService = true;
      // 取得當前使用者的userInfo
      const userData = this.authService.getUserInfo();

      //  取得生物辨識認證結果
      this.nocardTransService.biometricVerify(this.ftloginRemember, userData).then(
        (res_success) => {
          // 發送電文，預約無卡提款交易預約
          this.passCount++;
          let outputData = this.sortOutData(this.nocardTransConfirm);
          this.nocardTransService.makeReservation(outputData).then(
            (res) => {
              this.logger.debug('res', res);
              let resultData = res;
              if (!!res['trnsTxNo']) {
                resultData['transType'] = 'reserve';
                resultData['transRslt'] = 'success';
                resultData['resultTitle'] = '預約成功';
                resultData['resultContent'] = '請於交易有效時間內至有提供無卡提款服務的ATM，依畫面指示輸入合庫銀行代號「006」、「提款序號」、「提款金額」及「自設提款密碼」進行無卡提款。';
                resultData['iconType'] = 1;                         // icon圖示，0-失敗、1-成功
                resultData['bankId'] = this.nocardTransConfirm.bankId;
              }
              this.navigator.push('nocardresultkey', resultData);
            },
            (err) => {
              this.logger.debug('err', err);
              let errorObj = {
                type: 'result',
                title: 'FUNC_SUB.CARDLESS.RESERVE_TRANS',
                button: '返回無卡提款',
                backType: 'nocard',
                content: err.info_data.respCodeMsg,
                resultCode: err.info_data.respCode
              };
              this._handleError.handleError(errorObj);
            }
          );
        },
        (error) => {
          if (error['data']['ret_code'] === 10) {
            this.hasBioService = false;
            this.cancelBioBtn++; // 不為0則取消生物辨識驗證
          } else {
            this.alert.show(error.msg, { title: '錯誤' }).then(
              (errorcheck) => {
                if (error.data.ret_code === 4) {
                  this.loginRemember.ftlogin.fastlogin = '0';
                  this.loginRemember.ftlogin.type = '';
                  this.setObjCommon();
                } else if (error.data.ret_code === 12) {
                  // 第一次錯誤為0次
                  this.bioErrorCount++;
                  if (this.bioErrorCount == 2) {
                    this.loginRemember.ftlogin.fastlogin = '0';
                    this.loginRemember.ftlogin.type = '';
                    this.loginRemember.ftlogin.pay_setting = '0';
                    this.cancelBioBtn++; // 不為0則取消生物辨識驗證
                    this.setObjCommon();
                  }

                } else if (error.data.ret_code === 'sendFail_BI000102_ERRBI_0001') {
                  this.loginRemember.ftlogin.fastlogin = '0';
                  this.loginRemember.ftlogin.type = '';
                  this.loginRemember.ftlogin.pay_setting = '0';
                  this.setObjCommon();
                } else if (error.data.ret_code === 'sendFail_BI000102_ERRBI_0005') {
                  this.loginRemember.ftlogin.fastlogin = '0';
                  this.loginRemember.ftlogin.type = '';
                  this.ftloginRemember.comparecustId = '';
                  this.setObjCommon();
                  this.tcbb.fastAESEncode([this.ftloginRemember.comparecustId, this.ftloginRemember.compareuserId]).then(
                    (res_Encode) => {
                      const copyFT = Object.assign({}, this.ftloginRemember);
                      copyFT.comparecustId = res_Encode.custId;
                      copyFT.compareuserId = res_Encode.userId;
                      this.localStorageService.setObj('Compare', copyFT);
                    },
                    (error_Encode) => {
                      this._handleError.handleError(error_Encode);
                    }
                  );
                }
              }
            );
          }
        });
    } else {
      this.cancelBioBtn++; // 不為0則取消生物辨識驗證
      this.hasBioService = false;
    }
  }

  /**
   * 加密統一儲存
   */
  setObjCommon() {
    // 加密儲存到localStorage
    this.tcbb.fastAESEncode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
      (res_Encode) => {
        const copy = Object.assign({}, this.loginRemember);
        copy.userData = res_Encode;
        this.localStorageService.setObj('Remember', copy);
      },
      (error_Encode) => {
        this._handleError.handleError(error_Encode);
      }
    );
  }

  // 整理outputData
  sortOutData(nocardTransConfirm) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let MM = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let currentTime = yyyy + MM + dd; // 取得當日時間YYYYMMDD
    let output = {
      custId: nocardTransConfirm.custId,                // 客戶ID(身分證字號)
      recType: 'A',                                     // 交易類別：A-預約，D-取消
      nocrwdDay: currentTime,                           // 無卡提款預約交易日期
      trnsAccnt: nocardTransConfirm.withdrawAcct,       // 預約無卡提款帳號
      transAmt: nocardTransConfirm.withdrawMoney,       // 無卡提款預約提款金額
      trasPwd: nocardTransConfirm.withdrawPwd,          // 一次性提款密碼
      nocrwdTime: nocardTransConfirm.nocrwdTime,        // 無卡提款有效時間，預設15分鐘
      trnsTxNo: '',                                     // 無卡提款交易序號(取消交易必填)
      trnsToken: nocardTransConfirm.trnsToken           // 交易控制碼
    };

    return output;
  }

}
