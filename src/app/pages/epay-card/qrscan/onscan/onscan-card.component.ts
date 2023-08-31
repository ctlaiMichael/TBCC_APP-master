/**
 * Epay 主掃
 * 1. 取得FQ000101判斷是否開通smart pay
 * 2. 開啟相機並掃描(以前的openEmbedQRCodeReader)
 * 2.1 相機權限
 * 3. 解析並依照解析結果轉換頁面
 */
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { EPayCardService } from '@pages/epay-card/shared/epay-card.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { QRTpyeCardService } from '@pages/epay-card/shared/qrocdeType-card.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormateService } from '@shared/formate/formate.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { Logger } from '@core/system/logger/logger.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { LoadingSpinnerService } from '@core/layout/loading/loading-spinner.service';
// == api 相關 == //
import { FQ000302ApiService } from '@api/fq/fq000302/fq000302-api.service';
import { FQ000420ApiService } from '@api/fq/fq000420/fq000420-api.service'; // outbound
// == epay 相關 == //
import { OnscanCardService } from '@pages/epay-card/shared/service/onscan-card.service';
import { logger } from '@shared/util/log-util';
import { FQ000116ReqBody } from '@api/fq/fq000116/fq000116-req';
import { FQ000115ApiService } from '@api/fq/fq000115/fq000115-api.service';
import { HeaderOptions } from '@core/layout/header/header-options';
import { AnalyzeTWQRP } from '@pages/epay/shared/service/qrcode/analyze-twqrp-class';
import { QrcodeFieldsOptions } from '@pages/epay/shared/service/qrcode/qrcode-fields-options';
import { FQ000115ReqBody } from '@api/fq/fq000115/fq000115-req';
import { HttpUrlEncodingCodec } from '@angular/common/http';


@Component({
  selector: 'app-onscan-card',
  templateUrl: './onscan-card.component.html',
  styleUrls: ['./onscan-card.component.css'],
  providers: [OnscanCardService]
})
export class OnscanCardComponent implements OnInit, OnDestroy, AfterViewInit {

  myAcct: any;
  defaultTrnsOutAcct: any;
  trnsLimitAmt: any;
  fq000101DataSave: any;
  resultTemp: any;
  // private readyFlag = false;
  private testFlag = false;
  private clickBlock = false;

  isFromURL = false;
  webToAppRes: FQ000116ReqBody;

  constructor(
    private _logger: Logger,
    private scan: QrcodeService,
    private epay: EPayCardService,
    private handleError: HandleErrorService,
    private auth: AuthService,
    private localStorageService: LocalStorageService,
    private alert: AlertService,
    private qrtype: QRTpyeCardService,
    private navgator: NavgatorService,
    private fq000302: FQ000302ApiService,
    private fq000420: FQ000420ApiService,
    private headerCtrl: HeaderCtrlService,
    private formateService: FormateService,
    private uiContent: UiContentService,
    private _mainService: OnscanCardService,
    private loading: LoadingSpinnerService,
    private fq000115: FQ000115ApiService,
  ) {
  }


  ngOnInit() {
    logger.error('scan');
    this.resetData();
    this.isFromURL = this.navgator.getParams() && this.navgator.getParams().from === 'Url' ? true : false;
    if (this.isFromURL) {
      const option = new HeaderOptions();
      option.title = '掃碼收付';
      this.headerCtrl.updateOption(option);
    }
    this.headerCtrl.setLeftBtnClick(() => {
      this.cancelEdit();
    });
    this._logger.step('Epay-card-card', 'onscan init');

    this._mainService.initScan().then(
      (resObj) => {
        if (resObj.haveTerm) {
          this.myAcct = resObj.myAcct;
          this.defaultTrnsOutAcct = resObj.defaultTrnsOutAcct;
          this.trnsLimitAmt = resObj.trnsLimitAmt;
          if (this.isFromURL) {
            this.startWebToApp(this.navgator.getParams()); // webToApp
          } else {
            this.open();
          }
        } else {
          this.handleError.handleError({
            type: 'dialog',
            title: 'ERROR.TITLE',
            content: 'EPAY.ERROR.SMART_PAY_ALLOW' // 請先開通SmartPay與設定帳號
          });
          this._mainService.changePage('qrcodePayTerms');
        }
      },
      (errorObj) => {
        let error_obj: any = errorObj;
        // error_obj['type'] = 'dialog';
        this.handleError.handleError(error_obj);
        this._mainService.changePage('epay-card');
      }
    );
  }

