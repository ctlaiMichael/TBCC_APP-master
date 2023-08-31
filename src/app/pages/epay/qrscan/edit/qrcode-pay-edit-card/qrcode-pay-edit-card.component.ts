/**
 * [待廢除] 繳卡費
 * 整隻寫錯，直接重寫
 */
import { Component, OnInit } from '@angular/core';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { EPayService } from '@pages/epay/shared/epay.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FQ000112ReqBody } from '@api/fq/fq000112/fq000112-req';
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { FQ000114ApiService } from '@api/fq/fq000114/fq000114-api.service';
import { logger } from '@shared/util/log-util';

@Component({
  selector: 'app-qrcode-pay-edit-card',
  templateUrl: './qrcode-pay-edit-card.component.html',
  styleUrls: []
})
export class QrcodePayEditCardComponent implements OnInit {
  isTwpay: any;
  trnsfrOutCard: any;
  getCardType: any;
  cardData: {
    trnsRsltCode: any,
    hostCode: any,
    hostCodeMsg: any,
    visaMerchantPAN: any,
    masterMerchantPAN: any,
    jcbMerchantPAN: any,
    merchantCategoryCode: any,
    transactionCurrency: any,
    transactionAmout: any,
    countryCode: any,
    merchantName: any,
    merchantCity: any,
    postalCode: any,
    billNumber: any,
    mobileNumber: any,
    storeLabel: any,
    loyaltyNumber: any,
    referenceLabel: any,
    customerLabel: any,
    terminalLabel: any,
    purposeOfTransaction: any,
    additionalConsumerDataRequest: any,
    trnsToken: any,
    merchantNameByLang: any,
    supportScheme: any,
    transType: any,
    pfid: any
  };
  isEmv: any;
  disableCardAmountInput: any;
  disablemobileNumberInput: any;
  mobileNumberDisply: any;
  disablebillNumberInput: any;
  billNumberDisply: any;
  selectedItem: any;
  barcode = [];
  noBarcode: any;
  barcodeStyle: any;
  defaultBarcode: any;
  anotherBarcode: any;
  securityTypes = [];
  selectSecurityType: any;
  trnsLimitAmt: any;
  disableAmountInput: any;
  disableOrderNumberInput: any;
  chCardType: any;
  ParamsObj: any;
  selectType = {
    name: '金融卡',
    acct: '',
    key: '1'
  };
  form: any = {
    trnsfrOutAcct: '',
    secureCode: '',
    acqInfo: ''
  };
  errorMsg = {
    billNumber: '',
    transactionAmout: '',
    mobileNumber: '',
    trnsAmount: '',
    orderNumber: '',
  };
  TrnsType = [];
  paymentData: any;
  qrcodeObj: any;
  constructor(
    private qrcodeService: QRTpyeService,
    private navgator: NavgatorService,
    private auth: AuthService,
    private handleError: HandleErrorService,
    private epay: EPayService,
    private confirm: ConfirmService,
    private alert: AlertService,
    private localStorage: LocalStorageService,
    private fq000112: FQ000112ApiService,
    private fq000114: FQ000114ApiService
  ) { }

  ngOnInit() {
    this._init();
  }

