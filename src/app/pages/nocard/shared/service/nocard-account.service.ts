import { Injectable } from '@angular/core';
import { FN000101ReqBody } from '@api/fn/fn000101/fn000101-req';
import { FN000101ApiService } from '@api/fn/fn000101/fn000101-api.service';
import { FN000102ReqBody } from '@api/fn/fn000102/fn000102-req';
import { FN000102ApiService } from '@api/fn/fn000102/fn000102-api.service';
import { FN000103ReqBody } from '@api/fn/fn000103/fn000103-req';
import { FN000103ApiService } from '@api/fn/fn000103/fn000103-api.service';
import { FN000105ReqBody } from '@api/fn/fn000105/fn000105-req';
import { FN000105ApiService } from '@api/fn/fn000105/fn000105-api.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { OtpServiceService } from '@pages/security/shared/service/otp-service.service';
import { DeviceService } from '@lib/plugins/device.service';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class NocardAccountService {

  // 回傳物件
  resultObj = {
    ERROR: {
        title: '',
        content: '',
        message: '',
        type: '',
        status: null
    },
    headerObj: {}, // 安控須回送header
    body: {}
  };

  accountAddList = [];              // 可新增帳號清單
  isATM: boolean = false;           // 是否有ATM待綁定帳號

  constructor(
    private fn000101: FN000101ApiService,
    private fn000102: FN000102ApiService,
    private fn000103: FN000103ApiService,
    private fn000105: FN000105ApiService,
    private authService: AuthService,
    private otpServiceService: OtpServiceService,
    private logger: Logger,
    private navgator: NavgatorService,
    private alert: AlertService,
    private deviceService: DeviceService,
    private confirm: ConfirmService,
    private _handleError: HandleErrorService
  ) { }

  /******************************************************************************
   * 發送fn000102電文，取得無卡提款申請狀態查詢                                            *
   ******************************************************************************/
  getAppliedStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 取得userInfo
      const userData = this.authService.getUserInfo();
      let req_data = new FN000102ReqBody();
      req_data.custId = userData.custId;
      req_data.queryType = '6';

      this.fn000102.send(req_data).then(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /******************************************************************************
   * 是否申請OTP簡訊服務                                                            *
   ******************************************************************************/
  checkOtpApplied(): Promise<any>  {
    return new Promise((resolve, reject) => {
      this.otpServiceService.checkAuth().then(
        (resObj) => {
          this.logger.log('OTP', 'checkAuth', resObj);
          resolve(resObj);
        },
        (errorObj) => {
          errorObj['type'] = 'message';
          reject(errorObj);
        }
      );
    });
  }


  /******************************************************************************
   * 發送fn000101API電文，取消舊裝置之提款帳號
   * @data 需取消帳戶資料
   * @isAllCancel 是否為全部取消                                                 *
   ******************************************************************************/
  cancelBindingAcctNo(data, isAllCancel): Promise<any> {
    // 判斷部分取消或全部取消
    return new Promise((resolve, reject) => {
      // 取得userInfo
      const userData = this.authService.getUserInfo();
      let security = {
        SecurityType: '',
        SecurityPassword: '',
        Acctoken: ''
      };
      let req_data = new FN000101ReqBody();
      let req_len = 0;
      let accountDetail: any;
      let account_len: number = 0;
      let cancelIndex = [];
      if (data.hasOwnProperty('accounts')) {
        // === 資料來自無卡提款帳號設定-取消頁 === //
        accountDetail = data['accounts'];
        for (let i1 = 0; i1 < accountDetail.length; i1++) {
          if (accountDetail[i1]['chrnatl'] == '0' && accountDetail[i1]['chrpur'] == '2') {
            account_len++;
            cancelIndex.push(i1);
          }
        }
      } else if (data.hasOwnProperty('data')) {
        // === 資料來自MENU頁 === //
        accountDetail = data['data'];
        for (let i2 = 0; i2 < accountDetail.length; i2++) {
          if (accountDetail[i2]['chrnatl'] == '0' && accountDetail[i2]['chrpur'] == '2') {
            account_len++;
            cancelIndex.push(i2);
          }
        }
      }
      req_data.custId = userData.custId;
      req_data.recType = '2';
      req_data.transType = '2';
      req_data.mailType = data.mailType;
      req_data.deviceId = data.deviceId;
      req_data.trnsToken = data.trnsToken;

      if (!!isAllCancel) {
        // === 全部取消 === //
        // 將最後一筆已綁定帳號的cancelFlag註記為1
        for (let i = 0; i < accountDetail.length; i++) {
          if (accountDetail[i]['chrnatl'] == '0' && accountDetail[i]['chrpur'] == '2') {
            let selectObj = {
              trnsAccnt: accountDetail[i]['account'],
              trasCode: '',
              cancelFlag: ''
            };
            if (i == cancelIndex[(account_len - 1)]) {
              if ( i == cancelIndex[0] && cancelIndex.length == 1) {
                // === 只有一筆且為最後一筆 === //
                req_data.accounts.account['0']['trnsAccnt'] = accountDetail[i]['account'];
                req_data.accounts.account['0']['cancelFlag'] = '1';
              } else {
                // === 最後一筆 ===//
                selectObj['cancelFlag'] = '1';
                req_data.accounts.account.push(selectObj);
              }
            } else {
              // === 第一筆、非最後一筆 ===//
              if (req_len == 0) {
                req_data.accounts.account['0']['trnsAccnt'] = accountDetail[i]['account'];
                req_data.accounts.account['0']['cancelFlag'] = '0';
                req_len++;
              } else {
                selectObj['cancelFlag'] = '0';
                req_data.accounts.account.push(selectObj);
              }
            }
          }
        }
      } else {
        // === 部份取消 === //
        for (let i = 0; i < accountDetail.length; i++) {
          if (accountDetail[i]['chrnatl'] == '0' && accountDetail[i]['chrpur'] == '2') {
            let selectObj = {
              trnsAccnt: accountDetail[i]['account'],
              trasCode: '',
              cancelFlag: ''
            };
            if (req_len == 0) {
              // === 第一筆 ===//
              req_data.accounts.account['0']['trnsAccnt'] = accountDetail[i]['account'];
              req_data.accounts.account['0']['cancelFlag'] = '0';
              req_len++;
            } else {
              selectObj['cancelFlag'] = '0';
              req_data.accounts.account.push(selectObj);
            }
          }
        }
      }

      this.fn000101.send(req_data, security).then(
        (res) => {
          this.logger.debug('fn000101_res:', res);
          resolve(res);
        },
        (error) => {
          this.logger.debug('fn000101_error:', error);
          reject(error);
        }
      );
    });
  }

  /******************************************************************************
   * 發送fn000101API電文，綁定ATM提款帳號
   * @data 需新增ATM帳戶資料                                         *
   ******************************************************************************/
  atmBindingAcctNo(data): Promise<any> {
    return new Promise((resolve, reject) => {
      // 取得userInfo
      const userData = this.authService.getUserInfo();
      let security = {
        SecurityType: '',
        SecurityPassword: '',
        Acctoken: ''
      };
      let req_data = new FN000101ReqBody();
      let req_len = 0;
      let account_len = data.accounts.length;

      req_data.custId = userData.custId;
      req_data.recType = '1';
      req_data.transType = '2';
      req_data.mailType = data.mailType;
      req_data.deviceId = data.deviceId;
      req_data.trnsToken = data.trnsToken;

      for (let i = 0; i < account_len; i++) {
        let selectObj = {
          trnsAccnt: data.accounts[i]['account'],
          trasCode: data.accounts[i]['pwd'],
          cancelFlag: ''
        };

        if (i == 0) {
          req_data.accounts.account['0']['trnsAccnt'] = data.accounts[i]['account'];
          req_data.accounts.account['0']['trasCode'] = data.accounts[i]['pwd'];
          req_len++;
        } else {
          req_data.accounts.account.push(selectObj);
        }
      }

      this.fn000101.send(req_data, security).then(
        (res) => {
          this.logger.debug('fn000101_ATM_res:', res);
          resolve(res);
        },
        (error) => {
          this.logger.debug('fn000101_ATM_error:', error);
          reject(error);
        }
      );
    });
  }

  /******************************************************************************
   * 發送fn000103API電文，綁定OTP提款帳號
   * @data 需新增OTP帳戶資料                                        *
   ******************************************************************************/
  otpBindingAcctNo(data, otpData): Promise<any> {
    return new Promise((resolve, reject) => {
      // 取得userInfo
      const userData = this.authService.getUserInfo();
      let req_data = new FN000103ReqBody();

      if (otpData.hasOwnProperty('OTP_val') && otpData.hasOwnProperty('accessToken')) {
        this.authService.digitalEnvelop(otpData['OTP_val']).then(
          (SuccessObj) => {
            // 加密成功回傳
            if (!!SuccessObj.value) {
              this.resultObj.ERROR.status = true;
              this.resultObj.headerObj = {
                SecurityType: '3',
                SecurityPassword: SuccessObj.value,
                Acctoken: otpData.accessToken
              };

              req_data.custId = userData.custId;
              req_data.deviceId = data.deviceId;
              req_data.recType = '1';
              req_data.transType = '1';
              req_data.mailType = data.mailType;
              req_data.trnsToken = data.trnsToken;
              let len = data.accounts.length;
              if (len >= 1) {
                for (let i = 0; i < len; i++) {
                  let accountObj = {
                    trnsAccnt: data.accounts[i].account,
                    trasCode: '',
                    cancelFlag: ''
                  };
                  if (i == 0) {
                    req_data.accounts.account[i]['trnsAccnt'] = data.accounts[i].account;
                    req_data.accounts.account[i]['trasCode'] = '';
                    req_data.accounts.account[i]['cancelFlag'] = '';
                  } else {
                    req_data.accounts.account.push(accountObj);
                  }
                }
              }

              this.fn000103.send(req_data, this.resultObj.headerObj).then(
                (res) => {
                  this.logger.debug('fn000103_res:', res);
                  resolve(res);
                },
                (error) => {
                  this.logger.debug('fn000103_error:', error);
                  reject(error);
                }
              );
            }
          },
          (FailedObj) => {
            this.resultObj.ERROR.status = false;
            this.resultObj.ERROR.title = '';
            this.resultObj.ERROR.content = '加密錯誤';
            this.resultObj.ERROR.message = '加密錯誤';
            reject(this.resultObj);
          });
      }
    });
  }

  /********************************************************************************************
   * 整理成功、失敗帳戶
   * @resultObj 回傳結果
   * @data      需整理的資料
   * @allcancel 是否為全部取消
   ********************************************************************************************/
  checkSuccess(resultObj, data, allcancel?) {
    let failedCount = 0;
    let detailsLen = data.data.length;
    for (let i = 0; i < detailsLen; i++) {
      if (data.data[i]['hostCode'] != '4001') {
        // === cancel === //
        if (data.hasOwnProperty('recType') && data.recType == '2') {
          data.data[i]['resultStr'] = '提款帳號 '
          + AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + ' ' + data.data[i]['hostCodeMsg'];
        } else {
          // === ATM === //
          if (data.data[i]['hostCode'] == '333A') {
            data.data[i]['resultStr'] = AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + '驗證碼有效時間已逾時';
          } else if (data.data[i]['hostCode'] == '333B') {
            data.data[i]['resultStr'] = AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + '驗證碼錯誤次數已達上限';
          } else if (data.data[i]['hostCode'] == '333C') {
            data.data[i]['resultStr'] = AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + '尚有ATM申請資料';
          } else {
            // === ATM or OTP === //
            data.data[i]['resultStr'] = '提款帳號 '
            + AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + ' ' + data.data[i]['hostCodeMsg'];
          }
        }
        data.data[i]['showError'] = true;
        failedCount++;
      } else if (data.data[i]['hostCode'] == '4001') {
        if (data.data[i].hasOwnProperty('pwdErrFlag') && data.data[i]['pwdErrFlag'] == 'Y'
        && (data.data[i]['pwdErrCnt'] == '1' || data.data[i]['pwdErrCnt'] == '2')) {
          failedCount++;
          data.data[i]['resultStr'] = '手機設備認證碼錯誤，請重新輸入。';
        } else if (data.data[i].hasOwnProperty('pwdErrFlag') && data.data[i]['pwdErrFlag'] == 'Y'
        && data.data[i]['pwdErrCnt'] == '3') {
          failedCount++;
          data.data[i]['resultStr'] = '很抱歉，您手機設備認證碼錯誤次數已達上限，請重新持欲開啟本服務之帳號所屬晶片金融卡至本行ATM設定認證碼。';
        } else {
          if (data.hasOwnProperty('recType') && data.recType == '2') {
            if (data.data[i].hasOwnProperty('hostCodeMsg') && data.data[i]['hostCodeMsg'] == '交易成功') {
              data.data[i]['resultStr'] = '提款帳號 '
              + AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + ' ' + '取消設定成功。';
            } else {
              data.data[i]['resultStr'] = '提款帳號 '
              + AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + ' ' + data.data[i]['hostCodeMsg'];
            }
          } else {
            // OTP、ATM成功訊息待確認
            if (data.data[i].hasOwnProperty('hostCodeMsg') && data.data[i]['hostCodeMsg'] == '交易成功') {
              data.data[i]['resultStr'] = '提款帳號 '
              + AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + ' ' + '新增設定成功。';
            } else {
              data.data[i]['resultStr'] = '提款帳號 '
              + AccountMaskUtil.accountNoFormate(data.data[i]['trnsAccnt']) + ' ' + data.data[i]['hostCodeMsg'];
            }
          }
        }
        data.data[i]['showError'] = false;
      }
    }

    if (failedCount == (detailsLen)) {
      resultObj.iconType = 0;
      resultObj['oneButton'] = 0;
    } else if (failedCount == 0 ) {
      switch (allcancel) {
        case true:
            resultObj.iconType = 1;
            resultObj['oneButton'] = 0;
            resultObj.resultTitle = '停用成功';
            resultObj.showAccountList = false;
          break;
        default:
            resultObj.iconType = 1;
            resultObj['oneButton'] = 0;
          break;
      }
    } else {
      resultObj.iconType = 2;
    }
    resultObj.recType = data.recType;
    resultObj.resultContent = data.data;

    this.logger.debug('checkSuccess resultObj:', resultObj);
    return resultObj;
  }


  /********************************************************************************************
   * 無卡提款申請狀態檢核、裝置檢核 [主流程判斷]
   * @pagekey 轉跳頁面
   * @rescheduleObj 重新預約資料/是否重新綁定
   ********************************************************************************************/
  checkAllStatus(pagekey, rescheduleObj?) {
    let appliedStatus;
    let deviceId: string = '';                 // 本機端UDID
    this.accountAddList = []; // 清空可綁定帳戶
    // 發送FN000102電文，取得無卡提款申請狀態
    this.getAppliedStatus().then(
      (fn000102res) => {
        appliedStatus = fn000102res;
        this.logger.debug('fn000102res:', fn000102res);

        // 取得可綁定帳號清單
        this.accountAddList = this.getAccountList(appliedStatus);

        // 判斷申請狀態
        if (appliedStatus.applyStatus === '1') {
          // === 已申請 === //

          // 辨別裝置識別碼
          this.deviceService.devicesInfo().then(
            (localdeviceInfo) => {
              deviceId = localdeviceInfo.udid;
              if (localdeviceInfo.udid == appliedStatus.deviceId) { // 不同裝置-simulation
              // if (localdeviceInfo.udid == 'device.uuid') { // 同一台裝置-simulation
                // === 同一台裝置，轉跳至相對應頁面 === //
                if (pagekey == 'nocardreservationkey') {
                  // === 預約無卡提款 === //
                  // 判斷是否已有一筆預約交易，有則禁止進入預約無卡提款交易
                  this.getTransRecord().then(
                    (fn000105res) => {
                      this.logger.debug('fn000105res:', fn000105res);
                      if (fn000105res.hasOwnProperty('rsrvtnData') ) {
                        if (!!fn000105res.rsrvtnData && fn000105res.rsrvtnData.transStatus == '0') { // 該筆交易預約中
                          this.alert.show('很抱歉，您已有一筆預約無卡提款交易，請於有效時間內至鄰近ATM完成提領。', { title: '提醒您'});
                        } else {
                          if (!!rescheduleObj) {
                            appliedStatus['rescheduleObj'] = rescheduleObj;
                          } else {
                            appliedStatus['rescheduleObj'] = '';
                          }
                          this.navgator.push(pagekey, appliedStatus);
                        }
                      }
                    },
                    (fn000105err) => {
                      this.logger.debug('fn000105err:', fn000105err);
                      if (fn000105err.hasOwnProperty('resultData')) {
                        switch (fn000105err.resultData.body.respCode) {
                          case '112A':
                              this.navgator.push(pagekey, appliedStatus);
                            break;
                          default:
                            // this.navgator.push(pagekey, appliedStatus);
                            break;
                        }

                      }
                    });
                } else {
                  // === 無卡提款帳號設定 === //
                  appliedStatus['firstTime'] = false;   // 首次啟用Flag
                  appliedStatus['isSameDevice'] = true; // 相同裝置
                  appliedStatus['mailType'] = '1';      // 首次或二次綁定
                  this.navgator.push(pagekey, appliedStatus);
                }
              } else {
                // === 不同裝置，轉跳至無卡提款設定之首次啟用 === //
                appliedStatus['deviceId'] = deviceId;
                appliedStatus['mailType'] = '0';        // 裝置不同，重新綁定
                this.confirm.show('很抱歉，無卡提款服務限一個行動裝置使用，您已於其他裝置啟用本服務，若欲於本裝置使用，請重新執行『無卡提款帳號設定』。(請注意：重新執行無卡提款帳號設定後，將自動取消原行動裝置之無卡提款功能)',
                  {
                    title: 'POPUP.CANCEL_EDIT.TITLE',
                    btnYesTitle: 'POPUP.CONFIRM.OK_BTN',
                    btnNoTitle: 'POPUP.CONFIRM.CANCEL_BTN'
                  }).then(
                    (check) => {
                      // 按下確定鍵後，全部取消所有無卡提款帳號之綁定，並回到首次啟用流程
                      this.cancelBindingAcctNo(appliedStatus, true).then(
                        (fn000101res) => {
                          this.logger.debug('fn000101res', fn000101res);
                          let dataObj = {
                            isReset: true
                          };
                          this.checkAllStatus('nocardaddaccountkey', dataObj);
                        },
                        (fn000101err) => {
                          this.logger.debug('fn000101err', fn000101err);
                        });
                    },
                    (cancel) => {
                    });
              }
            },
            (deviceErr) => {
              this._handleError.handleError(deviceErr);
            });

        } else if (appliedStatus.applyStatus === '0') {

          if (!!rescheduleObj && rescheduleObj.hasOwnProperty('isReset')) {
            appliedStatus['isReset'] = true;
          } else {
            appliedStatus['isReset'] = false;
          }

          this.deviceService.devicesInfo().then(
            (localdeviceInfo) => {
              appliedStatus['deviceId'] = localdeviceInfo.udid;
              if (pagekey == 'nocardreservationkey') {
                // === 預約無卡提款 === //
                const confirmOpt = new ConfirmOptions();

                // 判斷是否有ATM或OTP可綁定帳號
                if (this.accountAddList.length == 0) {
                  let resultData = {
                    transType: 'accountSet',
                    transRslt: '',
                    resultTitle: '設定結果',
                    showAccountList: false,
                    resultContent: '很抱歉，您尚未持有可使用之金融卡帳號，請攜帶雙證件及存款原留印鑑至鄰近分行查詢或辦理申請金融卡業務。',
                    iconType: 0,                         // icon圖示，0-失敗、1-成功
                    oneButton: 1                         // 只顯示一個button，0-返回無卡提款、1-服務據點
                  };
                  this.navgator.push('nocardresultkey', resultData);
                } else {
                  if (!!this.isATM ) {
                    confirmOpt.btnYesTitle = 'ATM認證綁定';
                    confirmOpt.title = 'POPUP.NOTICE.TITLE';
                    this.confirm.show('您尚未申請本服務，請完成ATM認證綁定後再執行預約無卡提款功能', confirmOpt).then(
                      () => { // 確定
                        appliedStatus['firstTime'] = false;          // 首次啟用Flag
                        appliedStatus['isSameDevice'] = false;       // 不同裝置
                        if (!!appliedStatus['isReset']) {
                          appliedStatus['mailType'] = '2';           // 裝置不同，重新綁定
                        } else {
                          appliedStatus['mailType'] = '1';           // 首次綁定
                        }
                        this.navgator.push('nocardaddaccountkey', appliedStatus);
                      },
                      () => { });
                  } else {
                    // 是否已申請OTP簡訊服務
                    this.checkOtpApplied().then(
                      (otpSuccess) => {
                        if (otpSuccess.status == true) {
                          this.logger.debug('otpSuccess add:', otpSuccess);
                          // === 已申請OTP簡訊服務 === //
                          confirmOpt.btnYesTitle = '無卡提款帳號設定';
                          confirmOpt.title = '提醒您';
                          this.confirm.show('您尚未申請本服務，請先完成無卡提款帳號設定後，再執行預約無卡提款功能', confirmOpt).then(
                            () => { // 確定
                              appliedStatus['firstTime'] = false;    // 首次啟用Flag
                              appliedStatus['isSameDevice'] = false; // 不同裝置
                              if (!!appliedStatus['isReset']) {
                                appliedStatus['mailType'] = '2';     // 裝置不同，重新綁定
                              } else {
                                appliedStatus['mailType'] = '1';     // 首次綁定
                              }
                              this.navgator.push('nocardaddaccountkey', appliedStatus);
                            },
                            () => { });
                        } else {
                          this.logger.debug('otpSuccess:', otpSuccess);
                          // === 未申請OTP簡訊服務 === //
                          confirmOpt.btnYesTitle = '了解如何申請';
                          confirmOpt.title = 'POPUP.NOTICE.TITLE';
                          this.confirm.show('您尚未申請本服務，請先完成無卡提款帳號設定後，再執行預約無卡提款功能', confirmOpt).then(
                            () => { // 確定
                              // 轉導至教學頁link
                              this.navgator.push('https://www.tcb-bank.com.tw/product/electronic_banking/Pages/cardlesswithdrawal_app.aspx');
                            },
                            () => { });
                          }
                      },
                      (otpErrMsg) => {
                        this.logger.debug('otpErrMsg:', otpErrMsg);
                        // === 未申請OTP簡訊服務 === //
                        confirmOpt.btnYesTitle = '了解如何申請';
                        confirmOpt.title = 'POPUP.NOTICE.TITLE';
                        this.confirm.show('您尚未申請本服務，請先完成無卡提款帳號設定後，再執行預約無卡提款功能', confirmOpt).then(
                          () => { // 確定
                            // 轉導至教學頁link
                            this.navgator.push('https://www.tcb-bank.com.tw/product/electronic_banking/Pages/cardlesswithdrawal_app.aspx');
                          },
                          () => { });
                      });
                  }
                }
              } else {
                // === 無卡提款設定 === //
                appliedStatus['firstTime'] = false;    // 首次啟用Flag
                appliedStatus['isSameDevice'] = false; // 不同裝置
                if (!!appliedStatus['isReset']) {
                  appliedStatus['mailType'] = '2';     // 裝置不同，重新綁定
                } else {
                  appliedStatus['mailType'] = '1';     // 首次綁定
                }
                this.navgator.push('nocardaddaccountkey', appliedStatus);
              }
          });
        }
      },
      (fn000102err) => {
        this.logger.debug('fn000102err', fn000102err);
        fn000102err['type'] = 'result';
        fn000102err['title'] = 'FUNC.CARDLESS';
        this._handleError.handleError(fn000102err);
      }
    );
  } // end of checkAllStatus

  /***************************************************************************************************
   * 取得未綁定帳號清單
   ***************************************************************************************************/
  getAccountList(navigatorObj) {
    let _isATM = false;
    let _accountAddList = [];
    if (!!navigatorObj && navigatorObj.hasOwnProperty('data')) {
      // === 新增帳號 === //
      let accounts = navigatorObj.data;
      let len = accounts.length;
      let count_add = 0;
      // 檢查是否有ATM帳號已申請未綁定
      for (let count_a = 0; count_a < len; count_a++) {
        if (accounts[count_a]['chrnatl'] == '0' && accounts[count_a]['chrpur'] == '1') {
          // 已申請且有ATM已申請未綁定
          _isATM = true;
          accounts[count_a]['ischecked'] = false;         // 是否被選取
          accounts[count_a]['pwd'] = '';                  // ATM密碼
          accounts[count_a]['errorMsgPwd'] = '';          // ATM密碼錯誤檢核訊息
          _accountAddList[count_add++] = accounts[count_a];
        }
      }
      this.isATM = _isATM;

      if (!this.isATM) {
        // 確認沒有ATM未綁定，取得可綁定帳號清單
        for (let count_a = 0; count_a < len; count_a++) {

          if (accounts[count_a]['chrnatl'] == '0' && accounts[count_a]['chrpur'] != '2') {
            // 已申請且有帳號未綁定
            accounts[count_a]['ischecked'] = false;
            accounts[count_a]['pwd'] = '';
            accounts[count_a]['errorMsgPwd'] = '';
            _accountAddList[count_add++] = accounts[count_a];
          }
        }
      } // end of if (!this.isATM)

      // this.accountAddList = _accountAddList;
      this.logger.debug('usefulAccList:', _accountAddList);
      return _accountAddList;

    }
  } // end of getAccountList

  /***********************************************************************************************
   * 發送fn000105電文，取得交易紀錄查詢
   ***********************************************************************************************/
  getTransRecord(): Promise<any> {

    return new Promise((resolve, reject) => {
      let req_data = new FN000105ReqBody();
      const userData = this.authService.getUserInfo();
      req_data.custId = userData.custId;
      req_data.recType = 'Q';

      this.fn000105.send(req_data).then(
        (res) => {
          this.logger.debug('fn000105_res:', res);
          resolve(res.body);
        },
        (error) => {
          this.logger.debug('fn000105_error:', error);
          reject(error);
        }
      );
    });
  } // end of getTransRecord
}