  /**
   * 修正Scan框線消失問題
   */
  ngAfterViewInit() {
    if (!this.isFromURL) {
      this.draw(); // 畫面繪製
    }
  }

  /**
   * 功能離開事件
   */
  ngOnDestroy() {
    this._logger.step('Epay-card-card', 'onscan destroy');
    this.isFromURL = false;
    this.uiContent.setSectionScroll(true);
    this._mainService.closeScan().then(
      () => {
        logger.error('close1');
        this.resetData();
      }
    );
  }


  /**
   * 取消編輯
   */
  cancelEdit() {
    // if (this.readyFlag) {
    if (!!sessionStorage.cameraReady) {
      this._mainService.changePage('epay-card');
    } else {
      if (this.isFromURL) {
        this._mainService.changePage('epay-card');
        this.isFromURL = false;
      } else {
      	this.alert.show('ERROR.WAIT_FOR_READY');
        this._mainService.changePage('epay-card');
      }
    }
  }

  /**
   * 取消掃碼
   */
  cancelScan() {
    // this.scan.closeCamera();
    
    logger.error('close2');
    this._mainService.closeScan();
  }

  async open() {
    this.scan.waitForReady().then(() => {
      if (!sessionStorage.cameraReady) {
        sessionStorage.cameraReady = true;
      }
    }).catch((errorObj) => {
      sessionStorage.cameraReady = true;
    }).then(async () => {
      try {
        let Qrcode_res = await this._mainService.openScan();
        if (this.isTaipower(Qrcode_res)) { // 判斷是否為台電繳費QRCode
          this.goTaipower(Qrcode_res);
          return;
        }
        this._logger.step('Epay-card-card', 'qrcodeCheck:', Qrcode_res);
        this.loading.show('Epay_analyze'); // 開啟解析中畫面
        let resultObj = await this._mainService.analyzeCode(Qrcode_res);
        this._logger.step('Epay-card-card', 'qrcodeAnalyze', resultObj);
        this.sameProcess(resultObj);
      } catch (errorObj) {
        // this._logger.log('Epay', 'openCamera Error', errorObj);
        this.loading.hide('Epay_analyze'); // 關閉解析中畫面
        this._mainService.checkError(errorObj);
      }
    });
  }

  /**
   * 圖片讀取
   */
  async scanFromLib(decQRCode?: string) {
    this._logger.step('Epay-card-card', 'scanFromLib init');
    this.loading.show('Epay_analyze'); // 開啟解析中畫面
    try {
      let Qrcode_res = '';
      if (!decQRCode) {
        Qrcode_res = await this._mainService.imageScan();
      }
      try {
        if (!decQRCode) {
          this.cancelScan(); // 先關閉相機才能解析
        } else {
          Qrcode_res = decQRCode;
        }
        if (this.isTaipower(Qrcode_res)) { // 判斷是否為台電繳費QRCode
          this.goTaipower(Qrcode_res);
          this.loading.hide('Epay_analyze'); // 關閉解析中畫面
          return;
        }
        let resultObj = await this._mainService.analyzeCode(Qrcode_res);
        this._logger.step('Epay-card-card', 'qrcodeAnalyze[img]', resultObj);
        this.sameProcess(resultObj);
      } catch (errorObj) {
        this._logger.step('Epay-card-card', 'scanFromLib Analyze', errorObj);
        // this.open(); // 失敗必須重開相機
        this.loading.hide('Epay_analyze'); // 關閉解析中畫面
        this._mainService.checkError(errorObj);
      }
    } catch (imgError) {
      this._logger.step('Epay-card-card', 'scanFromLib Error', imgError);
      this.loading.hide('Epay_analyze'); // 關閉解析中畫面
      this.handleError.handleError(imgError);
      // this._mainService.checkError(imgError);
    }
  }