  _init() {
    this.isTwpay = this.qrcodeService.TaiwanPayTypeGet();
    this.trnsfrOutCard = this.qrcodeService.trnsfrOutCardGet();

    this.ParamsObj = this.navgator.getParams();
    this.qrcodeObj = this.ParamsObj.qrcode;
    this.trnsLimitAmt = this.ParamsObj.trnsLimitAmt;
    this.cardData = this.ParamsObj.qrcode;

    logger.error('cardData', this.cardData, this.ParamsObj);
    this.form = {
      trnsfrOutAcct: this.ParamsObj.trnsfrOutAcct
      , secureCode: this.ParamsObj.qrcode.secureCode
      , acqInfo: this.ParamsObj.qrcode.acqInfo
    };
    logger.error('cardData', this.cardData);
    // boundle.remove('hasCards');
    logger.debug('取得卡片型態');
    if (typeof this.trnsfrOutCard === 'undefined' || this.trnsfrOutCard === null) {
      if (this.cardData.transType !== '3') {
        this.getCardType = this.trnsfrOutCard;
        const form = new FQ000112ReqBody();
        form.custId = this.auth.userInfo.custId;
        this.fq000112.send(form)
          .then(
            (fq000112res) => {
              // 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
              if (fq000112res.creditCards === null || fq000112res.creditCards.creditCard === null) {
                let today = new Date();
                if (this.localStorage.get('nextAsk_bindCard') !== today.getDate().toString()) {
                  // 是否要綁定信用卡
                  this.confirm.show('是否申請信用卡').then(
                    res01 => {
                      this.confirm.show('本日不再提醒我').then(
                        reschecked => {
                          this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                        },
                        errorchecked => {
                          this.localStorage.set('nextAsk_bindCard', '0');
                        }
                      );
                      this.navgator.push('web:apply');
                    }
                  );
                } else {
                  this.alert.show('無信用卡,無法進行此交易').then(
                    res02 => {
                      this.navgator.push('epay');
                    }
                  );
                }
              } else {
                // 判斷有無預設信用卡
                let today = new Date();
                if (this.localStorage.get('nextAsk_bindCard') !== today.getDate().toString()) {
                  // 是否要綁定信用卡
                  this.confirm.show('是否綁定信用卡').then(
                    resconfirm => {
                      this.confirm.show('本日不再提醒我').then(
                        reschecked => {
                          this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                          this.navgator.push('qrcodePayCardTerms');
                        },
                        errorchecked => {
                          this.localStorage.set('nextAsk_bindCard', '0');
                          this.navgator.push('qrcodePayCardTerms');
                        }
                      );
                    },
                    error => {
                      this.alert.show('無綁定卡號,無法進行此交易').then(
                        res01 => {
                          this.navgator.push('epay');
                        }
                      );
                    }
                  );
                } else {
                  this.alert.show('無綁定卡號,無法進行此交易').then(
                    res02 => {
                      this.navgator.push('epay');
                    }
                  );
                }
              }
            }).catch(
              error => {
                this.handleError.handleError(error);
              });
      } else {
        // 走金融卡頁面
        this.isEmv = false;
      }
    } else {
      let cardType = this.trnsfrOutCard.substr(0, 1);
      if (cardType === '3') {
        this.getCardType = 'JCB';
      } else if (cardType === '4') {
        this.getCardType = 'VISA';
      } else if (cardType === '2' || cardType === '5') {
        this.getCardType = 'MASTER';
      }
    }

    // tslint:disable-next-line: max-line-length
    if (this.cardData.transactionAmout !== null && this.cardData.transactionAmout !== '' && typeof (this.cardData.transactionAmout) !== 'object') {
      // tslint:disable-next-line: radix
      this.cardData.transactionAmout = parseInt(this.cardData.transactionAmout);
      this.disableCardAmountInput = true;
    }
    if (typeof (this.cardData.transactionAmout) === 'object') {
      this.cardData.transactionAmout = '';
    }
    // 判斷手機手否有值
    if (this.cardData.mobileNumber !== null && typeof (this.cardData.mobileNumber) !== 'object') {
      this.disablemobileNumberInput = true;
      this.mobileNumberDisply = true;
      if (this.cardData.mobileNumber === '***') {
        this.mobileNumberDisply = true;
        this.cardData.mobileNumber = '';
        this.disablemobileNumberInput = false;
      }
    } else {
      this.mobileNumberDisply = false;
      this.cardData.mobileNumber = '';
    }

    // 訂單編號(針對可能為空值特別處理)
    if (this.cardData.billNumber !== null && typeof (this.cardData.billNumber) !== 'object') {
      this.disablebillNumberInput = true;
      this.billNumberDisply = true;
      if (this.cardData.billNumber === '***') {
        this.billNumberDisply = true;
        this.cardData.billNumber = '';
        this.disablebillNumberInput = false;
      }
    } else {
      this.billNumberDisply = false;
      this.cardData.billNumber = '';
    }
    // 判斷是否有對應的卡片型態

    if (typeof this.cardData.jcbMerchantPAN === 'undefined') {
      this.cardData.jcbMerchantPAN = '';
    }
    if (typeof this.cardData.visaMerchantPAN === 'undefined') {
      this.cardData.visaMerchantPAN = '';
    }
    if (typeof this.cardData.masterMerchantPAN === 'undefined') {
      this.cardData.masterMerchantPAN = '';
    }

    let getCardType = this.getCardType;
    this.chCardType = true;
    if (getCardType === 'JCB' && this.cardData.jcbMerchantPAN === '') {
      this.chCardType = false;
    }
    if (getCardType === 'VISA' && this.cardData.visaMerchantPAN === '') {
      this.chCardType = false;
    }
    if (getCardType === 'MASTER' && this.cardData.masterMerchantPAN === '') {
      this.chCardType = false;
    }

    let res: any = this.auth.getUserInfo();
    if (res.AuthType.indexOf('2') > -1) {
      let cnEndDate: any;
      if (res.cnEndDate === null) {
        cnEndDate = DateUtil.transDate(new Date());
      } else {
        cnEndDate = DateUtil.transDate(res.cnEndDate, 'date');
      }
      let todayDate = DateUtil.transDate(new Date());
      if (res.cn == null || res.cn == '' || DateUtil.compareDate(todayDate, cnEndDate) == -1) {
      } else {
        this.securityTypes.push({ name: '憑證', key: 'NONSET' });
      }
    }
    if (res.AuthType.indexOf('3') > -1) {
      if (res.BoundID == '4' && res.OTPID == '2') {
        this.securityTypes.push({ name: 'OTP', key: 'OTP' });
      }
    }
    // 安控資料取得
    let security_data = this.qrcodeService.getSecurityData();
    this.securityTypes = security_data.securityTypes;
    if (!!security_data.selectSecurityType) {
      this.onChangeSecurity(security_data.selectSecurityType);
    }
  }

