/**
 * 繳卡費
 * [TODO:] 待確認"交易帳號"是否使用formate
 * [TODO:] 待確認"交易金額"是否僅有TWD
 */
import { Component, OnInit } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { QRTpyeCardService } from '@pages/epay-card/shared/qrocdeType-card.service';
import { PayCardService } from '@pages/epay/shared/service/pay-card.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { ConfirmCheckBoxService } from '@shared/popup/confirm-checkbox/confirm-checkbox.service';
//edit by alex
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { FQ000112ReqBody } from '@api/fq/fq000112/fq000112-req';
import { AuthService } from '@core/auth/auth.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { EPayCardService } from '@pages/epay-card/shared/epay-card.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FQ000116ReqBody } from '@api/fq/fq000116/fq000116-req';
import { logger } from '@shared/util/log-util';



@Component({
  selector: 'app-pay-card-login',
  templateUrl: './pay-card-login.component.html',
  styleUrls: []
})
export class PayCardLoginComponent implements OnInit {
  /**
   * 參數處理
   */

  //mody by alex
  isEmv: Boolean = false;
  trnsfrOutCard: any;
  iconFlag = 'CARD';
  meansTransactionMoney = false;
  meansTransactionCard = true;
  selectType = {
    name: '金融卡',
    acct: '',
    key: '1'
  };
  errorMsg = {
    billNumber: '',
    transactionAmout: '',
    mobileNumber: '',
    trnsAmount: '',
    orderNumber: '',
  };
  // 交易帳號(金融卡)
  // defaultTrnsOutAcct = '';
  // 交易卡號(信用卡)
  defaultTrnsCard = '';
  //isTwpay: any;
  //cardData: any;
  getCardType = '';
  creditCards = [];
  isCard = false;
  payMethod: any;


  // --- step Bar --- //
  nowStep = 'edit';
  stepMenuData = 'onepage'; // 預設stepbar
  private back_path = 'epay-card'; // epay選單

  amountCurrency = 'TWD'; // 幣別
  typeAndFeeState = '';
  typeAndFeeState1 = false;
  typeAndFeeState2 = false;
  typeAndFeeState3 = false;
  feeNameState = false;
  typeAndFeeValue = '';
  typeAndFeeValue1 = '';
  typeAndFeeValuetype = '';
  typeAndFeeValuetype1 = '';
  securityTypes = [];
  selectSecurityType: any;
  ParamsObj: any; // 傳入參數
  qrcode: any; // 傳入qrcode資料
  trnsLimitAmt: any; // 單筆限額: 來自fq000101
  // 要傳送的表單
  form: any = {};
  error_data: any;
  // 是否不提供編輯
  disableList = {
    txnAmt: true // 交易金額
    , orderNumber: false
  };
  resultData: any; // 結果資料

  webToAppRes: FQ000116ReqBody;

  constructor(
    private _logger: Logger
    , private _headerCtrl: HeaderCtrlService
    , private _formateService: FormateService
    , private _checkService: CheckService
    , private navgator: NavgatorService
    , private qrtype: QRTpyeCardService
    , private _mainService: PayCardService
    , private confirm: ConfirmService
    , private _confirmCheckBoxService: ConfirmCheckBoxService
    , private _handleError: HandleErrorService
    , private _uiContentService: UiContentService
    // deit by alex
    , private fq000112: FQ000112ApiService
    , private auth: AuthService
    , private localStorage: LocalStorageService
    , private epay: EPayCardService
    , private formateService: FormateService
    , private handleError: HandleErrorService
    , private alert: AlertService
  ) { }

  ngOnInit() {
    // --- 頁面設定 ---- //
    this._headerCtrl.setLeftBtnClick(() => {
      if (this.navgator.getParams().webToAppRes) {
        this.navgator.push('epay-card');
      } else {
        this.cancelEdit();
      }
    });
    // --- 頁面設定 End ---- //
    this._init();
  }