  /**
   * 判斷掃描的QRCode是否為繳台電費
   * @param Qrcode_res 
   */
  isTaipower(Qrcode_res): boolean {
    return (typeof Qrcode_res == 'string') && Qrcode_res.indexOf('http://www.taipower.com.tw/tc/page.aspx?') >= 0;
  }
  /**
   * 進入繳台電費
   * @param Qrcode_res 
   */
  goTaipower(Qrcode_res) {
    Qrcode_res = Qrcode_res.substring(Qrcode_res.indexOf('http://www.taipower.com.tw/tc/page.aspx?'));
    Qrcode_res = Qrcode_res.substring(99); // 只取最後面
    this.goto('taipowerOverview', [Qrcode_res, this.defaultTrnsOutAcct]);
    return;
  }

  goto(url, data?) {
    this.cancelScan();
    this.navgator.push(url, data);
  }

  fq000101DataSaveGet() {
    let copyTemp = this._mainService.getFq000101Data();
    return copyTemp;
  }


  // 出示付款碼
  gotoBeScan() {
    if (this.clickBlock) {
      logger.error('menu is block', this.clickBlock);
      return false;
    }
    const res = this.auth.getUserInfo();
    const tempCustid = res.custId;
    // 安控
    let securityTypesInside = [];
    let securityList = this.qrtype.getSecurityData({ reget: true });
    securityTypesInside = securityList.securityTypes;
    // let allowSecurity = this.auth.getAllowSecurity();
    // if (securityTypesInside.length < 0 && localStorage.getItem('defaultType') == null) {
    //   this.alert.show('EPAY.ERROR.NO_SECURITY').then(() => {
    //     if (allowSecurity.authType.indexOf('3') > -1) {
    //       this.auth.checkSecurityOtp();
    //     }
    //   });
    // }
    let defaultSecurityTypeInside: any;
    if (localStorage.getItem('defaultType') !== null && localStorage.getItem('defaultType') !== '') {
      defaultSecurityTypeInside = JSON.parse(localStorage.getItem('defaultType'));
    } else {
      defaultSecurityTypeInside = securityTypesInside[0];
    }

    let resfq000101 = this.fq000101DataSaveGet();
    if (typeof resfq000101.defaultTrnsOutAcct == 'undefined' || resfq000101.defaultTrnsOutAcct == '') {
      this.alert.show('取得預設轉出帳號失敗');
      this.clickBlock = false;
    } else {

      let form302: any = {
        custId: '',
        trnsToken: '',
        trnsfrOutAcct: ''
      };
      form302.custId = tempCustid;
      form302.trnsfrOutAcct = resfq000101.defaultTrnsOutAcct;
      form302.trnsToken = '';
      const CA_Object = {
        securityType: '',
        serviceId: 'FQ000302',
        signText: form302,
      };
      this.qrtype.getSecurityInfo(CA_Object, defaultSecurityTypeInside).then(
        resSecurityInfo => {
          let reqHeader = {
            header: resSecurityInfo.headerObj
          };
          this._logger.error('resSecurityInfo', resSecurityInfo);
          this.fq000302.send(resSecurityInfo.responseObj.signText, reqHeader).then(
            (resfq000302) => {
              this.clickBlock = false;
              if (!this.qrtype.isCheckResponse(resfq000302)) {
                this.handleError.handleError({
                  type: 'dialog',
                  title: 'ERROR.TITLE',
                  content: '(' + resfq000302.body.hostCode + ')' + resfq000302.body.hostCodeMsg
                });
                this.cancelScan();
                return;
              }
              let params = {
                result: resfq000302.body
              };
              //被掃路徑：cardlogin-qrcodeShowPay（信用卡登入專用） qrcodeShowPay（網銀會員專用）
              this._mainService.changePage('cardlogin-qrcodeShowPay', params);
            })
            .catch(
              error => {
                this.clickBlock = false;
                this.handleError.handleError(error);
              });
        },
        errorSecurityInfo => {
          this.clickBlock = false;
          this._logger.debug('errorSecurityInfo');
        },
      );
    }
  }

  /**
   * 出示收款碼
   */
  gotoReceipt() {
    this._mainService.changePage('qrcodeShowReceipt');
  }