  changeBarcode(e) {
    this.defaultBarcode = this.barcode[e.target.selectedIndex];
  }

  // 沒有發票載具條碼
  getBarcode() {
    this.navgator.push('getBarcodeTerm');
  }

  onChangeSecurity(security) {
    this.selectSecurityType = security;
  }

  setHtmlData() {
    const response = this.navgator.getParams();
    this.qrcodeObj = response.qrcode;
    this.trnsLimitAmt = response.trnsLimitAmt;

    this.form.trnsfrOutAcct = response.trnsfrOutAcct;
    this.form.secureCode = response.qrcode.secureCode;
    this.form.acqInfo = response.qrcode.acqInfo;

    if (response.qrcode.txnAmt != null && response.qrcode.txnAmt != '' && typeof (response.qrcode.txnAmt) != 'object') {

      // tslint:disable-next-line: radix
      this.form.trnsAmount = parseInt(response.qrcode.txnAmt) / 100;
      this.disableAmountInput = true;
    }
    // 訂單編號(針對可能為空值特別處理)
    if (response.qrcode.orderNbr != null && typeof (response.qrcode.orderNbr) != 'object') {
      this.form.orderNumber = response.qrcode.orderNbr;
      this.disableOrderNumberInput = true;
    }
    // 交易幣別(針對可能為空值特別處理)
    if (response.qrcode.txnCurrencyCode != null && typeof (response.qrcode.txnCurrencyCode) != 'object') {
      this.form.txnCurrencyCode = response.qrcode.txnCurrencyCode;
    }

    // QRCode效期(針對可能為空值特別處理)
    if (response.qrcode.qrExpirydate != null && typeof (response.qrcode.qrExpirydate) != 'object') {
      this.form.qrExpirydate = response.qrcode.qrExpirydate;
    }
  }
  onType(e) {
    this.selectType = this.TrnsType[e.target.selectedIndex];
    this.errorMsg = {
      billNumber: '',
      transactionAmout: '',
      mobileNumber: '',
      trnsAmount: '',
      orderNumber: '',
    };
  }

