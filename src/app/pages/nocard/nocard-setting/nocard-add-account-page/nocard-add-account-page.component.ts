import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { NocardAccountService } from '../../shared/service/nocard-account.service';
import { DeviceService } from '@lib/plugins/device.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NocardTransService } from '../../shared/service/nocard-trans.service';

@Component({
  selector: 'app-nocard-add-account-page',
  templateUrl: './nocard-add-account-page.component.html'
})
export class NocardAddAccountPageComponent implements OnInit {

  headerObj = {
    title: 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
    leftBtnIcon: 'back',
  };
  /**
	 * 轉帳頁面切換
	 * ('originalPage':無卡提款帳號設定，'agreementPage':無卡提款帳號設定-同意條款頁
   *  'confirmPage':無卡提款帳號設定-確認頁)
	 */
  showPage = 'originalPage';
  editData: any;                    // 新增帳號或取消帳號資料(送給確認頁資料)

  navigatorObj: any;                // 由navigator傳輸資料
  firstTime: boolean = false;       // 是否為第一次申請
  adding: boolean = false;          // 是否正在"新增"頁籤
  cancel: boolean = false;          // 是否正在"取消"頁籤
  isATM: boolean = false;           // 是否使用ATM新增帳號
  verifyMethod: string = '';        // 認證方式： ATM認證/OTP認證
  sequenceNum: number = 15;         // 字元連續出現 到此數字判定為連續字串
  repeatNum: number = 15;           // 字元重複出現 到此數時判定為重複字串
  pwd;                              // ATM密碼

  accountAddList = [];              // 可新增帳號清單
  accountCancelList = [];           // 可取消帳號清單