  /**
   * 啟動事件
   */
  async _init() {
    this.webToAppRes = this.navgator.getParams().webToAppRes;
    let paramsObj = this.navgator.getParams();
    logger.error('Param',paramsObj);
    let modify_data = this._mainService.getEditData(paramsObj);
    if (!modify_data.status) {
      // 無法正常執行功能
      modify_data['type'] = 'dialog';
      this._handleError.handleError(modify_data).then(
        () => {
          this.navgator.push('epay-scan');
        }
      );
    }
    this.trnsLimitAmt = modify_data.trnsLimitAmt;
    this.qrcode = modify_data.qrcode;
    this.form = modify_data.form;
    this.disableList = modify_data.disableList;
    this.error_data = modify_data.error_data;
    //mody by alex

    // this.defaultTrnsCard = this.qrcode.trnsfrOutCardGet();


    //this.isTwpay = this.qrcode.TaiwanPayTypeGet();
    //this.cardData = this.qrcode.fq000102ResGet();

    if(!modify_data.form['typeAndFee'] || modify_data.form['typeAndFee'].indexOf('C') == '-1'){
        this.alert.show('不支援此QRCode').then(
          ()=>{
            this.navgator.push('epay-card'); 
            return false;
          }
        );

    }
    const fq000101Data: any = await this.epay.sendFQ000101('T');
    logger.info('fq000101Data',fq000101Data);
    this.defaultTrnsCard = this.formateService.checkField(fq000101Data, 'defaultTrnsCard');
    this.getCardType = this.defaultTrnsCard.substr(0, 1);

    if (this.defaultTrnsCard != null && this.defaultTrnsCard != '') {


    } else {                    //預設信用卡為空
      const form = new FQ000112ReqBody();
      let userData = this.auth.getUserInfo();
      form.custId = userData.custId;
      this.fq000112.send(form)
        .then(
          (fq000112res) => {
            this.creditCards = fq000112res.body.creditCards;
            let today = new Date();
            // 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束

            if (this.creditCards == null || this.creditCards['creditCard'] == null) {
    
              // 是否要申請信用卡
            if (this.localStorage.get('nextAsk_bindCard') != today.getDate().toString()) {
                this._confirmCheckBoxService.show('是否申請信用卡', {
                  title: '提醒您',
                  checkbox: '本日不再提醒我'
                }).then(
                  apply => {
                    if (apply.checked) {
                      this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                    } else {
                      this.localStorage.set('nextAsk_bindCard', '0');
                    }
                    this.navgator.push('web:apply');
                  },
                  not_apply => {
                    if (not_apply.checked) {
                      this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                    } else {
                      this.localStorage.set('nextAsk_bindCard', '0');
                    }
                    this.alert.show('無信用卡,無法進行此交易')
                    this.navgator.push('epay-card');
                  }
                );
              }
            } else {
              // 判斷有無預設信用卡
              if (this.localStorage.get('nextAsk_bindCard') != today.getDate().toString()) {
                // 是否要綁定信用卡
                this._confirmCheckBoxService.show('是否綁定預設信用卡', {
                  title: '提醒您',
                  checkbox: '本日不再提醒我'
                }).then(
                  (resconfirm) => {
                    if (resconfirm.checked) {
                      this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                      this.navgator.push('cardlogin-qrcodePayCardTerms');
                    } else {
                      this.localStorage.set('nextAsk_bindCard', '0');
                      this.navgator.push('cardlogin-qrcodePayCardTerms');
                    }
                  }, (cancel) => {
                    if (cancel.checked) {
                      this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                    } else {
                      this.localStorage.set('nextAsk_bindCard', '0');
                    }
                    this.alert.show('無綁定預設信用卡,無法進行此交易');
                    this.navgator.push('epay-card');
                  }
                );
              } else {
                // 走金融卡頁面
                  this.alert.show('無信用卡,無法進行此交易');
                  this.navgator.push('epay-card');
                // this.meansTransactionMoney = true;
                // this.meansTransactionCard = false;
              }
            }
          }).catch(
            error => {
              this.handleError.handleError(error);
            });
    }
    // 判斷可使用繳費方式
    let Cardtype = this.defaultTrnsCard.substr(0, 1);
    //if (Cardtype == '4' || Cardtype == '3' || Cardtype == '2' || Cardtype == '5') { Cardtype = 'C'; }
  if (this.form.typeAndFee.indexOf('F') != '-1' && this.defaultTrnsCard != '' && this.form.typeAndFee.indexOf('C') != '-1' && (Cardtype == '2' || Cardtype == '3' || Cardtype == '4' || Cardtype == '5')) {
      this.typeAndFeeState3 = true;
    } else if (this.form.typeAndFee.indexOf('F') == '-1' && this.defaultTrnsCard != '' && this.form.typeAndFee.indexOf('C') != '-1' && (Cardtype == '2' || Cardtype == '3' || Cardtype == '4' || Cardtype == '5')) {
      this.typeAndFeeState2 = true;
    }
    // 手續費與feeSessionId 有金融卡與信用卡兩種可能

    let feeSessionId = this.form.feeSessionId;
    let feeSessionId1 = this.form.feeSessionId;
    if (feeSessionId1 != null && feeSessionId1 != '' && (feeSessionId1.indexOf('F') != '-1')) {
      let feeSessionIdArray = [];
      feeSessionIdArray = feeSessionId1.split(',');
      for (let i = 0; i < feeSessionIdArray.length; i++) {
        if (feeSessionIdArray[i].indexOf('F') != '-1') {
          feeSessionId1 = feeSessionIdArray[i];
        }
      }
      this.form.feeSessionId1 = feeSessionId1;
    }
    // tslint:disable-next-line:max-line-length
    if (feeSessionId != null && feeSessionId != '' && feeSessionId.indexOf('C') != '-1' && (this.getCardType == '2' || this.getCardType == '3' || this.getCardType == '4' || this.getCardType == '5')) {
      let feeSessionIdArray = [];
      feeSessionIdArray = feeSessionId.split(',');
      for (let i = 0; i < feeSessionIdArray.length; i++) {
        if (feeSessionIdArray[i].indexOf('C') != '-1') {
          feeSessionId = feeSessionIdArray[i];
        }
      }
      this.form.feeSessionId = feeSessionId;
    }
    // 取出Ｆ手續費
    //  let typeAndFeeValue;
    //  let typeAndFeeValue1;
    //debugger;
    if (this.form.typeAndFee.indexOf('F') != '-1') {
      let startindex = this.form.typeAndFee.indexOf('F');
      if ((this.form.typeAndFee.substr(startindex, startindex + 3)).indexOf(',') == '-1') {
        this.typeAndFeeValue1 = this.form.typeAndFee.substr(startindex + 1, 2);
        this.form.typeAndFee1 = this.form.typeAndFee.substr(startindex, 3);
      } else {
        this.typeAndFeeValue1 = this.form.typeAndFee.substr(startindex + 1, 1);
        this.form.typeAndFee1 = this.form.typeAndFee.substr(startindex, 2);
      }
      this.form.charge1 = (this.typeAndFeeValue1.substr(0)).concat('.00');
      //this.typeAndFeeState = '3';
    }
    // tslint:disable-next-line:one-line
    // tslint:disable-next-line:max-line-length
    if (this.form.typeAndFee.indexOf('C') != '-1' && ((this.getCardType == '2') || (this.getCardType == '3') || (this.getCardType == '4') || (this.getCardType == '5'))) {
      let startindex = this.form.typeAndFee.indexOf('C');
      if ((this.form.typeAndFee.substr(startindex, startindex + 3)).indexOf(',') == '-1') {
        this.typeAndFeeValue = this.form.typeAndFee.substr(startindex + 1, 2);
        this.form.typeAndFee = this.form.typeAndFee.substr(startindex, 3);
      } else {
        this.typeAndFeeValue = this.form.typeAndFee.substr(startindex + 1, 1);
        this.form.typeAndFee = this.form.typeAndFee.substr(startindex, 2);
      }
      this.form.charge = (this.typeAndFeeValue.substr(0)).concat('.00');
      //this.typeAndFeeState = '2';
    }

    if (this.form.typeAndFee == '') {
      this.form.charge = this._formateService.checkField(this.qrcode, 'charge');
      this.form.charge = (this.typeAndFeeValue.substr(0)).concat('00');
      //this.typeAndFeeState = '1';
    }
    // 顯示手續費
    if (this.typeAndFeeState1 == true || this.typeAndFeeState3 == true) {
      this.typeAndFeeState = '3';
    } else if (this.typeAndFeeState2 == true) {
      this.typeAndFeeState = '2';
    } else {
      this.typeAndFeeState = '1';
    }








    if (this.form.typeAndFee != null && this.form.typeAndFee != '') {
      // tslint:disable-next-line:max-line-length
      if (this.form.typeAndFee != null && this.form.typeAndFee != '' && this.form.typeAndFee.indexOf('F') == '-1' && this.form.typeAndFee.indexOf('C') == '-1') {
        // return Promise.reject({
        //   title: '提示',
        //   msg: '不支援該類支付工具類型' // QR Code掃描失敗(SUPPORT_ERRPR)
        // });
        this._handleError.handleError({
          type: 'dialog',
          title: 'ERROR.TITLE',
          content: '不支援該類支付工具類型'
        }).then(
          () => {
            this.navgator.push('epay-card');
          }
        );
        return false;
      }
      // console.log('this.typeAndFeeValue' + this.typeAndFeeValue);
      // console.log('this.form.typeAndFee' + this.form.typeAndFee);
      // this.typeAndFeeValue = this.form.typeAndFeeValue;
    }
    // 取出Ｆ手續費
    // if (this.form.typeAndFee.indexOf('F') != '-1') {
    //   let startindex = this.form.typeAndFee.indexOf('F');
    //   let endindex = (this.form.typeAndFee.substr(this.form.typeAndFee.indexOf('F'))).indexOf(','); // F沒有出現在最後
    //   if (endindex != '-1') {
    //     this.typeAndFeeValue = this.form.typeAndFee.substr(startindex + 1, startindex + endindex);
    //   } else {// F出現在最後
    //     this.typeAndFeeValue = this.form.typeAndFee.substr(startindex + 1);
    //   }
    // }

    if (this.form.feeName != null && this.form.feeName != '') {
      this.feeNameState = true;
    }
    // alert('typeAndFeeState' + this.typeAndFeeState);
    // 安控資料取得
    let security_data = this.qrtype.getSecurityData();
    this.securityTypes = security_data.securityTypes;
    if (!!security_data.selectSecurityType) {
      this.onChangeSecurity(security_data.selectSecurityType);
    }
  logger.error('defaultTrnsCard',this.defaultTrnsCard,this.typeAndFeeState2 = false);
    this._logger.step('Epay-card', 'security:', this.securityTypes, this.selectSecurityType);

  }

