import { SessionStorageService } from '@lib/storage/session-storage.service';
import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../shared/login.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FtLoginService } from '../shared/ftlogin.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { CustomValidators } from 'ng2-validation';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ValidatorcustId, ValidatoruserId, Validatorpwd } from '@shared/validator/validator';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { logger } from '@shared/util/log-util';
import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { UserSetResultRoutingModule } from '@pages/user-set/shared/component/result/result.routing.module';
import { environment } from '@environments/environment';
import { CacheService } from '@core/system/cache/cache.service';
import { FormateService } from '@shared/formate/formate.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  @ViewChild('userId', { read: ElementRef }) userIdInput: ElementRef; // body區塊
  @ViewChild('pwd', { read: ElementRef }) pwdInput: ElementRef; // body區塊
  loginForm: FormGroup;
  // 登入資訊
  loginRemember = {
    userData: {
      custId: '',
      userId: ''
    },
    rememberMe: { // 記住我 0 關閉 1 啟用
      remcust: '0',
      remuser: '0',
    },
    ftlogin: {
      type: '', // 預設登入方式：圖形鎖(pattern) or 生物辨識(biometric) or 一般登入(pwdlogin)
      fastlogin: '0', // 是否快速登入 0 關閉 1 啟用
      pay_setting: '0', // 生物辨識付款
      hasPatternLock: '0', // 是否有圖形鎖綁定
      patterLoginErrorCount: '', // 圖形鎖登入錯誤次數
      payPattern: '0', // 圖形密碼台灣Pay交易
      patternDeviceId: '' // 圖形密碼啟用時的裝置id
    }
  };
  // 登入資訊(信用卡登入專用)
  card_loginRemember = {
    userData: {
      custId: '',
      userId: ''
    },
    rememberMe: { // 記住我 0 關閉 1 啟用
      remcust: '0',
      remuser: '0',
    },
    ftlogin: {
      type: '', // 預設登入方式：圖形鎖(pattern) or 生物辨識(biometric) or 一般登入(pwdlogin)
      fastlogin: '0', // 是否快速登入 0 關閉 1 啟用
      pay_setting: '0', // 生物辨識付款
      hasPatternLock: '0', // 是否有圖形鎖綁定
      patterLoginErrorCount: '', // 圖形鎖登入錯誤次數
      payPattern: '0', // 圖形密碼台灣Pay交易
      patternDeviceId: '' // 圖形密碼啟用時的裝置id
    }
  };
  remrmber_login:any={
    remcust: '0',
    remuser: '0',
  }
  // 快速登入資訊
  ftloginRemember = {
    comparecustId: '',
    compareuserId: '',
  };
 // 快速登入資訊(信用卡登入專用)
 card_ftloginRemember = {
    comparecustId: '',
    compareuserId: '',
  };
  // 看見我資訊
  seeObj = {
    seecust: true,
    seeuser: true,
    seepwd: true,
  };

  // 錯誤Obj
  errorObj = {
    type: '',
    content: ''
  };


  // 快速登入隱藏
  showFt = true;
  // 提示註冊快速登入
  showAgree = true;
  showPatternLock = false; // 顯示圖形鎖
  showPatternLockAgree = false; // 顯示圖形鎖快速登入文宣
  showDoc = false;
  goPatternLock = false; // 登入後轉導至圖形鎖設定
  leftBtn: string; // 圖形鎖的左方按鈕
  subscriptionOnDraw: any; // 訂閱圖形鎖的onDraw
  maxPatterLockError: number = 5; // 圖形鎖最多錯誤次數
  maskCust = ''; // 快速登入/圖形密碼 custId mask
  maskCust_card='';
  bioReqWord = ''; // bio Wording
  card_bioReqWord ='';
  loginType='1'; //登入種類
  prevlogin='';//上次登入種類
  constructor(
    private loginService: LoginService,
    private ftloginService: FtLoginService,
    private localStorageService: LocalStorageService,
    private navgator: NavgatorService,
    private tcbb: TcbbService,
    private headerCtrl: HeaderCtrlService,
    private errorHandler: HandleErrorService,
    private microInteraction: MicroInteractionService,
    private alert: AlertService,
    private patternLockService: PatternLockService,
    private securityService: SecurityService,
    private zone: NgZone,
    private cacheService: CacheService,
    private _formateService: FormateService,
    private SessionStorage:SessionStorageService
  ) {
    let prev=this.localStorageService.getObj("prevlogin");
    this.loginType=(prev=='card'?'2':'1');
    this.ftloginService.getMaskedCustid(0, 5).then((res) => {
      this.maskCust = res;
      this.bioReqWord = (this.maskCust === '') ? '' : '\n身分證字號' + this.maskCust;
    });
    this.ftloginService.getMaskedCustid_card(0, 5).then((res) => {
      this.maskCust_card=res;
      this.card_bioReqWord = (res === '') ? '' : '\n身分證字號' + res;
    });
    // this.navgator.displaymicroBoxSubject.next(false);
    this.microInteraction.displayMicroBox(false);
    this.loginForm = new FormGroup(
      {
        custId: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 12]), ValidatorcustId]),
        userId: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 16]), ValidatoruserId]),
        pwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 12]), Validatorpwd])
      }
    );
    this.headerCtrl.setOption({
      'style': 'login',
      'leftBtnIcon': '',
      'rightBtnIcon': 'btn_info',
      'rightSecBtn': 'noshow'
    });
    // 新增信用卡取用 登入資訊Storage
    const tempCardRem = this.localStorageService.getObj('Remember_card');
    if (tempCardRem !== null && tempCardRem.hasOwnProperty('userData') && tempCardRem.hasOwnProperty('rememberMe') && tempCardRem.hasOwnProperty('ftlogin')) {
      this.tcbb.fastAESDecode([tempCardRem.userData.custId, tempCardRem.userData.userId])
        .then((res_Dncode) => {
          tempCardRem.userData = res_Dncode;
          this.card_loginRemember = tempCardRem;
          logger.error('信卡登入Remember_card', this.card_loginRemember);
          return Promise.resolve();
        }, (error_Dncode) => {
          logger.debug('error_Dncode', error_Dncode);
          return Promise.resolve();
        }
        ).then((res_compare) => {
          // 取用 快入登入資訊Storage
          const tempFtData = this.localStorageService.getObj('Compare_card');
          if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
            this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
              (res_Dncode) => {
                tempFtData.comparecustId = res_Dncode.custId;
                tempFtData.compareuserId = res_Dncode.userId;
                logger.error('信卡登入Compare_card',this.card_ftloginRemember);
                this.card_ftloginRemember = tempFtData;
              },
              (error_Dncode) => {
                logger.debug('error_Dncode', error_Dncode);
              }
            );
          } 
        }, (error_compare) => {
          logger.debug('error_compare', error_compare);
        });
    } 
    // 取用 登入資訊Storage
    const tempRem = this.localStorageService.getObj('Remember');
    // tslint:disable-next-line: max-line-length
    if (tempRem !== null && tempRem.hasOwnProperty('userData') && tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
      this.tcbb.fastAESDecode([tempRem.userData.custId, tempRem.userData.userId])
        .then((res_Dncode) => {
          tempRem.userData = res_Dncode;
          this.loginRemember = tempRem;
          logger.error('一般登入 Remember',this.loginRemember);
          return Promise.resolve();
        }, (error_Dncode) => {
          logger.debug('error_Dncode', error_Dncode);
          return Promise.resolve();
        }
        ).then((res_compare) => {
          // 取用 快入登入資訊Storage
          const tempFtData = this.localStorageService.getObj('Compare');
          if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
            this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
              (res_Dncode) => {
                tempFtData.comparecustId = res_Dncode.custId;
                tempFtData.compareuserId = res_Dncode.userId;
                
                logger.error('快速登入 Compare',tempFtData);
                this.ftloginRemember = tempFtData;
                this.common();
              },
              (error_Dncode) => {
                this.common();
                logger.debug('error_Dncode', error_Dncode);
              }
            );
          } else {
            this.common();
          }
        }, (error_compare) => {
          logger.debug('error_compare', error_compare);
        });
    } else {
      this.oldStorageCompilr();
    }

  }

  /**
   * 驗證表單
   * @param fieldName 欄位名稱
   */
  validate(fieldName: string) {
    if (typeof this.loginForm !== 'undefined') {
      const field = this.loginForm.get(fieldName);
      return (field.touched && field.invalid);
    }
    return false;
  }

  ngOnInit() {
    this.subscriptionOnDraw = this.patternLockService.onDrawSubject.subscribe(
      () => {
        this.onDraw();
      }
    );
  }
  gotoPrivacy() {
    this.navgator.push('web:privacy');
  }

  /**
   * localStorage 一般流程合併
   */
  common() {
   
    this.setForm();
    // 是否啟動快速登入 0 關閉 1 啟用
    // 新增信用卡快速登入
    if (((this.loginRemember.ftlogin.fastlogin === '1'&& this.prevlogin=='web') || (this.card_loginRemember.ftlogin.fastlogin === '1'&& this.prevlogin=='card'))
      && this.loginRemember.ftlogin.type === 'biometric') {
        logger.error('common()');
      // 快速登入開啟為生物辨識
      let cancelFastLogin = this.localStorageService.get('cancelFastLogin'); // 生物辨識錯五次自動解除生物辨識與圖形鎖
      if (!!cancelFastLogin && cancelFastLogin == '1') {
        return false; // 已lock不處理
      }
      if (!environment.ONLINE && !environment.NATIVE) {
        // 開發使用
        this.errorHandler.handleError({
          type: 'confirm',
          title: 'ERROR.INFO_TITLE',
          content: '[測試]確定要立即使用快速登入'
        }).then(
          () => {
            this.fastLogin();
          },
          () => {
            // no do
          }
        );
      } else {
        this.fastLogin();
      }
    } else if (((this.loginRemember.ftlogin.hasPatternLock === '1'&& this.prevlogin=='web') || (this.card_loginRemember.ftlogin.fastlogin === '1'&& this.prevlogin=='card'))
     && this.loginRemember.ftlogin.type === 'pattern') { // 直接切到圖形鎖登入畫面
      this.patternLogin();
    }
  }
  /**
   * 重置資料
   * @param type 有帶則表示非第一次重置資料
   */
  setForm(type?){
    let custId = '';
    let userId = '';
    if(type){ //此為點選按鈕切換時資料重置
      if(type=='1'){
        custId = this.loginRemember.rememberMe.remcust=='1'?this.loginRemember.userData.custId:'';
        userId = this.loginRemember.rememberMe.remuser=='1'?this.loginRemember.userData.userId:'';
      }else if(type=='2'){
        custId = this.card_loginRemember.rememberMe.remcust=='1'?this.card_loginRemember.userData.custId:'';
        userId = this.card_loginRemember.rememberMe.remuser=='1'?this.card_loginRemember.userData.userId:'';
      }
      this.loginForm.setValue({ custId: custId, userId: userId, pwd: '' });
      return false;
    }
    // 一般登入是否有記住我
    this.prevlogin=this.localStorageService.getObj("prevlogin");
    logger.error('card_loginRemember',this.card_loginRemember);
    if(this.prevlogin=='card'){
      logger.info('card common()');
      if (this.card_loginRemember.rememberMe.remcust === '1' && this.card_loginRemember.userData.custId !== '') {
        custId = this.card_loginRemember.userData.custId;
        this.remrmber_login.remcust='1';
      } else {
        this.card_loginRemember.rememberMe.remcust = '0';
        this.remrmber_login.remcust='0';
      }
  
      if (this.card_loginRemember.rememberMe.remuser === '1' && this.card_loginRemember.userData.userId !== '') {
        userId = this.card_loginRemember.userData.userId;
        this.remrmber_login.remuser='1';
      } else {
        this.card_loginRemember.rememberMe.remuser = '0';
        this.remrmber_login.remcust='0';
      }
    }else{
      logger.info('web common()');
      if (this.loginRemember.rememberMe.remcust === '1' && this.loginRemember.userData.custId !== '') {
        custId = this.loginRemember.userData.custId;
        this.remrmber_login.remcust='1';
      } else {
        this.loginRemember.rememberMe.remcust = '0';
        this.remrmber_login.remcust='0';
      }
  
      if (this.loginRemember.rememberMe.remuser === '1' && this.loginRemember.userData.userId !== '') {
        userId = this.loginRemember.userData.userId;
        this.remrmber_login.remuser='1';
      } else {
        this.loginRemember.rememberMe.remuser = '0';
        this.remrmber_login.remcust='0';
      }
    }
    this.loginForm.setValue({ custId: custId, userId: userId, pwd: '' });
  }
  /**
   * 一般登入
   */
  async loginMethod() {
    if (this.loginForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.loginForm.controls) {
        logger.warn('this.loginForm', this.loginForm);
        this.loginForm.controls[key].markAsTouched();
      }
      return;
    }
    logger.error('this.card_loginRemember loginmethod',this.card_loginRemember)
    //信用卡一般登入=================
    if(this.loginType=='2'){  
      this.loginService.card_login(this.loginForm.value).then(
        (suc)=>{
          logger.error('suc',suc);
          logger.error('this.loginForm',this.loginForm.value);
          //card_loginRemember
          if(suc.result=='0'){
            this.card_loginRemember.userData.custId = this.loginForm.value.custId;
            this.card_loginRemember.userData.userId = this.loginForm.value.userId;
            // 加密儲存到localStorage
            this.tcbb.fastAESEncode([this.card_loginRemember.userData.custId, this.card_loginRemember.userData.userId]).then(
              (card_Encode)=>{
                // 有錯五次快速登入，將localStorage的快速登入設為0
                let cancelFastLogin = this.localStorageService.get('cancelFastLogin');
                if (!!cancelFastLogin && cancelFastLogin === '1') {
                  this.card_loginRemember.ftlogin.fastlogin = '0';
                }
                this.card_loginRemember.ftlogin.patterLoginErrorCount = '0'; // 圖形鎖錯誤次數 = 0
                this.card_loginRemember.ftlogin.type = 'pwdlogin';
                const copy = Object.assign({}, this.card_loginRemember);
                copy.userData = card_Encode;
                logger.error('Remember_card', copy);
                //信用卡第一次登入 避免後續流程錯誤在此set
                if( !this.localStorageService.getObj('Remember')){
                  this.localStorageService.setObj('Remember', this.loginRemember);  //
                }
                this.localStorageService.setObj('Remember_card', copy);
                this.localStorageService.setObj('prevlogin', 'card');
                logger.error('showFt', this.showFt);
                sessionStorage.setItem('login_method','2');
                //若有開啟生物辨識，第一次使用信卡登入，資料存入compare_card
                // if( this.loginRemember.ftlogin.fastlogin=='1' && this.card_loginRemember.ftlogin.fastlogin=='0'){
                //   const copyFT = Object.assign({}, this.card_ftloginRemember);
                //   copyFT.comparecustId = card_Encode.custId;
                //   copyFT.compareuserId = card_Encode.userId;
                //   logger.error('Compare_card', copyFT);
                //   this.localStorageService.setObj('Compare_card', copyFT);
                // }
                if (this.goPatternLock) { // 轉至設定圖形鎖
                  this.navgator.push('security_patternlock_preface', 'fromLogin');
                } else if (!this.showFt) {
                  const copyFT = Object.assign({}, this.card_ftloginRemember);
                  copyFT.comparecustId = card_Encode.custId;
                  copyFT.compareuserId = card_Encode.userId;
                  logger.error('Compare_card', copyFT);
                  this.localStorageService.setObj('Compare_card', copyFT);
                  // 註冊頁
                  this.navgator.push('security_ftlogin_agree', 'fromLogin');
                }else{
                  this.goCardUrl();
                }
              },
              (card_errEncode)=>{
                logger.error('card_errEncode',card_errEncode);
              }
            );
          }else{
            this.errorHandler.handleError({
              type:'dialog',
              content: suc.respCodeMsg
            });
            return false;
          }
        },
        (fail)=>{
          this.errorObj = fail;
          this.errorHandler.handleError(fail);
        }
      );
      return false;
    }
    //網銀會員一般登入==================
    sessionStorage.setItem('login_method','1');
    this.loginService.login(this.loginForm.value).then(
      (res) => {
        this.loginRemember.userData.custId = this.loginForm.value.custId;
        this.loginRemember.userData.userId = this.loginForm.value.userId;
        // 加密儲存到localStorage
        this.tcbb.fastAESEncode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
          (res_Encode) => {
            // 有錯五次快速登入，將localStorage的快速登入設為0
            let cancelFastLogin = this.localStorageService.get('cancelFastLogin');
            if (!!cancelFastLogin && cancelFastLogin === '1') {
              this.loginRemember.ftlogin.fastlogin = '0';
            }
            this.localStorageService.setObj('prevlogin', 'web');
            this.loginRemember.ftlogin.patterLoginErrorCount = '0'; // 圖形鎖錯誤次數 = 0
            this.loginRemember.ftlogin.type = 'pwdlogin';
            const copy = Object.assign({}, this.loginRemember);
            copy.userData = res_Encode;
            logger.error('copy',copy);
            logger.error('showFt',this.showFt);
            this.localStorageService.setObj('Remember', copy);
            if (this.goPatternLock) { // 轉至設定圖形鎖
              this.navgator.push('security_patternlock_preface', 'fromLogin');
            } else if (!this.showFt) {
              const copyFT = Object.assign({}, this.ftloginRemember);
              copyFT.comparecustId = res_Encode.custId;
              copyFT.compareuserId = res_Encode.userId;
              logger.error('Compare', copyFT);
              this.localStorageService.setObj('Compare', copyFT);
              // 註冊頁
              this.navgator.push('security_ftlogin_agree', 'fromLogin');
            } else {
              this.loginService.doAfterLogin(res, this.loginForm.value);
            }
          },
          (error_Encode) => {
            logger.debug('error_Encode', error_Encode);
          }
        );
      },
      (error) => {
        logger.debug('loginMethod error', error);
        this.errorObj = error;
        this.errorHandler.handleError(error);
        // this.alert.show(error.content, { title: '錯誤' }).then(res => { });
      }
    );
  }

  /**
   * 快速登入
   */
  fastLogin() {
    // check allow
    let allow = this.checkAllowBio();
    if (!allow) {
      return;
    }
    //信用卡綁定 && 網銀使用不同custId登入
    logger.error('loginForm',this.loginForm.value);

    //網銀登入
    if(this.loginType=='1' && (this.card_ftloginRemember.comparecustId &&this.loginRemember.userData.custId!=this.ftloginRemember.comparecustId
      && this.loginRemember.userData.custId !=this.card_ftloginRemember.comparecustId
      )){
      this.alert.show('您現在的ID與設定生物辨識的ID不同，請重新登入後設定', { title: 'ERROR.INFO_TITLE' }).then(
        success => {
          logger.error(this.loginRemember.userData.custId ,this.card_ftloginRemember.comparecustId);
          return;
        }
      );
      return false;
    }
    if(this.loginType=='2' && (this.ftloginRemember.comparecustId &&this.card_loginRemember.userData.custId!=this.card_ftloginRemember.comparecustId
       &&this.card_loginRemember.userData.custId !=this.ftloginRemember.comparecustId
       )){
      this.alert.show('您現在的ID與設定生物辨識的ID不同，請重新登入後設定', { title: 'ERROR.INFO_TITLE' }).then(
        success => {
          logger.error(this.card_loginRemember.userData.custId ,this.ftloginRemember.comparecustId);
          return;
        }
      );
      return false;
    }
    // 快速登入啟用狀態
    if (this.loginRemember.ftlogin.fastlogin === '1'||this.card_loginRemember.ftlogin.fastlogin === '1') {
      // 比對快速登入資訊 與 一般登入資訊 最後登入帳號是否相同 && 不為空
      logger.error('fast',this.ftloginRemember,this.loginRemember);
      logger.error('fast2',this.card_ftloginRemember,this.card_loginRemember);
      //前兩行為判斷custId相同 && userId不等於web及card的compareUserId
      //後兩行為判斷custd和userId不為空
      logger.info((this.loginType=='1' && this.ftloginRemember.comparecustId !== this.loginRemember.userData.custId &&(this.ftloginRemember.compareuserId !== this.loginRemember.userData.userId && this.card_ftloginRemember.compareuserId !== this.loginRemember.userData.userId))
      ,(this.loginType=='2' && this.card_ftloginRemember.comparecustId !== this.card_loginRemember.userData.custId && (this.card_ftloginRemember.compareuserId !== this.card_loginRemember.userData.userId && this.ftloginRemember.compareuserId !== this.card_loginRemember.userData.userId))
      ,(this.loginType=='1' && (this.ftloginRemember.comparecustId =='' || this.loginRemember.userData.userId ==''))
      ,(this.loginType=='2' && (this.card_ftloginRemember.comparecustId =='' || this.card_loginRemember.userData.userId=='')));
     
      if ((this.loginType=='1' && this.ftloginRemember.comparecustId !== this.loginRemember.userData.custId &&(this.ftloginRemember.compareuserId !== this.loginRemember.userData.userId && this.card_ftloginRemember.compareuserId !== this.loginRemember.userData.userId))
        ||(this.loginType=='2' && this.card_ftloginRemember.comparecustId !== this.card_loginRemember.userData.custId && (this.card_ftloginRemember.compareuserId !== this.card_loginRemember.userData.userId && this.ftloginRemember.compareuserId !== this.card_loginRemember.userData.userId))
        ||(this.loginType=='1' && (this.ftloginRemember.comparecustId =='' || this.loginRemember.userData.userId ==''))
        ||(this.loginType=='2' && (this.card_ftloginRemember.comparecustId =='' || this.card_loginRemember.userData.userId==''))) {   
          if(this.loginType=='2' && this.ftloginRemember.comparecustId ==this.card_loginRemember.userData.custId && !this.card_ftloginRemember.comparecustId){
            logger.error('old To new');
            this.resuestBio();
          }else{
            this.alert.show('您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
              success => {
                logger.error('請先使用原帳號作一般登入1');
                return;
              }
            );
          }
        return false;
      } else {
        let cancelFastLogin = this.localStorageService.get('cancelFastLogin'); // 生物辨識錯五次自動解除生物辨識與圖形鎖
        if (!!cancelFastLogin && cancelFastLogin == '1') {
          this.alert.show('生物辨識錯誤已達5次，請重新設定或改用密碼登入，系統已自動取消生物辨識快速登入', { title: 'ERROR.INFO_TITLE' }).then(
            success => {
              this.cancelPatternBioLogin();
              this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
              // 快速登入關閉狀態-重新設定
              this.showAgree = false;
              this.showFt = false;
              return;
            }
          );
          return false;
        }
        this.resuestBio();
      }
    } else {
      if(this.loginType=='1'){
        // 比對快速登入資訊 與 一般登入資訊 最後登入帳號是否相同
        if ( (this.ftloginRemember.comparecustId !== '' || this.ftloginRemember.compareuserId !== '') &&
          (this.ftloginRemember.comparecustId !== this.loginRemember.userData.custId &&
          this.ftloginRemember.compareuserId !== this.loginRemember.userData.userId)) {
          this.alert.show('您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
            success => {
              return;
            }
          );
          return false;
        }
     }else{
        if ( (this.card_ftloginRemember.comparecustId !== '' || this.card_ftloginRemember.compareuserId !== '') &&
        (this.card_ftloginRemember.comparecustId !== this.card_loginRemember.userData.custId &&
        this.card_ftloginRemember.compareuserId !== this.card_loginRemember.userData.userId)) {
        this.alert.show('您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
          success => {
            return;
          }
        );
        return false;
      }
     }
      // 快速登入關閉狀態
      this.showAgree = false;
      this.showFt = false;
    }
  }

  /**
   * 加密統一儲存
   */
  setObjCommon() {
    // 加密儲存到localStorage
    if(this.loginType=='1'){
      this.tcbb.fastAESEncode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
        (res_Encode) => {
          let copy = Object.assign({}, this.loginRemember);
          copy.userData = res_Encode;
          this.localStorageService.setObj('Remember', copy);
        },
        (error_Encode) => {
          logger.debug('error_Encode', error_Encode);
        }
      );
    }else{
      this.tcbb.fastAESEncode([this.card_loginRemember.userData.custId, this.card_loginRemember.userData.userId]).then(
        (res_Encode) => {
          let copy = Object.assign({}, this.card_loginRemember);
          copy.userData = res_Encode;
          this.localStorageService.setObj('Remember_card', copy);
        },
        (error_Encode) => {
          logger.debug('error_Encode', error_Encode);
        }
      );
    }
  }

  /**
   * 從舊版app Storage資訊同步更新到新app
   * @param type 判斷同步的狀態
   */
  oldStorageCompilr() {
    logger.error('oldStorageCompilr');
    // 舊版localStorage更新
    // 有註冊過快速登入，並且有開啟
    if (this.localStorageService.get('bioLogin') !== null && this.localStorageService.get('bioLogin') === '1') {
      this.loginRemember.ftlogin.fastlogin = '1';
      this.loginRemember.ftlogin.type = 'biometric';
    }
    // 有啟用付款
    if (this.localStorageService.get('pay_setting') !== null && this.localStorageService.get('pay_setting') === '1') {
      this.loginRemember.ftlogin.pay_setting = '1';
    }
    // 有記住我的name
    if (this.localStorageService.get('loginname') !== null && this.localStorageService.get('loginname') !== '') {
      this.loginRemember.userData.custId = this.localStorageService.get('loginname');
    }
    // 有記住我的user
    if (this.localStorageService.get('loginuser') !== null && this.localStorageService.get('loginuser') !== '') {
      this.loginRemember.userData.userId = this.localStorageService.get('loginuser');
    }
    // 有勾選記住我name
    if (this.localStorageService.get('isstorename') !== null && this.localStorageService.get('isstorename') === 'yes') {
      this.loginRemember.rememberMe.remcust = '1';
      this.remrmber_login.remcust ='1';
    }
    // 有勾選記住我user
    if (this.localStorageService.get('isstoreuser') !== null && this.localStorageService.get('isstoreuser') === 'yes') {
      this.loginRemember.rememberMe.remuser = '1';
    }
    // 有記住快速登入資料name，且資料不是空值
    if (this.localStorageService.get('comparename') !== null && this.localStorageService.get('comparename') !== '') {
      this.ftloginRemember.comparecustId = this.localStorageService.get('comparename');
    }
    // 有記住快速登入資料user，且資料不是空值
    if (this.localStorageService.get('compareuser') !== null && this.localStorageService.get('compareuser') !== '') {
      this.ftloginRemember.compareuserId = this.localStorageService.get('compareuser');
    }
    this.tcbb.fastAESDecode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
      (res_Dncode) => {
        this.loginRemember.userData.custId = res_Dncode.custId;
        this.loginRemember.userData.userId = res_Dncode.userId;
        return Promise.resolve;
      },
      (error_Dncode) => {
        this.common();
        logger.debug('error_Dncode', error_Dncode);
      }
    ).then(
      (res_compare) => {

        const copyFT = { 'comparecustId': '', 'compareuserId': '' };
        copyFT.comparecustId = this.ftloginRemember.comparecustId;
        copyFT.compareuserId = this.ftloginRemember.compareuserId;

        this.tcbb.fastAESDecode([this.ftloginRemember.comparecustId, this.ftloginRemember.compareuserId]).then(
          (res_Dncode) => {
            this.ftloginRemember.comparecustId = res_Dncode.custId;
            this.ftloginRemember.compareuserId = res_Dncode.userId;
            this.localStorageService.setObj('Compare', copyFT);
            this.common();
          },
          (error_Dncode) => {
            logger.debug('error_Dncode', error_Dncode);
            this.common();
          }
        );
      },
      (error_compare) => {
        this.common();
      }
    );
  }

   /**
   * 返回前一頁
   */
  cancel() {
    this.SessionStorage.set('redirectToOld','');
    let cardClose=this.SessionStorage.get('cardClose');
    let login_method=this.SessionStorage.getObj("login_method");   
   
    //login_method為3表示從信用卡點選信卡登入功能導致登入頁
    if(login_method && (login_method =='3' ||login_method =='')){
      this.navgator.push('home',{},{
        'user':'card'
      });
    }else{
       //cardClose表示從信用卡登出導致登入頁，其餘導回上一頁
      if(cardClose && cardClose =='1'){
        this.SessionStorage.set('cardClose','');
        this.navgator.push('home');
        return false;
      } else{
        this.navgator.pop();
      }
    }
  }


  /**
   * 切換input 密碼與文字切換
   * @param type 類別
   */
  switchSee(type) {
    switch (type) {
      case 'seecust':
        this.seeObj.seecust = !this.seeObj.seecust;
        break;

      case 'seeuser':
        this.seeObj.seeuser = !this.seeObj.seeuser;
        break;

      case 'seepwd':
        this.seeObj.seepwd = !this.seeObj.seepwd;
        break;
    }
  }

  /**
   * 記住我開關
   * @param type type
   */
  remember(type) {
    logger.error(' remember(type)', type,this.loginType,this.loginRemember.rememberMe,this.card_loginRemember.rememberMe);
    switch (type) {
      case 'remcust': //custId
      if(this.loginType=='1'){  //web
        if (this.remrmber_login.remcust === '0') {
          this.loginRemember.rememberMe.remcust = '1';
        } else {
          this.loginRemember.rememberMe.remcust = '0';
        }
        this.remrmber_login.remcust =this.loginRemember.rememberMe.remcust;
        break;
      }else{  //card
        if (this.remrmber_login.remcust === '0') {
          this.card_loginRemember.rememberMe.remcust = '1';
        } else {
          this.card_loginRemember.rememberMe.remcust = '0';
        }
        this.remrmber_login.remcust =this.card_loginRemember.rememberMe.remcust;
        break;
      }

      case 'remuser': //userId
      if(this.loginType=='1'){  //web
        if (this.remrmber_login.remuser === '0') {
          this.loginRemember.rememberMe.remuser = '1';
        } else {
          this.loginRemember.rememberMe.remuser = '0';
        }
        this.remrmber_login.remuser =this.loginRemember.rememberMe.remuser;
        break;
      }else{//card
        if (this.remrmber_login.remuser === '0') {
          this.card_loginRemember.rememberMe.remuser = '1';
        } else {
          this.card_loginRemember.rememberMe.remuser = '0';
        }
        this.remrmber_login.remuser =this.card_loginRemember.rememberMe.remuser;
        break;
      }
    }
  }

  onEnter(elementId: string) {
    if (elementId === 'custId') {
      this.userIdInput.nativeElement.focus();
    } else if (elementId === 'userId') {
      this.pwdInput.nativeElement.focus();
    } else {
      document.getElementById('login').focus();
      this.loginMethod();
    }
  }

  /**
   * 恢復登入資料
   */
  resetLoginInfo() {
    let recustId = '';
    let reuserId = '';
    if(this.loginType == '1'){
      if (this.loginRemember.rememberMe.remcust == '1') {
        recustId = this.loginRemember.userData.custId;
        this.loginRemember.rememberMe.remcust = '1';
      }
      if (this.loginRemember.rememberMe.remuser == '1') {
        reuserId = this.loginRemember.userData.userId;
        this.loginRemember.rememberMe.remuser = '1';
      }
    }else{
      if (this.card_loginRemember.rememberMe.remcust == '1') {
        recustId = this.card_loginRemember.userData.custId;
        this.card_loginRemember.rememberMe.remcust = '1';
      }
      if (this.card_loginRemember.rememberMe.remuser == '1') {
        reuserId = this.card_loginRemember.userData.userId;
        this.card_loginRemember.rememberMe.remuser = '1';
      }
    }
  
    this.loginForm = new FormGroup(
      {
        custId: new FormControl(recustId, [Validators.required, CustomValidators.rangeLength([1, 12]), ValidatorcustId]),
        userId: new FormControl(reuserId, [Validators.required, CustomValidators.rangeLength([1, 16]), ValidatoruserId]),
        pwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 12]), Validatorpwd])
      });
  }

  /**
   * 圖形鎖快速登入 進入時恢復登入資料
   */
  resetLoginInfoForPatternLock() {
    this.resetLoginInfo();
    this.showPatternLockAgree = false;
    this.showDoc = false;
    this.showFt = false;
    this.goPatternLock = true;
  }

  /**
   * 指紋/臉部快速登入 進入時恢復登入資料
   */
  resetLoginInfoForFinger() {
    this.resetLoginInfo();
    this.showAgree = true;
  }


 /**
   * 點選 "圖形密碼"
   */
  patternLogin() {
    logger.error('patternLogin', this.loginRemember.userData.custId, this.ftloginRemember.comparecustId);
    logger.error('patternLogin2', this.card_loginRemember.userData.custId, this.card_ftloginRemember.comparecustId);
    logger.error('patternLogin3', this.card_ftloginRemember.compareuserId, this.ftloginRemember.compareuserId);
    //   若圖形鎖開＆＆compsre custId與另一身分之remember custId相同＆＆開且快速登入userId為空 
    //   =>代表使用另一身分註冊圖形登入，此一身份compareuserId自動補為remember userId
    if (this.loginRemember.ftlogin.hasPatternLock === '1' && this.loginType == '1' && this.ftloginRemember.compareuserId == ''
      && this.ftloginRemember.comparecustId === this.card_loginRemember.userData.custId) {
      this.ftloginRemember.compareuserId = this.loginRemember.userData.userId;
      logger.error('patternLogin~1', this.ftloginRemember.comparecustId === this.card_loginRemember.userData.custId);
    } else if (this.loginRemember.ftlogin.hasPatternLock === '1' && this.loginType == '2' && this.card_ftloginRemember.compareuserId == ''
      && this.card_ftloginRemember.comparecustId === this.loginRemember.userData.custId) {
      this.card_ftloginRemember.compareuserId = this.card_loginRemember.userData.userId;
      logger.error('patternLogin~2', this.card_ftloginRemember.comparecustId === this.loginRemember.userData.custId);
    }

    // 有綁定圖形鎖快速登入且註冊快速登入時的帳號與現在的ID相同
    //custId相同且 userId需等於 Compare || Compare_Card 的userId
    if (this.loginRemember.ftlogin.hasPatternLock === '1' &&
      ((this.loginType == '1' && this.ftloginRemember.comparecustId === this.loginRemember.userData.custId &&
        (this.ftloginRemember.compareuserId === this.loginRemember.userData.userId || this.card_ftloginRemember.compareuserId === this.loginRemember.userData.userId)) ||
        (this.loginType == '2' && this.card_ftloginRemember.comparecustId === this.card_loginRemember.userData.custId &&
          (this.card_ftloginRemember.compareuserId === this.card_loginRemember.userData.userId || this.ftloginRemember.compareuserId === this.card_loginRemember.userData.userId)))) {
      logger.error('condition1');
      //使用過信卡綁定但網銀無綁定 第一次使用網銀登入
      if (this.loginType == '1' && (this.ftloginRemember.comparecustId == '' || this.loginRemember.userData.userId == '')) {
        this.alert.show('您現在的ID與設定圖形密碼的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
          success => {
            this.showPatternLockAgree = false; // 顯示圖形鎖文宣
            this.showDoc = false;
            this.showPatternLock = false;
            this.showAgree = true;
            this.showFt = true;
            return;
          }
        );
      } else if (this.loginType == '2' && (this.card_ftloginRemember.comparecustId == '' || this.card_loginRemember.userData.userId == '')) {
        this.alert.show('您現在的ID與設定圖形密碼的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
          success => {
            this.showPatternLockAgree = false; // 顯示圖形鎖文宣
            this.showDoc = false;
            this.showPatternLock = false;
            this.showAgree = true;
            this.showFt = true;
            return;
          }
        );
      } else {
        this.showPatternLock = true; // 顯示圖形密碼
      }
    } else if (this.loginRemember.ftlogin.hasPatternLock === '0' &&
      this.ftloginRemember.comparecustId === this.loginRemember.userData.custId &&
      this.ftloginRemember.compareuserId === this.loginRemember.userData.userId) {
      logger.error('condition2');
      this.showPatternLockAgree = true; // 顯示圖形鎖文宣
      this.showDoc = true;
    } else {
      logger.error(this.loginRemember.ftlogin.hasPatternLock === '1'
        , this.ftloginRemember.comparecustId != '', this.card_ftloginRemember.comparecustId != ''
        , this.ftloginRemember.comparecustId == this.card_ftloginRemember.comparecustId
        , (this.loginType == '1' && this.loginRemember.userData.custId == this.ftloginRemember.comparecustId),
        (this.loginType == '2' && this.card_loginRemember.userData.custId == this.card_ftloginRemember.comparecustId));
      if (this.loginRemember.ftlogin.hasPatternLock === '1' && this.ftloginRemember.comparecustId != ''
        && this.card_ftloginRemember.comparecustId != ''
        && this.ftloginRemember.comparecustId == this.card_ftloginRemember.comparecustId
        && ((this.loginType == '1' && this.loginRemember.userData.custId == this.ftloginRemember.comparecustId) ||
          (this.loginType == '2' && this.card_loginRemember.userData.custId == this.card_ftloginRemember.comparecustId))
      ) {//啟用過圖形鎖 but 信用卡與網銀會用userId不同，比對身分證相同
        this.showPatternLock = true; // 顯示圖形密碼
      } else if ((this.loginType == '1' && this.ftloginRemember.comparecustId === '' && this.ftloginRemember.compareuserId === '')
        || (this.loginType == '2' && this.card_ftloginRemember.comparecustId === '' && this.card_ftloginRemember.compareuserId === '')) {
        logger.error('condition3');
        if(this.loginType=='2' && this.ftloginRemember.comparecustId ==this.card_loginRemember.userData.custId && !this.card_ftloginRemember.comparecustId){
          this.ftloginService.getMaskedCustid_Remember_card(0, 5).then((res) => {
            this.maskCust_card=res;
            this.card_bioReqWord = (res === '') ? '' : '\n身分證字號' + res;
          });
          logger.error('old To new',this.maskCust_card);
          logger.error( this.ftloginRemember.comparecustId ==this.card_loginRemember.userData.custId , !this.card_ftloginRemember.comparecustId);
          this.showPatternLock = true; 
        }else{
          this.showPatternLockAgree = true; // 顯示圖形鎖文宣
          this.showDoc = true;
        }
      } else {
        logger.error('condition4');
        this.alert.show('您現在的ID與設定圖形密碼的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
          success => {
            this.showPatternLockAgree = false; // 顯示圖形鎖文宣
            this.showDoc = false;
            this.showPatternLock = false;
            this.showAgree = true;
            this.showFt = true;
            return;
          }
        );
      }
    }
  }

  /**
   * 圖形鎖下方按鈕，點選後返回一般登入
   */
  patternLockLeftBtn() {
    this.goPatternLock = false;
    this.showPatternLock = false;
  }

  /**
   * 圖形鎖登入
   */
  patternLockConfirm() {
    this.zone.run(() => {
      this.patternLockService.disablePattern(); // 發登入電文期間不給亂按
      let patternPwd = this.patternLockService.getPatternPwd();
      if (patternPwd.length <= 1) {
        this.alert.show('PG_SECURITY.PATTERN_LOCK.ENTER_PATTERN_LOCK', { title: 'ERROR.INFO_TITLE' }); // 請輸入圖形密碼
        this.patternLockService.resetPattern();
        return;
      }
      let reqObj ;
      if(this.loginType=='1'){  //web
        reqObj= {
          custId: this.loginRemember.userData.custId,
          userId: this.loginRemember.userData.userId,
          patternPwd: patternPwd
        };
      }else{    //card
        reqObj= {
          custId: this.card_loginRemember.userData.custId,
          userId: this.card_loginRemember.userData.userId,
          patternPwd: patternPwd
        };
      }
      if (reqObj.custId == '' || reqObj.userId == '') {
        this.alert.show('您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入', { title: 'ERROR.INFO_TITLE' }).then(
          success => {
            return;
          }
        );
        return false;
      }
      this.ftloginService.patternLockLogin(reqObj,this.loginType).then(
        (res) => {
          if(this.loginType=='1'){
            this.patternLockService.enablePattern();
            if (res.validateResult == '0') { // 驗證成功
              this.loginRemember.ftlogin.hasPatternLock = '1';
              this.loginRemember.ftlogin.type = 'pattern';
              this.loginRemember.ftlogin.patterLoginErrorCount = '0';
              this.localStorageService.setObj('prevlogin', 'web');
              sessionStorage.setItem("login_method","1");
              this.setObjCommon();
              this.loginService.doAfterLogin(res, this.loginForm.value);
            }
          }else{
            if (res.validateResult == '0') { // 驗證成功
              this.card_loginRemember.ftlogin.hasPatternLock = '1';
              this.card_loginRemember.ftlogin.type = 'pattern';
              this.card_loginRemember.ftlogin.patterLoginErrorCount = '0';
              this.localStorageService.setObj('prevlogin', 'card');
              sessionStorage.setItem("login_method","2");
              this.setObjCommon();
              this.goCardUrl();
            }
          }
        },
        (errObj) => { // 驗證失敗
          if (!!errObj['resultCode']) {
            // 已在其他裝置設定圖形密碼
            if (errObj['resultCode'] === 'ERRBI_0006') {
              this.alert.show(errObj['content'], { title: 'ERROR.INFO_TITLE' });
              this.cancelPatternLogin();
              this.patternLockLeftBtn();
              return;
            }
            // resultCode !== ERRBI_0001 顯示錯誤訊息&不累加錯誤次數
            if (errObj['resultCode'] !== 'ERRBI_0001') {
              this.alert.show(errObj['content'], { title: 'ERROR.INFO_TITLE' });
              return;
            }
            this.patternLockService.enablePattern();
            this.loginRemember.ftlogin.patterLoginErrorCount = (Number(this.loginRemember.ftlogin.patterLoginErrorCount) + 1).toString();
            this.setObjCommon();
            if (Number(this.loginRemember.ftlogin.patterLoginErrorCount) < this.maxPatterLockError) {
              this.alert.show('ERROR.LOGIN.PATTERN_ERROR', { title: 'ERROR.INFO_TITLE' }).then( // 您輸入的圖形密碼錯誤，如錯誤累積五次將自動解除圖形密碼綁定。
                () => {
                  this.patternLockService.resetPattern();
                }
              );
            } else { // 圖形鎖錯五次 -> 解除生物辨識與圖形鎖
              this.cancelPatternBioLogin();
              this.alert.show('ERROR.LOGIN.PATTERN_DISABLE', { title: 'ERROR.INFO_TITLE' }); // 您輸入密碼的錯誤次數已達五次，系統將解除您的圖形密碼綁定，請改用一般登入。
              this.showPatternLock = false;
            }
          } else { // 網路連線或是其他問題
            this.errorHandler.handleError(errObj);
            return;
          }
        }
      );
    })
  }

  /**
   * 使用者畫完圖形鎖自動執行
   */
  onDraw() {
    let patternPwd = this.patternLockService.getPatternPwd();
    if (patternPwd.length == 1) { // 可能是不小心點到"一個點"(圖形鎖)
      this.patternLockService.resetPattern();
      return;
    }
    // 直接發送圖形密碼登入電文
    this.patternLockConfirm();
  }

  /**
   * 取消圖形密碼登入
   */
  cancelPatternLogin() {
    this.loginRemember.ftlogin.fastlogin = '0';
    this.loginRemember.ftlogin.hasPatternLock = '0';
    this.loginRemember.ftlogin.type = 'pwdlogin'; // this.loginRemember.ftlogin.fastlogin == '1' ? 'biometric' : 'pwdlogin';
    this.loginRemember.ftlogin.patterLoginErrorCount = '0';
    this.loginRemember.ftlogin.payPattern = '0';
    this.loginRemember.ftlogin.pay_setting = '0';
    this.loginRemember.ftlogin.patternDeviceId = '';
    delete localStorage['keepPatternLock'];
    // epay cache強制清除
    this.cacheService.removeGroup('epay-security');
    this.setObjCommon();
    return;
  }

  /**
   * 取消生物辨識與圖形鎖登入
   */
  cancelPatternBioLogin() {
    this.securityService.cancelftLogin();
    // 不發取消圖形鎖電文，只更改local storageftlogin
    this.loginRemember.ftlogin.fastlogin = '0';
    this.loginRemember.ftlogin.hasPatternLock = '0';
    this.loginRemember.ftlogin.type = 'pwdlogin';
    this.loginRemember.ftlogin.patterLoginErrorCount = '0';
    this.loginRemember.ftlogin.payPattern = '0';
    this.loginRemember.ftlogin.pay_setting = '0';
    this.loginRemember.ftlogin.patternDeviceId = '';
    delete localStorage['keepPatternLock'];
    // epay cache強制清除
    this.cacheService.removeGroup('epay-security');
    this.setObjCommon();
    return;
  }

  cancelBio() {
    this.loginRemember.ftlogin.fastlogin = '0';
    this.loginRemember.ftlogin.type = this.loginRemember.ftlogin.hasPatternLock == '1' ? 'pattern' : 'pwdlogin';
    this.loginRemember.ftlogin.pay_setting = '0';
    // epay cache強制清除
    this.cacheService.removeGroup('epay-security');
    this.setObjCommon();
    return;
  }

  ngOnDestroy() {
    this.subscriptionOnDraw.unsubscribe();
    this.patternLockService.enablePattern();
  }

  /**
   * check allow
   */
  private checkAllowBio() {
    let check_allow = this.securityService.checkAllowDevice();
    let allow = check_allow.allow;
    if (!allow) {
      this.errorHandler.handleError(check_allow.error);
    }
    return allow;
  }
  /**
   * 新增信用卡登入
   */
  chooseLogin(type){
    logger.error('showPatternLock',this.showPatternLock,'showAgree', this.showAgree,'showPatternLockAgree', this.showPatternLockAgree);
    this.setForm(type);
    if(type=='1'){ // 網銀會員
      this.loginType='1';
      this.remrmber_login.remcust=this.loginRemember.rememberMe.remcust;
      this.remrmber_login.remuser=this.loginRemember.rememberMe.remuser;
    }else{  //信用卡會員
      this.loginType='2';
      this.remrmber_login.remcust=this.card_loginRemember.rememberMe.remcust;
      this.remrmber_login.remuser=this.card_loginRemember.rememberMe.remuser;
    }
  }

  goCardUrl(){
    let url=this.localStorageService.get("redirectUrl");
    const redirectToOld=this.SessionStorage.get('redirectToOld');
    const redirectToOldMenu=this.SessionStorage.get('redirectToOldMenu'); 
    this.removeRedirect();
    if (url && url == '/card/card-pay/pay-market-card') { //超商繳卡費
      this.navgator.push("pay-market-card");
    } else if(url && url.indexOf('epay/menu')>0){ //epay
      this.navgator.push("epay-card");
    } else {  //信卡選單/功能 位置
      if(redirectToOldMenu&&redirectToOldMenu!=''){
        logger.error('redirectToOldMenu',redirectToOldMenu);
        this.navgator.push(redirectToOldMenu);
      }else if(redirectToOld&&redirectToOld!=''){
        window.location.replace(redirectToOld);
      }else{
        this.navgator.push("web:card");
      }
    }
  }
  //session clear
  removeRedirect(){
    this.SessionStorage.set('redirectToOld','');
    this.SessionStorage.set('redirectToOldMenu','');
  }

  //生物辨識登入
  resuestBio(){
    let cancelFastLogin = this.localStorageService.get('cancelFastLogin');
    if(this.loginType=='1'){
      this.ftloginService.requestBioService(this.loginRemember.userData, '請將您的指紋置於感應區域上' + this.bioReqWord).then(
        (res) => {
          logger.error('this.bioReqWord',this.bioReqWord);
          logger.warn('requestBioService success', res);
          this.localStorageService.setObj('prevlogin', 'web');
          sessionStorage.setItem('login_method','1');
          this.loginRemember.ftlogin.fastlogin = '1';
          this.loginRemember.ftlogin.type = 'biometric';
          this.loginRemember.ftlogin.patterLoginErrorCount = '0'; // 圖形鎖錯誤次數 = 0
          this.setObjCommon();
          this.loginService.doAfterLogin(res, this.loginForm.value);
        },
        (error) => {
          if (!!error.data.resultCode && error.data.resultCode === 'ERRBI_0007') {
            // this.cancelBio();
            this.cancelPatternBioLogin();
            this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
          }
          if (!!cancelFastLogin && cancelFastLogin == '1') {
            this.cancelPatternBioLogin();
            this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
          }
          this.setObjCommon();
          logger.warn('requestBioService error', error);
          if (!!!error.hideError) {
            // hideError = false顯示錯誤訊息
            let dfmsg = '指紋/臉部登入驗證失敗！建議您先以「使用者代號」及「密碼」登入後，再重新進行快速登入設定。';
            let show_msg = (!!error.msg || error.msg == '') ? error.msg : dfmsg;
            this.alert.show(show_msg, { title: 'ERROR.INFO_TITLE' });
            if (!!error.msg && error.msg.indexOf('錯誤已達5次') > -1) {
              this.cancelPatternBioLogin();
              this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
            }
          }
        }
      );
    }else{//信卡快速登入
      logger.error('requestBioService_card',this.card_loginRemember.userData);
      this.ftloginService.requestBioService_card(this.card_loginRemember.userData, '請將您的指紋置於感應區域上' + this.card_bioReqWord).then(
        (res) => {
          logger.error('requestBioService success', res);
          this.localStorageService.setObj('prevlogin', 'card');
          sessionStorage.setItem('login_method','2');
          this.loginRemember.ftlogin.fastlogin = '1';
          this.loginRemember.ftlogin.type = 'biometric';
          this.loginRemember.ftlogin.patterLoginErrorCount = '0'; // 圖形鎖錯誤次數 = 0
          this.setObjCommon();
          this.goCardUrl();
        },
        (error) => {
          logger.error('this.card_bioReqWord',this.card_bioReqWord,error);
          if (!!error.data.resultCode && error.data.resultCode === 'ERRBI_0007') {
            // this.cancelBio();
            this.cancelPatternBioLogin();
            this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
          }
          if (!!cancelFastLogin && cancelFastLogin == '1') {
            this.cancelPatternBioLogin();
            this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
          }
          this.setObjCommon();
          logger.warn('requestBioService error', error);
          if (!!!error.hideError) {
            // hideError = false顯示錯誤訊息
            let dfmsg = '指紋/臉部登入驗證失敗！建議您先以「使用者代號」及「密碼」登入後，再重新進行快速登入設定。';
            let show_msg = (!!error.msg || error.msg == '') ? error.msg : dfmsg;
            this.alert.show(show_msg, { title: 'ERROR.INFO_TITLE' });
            if (!!error.msg && error.msg.indexOf('錯誤已達5次') > -1) {
              this.cancelPatternBioLogin();
              this.localStorageService.set('cancelFastLogin', '0'); // 要再錯五次快速登入，cancelFastLogin才會變成1
            }
          }
        }
      );
    }
  }
}
