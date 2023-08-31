import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { SUB_MENU } from '@conf/menu/sub-menu';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AuthService } from '@core/auth/auth.service';
import { QRTpyeService } from '../shared/qrocdeType.service';
import { FQ000302ApiService } from '@api/fq/fq000302/fq000302-api.service';
import { EPayService } from '../shared/epay.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FQ000302ReqBody } from '@api/fq/fq000302/fq000302-req';
import { logger } from '@shared/util/log-util';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, RoutesRecognized } from '@angular/router';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { timingSafeEqual } from 'crypto';
@Component({
  selector: 'app-epay-menu',
  templateUrl: './epay-menu.component.html',
  styleUrls: ['./epay-menu.component.css']
})
export class EpayMenuComponent implements OnInit, AfterViewInit {

  mainMenuKey = 'epay';
  menuData = [];
  showData: boolean;
  showType = '1';
  securityTypes = [];
  defaultSecurityType: any;
  // == 首頁物件 == //
  headerObj = {
    style: 'normal',
    showMainInfo: false,
    leftBtnIcon: 'menu',
    title: 'epay',
    backPath: ''
  };
  private clickBlock = false;
  btn_flag=true;

  constructor(
    private navgator: NavgatorService,
    private errorHandler: HandleErrorService,
    private _formateService: FormateService,
    private alert: AlertService,
    private localStorageService: LocalStorageService,
    private auth: AuthService,
    private navCtrl: NavgatorService,
    private qrcodeService: QRTpyeService,
    private epay: EPayService,
    private fq000302: FQ000302ApiService,
    private headerCtrl: HeaderCtrlService,
    private router: Router,
    private scan: QrcodeService,
  ) {
    this.cancelScan();
    this.headerCtrl.setOption(this.headerObj);
    this.headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('user-home');
    });
  }

  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    // this.headerCtrl.setLeftBtnClick(() => {
    //   this.navgator.push('user-home');
    // });
    logger.error('epaymenu');
    let login_method=sessionStorage.getItem("login_method");
    if(login_method&&login_method=='2'){
      this.mainMenuKey='cardLogin_epay';
      this.headerCtrl.updateOption({
        'leftBtnIcon': 'back',
      });
      this.headerCtrl.setLeftBtnClick(() => {
        this.navgator.push('web:card');
      });
      this.btn_flag=false;
    }else{
      this.btn_flag=true;
    }
    this.menuData = this.getMenu();
  }

  ngAfterViewInit() {
    let setParams: any;
    this.navCtrl.getQueryParams().subscribe((params) => {
      setParams = params;
      // 動作請不要寫裡面，會不斷重做(壘加)
    });
    if (typeof setParams == 'object' && !!setParams) {
      let go_path = this._formateService.checkField(setParams, 'redirect');
      if (go_path == 'scan') {
        const showPay = { name: 'FUNC_SUB.EPAY.ONSCAN', url: 'epayscan' };
        this.onGoEvent(showPay);
      } else if (go_path === 'qrcodeShowPay') {
        const showPay = { name: 'FUNC_SUB.EPAY.SHOWPAY', url: 'qrcodeShowPay' };
        this.onGoEvent(showPay);
      }
    }


    this.router.events
      .subscribe((event: any) => {
        if (event.url == '/epay/menu?redirect=scan' && event.urlAfterRedirects == '/epay/menu?redirect=scan') {
          this.headerCtrl.setOption(this.headerObj);
        }
      });

    this.goToShowpay();
  }

  goToShowpay() {
    let getParams = this.navCtrl.getParams();
    if (typeof getParams === 'object' && !!getParams.nextUrl &&
      (getParams.nextUrl === 'qrcodeShowPay' ||
        getParams.nextUrl === 'qrcodeShowReceipt' ||
        getParams.nextUrl === 'epayscan')) {

      let tmpName = '';
      switch (getParams.nextUrl) {
        case 'qrcodeShowPay':
          tmpName = 'FUNC_SUB.EPAY.SHOWPAY';
          break;
        case 'qrcodeShowReceipt':
          tmpName = 'FUNC_SUB.EPAY.SHOWRECEIPT';
          break;
        case 'epayscan':
          tmpName = 'FUNC_SUB.EPAY.ONSCAN';
          break;
      }
      const showPay = { name: tmpName, url: getParams.nextUrl };
      this.navCtrl.deleteParams();
      this.onGoEvent(showPay);
    }
  }

  private getMenu() {
    let output: Array<any> = [];
    if (SUB_MENU.hasOwnProperty(this.mainMenuKey)) {
      const menuSet = this._formateService.transClone(SUB_MENU[this.mainMenuKey]);
      output = menuSet.data;
      this.showData = true;

      this.showType = (menuSet.hasOwnProperty('menuType')) ? menuSet['menuType'] : '1';
    } else {
      this.showData = false;
      this.errorHandler.handleError({
        type: 'message',
        title: 'ERROR.TITLE',
        content: 'ERROR.DEFAULT'
      });
    }
    return output;
  }

  /**
   * 選單事件
   * @param menu 選單
   * [TODO:] 建議修正此流程
   */
  onGoEvent(menu) {
    if (this.clickBlock) {
      logger.error('menu is block', this.clickBlock);
      return false;
    }
    // logger.error('menu', menu);
    let url = menu.url;
    // if (typeof menu !=== 'object' || !menu.hasOwnProperty('url')) {
    //   this.errorHandler.handleError({
    //     title: 'ERROR.TITLE',
    //     content: 'ERROR.DEFAULT'
    //   });
    //   return false;
    // }
    // this.navgator.push(menu.url);

    // if (url === 'home') {
    //   this.auth.logout();
    //   return;
    // }

    // 檢查securityTypes
    let res: any = this.auth.getUserInfo();
    let custId = this.auth.getCustId();

    let securityList = this.qrcodeService.getSecurityData({ reget: true });
    this.securityTypes = securityList.securityTypes;

    logger.error('securityList',securityList);
    logger.error('securityTypes',this.securityTypes);
    

    // logger.log('securityList', securityList, this.securityTypes);
    // const checkIsBio = this.qrcodeService.checkBiometric();
    // if (checkIsBio) {
    //   this.securityTypes.push({ name: '快速交易', key: 'Biometric' });
    // }

    // if (res.AuthType.indexOf('2') > -1) {
    //   let cnEndDate: any;
    //   if (res.cnEndDate === null) {
    //     cnEndDate = DateUtil.transDate(new Date());
    //   } else {
    //     cnEndDate = DateUtil.transDate(res.cnEndDate, 'date');
    //   }

    //   let todayDate = DateUtil.transDate(new Date());
    //   if (res.cn == null || res.cn == '' || DateUtil.compareDate(todayDate, cnEndDate) == -1) {
    //   } else {
    //     this.securityTypes.push({ name: '憑證', key: 'NONSET' });
    //   }
    // }
    // if (res.AuthType.indexOf('3') > -1) {
    //   if (res.BoundID == '4' && res.OTPID == '2') {
    //     this.securityTypes.push({ name: 'OTP', key: 'OTP' });
    //   }
    // }

    // QR Code 小額支付免輸密碼設定-使用條款
    if (url == 'microPaymentTerms' && res.BoundID !== 4) {
      this.alert.show('您的裝置尚未綁定，請至行動網銀進行裝置綁定服務。');
      return;
    }
    // 信用卡新增/變更預設
    if (url == 'qrcodePayCardTerms') {
      if (this.hasSecurityType()) {
        // url = 'qrcodePayCardTerms';
        this.navgator.push(url);
      } else {
        this.checkNoSecurity();
      }
      return;
    }
    // 確認securityTypes是否有轉帳機制可以用
    if (!this.hasSecurityType() && (url == 'epayscan')) {
      this.checkNoSecurity();
      return;
    }
    // 推薦人設定
    if (this.hasSecurityType() && url == 'referenceEdit') {
      this.navgator.push(url);
      return;
    } else if (this.hasSecurityType() && url == 'qrcodeShowPay') {
      this.clickBlock = true;
      // 出示付款碼
      // 安控資料取得
      let security_data = this.qrcodeService.getSecurityData();
      this.securityTypes = security_data.securityTypes;
      if (!!security_data.selectSecurityType) {
        this.defaultSecurityType = security_data.selectSecurityType;
      }

      this.epay.sendFQ000101('T').then(
        resfq000101 => {
          let resultFQ000101: any = resfq000101;
          if (typeof resultFQ000101.defaultTrnsOutAcct == 'undefined' || resultFQ000101.defaultTrnsOutAcct == '') {
            this.alert.show('取得預設轉出帳號失敗');
            this.clickBlock = false;
          } else {
            let form302: any = {
              custId: '',
              trnsToken: '',
              trnsfrOutAcct: '',
              mobileBarcode: ''
            };
            form302.custId = res.custId;
            form302.trnsfrOutAcct = resultFQ000101.defaultTrnsOutAcct;
            form302.mobileBarcode = resultFQ000101.mobileBarcode;
            form302.trnsToken = '';

            const CA_Object = {
              securityType: '',
              serviceId: 'FQ000302',
              signText: form302,
              otpObj: {
                custId: '',
                fnctId: '',
                depositNumber: '',
                depositMoney: '',
                OutCurr: '',
                transTypeDesc: ''
              }
            };
            this.qrcodeService.getSecurityInfo(CA_Object, this.defaultSecurityType).then(
              resSecurityInfo => {

                let reqHeader = {
                  header: resSecurityInfo.headerObj
                };
                let reqbody = new FQ000302ReqBody();
                reqbody.custId = this.auth.getCustId();
                reqbody.trnsfrOutAcct = resultFQ000101.defaultTrnsOutAcct;
                reqbody.mobileBarcode = resultFQ000101.mobileBarcode;
                reqbody.trnsToken = resSecurityInfo['responseObj'].signText.trnsToken;

                this.fq000302.send(reqbody, reqHeader).then(
                  (resfq000302) => {
                    this.clickBlock = false;
                    if (!this.qrcodeService.isCheckResponse(resfq000302)) {
                      this.errorHandler.handleError({
                        type: 'dialog',
                        title: 'ERROR.TITLE',
                        content: '(' + res.body.hostCode + ')' + res.body.hostCodeMsg
                      });
                      this.navgator.push('epay');
                      return;
                    }
                    let params = {
                      result: resfq000302.body
                    };
                    this.navgator.push(url, params);
                  })
                  .catch(
                    error => {
                      this.clickBlock = false;
                      this.errorHandler.handleError(error);
                    });
              },
              errorSecurityInfo => {
                this.clickBlock = false;
                logger.debug('errorSecurityInfo');
              },
            );
          }
        },
        error => {
          this.clickBlock = false;
        }
      ).catch(
        error => {
          this.clickBlock = false;
          this.errorHandler.handleError(error);
        }
      );
    } else if (this.hasSecurityType() || (url !== 'epayscan' && url !== 'qrcodeShowPay')) {
      if (url !== 'qrcodeShowPay') {
        // 除了出示付款碼都轉址
        this.navgator.push(url);
      }
    } else {
      this.checkNoSecurity();
    }
  }

  hasSecurityType() {
    
    let securityList = this.qrcodeService.getSecurityData({ reget: true });
    let flag = false;
    securityList.securityTypes.forEach(element => {
      if (element.securityType == '2' || element.securityType == '3') {
        flag = true;
      }
    });
    if (!flag) {
        logger.error('errrrorrrrr hasSecurityType');
        return false;
    }
    if (!!this.securityTypes && this.securityTypes.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  logout() {
    this.auth.logout();
  }
  cancelScan() {//關閉相機
    this.scan.closeCamera();
  }

  /**
   * 安控檢核
   */
  private checkNoSecurity() {
    this.alert.show('EPAY.ERROR.NO_SECURITY').then(() => {
      let allowSecurity = this.auth.getAllowSecurity();
      if (allowSecurity.authType.indexOf('3') > -1) {
        this.auth.checkSecurityOtp();
      }
    });

  }


}
