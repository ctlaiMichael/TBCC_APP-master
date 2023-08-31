import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import Swiper from 'swiper/dist/js/swiper.js';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
import { CommonUtil } from '@shared/util/common-util';
import { FQ000303ApiService } from '@api/fq/fq000303/fq000303-api.service';

import { FQ000112ReqBody } from '@api/fq/fq000112/fq000112-req';
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

import { AuthService } from '@core/auth/auth.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FormateService } from '@shared/formate/formate.service';
import { ScreenshotPreventionService } from '@lib/plugins/screenshotprevention.service';
// import { QRCODESHOWPAY_SHORTCUT } from '@conf/shortcut/qrcodeShowPay_shortcut';
import { ShortcutService } from '@lib/plugins/shortcut.service';
import { logger } from '@shared/util/log-util';
import { DeviceService } from '@lib/plugins/device.service';
import { EPayCardService } from '@pages/epay-card/shared/epay-card.service';
@Component({
  selector: 'app-show-pay-card',
  templateUrl: './show-pay-card.component.html',
  styleUrls: ['./show-pay-card.component.css']
})
export class ShowPayCardComponent implements OnInit, OnDestroy {
  swiper: Swiper;
  defaultTrnsOutAcct: any;
  cradBarcode: any;
  myAcct: any;
  myAcct1: any;
  result = {
    respCode: '',
    qrcode: '',
    barcode: '',
    createTime: '',
    trnsRsltCode: '',
    cardBarcode: '',
    cardToken: ''
  };
  barcodeWidth = 1;
  mobileBarcode: any;
  cardNoFlag = 'N';
  // genQRCode: any;
  onBigCode = false;
  onBarcodeBigCode = false;
  onCardBarcodeBigCode = false;
  isLC: any;
  barcodeList: any;
  // genBarcode: any;
  genCardBarcode: any;
  createTime: any;
  cardBarcode: any;
  interval: any;
  mytimeout = 1800000;
  limitTime = 180;
  mobileCode = false;
  checkSS = 20;
  payMethod: any;
  isCard = false;
  // 金融卡區塊
  meansTransactionMoney = false;
    // 信用卡區塊
  meansTransactionCard = true;
  iconFlag = 'CARD';
  trnsfrOutCard: any;
  defaultTrnsCard = '';
  creditCards = [];
  cardToken: any;
  inBigPic = false;
  controFlag=false;
  // showShortcutBtn = false;
  constructor(
    private epay: EPayCardService,
    private navgator: NavgatorService,
    private handleError: HandleErrorService,
    private fq000303: FQ000303ApiService,
    private zone: NgZone,
    private auth: AuthService,
    private headerCtrl: HeaderCtrlService,
    private alert: AlertService,
    private formateService: FormateService,
    private screenshotPrevention: ScreenshotPreventionService,
    private shortcut: ShortcutService,
    private device: DeviceService,
    private fq000112: FQ000112ApiService,
    private localStorage: LocalStorageService,
    private confirm: ConfirmService
  ) {
    this.headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '消費扣款-出示付款碼'
    });
    this.headerCtrl.setLeftBtnClick(() => {
      if (this.inBigPic == true) {
        this.closeBigCode();
      } else {
        this.clickCancel();
      }
    });
  }

  ngOnInit() {
    // this.showShortCut();
    this._init();
  }

  ngOnDestroy() {
    this.screenshotPrevention.enabledScreenshotPrevention();
  }

  async _init() {
    this.screenshotPrevention.disabledScreenshotPrevention();
    // this.genQRCode = '';
    // this.genBarcode = '';
    // 處理一維二維條碼
    let ParamsObj = this.navgator.getParams();
    logger.error(ParamsObj);
    if(!ParamsObj.result){
      this.navgator.push('epay-card');
      return false;
    }
    this.result = ParamsObj.result; // fq000302 一維二維
    this.result.respCode = this.formateService.checkField(this.result, 'trnsRsltCode');
    // this.genQRCode = this.formateService.checkField(this.result, 'qrcode');
    // this.genBarcode = this.formateService.checkField(this.result, 'barcode');
    this.createTime = this.formateService.checkField(this.result, 'createTime');
    this.genCardBarcode = this.formateService.checkField(this.result, 'cardBarcode');
    // this.result.respCode = this.result.trnsRsltCode;
    // this.genQRCode = this.result.qrcode;
    // this.genBarcode = this.result.barcode;
    // this.createTime = this.result.createTime;
    try {
      const fq000101Data: any = await this.epay.sendFQ000101('T');
      // let trnsOutAcct = this.formateService.checkField(fq000101Data, 'defaultTrnsOutAcct');

      this.defaultTrnsCard = this.formateService.checkField(fq000101Data, 'defaultTrnsCard');
      logger.error('this.defaultTrnsCard', this.defaultTrnsCard);
      // debugger;
        if (this.defaultTrnsCard != null && this.defaultTrnsCard != '') {
          logger.error('defaultTrnsCard!=空');
          this.isCard = true;
          this.controFlag=true;
          // this.payMethod = 1;
          // 預設支付方式判斷
          // if (this.localStorage.get('default-pay-method') != 2 ) {
          //   this.payMethod = 1;
          // }else {this.payMethod = 2; }
        } else {                    // 預設信用卡為空
          logger.info('預設信用卡為空');
          const form = new FQ000112ReqBody();
          form.custId = this.auth.userInfo.custId;
          logger.info('112',form);
          this.fq000112.send(form)
            .then(
              (fq000112res) => { 
                logger.info('112res');
                this.creditCards = fq000112res.body.creditCards;
                logger.error('this.creditCards', this.creditCards);
                let today = new Date();
          // 檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
                if (this.creditCards == null || this.creditCards['creditCard'] == null) {
                  // 走金融卡頁面
                  this.isCard = false;
                  // 是否要申請信用卡
                  this.confirm.show('是否申請信用卡').then(
                    apply => {
                        this.confirm.show('本日不再提醒我').then(
                            reschecked => {
                                this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                            },
                            errorchecked => {
                                this.localStorage.set('nextAsk_bindCard', '0');
                            }
                        );
                        this.navgator.push('web:apply');
                    },
                    not_apply => {
                        this.alert.show('無信用卡,無法進行此交易')
                        this.navgator.push('epay-card');
                    }
                );
                } else {
                  // 判斷有無預設信用卡
                  // let today = new Date();
                  if (this.localStorage.get('nextAsk_bindCard') != today.getDate().toString()) {
                    // 是否要綁定信用卡
                    this.confirm.show('是否綁定信用卡', {
                      title: '提醒您'
                    }).then(
                      resconfirm => {
                        this.confirm.show('本日不再提醒我').then(
                            reschecked => {
                                this.localStorage.set('nextAsk_bindCard', today.getDate().toString());
                                this.navgator.push('cardlogin-qrcodePayCardTerms');
                            },
                            errorchecked => {
                                this.localStorage.set('nextAsk_bindCard', '0');
                                this.navgator.push('cardlogin-qrcodePayCardTerms');
                            }
                        );
                    },
                      resreject=>{
                        logger.error('否綁定');
                        this.alert.show('無信用卡,無法進行此交易')
                        this.navgator.push('epay-card');
                      }
                    );
                  } else {
                      // 走金融卡頁面
                      this.alert.show('無信用卡,無法進行此交易');
                      this.navgator.push('epay-card');
                  }
                }
              }).catch(
                error => {
                  logger.info('112err');
                  this.handleError.handleError(error);
                });
        }


      logger.info('112 over');
      this.defaultTrnsOutAcct = PadUtil.padLeft(this.defaultTrnsCard, 16);//改為信用卡
      // 帳號模糊化 ex:"0560-***-***456"
      // tslint:disable-next-line: max-line-length
      if (this.defaultTrnsCard == '') {
      } else {
        // 帳號模糊化 ex:"0560-***-***456"
        let trnsAcctReFmt = this.defaultTrnsCard;
        // if (this.defaultTrnsCard.length > 13) {
        //   trnsAcctReFmt = this.defaultTrnsCard.substr(-13, 13);
        // }
        this.myAcct = this.formateService.transAccount(trnsAcctReFmt, 'mask');
        // this.myAcct1 = this.formateService.transAccount(this.defaultTrnsCard, 'mask');
      }

   


      this.setSwiper();

      if(this.controFlag){
        this.controlTime();
      }
    } catch (error) {
      this.mobileBarcode = '';
      this.cardNoFlag = 'N';
      if(this.controFlag){
        this.controlTime();
      }
    }

    let getCardType = this.defaultTrnsCard.substr(0, 1);
    if (getCardType == '3') {
      this.iconFlag = 'JCB';
    } else if (getCardType == '4') {
      this.iconFlag = 'VISA';
    } else if ((getCardType == '2' || getCardType == '5')) {
      this.iconFlag = 'MASTER';
    } else {
      this.iconFlag = 'CARD';
    }
  }

  // 倒數控制
  controlTime() {
    // 倒數秒數
    let c = this.limitTime;
    let self = this;
    function showNext() {
      c = c - 1;
      if (c >= 0) {
        this.limitSec = c + '秒';
        self.limitTime = this.limitSec;
        if (c % self.checkSS == 0 && c > 19) {
          // 檢查被掃結果
          checkBeScan();
        }
      } else {
        clearInterval(self.interval); // 結束限制三分鐘後離開頁面
        self.alert.show('停留時間已經超過三分鐘囉，即將回到台灣Pay首頁!如欲確認交易結果,請執行行動網銀存款查詢').then(
          res => {
            self.navgator.push('epay-card');
          }
        );
      }
    }
    this.interval = window.setInterval(showNext, 1000); // 設定循環

    // 檢查交易結果
    function checkBeScan() {
      let formObj: any = {
        custId: '',
        trnsGenerateTime: '',
        trnsfrOutAcct: '',
        cardToken: '',
      };
      formObj.custId = self.auth.getUserInfo().custId;
      formObj.trnsGenerateTime = self.createTime;
      formObj.trnsfrOutAcct = '';
      if (typeof self.result.cardToken !== 'string' ) {self.result.cardToken = ''; }
      formObj.cardToken = self.result.cardToken;
      self.fq000303.send(formObj).then(
        resfq000303 => {
          if (resfq000303.body.trnsRsltCode === '0') {
            clearInterval(self.interval); // 結束限制三分鐘後離開頁面
            resfq000303.body.defaultTrnsOutAcct = self.defaultTrnsOutAcct;
            if (self.meansTransactionCard === true) {
              resfq000303.body.defaultTrnsCard =  self.defaultTrnsCard;
            } else {
              resfq000303.body.defaultTrnsCard = '';
            }
            let params = {
              qrcode: '',
              result: resfq000303,
              means: 'card',
              detail: 'qrcodePayBeScanResult'
            };
            self.navgator.push('cardlogin-qrcodePayResult', params);
          }
        },
        error => {
          self.handleError.handleError(error);
        }
      );
    }
  }


  // 顯示大圖 - QRCode
  showBigQrcode() {
    this.onBigCode = true;
    this.updateHeader();
  }

  // 顯示大圖 - Barcode
  showBigBarcode() {
    this.onBarcodeBigCode = true;
    this.updateHeader();
  }

  // 顯示大圖 - LcCode
  showBigLcQrcode() {
    this.isLC = true;
    this.updateHeader();
  }

  // 顯示大圖 - Barcode
  showBigCardBarcode() {
    this.onCardBarcodeBigCode = true;
    this.updateHeader();
  }

  // 顯示大圖 - mobileCode
  showBigMobileCode() {
    this.mobileCode = true;
    this.updateHeader();
  }

  closeBigCode() {

    this.onBigCode = false;
    this.onBarcodeBigCode = false;
    this.onCardBarcodeBigCode = false;
    this.isLC = false;
    this.mobileCode = false;

    // this.setSwiper();
    // 關閉大圖時 紀錄狀態
    this.inBigPic = false;

  }
  // 進入大圖時 紀錄狀態
  updateHeader() {
    this.inBigPic = true;
  }
  /**
   * 點選取消
   */
  clickCancel() {
    clearInterval(this.interval); // 結束限制三分鐘後離開頁面
    logger.error('clickCancel');
    this.navgator.push('epay-card');
  }


  private setSwiper() {
    if (!!this.swiper) {
      this.swiper.destroy();
    }
    setTimeout(() => {
      // logger.log('do swiper init');
      this.swiper = new Swiper('.swiper-ad-container', {
        loop: false,
        pagination: {
          el: '.swiper-ad-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      });
    }, 50);
  }

  /**
 * 建立捷徑
 */
/*
  createShortCut() {
    this.shortcut.isSupportsPinned()
      .then((isSupports) => {
        if (isSupports) {
          logger.debug('QRCODESHOWPAY_SHORTCUT:' + JSON.stringify(QRCODESHOWPAY_SHORTCUT));
          return this.shortcut.addPinned(QRCODESHOWPAY_SHORTCUT);
        } else {
          this.alert.show('您的作業系統不支援建立捷徑功能', { title: 'ERROR.TITLE' });
        }
      })
      .then((addPinned) => {
        logger.debug('Pinned shortcuts are added:' + addPinned);
      })
      .catch((error) => {
        if (!!error && !!error.platform && error.platform !== 'ANDROID' && !!error.msg) {
          this.alert.show(error.msg, { title: 'ERROR.TITLE' });
        } else {
          this.alert.show('您的作業系統不支援建立捷徑功能', { title: 'ERROR.TITLE' });
        }
      });
  }
*/

// createShortCut() {
//   this.shortcut.isSupportsPinned()
//     .then((isSupports) => {
//       if (isSupports) {
//         logger.debug('QRCODESHOWPAY_SHORTCUT:' + JSON.stringify(QRCODESHOWPAY_SHORTCUTS));
//         return this.shortcut.setDynamic(QRCODESHOWPAY_SHORTCUTS);
//       } else {
//         this.alert.show('您的作業系統不支援建立捷徑功能', { title: 'ERROR.TITLE' });
//       }
//     })
//     .then((setDynamic) => {
//       logger.debug('Pinned shortcuts are added:' + setDynamic);
//     })
//     .catch((error) => {
//       if (!!error && !!error.platform && error.platform !== 'ANDROID' && !!error.msg) {
//         this.alert.show(error.msg, { title: 'ERROR.TITLE' });
//       } else {
//         this.alert.show('您的作業系統不支援建立捷徑功能', { title: 'ERROR.TITLE' });
//       }
//     });
// }

  getBarcode() {
    clearInterval(this.interval);
    // 導頁到發票載具號碼
    this.navgator.push('cardlogin-invoice');
  }

  onType(e) {
    logger.error('e',e);
    let getCardType = this.defaultTrnsCard.substr(0, 1);
    // let getCardType = this.trnsfrOutCard.substr(0, 1);
    // debugger;
    if (getCardType == '3' && e.target.value == '2') {
      this.iconFlag = 'JCB';
      this.meansTransactionMoney = false;
      this.meansTransactionCard = true;
      this.localStorage.set('default-pay-method', '1');
      // this.selectType.key = '2';
    } else if (getCardType == '4' && e.target.value == '2') {
      this.iconFlag = 'VISA';
      this.meansTransactionMoney = false;
      this.meansTransactionCard = true;
      this.localStorage.set('default-pay-method', '1');
      // this.selectType.key = '2';
    } else if ((getCardType == '2' || getCardType == '5') && e.target.value == '2') {
      this.iconFlag = 'MASTER';
      this.meansTransactionMoney = false;
      this.meansTransactionCard = true;
      this.localStorage.set('default-pay-method', '1');
      // this.selectType.key = '2';
    }
    else {
      this.iconFlag = 'CARD';
      // this.meansTransactionMoney = true;
      // this.meansTransactionCard = false;
      // this.localStorage.set('default-pay-method', '2');
      // this.selectType.key = '1';
    }
  }
}
