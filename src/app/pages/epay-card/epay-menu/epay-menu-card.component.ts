import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { SUB_MENU } from '@conf/menu/sub-menu';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AuthService } from '@core/auth/auth.service';
import { QRTpyeCardService } from '../shared/qrocdeType-card.service';
import { FQ000302ApiService } from '@api/fq/fq000302/fq000302-api.service';
import { EPayCardService } from '../shared/epay-card.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FQ000302ReqBody } from '@api/fq/fq000302/fq000302-req';
import { logger } from '@shared/util/log-util';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, RoutesRecognized } from '@angular/router';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { timingSafeEqual } from 'crypto';
import { environment } from '@environments/environment.ts';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
@Component({
  selector: 'app-epay-menu',
  templateUrl: './epay-menu-card.component.html',
  styleUrls: ['./epay-menu-card.component.css']
})
export class EpayMenuCardComponent implements OnInit, AfterViewInit {

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
    private qrcodeService: QRTpyeCardService,
    private epay: EPayCardService,
    private fq000302: FQ000302ApiService,
    private headerCtrl: HeaderCtrlService,
    private router: Router,
    private scan: QrcodeService,
    private microInteraction: MicroInteractionService
  ) {
    this.cancelScan();
    this.headerCtrl.setOption(this.headerObj);
    this.headerCtrl.setLeftBtnClick(() => {
      this.navgator.pop();
    });
  }

  ngOnInit() {
    this.microInteraction.hideMicroBox(true); // 微交互隱藏
    this.headerCtrl.setOption(this.headerObj);

    logger.error('epaymenuCARD');
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
    let redirectUrl=this.localStorageService.get('redirectUrl');
    if(redirectUrl && redirectUrl=='/epay/menu?redirect=scan'){
      this.onGoEvent({name:'FUNC_SUB.EPAY.ONSCAN',url:'cardlogin-epayscan'});
    }
    this.localStorageService.set('redirectUrl','');
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
    this.localStorageService.set('redirectUrl','');
    logger.error('menu', menu);
    let url = menu.url;
    let securityList = this.qrcodeService.getSecurityData({ reget: true });
    let securityTypes = securityList.securityTypes;
    logger.info('menu securityTypes',securityTypes);

   

    if(url == 'cardlogin-qrcodeShowPay'){ //被掃
      this.clickBlock = true;
      if (securityTypes.length <= 0) {
        this.alert.show('倘未完成合庫E Pay/快速登入、交易設定內台灣Pay交易，請立即完成設定!').then(
          ()=>{
            return false;
          }
        );
      } 
      this.epay.sendFQ000101('T').then(
        resfq000101 => {
          let resultFQ000101: any = resfq000101;
            let form302: any = {
              custId: '',
              trnsToken: '',
              trnsfrOutAcct: '',
              mobileBarcode: '',
              loginType:'1'
            };
            form302.custId = this.auth.getCustId();
            // form302.trnsfrOutAcct = resultFQ000101.defaultTrnsOutAcct;
            form302.trnsfrOutAcct = '';
            form302.mobileBarcode = '';
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
            logger.error('302CA',CA_Object);
            let security_data = this.qrcodeService.getSecurityData();
            this.securityTypes = security_data.securityTypes;
            if (!!security_data.selectSecurityType) {
              this.defaultSecurityType = security_data.selectSecurityType;
            }
            logger.error('getSecurityInfo',CA_Object, this.defaultSecurityType);
            this.qrcodeService.getSecurityInfo(CA_Object, this.defaultSecurityType).then(
              resSecurityInfo => {

                let reqHeader = {
                  header: resSecurityInfo.headerObj
                };
                let reqbody = new FQ000302ReqBody();
                reqbody.custId = this.auth.getCustId();
                // reqbody.trnsfrOutAcct = resultFQ000101.defaultTrnsOutAcct;
                reqbody.trnsfrOutAcct = '';
                reqbody.mobileBarcode = '';
                reqbody.trnsToken = resSecurityInfo['responseObj'].signText.trnsToken;
                reqbody['loginType']='1';
                this.fq000302.send(reqbody, reqHeader).then(
                  (resfq000302) => {
                    this.clickBlock = false;
                    if (!this.qrcodeService.isCheckResponse(resfq000302)) {
                      this.errorHandler.handleError({
                        type: 'dialog',
                        title: 'ERROR.TITLE',
                        content: '(' + resfq000302.body.hostCode + ')' + resfq000302.body.hostCodeMsg
                      });
                      this.navgator.push('epay-card');
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
    }else if(url=='cardlogin-qrcodePayCardTerms' || url =='cardlogin-epayscan'){ //信用卡新增綁定/主掃
      if (securityTypes.length <= 0) {
        this.alert.show('倘未完成合庫E Pay/快速登入、交易設定內台灣Pay交易，請立即完成設定!').then(
          ()=>{
            return false;
          }
        );
      } else{
        this.navgator.push(url)
      }
    }else{  //其餘不須檢和安控
      this.navgator.push(url);
      return false;
    }

  }
  logout() {
    this.auth.logout();
  }
  cancelScan() {//關閉相機
    this.scan.closeCamera();
  }



}