  isSameDevice: boolean = false;    // 是否為相同裝置，true 相同；false 不相同
  deviceId: string;                 // 當前裝置Id

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private confirm: ConfirmService,
    private navigator: NavgatorService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private deviceService: DeviceService,
    private nocardAccountService: NocardAccountService,
    private _handleError: HandleErrorService,
    private logger: Logger,
    private nocardTransService: NocardTransService,
  ) { }

  ngOnInit() {
    this.navigatorObj = this.navigator.getParams();
    // 已同意協定書內容，進行首次啟用
    this.firstTime = this.navigatorObj.firstTime;
    // 是否為相同裝置
    this.isSameDevice = this.navigatorObj.isSameDevice;

    /****************************無卡提款帳號設定流程********************************
     * 1. 發送API電文，取得無卡提款申請狀態查詢
     * 2. 根據申請狀態電文回傳之申請狀態：
     *    a. 未申請：顯示同意條款，點選同意後，發送API電文，取得可綁定帳號清單
     *    b. 已申請：比對裝置識別碼---
     *       --->  相 同：發送API電文，取得可綁定帳號清單
     *       ---> 不相同：發送API電文，取消舊裝置之提款帳號，並回到步驟 2.a
     * 3. 根據可綁定帳號電文回傳之訊息：
     *    a. 失敗：顯示失敗訊息
     *    b. 無可綁定帳號且已綁定帳號是否 > 0：
     *       ---> 是，則顯示已綁定提款帳號取消畫面
     *       ---> 否，則判斷待ATM認證是否 > 0：
     *            ---> 是，顯示ATM認證流程畫面
     *            ---> 否，則判斷未綁定帳號是否 > 0：
     *                 ---> 是，判斷是否有開通OTP簡訊認證：
     *                      ---> 是，顯示OTP簡訊認證服務
     *                 ---> 否，顯示回覆訊息
     *
     * ====================================ATM認證==================================
     * 1. 下一步按鈕事件：
     *    a. 檢核是否勾選帳號
     *    b. 檢核輸入資料是否正確：
     *       ---> 失敗：顯示提示訊息，如密碼過短?!
     *       ---> 成功：轉跳至確認頁。
     * ====================================OTP認證==================================
     * 1. 下一步按鈕事件：
     *    a. 檢核是否勾選帳號：
     *       ---> 成功：轉跳至確認頁。
    ********************************************************************************/

    // 判斷申請狀態
    this.checkAppliedStatus();

    // 返回上一頁
    this._headerCtrl.setLeftBtnClick( () => {
      // 是否確認取消編輯
      this.cancelEdit();
    });
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

  // 選擇帳號
  selectAcctNo(item_account, item_index) {
    if (!!this.adding) {
      // === 新增帳號 === //
      if ( this.accountAddList[item_index]['account'] == item_account) {
        this.accountAddList[item_index]['ischecked'] = !this.accountAddList[item_index]['ischecked'];
      }
    } else {
      // === 取消帳號 === //
      if ( this.accountCancelList[item_index]['account'] == item_account) {
        this.accountCancelList[item_index]['ischecked'] = !this.accountCancelList[item_index]['ischecked'];
      }
    }

  }


  // 下一步
  nextStep() {
    if (this.adding || !!this.firstTime) {
      // === 在"新增"頁籤 === //
      let acctList_len = this.accountAddList.length;
      let selectObj = {};        // 被選取帳號物件
      let selectObjList = [];    // 被選取帳號清單
      let recordPwdErrMsg = '';  // 紀錄ATM密碼錯誤訊息
      let pwd = '';              // ATM密碼
      let reg1 = /^\d+$/;        // 密碼檢核規則(正規表示式):是否為純數字

      for (let count = 0; count < acctList_len; count++) {
        pwd = this.accountAddList[count]['pwd'].toString();
        this.accountAddList[count]['_errorMsgPwd'] = '';
        // === 整理被選擇之帳號 === //
        if (!!this.accountAddList[count]['ischecked']) {

          if (!!this.isATM) {
            // === ATM帳號 需要檢核密碼 === //

            if (!this.accountAddList[count]['pwd']) {
              this.accountAddList[count]['_errorMsgPwd'] = '請輸入6-12位手機設備認證碼';
            } else {
              this.accountAddList[count]['_errorMsgPwd'] = this.nocardTransService.checkPassWord(pwd, 6, 12, reg1, 7);

              if (this.accountAddList[count]['_errorMsgPwd'] !== '') {
                switch (this.accountAddList[count]['_errorMsgPwd']) {
                  case 'ERR001':
                    this.accountAddList[count]['_errorMsgPwd'] = '請輸入6-12位數字';
                    break;
                  case 'ERR002':
                    this.accountAddList[count]['_errorMsgPwd'] = '提款密碼不可為重覆或連續數字';
                    break;
                }
              }
            }

            if (!!this.accountAddList[count]['_errorMsgPwd']) {
              recordPwdErrMsg = recordPwdErrMsg + AccountMaskUtil.accountNoFormate(this.accountAddList[count]['account']) +
                ' ' + this.accountAddList[count]['_errorMsgPwd'] + '\n';
            }
            selectObj = this.accountAddList[count];
            selectObjList.push(selectObj);
          } else {
            // === OTP帳號 === //
            // alert('OTP');
            selectObj = this.accountAddList[count];
            selectObjList.push(selectObj);
          }
        }
      }

      // 檢核密碼後，顯示錯誤
      if (!!this.isATM && !!recordPwdErrMsg) {
        this.alertService.show(recordPwdErrMsg);
      } else if (selectObjList.length == 0) {
        // 未選擇新增帳號
        this.alertService.show('請至少選擇一筆提款帳號');
      } else {
        this.logger.debug('selectObjList:', selectObjList);
        // 輸出至confirm頁資料
        this.editData = {
          firstTime: this.firstTime,
          isATM: this.isATM,
          custId: this.navigatorObj.custId,
          accounts: selectObjList,
          mailType: this.navigatorObj.mailType,
          deviceId: this.deviceId,
          trnsToken: this.navigatorObj.trnsToken
        };
        // 轉跳至confirm頁
        this.showPage = 'confirmPage';
      }
    } else {
      // === 在"取消"頁籤 === //
      let acctList_len = this.accountCancelList.length;
      let selectObj = {};         // 被選取帳號物件
      let selectObjList = [];     // 被選取帳號清單
      let selectCancelCnt = 0;    // 已選取取消綁定筆數
      let content = '';           // 提示訊息內容

      for (let count = 0; count < acctList_len; count++) {
        // === 整理被選擇之帳號 === //
        if (!!this.accountCancelList[count]['ischecked']) {
          selectObj = this.accountCancelList[count];
          selectObjList.push(selectObj);
          selectCancelCnt++;
        }
      }

      this.editData = {
        firstTime: this.firstTime,
        isATM: this.isATM,
        custId: this.navigatorObj.custId,
        accounts: selectObjList,
        deviceId: this.deviceId,
        mailType: '3',
        trnsToken: this.navigatorObj.trnsToken
      };

      if (selectCancelCnt == acctList_len) {
        // 取消筆數=綁定筆數，全部取消
        content = '親愛的客戶您好，您的無卡提款服務將立即停止使用，已預約且於有效時間內之無卡提款交易將一併取消，如欲重新啟用本服務需再次申請，請確認是否取消無卡提款帳號之設定？';
        this.confirmService
        .show(content, {title: '提醒您'})
        .then(
          // 確認按鈕
          (check) => {
            // 發送fn000103提款帳號異動電文
            this.nocardAccountService.cancelBindingAcctNo(this.editData, true).then(
              (allCancelData) => {
                this.logger.debug('allCancelData:', allCancelData);

                // 輸出至result頁資料
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

                resultObj = this.nocardAccountService.checkSuccess(resultObj, allCancelData, true);
                this.navigator.push('nocardresultkey', resultObj);
              },
              (error) => {
                this.logger.debug('allCancelBindingError:', error);
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
          },
          (cancel) => {}
        );
      } else if (selectCancelCnt < acctList_len && selectCancelCnt != 0) {
        // 取消筆數<綁定筆數，部份取消
        content = '親愛的客戶，您所選擇的帳號，將立即停止無卡提款服務，且將一併取消預約中之無卡提款交易，如欲啟用需再次新增無卡提款帳號，請確認是否取消？';
        this.confirmService
        .show(content, {title: '提醒您'})
        .then(
          // 確認按鈕
          (check) => {
            // 發送fn000103提款帳號異動電文
            this.nocardAccountService.cancelBindingAcctNo(this.editData, false).then(
              (partCancelData) => {
                this.logger.debug('partCancelData:', partCancelData);

                // 輸出至result頁資料
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

                resultObj = this.nocardAccountService.checkSuccess(resultObj, partCancelData);
                this.navigator.push('nocardresultkey', resultObj);
              },
              (error) => {
                this.logger.debug('partCancelBindingError:', error);
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
          },
          (cancel) => {}
        );
      } else {
        // 未選擇取消帳號
        this.alertService.show('請至少選擇一筆提款帳號');
      }
    }
  }

  // 點選 新增
  addList() {
    this.adding = true;
    this.cancel = false;
  }

  // 點選 取消
  removeList() {
    this.adding = false;
    this.cancel = true;
  }

  // ATM 提示訊息
  atmAlertMsg(): Promise<any> {
    return Promise.resolve().then(() =>
      this.confirmService
        .show('本認證方式需要請您先持金融卡至本行ATM進行認證碼設定。', {
          title: '提醒您',
          btnNoTitle: '尚未設定',
          btnYesTitle: '我已完成設定'
        })
        .then(
          // 我已完成設定
          () => {
            Promise.resolve();
          },
          // 尚未設定
          () => {
            let resultData = {
              transType: 'accountSet',
              transRslt: '',
              resultTitle: '',
              showAccountList: false,
              resultContent: '請先持欲開啟本服務之帳號所屬晶片金融卡至本行任一ATM設定認證碼。',
              iconType: 0,                         // icon圖示，0-失敗、1-成功
              oneButton: 1                         // 只顯示一個button，0-返回無卡提款、1-服務據點
            };
            this.navigator.push('nocardresultkey', resultData);
          }
        )
    );
  }


  /************************************************************************************************
   * 檢查申請狀態
   ************************************************************************************************/
  checkAppliedStatus() {
    if ( this.navigatorObj.applyStatus === '1' ) {
      // === 已申請無卡提款 === //

      // 判斷是否為相同裝置
      if ( !!this.isSameDevice ) {
        // === 相同裝置 === //
        this.deviceId = this.navigatorObj.deviceId;

        // 取得可綁定帳號清單
        this.getAccountList(this.navigatorObj);

        if (!!this.isATM) {
          this.atmAlertMsg().then(
          (res) => {
            this.decideAddOrCancel();
          });
        } else {
          this.decideAddOrCancel();
        }

      } else {
        // === 不同裝置 === //
        // 獲取當前裝置的識別碼(udid)
        this.deviceService.devicesInfo().then(
          (localdeviceInfo) => {
            this.deviceId = localdeviceInfo.udid;
            // this.deviceId = localdeviceInfo.uuid;
            // 取得可綁定帳號清單
            this.getAccountList(this.navigatorObj);
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
              this.navigator.push('nocardresultkey', resultData);
            } else {
              this.startFirstUsing();
            }
          },
          (deviceErr) => {
            this.logger.debug('deviceErr:', deviceErr);
            this._handleError.handleError(deviceErr);
          });
      }

    } else {
      // === 未申請無卡提款 === //
      this.deviceId = this.navigatorObj.deviceId;
      // 取得可綁定帳號清單
      this.getAccountList(this.navigatorObj);
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
        this.navigator.push('nocardresultkey', resultData);
      } else {
        // 是否為ATM 或 OTP
        if (!!this.isATM) {
          this.startFirstUsing();
        } else {
          // 是否已申請OTP簡訊服務
          this.nocardAccountService.checkOtpApplied().then(
            (otpSuccess) => {
              this.logger.debug('otpSuccess:', otpSuccess);
              // === 已申請OTP簡訊服務 === //
              if (otpSuccess.status == true) {
                this.startFirstUsing();
              } else {
                this.logger.debug('checkOtpApplied otpSuccess', otpSuccess);
                // === 未申請OTP簡訊服務 === //
                let resultData = {
                  transType: 'accountSet',
                  transRslt: '',
                  resultTitle: '設定結果',
                  showAccountList: false,
                  resultContent: '很抱歉，您目前尚未申請OTP簡訊服務，請您親持雙證件及網路銀行原留印鑑至鄰近分行辦理啟用OTP簡訊服務，或改使用ATM認證方式申請本服務。',
                  iconType: 0,                         // icon圖示，0-失敗、1-成功
                  oneButton: 1                         // 只顯示一個button，0-返回無卡提款、1-服務據點
                };
                this.navigator.push('nocardresultkey', resultData);
              }
            },
            (otpErrMsg) => {
              this.logger.debug('checkOtpApplied otpErrMsg', otpErrMsg);
              // === 未申請OTP簡訊服務 === //
              let resultData = {
                transType: 'accountSet',
                transRslt: '',
                resultTitle: '設定結果',
                showAccountList: false,
                resultContent: '很抱歉，您目前尚未申請OTP簡訊服務，請您親持雙證件及網路銀行原留印鑑至鄰近分行辦理啟用OTP簡訊服務，或改使用ATM認證方式申請本服務。',
                iconType: 0,                         // icon圖示，0-失敗、1-成功
                oneButton: 1                         // 只顯示一個button，0-返回無卡提款、1-服務據點
              };
              this.navigator.push('nocardresultkey', resultData);
          });
        }
      }
    } // END OF 是否申請無卡提款服務判斷
  }

  /********************************************************************************************
   * 取得未綁定帳號清單
   ********************************************************************************************/
  getAccountList(navigatorObj) {
    let _isATM = false;
    let accounts;   // 取得帳戶資料
    if (!!navigatorObj && navigatorObj.hasOwnProperty('data')) {
      accounts = navigatorObj.data;
    } else {
      accounts = navigatorObj.accounts.account;
    }
    // alert('accounts:' + JSON.stringify(accounts));
    let len = accounts.length;
    let count_add = 0;
    let count_cancel = 0;
    // 檢查是否有ATM帳號已申請未綁定
    for (let count_a = 0; count_a < len; count_a++) {
      if (accounts[count_a]['chrnatl'] == '0' && accounts[count_a]['chrpur'] == '1') {
        // 已申請且有ATM已申請未綁定
        _isATM = true;
        accounts[count_a]['ischecked'] = false;         // 是否被選取
        accounts[count_a]['pwd'] = '';                  // ATM密碼
        accounts[count_a]['errorMsgPwd'] = '';          // ATM密碼錯誤檢核訊息
        this.accountAddList[count_add++] = accounts[count_a];
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
          this.accountAddList[count_add++] = accounts[count_a];
        }
      }
    }

    // 檢查是否有取消帳號清單：已申請已綁定
    for (let count_a = 0; count_a < len; count_a++) {
      if (accounts[count_a]['chrpur'] == '2') {
        // 獲取取消綁定清單
        switch (accounts[count_a]['chrnatl']) {
          case '0':
              accounts[count_a]['disabled'] = false;
              accounts[count_a]['accountStr'] = AccountMaskUtil.accountNoFormate(accounts[count_a]['account']);
            break;
          default:
            // 金融卡非正常狀態
            accounts[count_a]['disabled'] = true;
            accounts[count_a]['accountStr'] = AccountMaskUtil.accountNoFormate(accounts[count_a]['account']) + '(卡片異常)';
        }
        accounts[count_a]['ischecked'] = false;
        accounts[count_a]['errorMsgPwd'] = '';
        this.accountCancelList[count_cancel++] = accounts[count_a];
      }
    }
  }


  /****************************************************************************************************
   * 新增、取消帳號判斷
   ****************************************************************************************************/
  decideAddOrCancel() {
    // 新增、取消帳號判斷
    if (!!this.firstTime) {
      // === 僅提供新增帳號功能 === //
      this.decideATMorOTP();
    } else {
      if (this.accountAddList.length > 0 && this.accountCancelList.length == 0) {
        // === 僅有可綁定清單： 禁用取消按鈕 === //
        this.decideATMorOTP();
      } else if (this.accountAddList.length == 0 && this.accountCancelList.length > 0) {
        // === 僅有可取消綁定清單： 禁用新增按鈕 === //
        // this.adding = false;
        this.removeList();
      } else {
        this.decideATMorOTP();
      }
    }
  }

  /***************************************************************************************************
   * 判斷為ATM認證或OTP認證
   ***************************************************************************************************/
  decideATMorOTP() {
    if (!!this.isATM ) {
      // === 有ATM帳號可綁定 === //
      this.verifyMethod = 'ATM認證';
      if (!this.firstTime) {
        this.addList();
      } else {
        this.adding = true;
      }

    } else {
      // === 沒有ATM帳號可綁定 === //
      this.verifyMethod = 'OTP認證';
      if (!this.firstTime) {
        this.addList();
      } else {
        this.adding = true;
      }
    }
  }

  /****************************************************************************************************
   * 啟用首次申請流程
   ****************************************************************************************************/
  startFirstUsing() {
    // 已同意協定書內容，進行首次啟用
    if ( !!this.firstTime ) {
      this.adding = true;
      this.showPage = 'originalPage';

      if (!!this.isATM) {
        this.atmAlertMsg().then(
        (res) => {
          this.decideAddOrCancel();
        });
      } else {
        this.decideAddOrCancel();
      }
    } else {
      // 轉跳同意協定頁
      this.showPage = 'agreementPage';
    }
  }

  /************************************************************************************************
   * ATM密碼檢核，return 需 alert 的字串
   * @param str 欲檢核之字串
   ************************************************************************************************/
  checkATMPwd(str: string): string {
    // 必須為6~12碼
    if (str.length < 6 || str.length > 12) {
      return '請輸入6-12位手機設備認證碼';
    } else if (
      // 連續判斷：sequenceChar(ATM密碼, 區分大分寫(用不到)帶0或1, 連續幾個算重複)，連續時回傳之status為false
      !AuthCheckUtil.sequenceChar(str, 0, this.sequenceNum).status ||
      // 重複判斷
      this.hasRepeatChar(str, this.repeatNum)
    ) {
      return '手機設備認證碼不可為重覆或連續數字';
    }

    // 檢查ATM密碼沒有問題
    return '';
  }

  /**
   * 檢核重複字元-有重複 return true，沒重複 return false
   * @param str 欲檢核之字串
   * @param limitNum 重複次數達到此數即判定為重複
   */
  hasRepeatChar(str: string, limitNum: number): boolean {
    // 字元需重複出現次數 > 欲檢核之字串長度
    if (limitNum > str.length || limitNum <= 1 || str.length <= 1) {
      return false;
    }

    let i, j;
    let theseRepeat: boolean; // 小區塊判斷是否連續

    for (i = 0; i < str.length - limitNum + 1; i++) {
      theseRepeat = true;
      for (j = i + 1; j < i + limitNum; j++) {
        // 只要有一個 j != i 就代表此小區塊連續為否
        if (str.charAt(i) !== str.charAt(j)) {
          theseRepeat = false;
          break;
        }
      }
      if (theseRepeat) {
        return true;
      }
    }
    return false;
  }

  /**********************************************************************************
   *                                                                                *
   *   頁面轉跳 Method                                                               *
   *                                                                                *
   **********************************************************************************/

  // 同意協定頁轉跳新增編輯頁
  goAddPage(event) {
    if (event) {

      if (event.hasOwnProperty('firstTime')) {
        this.firstTime = event.firstTime;
      }

      // 檢查申請狀態
      this.checkAppliedStatus();
    }
  }

  // 確認頁回到新增編輯頁
  backAddPage(event) {
  }
}
