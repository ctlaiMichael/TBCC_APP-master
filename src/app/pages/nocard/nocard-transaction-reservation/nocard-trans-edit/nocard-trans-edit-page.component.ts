import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { NocardTransService } from '../../shared/service/nocard-trans.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { Logger } from '@core/system/logger/logger.service';
import { NocardAccountService } from '../../shared/service/nocard-account.service';

@Component({
  selector: 'app-nocard-trans-edit-page',
  templateUrl: './nocard-trans-edit-page.component.html',
})
export class NocardTransEditComponent implements OnInit {

  // == 首頁物件 == //
  headerObj = {
    title: 'FUNC_SUB.CARDLESS.RESERVE_TRANS',
    leftBtnIcon: 'back',
  };

  withdrawAcctList = [];  // 提款帳號列表
  balance = '';           // 可用餘額
  isRemeberPwd = false;   // 是否記住提款密碼

  // localStoraget儲存NO_CARD:記住提款密碼
  NO_CARD: '';

  /**
	 * 轉帳頁面切換
	 * ('originalPage':原始預約無卡提款-編輯頁，'confirmPage':預約無卡提款-確認頁)
	 */
  showPage = 'originalPage';

  // 錯誤檢核提示
  errorMsg = {
    withdrawAcct: '',     // 提款帳號
    withdrawMoney: '',    // 提款金額
    withdrawPwd: '',      // 提款密碼
    checkPwd: ''          // 再次確認提款密碼
  };

  // 檢核欄位
  checkDataObj = {
    selectAcct: -1,       // 是否選擇題款帳號
    withdrawAcct: '',     // 選擇的提款帳號
    withdrawMoney: '',    // 是否輸入提款金額
    withdrawPwd: '',      // 是否輸入提款密碼
    checkPwd: '',         // 再次確認密碼
  };

  // 編輯頁資料
  allEditReserveData = {
    transType: 'reserve', // 交易類型: 預約無卡提款(reserve)
    custId: '',           // 客戶者ID
    deviceId: '',         // 裝置識別碼
    nocrwdTime: '',       // 有效時間
    bankId: '006',        // 銀行代號
    withdrawAcct: '',     // 提款帳號
    withdrawMoney: '',    // 提款金額
    withdrawPwd: '',      // 提款密碼
    pwdLength: 0,         // 提款密碼長度
    remeberPwd: false,    // 記住提款密碼
    trnsToken: ''         // 交易控制碼
  };