  /**
   * 變更步驟
   * @param step
   */
  onChangePage(step: string) {
    this.nowStep = step;
  }


  onChangeSecurity(security) {
    this.selectSecurityType = security;
  }

  /**
   * 放棄編輯
   */
  cancelEdit() {
    this.confirm.cancelEdit({ type: 'edit' }).then(
      () => {
        this.navgator.push(this.back_path);
      },
      () => {
        // no do
      }
    );
  }

  /**
   * 資料檢查(目前不會到此步驟)
   */
  onCheckEvent() {
    this._logger.step('Epay-card', 'onCheckEvent');
    //this.form.meansTransactionCard = this.meansTransactionCard;
    //this.form.cardNbr = this.defaultTrnsCard;
    let check_data = this._mainService.checkEditData(this.form, this.selectSecurityType);
    if (!check_data.status) {
      this.error_data = check_data.error_list;
      // 當使用者輸入有誤時，將頁面拉回最上方。
      this._uiContentService.scrollTop();
      check_data['type'] = 'dialog';
      this._handleError.handleError(check_data);
      return false;
    }

    // this.onChangePage('check'); // 目前不顯示確認頁
    this.onSaveEvent();
  }


  /**
   * 儲存
   */
  onSaveEvent() {
    this._mainService.sendData(this.form, this.selectSecurityType, this.meansTransactionCard, this.defaultTrnsCard).then(
      (resData) => {
        this._logger.step('Epay-card', 'res go', resData);
        this.resultData = resData;
        // 成功，將頁面拉回最上方。
        // this._uiContentService.scrollTop();
        this.onChangePage('result');
        if (resData.classType !== 'error' && this.webToAppRes) {
          this.epay.webToAppRes(this.webToAppRes);
        }
      },
      (errorObj) => {
        if (errorObj.hasOwnProperty('errorCode') && errorObj['errorCode'] === 'USER_CANCEL') {
          // 使用者取消，不動作
          return false;
        }
        if (errorObj.hasOwnProperty('ret_code') && errorObj['ret_code'] === 10) {
          // 使用者取消，不動作(生物辨識)
          return false;
        }
        if (errorObj.hasOwnProperty('errorType') && errorObj['errorType'] === 'check' && errorObj.hasOwnProperty('error_list')) {
          // 當使用者輸入有誤時，將頁面拉回最上方。
          this._uiContentService.scrollTop();
          this.error_data = errorObj['error_list'];
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
        } else {
          if (this.webToAppRes) {
            const respCode = errorObj.hasOwnProperty('errorCode') && errorObj['errorCode'] ? errorObj['errorCode'] : '0099';
            this.webToAppRes.responseCode = respCode;
            this.epay.webToAppRes(this.webToAppRes);
          }
          errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        }
      }
    );
  }
  