  getFQ000420() {
    // this._logger.error("into getFQ000420()");
    let form: any = {};
    let custId = this.auth.getUserInfo().custId;
    form.custId = custId;
    form.account = '';
    this.fq000420.send(form).then(
      resObj => {
        let res = resObj.data;
        if (res.cixp3Cid != 'Y' || res.cixP33Flg != 'Y') {
          // this._logger.error("into res.cixp3Cid != 'Y' || res.cixP33Flg != 'Y'");
          let params = {
            result: res
          };
          this.navgator.push('cardlogin-outboundAgree', params);
        } else {
          // this._logger.error("into res.cixp3Cid == 'Y' || res.cixP33Flg == 'Y'");
          this.navgator.push('cardlogin-qrCodePayForm2', {
            trnsfrOutAcct: this.defaultTrnsOutAcct,
            trnsLimitAmt: this.trnsLimitAmt,
            qrcode: this.resultTemp['response']
          });
        }
      },
      error => {
        this.handleError.handleError(error);
      }
    );
  }

  /** ======================== 2. 從相簿選取掃描 ======================== */


  sameProcess(resultObj) {
    this.loading.hide('Epay_analyze'); // 關閉解析中畫面
    this.resultTemp = resultObj;
    let res = this.auth.getUserInfo();

    let securityList = this.qrtype.getSecurityData({ reget: true });
    let securityTypes = securityList.securityTypes;


   

    if (securityTypes.length <= 0) {
      this.alert.show('倘未完成合庫E Pay/快速登入、交易設定內台灣Pay交易，請立即完成設定!').then(
        res_error => {
          let allowSecurity = this.auth.getAllowSecurity();
          logger.error('allowSecurity.authType',allowSecurity.authType);
          this.cancelEdit();
        }
      );
    } else {
      logger.error('resultObj.data',resultObj['data']);
      if (resultObj['data'].payCategory === '15001') {
        this.cancelScan();
        this.navgator.push('cardlogin-qrCodePayFormTax4', {
          trnsfrOutAcct: this.defaultTrnsOutAcct,
          trnsLimitAmt: this.trnsLimitAmt,
          qrcode: resultObj['data'],
          webToAppRes: this.webToAppRes ? this.webToAppRes : ''
        });
      } else if (resultObj['data'].PayType === '2') {
        this.cancelScan();
        this.navgator.push('cardlogin-qrCodePayFormTax2', {
          trnsfrOutAcct: this.defaultTrnsOutAcct,
          trnsLimitAmt: this.trnsLimitAmt,
          qrcode: resultObj['data'],
          webToAppRes: this.webToAppRes ? this.webToAppRes : ''
        });
      } else if (resultObj['data'].trnsType === '03') {
        this._logger.step('Epay-card', 'is pay-card');
        // 繳費網頁-繳卡費
        this.cancelScan();
        // this.showNoSupport();
        this.navgator.push('cardlogin-qrCodePayFormCard', {
          trnsfrOutAcct: this.defaultTrnsOutAcct,
          trnsLimitAmt: this.trnsLimitAmt,
          qrcode: resultObj['response'],
          webToAppRes: this.webToAppRes ? this.webToAppRes : ''
        });
      } else if (resultObj['data'].trnsType === '02') {
        this._logger.step('Epay-card', 'is p2p (trnsType=02');
        // P2P轉帳
        this.cancelScan();
        this.showNoSupport();
        // this.navgator.push('cardlogin-qrCodeGetForm', {
        //   trnsfrOutAcct: this.defaultTrnsOutAcct,
        //   trnsLimitAmt: this.trnsLimitAmt,
        //   qrcode: resultObj['response'],
        //   webToAppRes: this.webToAppRes ? this.webToAppRes : ''
        // });
      } else if (resultObj['data'].trnsType === '01' && resultObj['response'].acqInfo.substring(0, 3) === '51,') {
        logger.error('resultObj.data 01 51');
        this.cancelScan();
        this.showNoSupport();
        // 轉帳購物(01購物交易,收單行資訊acqinfo為51)
        // this._logger.step('Epay-card-card', 'is 轉帳購物 (trnsType=01, acqInfo ==51,)');
        // this.cancelScan();
        // this.navgator.push('cardlogin-qrCodeBuyForm', {
        //   trnsfrOutAcct: this.defaultTrnsOutAcct,
        //   trnsLimitAmt: this.trnsLimitAmt,
        //   qrcode: resultObj['response'],
        //   webToAppRes: this.webToAppRes ? this.webToAppRes : ''
        // });
      } else if (resultObj['response'].acqInfo.substring(0, 3) == '11,') {
        logger.error('resultObj.data 11');
        this.cancelScan();//outbound  qrCodePayForm2
          // this.getFQ000420();
        this.showNoSupport();
      } else {
        logger.error('resultObj.data else is qrCodePayForm');
        // done
        this.cancelScan();
        this.navgator.push('cardlogin-qrCodePayForm', {
          trnsfrOutAcct: this.defaultTrnsOutAcct,
          trnsLimitAmt: this.trnsLimitAmt,
          qrcode: resultObj['response'],
          webToAppRes: this.webToAppRes ? this.webToAppRes : ''
        });
      }
    }
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
  // --------------------------------------------------------------------------------------------

  private resetData() {
    logger.error('clo reset');
    // this.readyFlag = false;
    if (!!sessionStorage.cameraReady) {
      delete sessionStorage.cameraReady;
    }
  }

  private draw() {
    const c: any = document.getElementById('scanArea');
    const outerBox: any = document.getElementById('scanBox');

    let canvasW = outerBox.clientWidth;
    let canvasH = outerBox.clientHeight;
    c.width = canvasW;
    c.height = canvasH;
    let shrinkTimes = 0.7;
    let sideLength = Math.round(canvasW * shrinkTimes);
    if (sideLength > canvasH) {
      sideLength = canvasH;
    }

    let startPostionX = Math.round((canvasW - sideLength) / 2);
    let border = 8;


    let ctx = c.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, 0, startPostionX, c.height);
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(sideLength + startPostionX, 0, c.width + startPostionX, c.height);
    ctx.strokeStyle = '#97f5d0';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(startPostionX, sideLength - ctx.lineWidth, sideLength, c.height);
    ctx.strokeStyle = '#97f5d0';
    ctx.lineWidth = 6;
    ctx.globalAlpha = 1;
    ctx.rect(startPostionX, ctx.lineWidth / 2, sideLength, sideLength - ctx.lineWidth);
    ctx.stroke();

  }