  // 取得navgator資料：重新預約的資料/可綁定帳號清單
  navgatorObj = {};

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private localStorageService: LocalStorageService,
    private tcbb: TcbbService,
    private navgator: NavgatorService,
    private confirm: ConfirmService,
    private alert: AlertService,
    private nocardTransService: NocardTransService,
    private errorHandler: HandleErrorService,
    private logger: Logger,
    private nocardaccountService: NocardAccountService,
  ) {
    this._headerCtrl.setOption(this.headerObj);
    this._headerCtrl.setLeftBtnClick( () => {
      // 是否確認取消編輯
      this.cancelEdit();
    });

    // 取用localStorage檢查是否有無卡提款設定
    const tempNocard = this.localStorageService.get('NO_CARD');
    if ( !!tempNocard ) {
      this.NO_CARD = tempNocard;
    }

  }

  ngOnInit() {

    // 判斷資料來源，是重新預約的資料(來自交易查詢)或是可綁定帳號清單(來自MENU)
    this.navgatorObj = this.navgator.getParams();

    // 判斷是否有儲存localstorage的密碼，需解密
    if ( !!this.NO_CARD ) {
      this.isRemeberPwd = true;
      // 提款密碼解密
      this.tcbb.fastAESDecode([this.NO_CARD, this.NO_CARD]).then(
        (res_Dncode) => {
          // 借用custId欄位，進行提款密碼解密
          this.checkDataObj.withdrawPwd = res_Dncode.custId;
          this.checkDataObj.checkPwd = res_Dncode.custId;
          return Promise.resolve();
        },
        (error_Dncode) => {
          this.errorHandler.handleError(error_Dncode);
          return Promise.resolve();
        }
      );
    } else {
      this.isRemeberPwd = false;
      this.checkDataObj.withdrawPwd = '';
      this.checkDataObj.checkPwd = '';
    }
    // 取得資料，如可用提款帳號、可用餘額
    if (!!this.navgatorObj && this.navgatorObj.hasOwnProperty('data') && !this.navgatorObj['rescheduleObj']) {
      // === 資料為MENU頁來的可綁定帳號清單 === //
      this.getData(this.navgatorObj);
    } else {
      // === 資料為交易紀錄查詢頁來的重新預約資料 === //
      // 發送fn000102電文，取得金融卡狀態
      this.nocardaccountService.getAppliedStatus().then(
        (fn000102res) => {
          this.getData(fn000102res);
          if (this.navgatorObj.hasOwnProperty('rescheduleObj') && !!this.navgatorObj['rescheduleObj']) {
            let money = parseInt(this.navgatorObj['rescheduleObj']['applyAmt'], 10);
            this.checkDataObj.withdrawMoney = money.toString();
          }
        },
        (fn000102err) => {
          this.logger.debug('fn000102err', fn000102err);
        });
    }
  }

  // 跳出popup是否返回
  cancelEdit() {
    if (this.showPage != 'originalPage') {
      this.showPage = 'originalPage';
    } else {
      this.confirm.show('如取消編輯，您的資料將遺失' + '\n' + '請問您是否確定要取消編輯?', {
        title: '提醒您'
      }).then(
        () => {
          // 確定
          this.navgator.push('nocard');
        },
        () => {
        }
      );
    }
  }

  /**
   * 改變select提款帳號選擇時，可用餘額跟著變動
   */
  onChangeAcct() {
    // 根據所選之轉出帳號，更改顯示之餘額金額
    if (this.checkDataObj.selectAcct == -1) {
      this.balance = '0';
      this.checkDataObj['withdrawAcct'] = '請選擇提款帳號';
    } else {
      this.balance = this.withdrawAcctList[this.checkDataObj.selectAcct].usefulBalance;
      this.checkDataObj['withdrawAcct'] = this.withdrawAcctList[this.checkDataObj.selectAcct].account;
    }

  }

  /**
   * 取得可用提款帳號資料
   */
  private getData(navgatorObj) {
    // this.checkDataObj.selectAcct = -1;
    if (!!navgatorObj && navgatorObj.hasOwnProperty('data')) {
      let len = navgatorObj.data.length;
      let accountDetail = navgatorObj.data;
      let validCnt = 0;
      let count_b = 0; // 存放可用提款帳戶之計數器
      for ( let count_a = 0; count_a < len; count_a++) {
        // 篩選可用帳號-已綁定帳號
        if (accountDetail[count_a]['chrpur'] == '2') {
          switch (accountDetail[count_a]['chrnatl']) {
            case '0':
              if (validCnt === 0) {
                this.checkDataObj.selectAcct = count_b;
                validCnt++;
              }
              accountDetail[count_a]['style'] = {'color':  'rgba(0,0,0,.5)'};
              accountDetail[count_a]['disabled'] = false;
              accountDetail[count_a]['accountStr'] = AccountMaskUtil.accountNoFormate(accountDetail[count_a]['account']);
              break;
            // case '2':
            //   // 金融卡非正常狀態
            //   accountDetail[count_a]['disabled'] = true;
            //   accountDetail[count_a]['accountStr'] = AccountMaskUtil.accountNoFormate(accountDetail[count_a]['account']) + '(掛失)';
            //   break;
            // case '9':
            //   // 金融卡非正常狀態
            //   accountDetail[count_a]['disabled'] = true;
            //   accountDetail[count_a]['accountStr'] = AccountMaskUtil.accountNoFormate(accountDetail[count_a]['account']) + '(中心掛失)';
            //   break;
            default:
              // 金融卡非正常狀態
              accountDetail[count_a]['style'] = {'color': 'grey'};
              accountDetail[count_a]['disabled'] = true;
              accountDetail[count_a]['accountStr'] = AccountMaskUtil.accountNoFormate(accountDetail[count_a]['account']) + '(卡片異常)';
          }
          this.withdrawAcctList[count_b++] = accountDetail[count_a];
        }
      }
      if (this.withdrawAcctList.length == 1 && !!this.withdrawAcctList[0]['disabled']) {
        this.balance = '0';
        this.checkDataObj.selectAcct = -1;
      } else {
        if (this.checkDataObj.selectAcct == -1) {
          this.balance = '0';
          this.checkDataObj['withdrawAcct'] = '請選擇提款帳號';
        } else {
          this.balance = this.withdrawAcctList[this.checkDataObj.selectAcct].usefulBalance;                   // 預設帶第一筆資料之可用餘額
          this.checkDataObj['withdrawAcct'] = this.withdrawAcctList[this.checkDataObj.selectAcct].account;    // 預設帶第一筆資料之提款帳號
        }
      }
    }
  }

  // 下一步按鈕事件
  nextStep() {

    // 檢核欄位資料
    this.nocardTransService.checkData(this.checkDataObj).then(
      (res) => {
        this.errorMsg = res['errorMsg'];
        this.allEditReserveData = res['allEditReserveData'];

        // 若記住我被勾選
        if (this.isRemeberPwd == true) {
          let mytestPWD: string = this.allEditReserveData.withdrawPwd;
          this.tcbb.fastAESEncode([mytestPWD, mytestPWD]).then(
            (res_Encode) => {
              // 借用custId欄位，進行提款密碼加密，儲存至localStorage
              let NO_CARD: string = res_Encode.custId;
              this.localStorageService.set('NO_CARD', NO_CARD);
            },
            (error_Encode) => {
              this.errorHandler.handleError(error_Encode);
            }
          );
        } else {
          // 清空儲存至localStorage的NO_CARD
          this.localStorageService.set('NO_CARD', '');
        }

        this.allEditReserveData.custId = this.navgatorObj['custId'];
        this.allEditReserveData.deviceId = this.navgatorObj['deviceId'];
        this.allEditReserveData.nocrwdTime = this.navgatorObj['nocrwdTime'];
        this.allEditReserveData.trnsToken = this.navgatorObj['trnsToken'];

        // passCount檢核欄位數為四時，表示必填欄位已填
        if (res['passCount'] == 4) {
          // 轉跳至確認頁面
          this.showPage = 'confirmPage';
        }
    });
  }

  // 取消按鈕事件
  cancelBtn() {
    // 是否確認取消編輯
    this.cancelEdit();
  }

  // 檢核是否記住提款密碼
  checkRemeberPwd() {
    this.isRemeberPwd = !this.isRemeberPwd;
    if (this.isRemeberPwd == true) {
      this.alert.show('若執行APP清除暫存時，將自動取消記住此提款密碼!', {
        title: 'ERROR.INFO_TITLE' // 提醒您
      });
    }
    this.allEditReserveData.remeberPwd = this.isRemeberPwd;
  }

}