  //mody by alex
  onType(e) {
    if (this.getCardType == '3' && e.target.value == '2') {
      this.iconFlag = 'JCB';
      this.meansTransactionMoney = false;
      this.meansTransactionCard = true;
      this.selectType.key = '2';
      this.typeAndFeeState = '2';
      // this.webToAppRes.cardPlan = 'J';
      this.setCardPlan('J');
    } else if (this.getCardType == '4' && e.target.value == '2') {
      this.iconFlag = 'VISA';
      this.meansTransactionMoney = false;
      this.meansTransactionCard = true;
      this.selectType.key = '2';
      this.typeAndFeeState = '2';
      // this.webToAppRes.cardPlan = 'V';
      this.setCardPlan('V');
    } else if ((this.getCardType == '2' || this.getCardType == '5') && e.target.value == '2') {
      this.iconFlag = 'MASTER';
      this.meansTransactionMoney = false;
      this.meansTransactionCard = true;
      this.selectType.key = '2';
      this.typeAndFeeState = '2';
      // this.webToAppRes.cardPlan = 'M';
      this.setCardPlan('M');
    } else {
      this.iconFlag = 'CARD';
      this.meansTransactionMoney = true;
      this.meansTransactionCard = false;
      this.selectType.key = '1';
      this.typeAndFeeState = '3';
    }

    this.errorMsg = {
      billNumber: '',
      transactionAmout: '',
      mobileNumber: '',
      trnsAmount: '',
      orderNumber: '',
    };
  }


  private setCardPlan( cardPlan: string ) {
    if ( !!this.webToAppRes ) {
      this.webToAppRes.cardPlan = cardPlan;
    }
  }
}