  private async startWebToApp(data: { urlParams: string, from: string }) {
    try {
      this.loading.show('Epay_analyze'); // 開啟解析中畫面
      const analyzeTWQRP = new AnalyzeTWQRP();
      const qrObj = {
        acqBank: '',
        encQRCode: '',
        encRetURL: '',
        merchantId: '',
        orderNumber: '',
        terminalId: '',
        verifyCode: '',
      };
      const analyzeParams: QrcodeFieldsOptions = analyzeTWQRP.analyzeWebToApp(data.urlParams, qrObj);
      const req = new FQ000115ReqBody();
      req.custId = '';
      const enCoding = new HttpUrlEncodingCodec();
      const QrCodeDeCode = enCoding.decodeValue(analyzeParams.data.encQRCode);
      req.encQRCode = JSON.stringify({ EQR: QrCodeDeCode });
      req.encRetURL = analyzeParams.data.encRetURL;
      req.acqBank = analyzeParams.data.acqBank;
      req.merchantId = analyzeParams.data.merchantId;
      req.orderNumber = analyzeParams.data.orderNumber;
      req.terminalId = analyzeParams.data.terminalId;
      req.verifyCode = analyzeParams.data.verifyCode;
      this.fq000115.send(req)
        .then((res) => {
          const deQrCodeObj: {
            EQR: string
          } = JSON.parse(res.body.decQRCode);
          this.webToAppRes = new FQ000116ReqBody();
          this.webToAppRes.custId = '';
          this.webToAppRes.cardPlan = 'F';
          this.webToAppRes.encRetURL = analyzeParams.data.encRetURL;
          this.webToAppRes.merchantId = analyzeParams.data.merchantId;
          this.webToAppRes.orderNumber = analyzeParams.data.orderNumber;
          this.webToAppRes.responseCode = '0000';
          this.webToAppRes.terminalId = analyzeParams.data.terminalId;
          this.webToAppRes.acqBank = analyzeParams.data.acqBank;
          this.scanFromLib(deQrCodeObj.EQR);
        })
        .catch((error) => {
          this.loading.hide('Epay_analyze'); // 關閉解析中畫面
          this._mainService.checkError(error);
        });
    } catch (errorObj) {
      // this._logger.log('Epay', 'openCamera Error', errorObj);
      this.loading.hide('Epay_analyze'); // 關閉解析中畫面
      this._mainService.checkError(errorObj);
    }
  }

  /**
   * show card no support
   * TODO:
   */
  showNoSupport() {
    this.alert.show('不支援此QRCode');
  }


}