  clickCancel() {
    this.navgator.push('epay');
  }
  /**
   * 點選確認
   */
  clickSubmit() {
    // 如果是信用卡要判斷電話是否為空值
    if (this.billNumberDisply) {
      if ((this.cardData.billNumber == null || this.cardData.billNumber.length == 0)) {
        this.errorMsg.billNumber = '請輸入訂單編號';
        return;
      }
    }
    if (this.cardData.transactionAmout === '') {
      this.errorMsg.transactionAmout = '請輸入交易金額';
      return;
    }
    if (this.mobileNumberDisply) {
      if ((this.cardData.mobileNumber == null || this.cardData.mobileNumber.length == 0)) {
        this.errorMsg.mobileNumber = '請輸入電話號碼';
        return;
      }
    }
    // tslint:disable-next-line: radix
    let limit = 50000;
    if (this.cardData.transactionAmout > limit) {
      this.errorMsg.transactionAmout = '一般交易金額每筆限新臺幣五萬元(不含稅費)';
      return;
    }


    this.paymentData = this.form;
    let info = this.auth.getUserInfo();
    if (this.selectSecurityType.key === 'NONSET' && (info.cn == null || info.cn == '')) {
      this.alert.show('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。');
      return;
    }

    // 信用卡交易
    this.paymentData.custId = info.custId;
    let formCopy = { ...this.paymentData }; // 因顯示和實際發出資料會有不同所以copy一份以免異常
    formCopy.custId = info.custId;
    formCopy.cardNo = this.trnsfrOutCard;
    formCopy.trnsAmount = this.cardData.transactionAmout;
    if (typeof (this.cardData.transactionAmout) == 'number') {
      formCopy.trnsAmount = this.cardData.transactionAmout.toString();
    }
    if (formCopy.trnsAmount.indexOf('.') == -1) {
      formCopy.trnsAmount = formCopy.trnsAmount + '00';
    } else {
      formCopy.trnsAmount = formCopy.trnsAmount * 100;
    }
    formCopy.countryCode = '158';
    formCopy.txnCurrencyCode = this.cardData.transactionCurrency;

    // 判斷是什麼卡 傳什麼pan
    if (this.getCardType == 'JCB') {
      formCopy.merchantPan = this.cardData.jcbMerchantPAN;
    } else if (this.getCardType == 'VISA') {
      formCopy.merchantPan = this.cardData.visaMerchantPAN;
    } else if (this.getCardType == 'MASTER') {
      formCopy.merchantPan = this.cardData.masterMerchantPAN;
    }
    formCopy.mcc = this.cardData.merchantCategoryCode;
    formCopy.merchantName = this.cardData.merchantName;
    formCopy.merchantCity = this.cardData.merchantCity;
    formCopy.postalCode = this.cardData.postalCode;
    formCopy.billNumber = this.cardData.billNumber;
    formCopy.mobileNumber = this.cardData.mobileNumber;
    formCopy.merchantNameByLang = encodeURI(this.cardData.merchantNameByLang);
    formCopy.trnsToken = this.cardData.trnsToken;
    let respon = {
      custId: formCopy.custId,
      cardNo: formCopy.cardNo,
      trnsAmount: formCopy.trnsAmount,
      countryCode: formCopy.countryCode,
      txnCurrencyCode: formCopy.txnCurrencyCode,
      merchantPan: formCopy.merchantPan,
      mcc: formCopy.mcc,
      merchantName: formCopy.merchantName,
      merchantCity: formCopy.merchantCity,
      postalCode: formCopy.postalCode,
      billNumber: formCopy.billNumber,
      mobileNumber: formCopy.mobileNumber,
      storeLabel: formCopy.storeLabel,
      loyaltyNumber: formCopy.loyaltyNumber,
      referenceLabel: formCopy.referenceLabel,
      customerLabel: formCopy.customerLabel,
      terminalLabel: formCopy.terminalLabel,
      purposeOfTransaction: formCopy.purposeOfTransaction,
      additionalCDR: formCopy.additionalCDR,
      merchantNameByLang: formCopy.merchantNameByLang,
      pfid: formCopy.pfid,
      trnsToken: formCopy.trnsToken
    };

    const CA_Object = {
      securityType: '',
      serviceId: 'FQ000114',
      signText: respon
    };
    this.qrcodeService.getSecurityInfo(CA_Object, this.selectSecurityType).then(
      resSecurityInfo => {
        logger.error('resSecurityInfo', resSecurityInfo);
        let reqHeader = {
          header: resSecurityInfo.headerObj
        };
        this.fq000114.send(resSecurityInfo.responseObj.signText, reqHeader).then(
          (res) => {
            if (!this.qrcodeService.isCheckResponse(res)) {
              this.handleError.handleError({
                type: 'dialog',
                title: 'ERROR.TITLE',
                content: '(' + res.body.hostCode + ')' + res.body.hostCodeMsg
              });
              this.clickCancel();
              return;
            }
            let params = {
              qrcode: this.qrcodeService,
              result: res,
              means: 'card',
              detail: 'qrcodePayResult'
            };
            localStorage.setItem('lastTransaction', '2');
            this.navgator.push('qrcodePayResult', params);
          }).
          catch(
            error => {
              this.handleError.handleError(error);
            });
      },
      errorSecurityInfo => {
        logger.debug('errorSecurityInfo');
      },
    );
  }
}
