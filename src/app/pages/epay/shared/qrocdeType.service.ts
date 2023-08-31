import { Injectable } from '@angular/core';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FH000203ReqBody } from '@api/fh/fh000203/fh000203-req';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { BiometricService } from '@lib/plugins/biometric.service';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { CacheService } from '@core/system/cache/cache.service';
@Injectable()

export class QRTpyeService {
  PayType: any;
  emv = '0';
  returnObj: any;
  isTwpay: any;
  trnsfrOutCard: any;
  trnsfrOutCardType: any;
  fq000102Res: any;
  hasCards: any;
  securityServices: any;
  maxPatterLockError: number = 5; // 圖形鎖最多錯誤次數
  // 回傳物件
  resultObj = {
    ERROR: {
      title: '',
      content: '',
      message: '',
      type: '',
      status: null
    },
    ca_protective_code: '',
    headerObj: {} // 安控須回送header
    // SecurityType: '', // 安控交易類別
    // Signature: '', // 混淆後SSL密碼
    // SecurityPassword: '', // 混淆後的OTP密碼
    // Acctoken: '', // F1000105取的accessToken
    // cn: '',
    // certSN: '',
    // rquId: ''
  };
  constructor(
    private _logger: Logger,
    private _formateService: FormateService,
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private handleError: HandleErrorService,
    private navigator: NavgatorService,
    private fh000203: FH000203ApiService,
    private check_security: CheckSecurityService,
    private biometricService: BiometricService,
    private _cacheService: CacheService,
    private scan: QrcodeService,
  ) { }

  //  Uri decode
  decodeURI(str) {
    return decodeURIComponent(str);
  }

  TaiwanPayTypeSet(type) {
    this.isTwpay = type;
  }

  TaiwanPayTypeGet() {
    let copyTemp = this.isTwpay;
    return copyTemp;
  }

  trnsfrOutCardSet(obj) {
    this.trnsfrOutCard = obj;
  }

  trnsfrOutCardGet() {
    let copyTemp = this.trnsfrOutCard;
    return copyTemp;
  }

  trnsfrOutCardTypeSet(obj) {
    this.trnsfrOutCardType = obj;
  }

  trnsfrOutCardTypeGet() {
    let copyTemp = this.trnsfrOutCardType;
    return copyTemp;
  }

  fq000102ResSet(obj) {
    this._logger.log('fq000102Res Set', this._formateService.transClone(obj));
    this.fq000102Res = obj;
  }

  fq000102ResGet() {
    this._logger.log('fq000102Res Get', this._formateService.transClone(this.fq000102Res));
    let copyTemp = this.fq000102Res;
    return copyTemp;
  }

  hasCardsSet(obj) {
    this.hasCards = obj;
  }

  hasCardsGet() {
    let copyTemp = this.hasCards;
    return copyTemp;
  }

  /**
   * 儲存安控清單
   * @param obj
   */
  private securityServicesSet(obj) {
    let cache_key = 'epay-security';
    let cache_option = this._cacheService.getCacheSet(cache_key);
    this._cacheService.save(cache_key, obj, cache_option);
    this.securityServices = obj;
  }

  /**
   * 取得安控清單(請使用 getSecurityData)
   */
   securityServicesGet() {
    let cache_key = 'epay-security';
    const cache_data = this._cacheService.load(cache_key);
    let copyTemp = cache_data;
    // let copyTemp = this._formateService.transClone(this.securityServices);
    return copyTemp;
  }


  /**
   * 取得交易控制碼
   */
  getTrnsToken(): Promise<any> {
    let reqData = new FH000203ReqBody();
    return this.fh000203.send(reqData).then(
      (resObj) => {
        return Promise.resolve(resObj.data);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }


  /**
    * 依安控機制取得相關資訊
    */
  async getSecurityInfo(stepObj, securityType: any): Promise<any> {
    const end_data = {
      lock: false,
      data: {},
      msg: ''
    };
    this._logger.step('Epay', 'security start', this._formateService.transClone(securityType), this._formateService.transClone(stepObj));
    let security_key = this._formateService.checkField(securityType, 'key');
    let modify_security = this.securityDataModify(security_key, stepObj);
    if (!modify_security || !modify_security.key || !modify_security.securityType ) {
      // tslint:disable-next-line:max-line-length
      this._logger.error('Epay', 'set data error', this._formateService.transClone(securityType), this._formateService.transClone(stepObj));
      return Promise.reject({
        title: 'ERROR.TITLE',
        msg: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    try {
      let trnsToken = this._formateService.checkObjectList(stepObj, 'signText.trnsToken');
      if (!trnsToken) {
        let token_data = await this.getTrnsToken();
        this._logger.step('Epay', 'security token', token_data);
        trnsToken = token_data;
      }

      // 非生物辨識案控
      let set_security = modify_security.data;
      set_security.securityType = modify_security.securityType;
      set_security.signText.trnsToken = trnsToken;
      return new Promise((resolve, reject) => {
        if (modify_security.key === 'Biometric') {
          // 生物辨識處理
          const errorMethod = (errorObj) => {
            end_data.data = errorObj;
            if (errorObj instanceof Object && errorObj.hasOwnProperty('ret_code')) {
              this.handleError.handleError({
                type: 'dialog',
                title: 'ERROR.TITLE',
                content: end_data.msg
              });
            }
          };
          // 取得Body的XML
          let set_security_id = set_security.serviceId.toLowerCase();
          this.check_security.getXmlBody(set_security_id, set_security.signText)
            .then(text => {
              // 做加密回傳
              // rquId + XMLbpdy本文
              let text_0 = (!!text[0]) ? text[0] : '';
              let text_1 = (!!text[1]) ? text[1] : '';
              let SignText = text_0 + text_1;
              // let custId = this.auth.getCustId();
              // let userId = this.auth.getUserIdStr();
              // let txData = custId + userId;
              this._logger.step('Security', 'BIO SignText', SignText);
              this.biometricService.requestBioService('請將您的指紋置於感應區域上', SignText)
                .then(resObj => {
                  let resultObj = {
                    headerObj: {
                      rquId: text_0,
                      plainText: SignText, // 憑證CN
                      SecurityType: set_security.securityType,
                      signature: resObj.mac_value, // 簽章值
                      cn: '',
                      certSN: ''
                    },
                    // responseObj: this._formateService.transClone(stepObj)
                    responseObj: set_security
                  };
                  resolve(resultObj);
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        } else {

          this._logger.step('Epay', 'send doSecurityNextStep start', set_security);
          this.check_security.doSecurityNextStep(set_security).then(
            // tslint:disable-next-line: no-shadowed-variable
            (resSecurity) => {
              this._logger.step('Epay', 'send security success', resSecurity);
              let output = this._formateService.transClone(resSecurity);
              output.responseObj = set_security;
              resolve(output);
            },
            (errorSecurity) => {
              this._logger.error('Epay', 'send security error', errorSecurity);
              let set_security_id = set_security.serviceId.toLowerCase();
              if (modify_security.key === 'Pattern' && !!errorSecurity && set_security_id !== 'fq000107') {
                this.handleError.handleError(errorSecurity).then(() => {
                  let tempRem = this.localStorage.getObj('Remember');
                  if (!!errorSecurity.message && errorSecurity.message === 'ERROR.LOGIN.PATTERN_DISABLE') {
                    this.navigator.setRoot('');
                    this.navigator.push('epay');
                  }
                });
              }
              reject(errorSecurity);
            }
          );
        }
      });

    } catch (errorObj) {
      this._logger.error('Epay', 'token error', errorObj);
      return Promise.reject(errorObj);
    }
  }


  /**
   * 檢查生物辨識狀態
   */
  checkBiometric() {
    return this.auth.checkBiometric();
  }

  /**
   * 安控資料整理
   * @param security_key 安控類型
   * @param stepObj 傳遞資料
   */
  securityDataModify(security_key: string, stepObj) {
    if (typeof stepObj !== 'object' || !stepObj) {
      return false;
    }
    let output: any = {
      key: security_key,
      securityType: '',
      data: {}
    };
    let security_set = this._formateService.transClone(stepObj);
    if (!this._formateService.checkObjectList(security_set, 'securityType')) {
      security_set.securityType = '';
    }
    let securityList = {
      'SSL': { name: 'SSL', key: 'SSL', securityType: '1', status: true }
      , 'NONSET': { name: '憑證', key: 'NONSET', securityType: '2', status: true }
      , 'OTP': { name: 'OTP', key: 'OTP', securityType: '3', status: true }
      , 'Biometric': { name: '指紋/臉部', key: 'Biometric', securityType: '4', status: true }
      , 'Pattern': { name: '圖形密碼', key: 'Pattern', securityType: '5', status: true }
    };
    if (!!securityList[security_key]) {
      output.securityType = securityList[security_key]['securityType'];
    } else {
      output.securityType = '';
    }

    let signText = this._formateService.checkObjectList(security_set, 'signText');
    if (!signText) {
      signText = {};
    }
    if (this._formateService.checkField(signText, 'trnsToken') == '') {
      signText.trnsToken = '';
    }
    let serviceId = this._formateService.checkField(security_set, 'serviceId');
    security_set.serviceId = serviceId;
    if (security_key === 'OTP') {
      // 依照不同API進行OTP資料調整
      security_set.otpObj = this.securityOTPData(serviceId, security_set);
    }

    security_set.signText = signText;
    output.data = security_set;
    return output;
  }

  /**
   * 整理OTP DATA
   */
  securityOTPData(serviceId: string, stepObj) {
    let output: any = {
      custId: this.auth.getCustId(),
      fnctId: serviceId,
      depositNumber: '',
      depositMoney: '',
      OutCurr: 'TWD', // 目前固定都為台幣，epay尚未提供外幣轉帳
      transTypeDesc: ''
    };
    let signText = this._formateService.checkObjectList(stepObj, 'signText');
    let money: any;
    let tmp_data: any;
    switch (serviceId) {
      case 'BI000101':
      case 'FQ000421':
      case 'FQ000113':
      case 'FQ000114':
        output.depositMoney = 0;
        break;
      case 'FQ000105':
        money = this._formateService.checkField(signText, 'trnsAmount');
        // tslint:disable-next-line:radix
        output.depositMoney = parseInt(money) / 100;
        break;
      case 'FQ000107': // 繳費-繳卡費
        money = this._formateService.checkField(signText, 'txnAmt');
        // tslint:disable-next-line:radix
        output.depositMoney = parseInt(money) / 100;
        break;
      case 'FQ000117': // 繳費-繳卡費
        money = this._formateService.checkField(signText, 'txnAmt');
        // tslint:disable-next-line:radix
        output.depositMoney = parseInt(money) / 100;
        break;
      case 'FQ000110':
        money = this._formateService.checkField(signText, 'trnsfrAmount');
        // tslint:disable-next-line:radix
        output.depositMoney = parseInt(money);
        tmp_data = this._formateService.checkField(signText, 'trnsfrInAcct');
        if (!!tmp_data && tmp_data != '' && tmp_data.length >= 4) {
          output.depositNumber = tmp_data.substr(-4, 4);
        }
        break;
      case 'FQ000111':
        money = this._formateService.checkField(signText, 'trnsfrAmount');
        output.depositMoney = money;
        tmp_data = this._formateService.checkField(signText, 'trnsfrOutAcct');
        if (!!tmp_data && tmp_data != '' && tmp_data.length >= 4) {
          output.depositNumber = tmp_data.substr(-4, 4);
        }
        break;
      case 'FQ000302':
        output.depositMoney = 0;
        tmp_data = this._formateService.checkField(signText, 'trnsfrOutAcct');
        if (!!tmp_data && tmp_data != '' && tmp_data.length >= 4) {
          output.depositNumber = tmp_data.substr(-4, 4);
        }
        break;
      case 'FQ000202':
        money = this._formateService.checkField(signText, 'trnsAmountStr');
        output.depositMoney = money;
        break;
      case 'FQ000106':
        money = this._formateService.checkField(signText, 'trnsfrAmount');
        output.depositMoney = money;
        break;
      case 'FQ000502':
        tmp_data = this._formateService.checkField(signText, 'txnAmt');
        if (!!tmp_data) {
          output.depositMoney = String(tmp_data).substr(0, String(tmp_data).length - 2);
        }
        output.depositNumber = '';
        break;
    }


    return output;
  }

  /**
     * 錯誤訊息整理
     * @param Obj 生物辨識回傳Obj
     */
  errorCompiler(Obj) {
    let msg: string;
    let check_code = this._formateService.checkField(Obj, 'ret_code');
    switch (check_code) {
      case '-1':
        msg = '資料驗證失敗，請重新設定指紋/臉部快速登入';
        return msg;
      case '1':
        msg = '硬體設備不支援';
        return msg;
      case '2':
        msg = '生物辨識尚未啟用';
        return msg;
      case '3':
        msg = '生物辨識尚未設定';
        return msg;
      case '4':
        msg = '系統偵測到您的生物辨識有異動，請重新註冊生物辨識';
        return msg;
      case '5':
        msg = '尚未產製設備信物';
        return msg;
      case '6':
        msg = '尚未啟用驗證服務';
        return msg;
      case '7':
        msg = '已啟用驗證服務';
        return msg;
      case '13':
        msg = '驗證功能被鎖住';
        return msg;
      // case 10:
      //     msg = '生物辨識錯誤';
      //     return msg;
      case '11':
        msg = '生物辨識錯誤';
        return msg;
      case '12':
        msg = '生物辨識錯誤';
        return msg;
      default:
        msg = '系統錯誤 ' + check_code;
        return msg;
    }
  }

  isCheckResponse(response) {
    if (response.body.trnsRsltCode === '1') {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 取得安控權限設置 (epay 暫時製作，尚未與其他功能整併...)
   * 20191127 請統一透過getSecurityData
   */
  private getSecurityList(set_data?: string | Array<string>) {
    let output: any = {
      status: false,
      securityTypes: [],
      selectSecurityType: null
    };

    if (!this.auth.isLoggedIn()) {
      return output;
    }

    let securityList = {
      1: { name: 'SSL', key: 'SSL', securityType: '1', status: true }
      , 2: { name: '憑證', key: 'NONSET', securityType: '2', status: true }
      , 3: { name: 'OTP', key: 'OTP', securityType: '3', status: true }
      , 4: { name: '指紋/臉部', key: 'Biometric', securityType: '4', status: true }
      , 5: { name: '圖形密碼', key: 'Pattern', securityType: '5', status: true }
    };

    let securityTypes = [];
    let selectSecurityType: any;
    let auth_data = this.auth.getUserInfo();
    let authType = (!!auth_data.AuthType) ? auth_data.AuthType : '';
    let authSecurity = authType.split(',');
    let set_security_key: any;
    if (typeof set_data !== 'undefined') {
      let allow_list: Array<string> = [];
      if (typeof set_data == 'string') {
        let quick_key = {
          'epay': ['NONSET', 'OTP', 'Biometric', 'Pattern']
        };
        if (!!quick_key[set_data]) {
          allow_list = quick_key[set_data];
        }
      } else {
        allow_list = set_data;
      }

      // 特殊開關設定
      let tk: any;
      for (tk in securityList) {
        let set_status = false;
        if (allow_list.indexOf(securityList[tk]['key']) > -1) {
          set_status = true;
        }
        if (!!securityList[tk]) {
          securityList[tk]['status'] = set_status;
        }
      }
    }


    set_security_key = 4;
    const checkIsBio = this.checkBiometric();
    if (checkIsBio) {
      if (!!securityList[set_security_key].status) {
        securityTypes.push(securityList[set_security_key]);
      }
    }

    // 圖形密碼
    set_security_key = 5;
    let tempRem = this.localStorage.getObj('Remember');
    let ftUser = this.localStorage.getObj('Compare');
    if ((tempRem.ftlogin.payPattern === '1') &&
      (Number(tempRem.ftlogin.patterLoginErrorCount) < Number(this.maxPatterLockError)) &&
      (ftUser.comparecustId === tempRem.userData.custId) &&
      (ftUser.compareuserId === tempRem.userData.userId) &&
      !!securityList[set_security_key].status) {
      securityTypes.push(securityList[set_security_key]);
    }

    // SSL判斷
    set_security_key = 1;
    if (authSecurity.indexOf('1') > -1 && !!securityList[set_security_key].status) {
      securityTypes.push(securityList[set_security_key]);
    }


    // 憑證判斷
    set_security_key = 2;
    if (authSecurity.indexOf('2') > -1 && !!securityList[set_security_key].status
      && this.auth.checkDownloadCA(true)
    ) {
      securityTypes.push(securityList[set_security_key]);
    }

    // OTP判斷
    set_security_key = 3;
    if (authSecurity.indexOf('3') > -1 && !!securityList[set_security_key].status
      && this.auth.checkAllowOtp(true)
    ) {
      securityTypes.push(securityList[set_security_key]);
    }

    // default select
    if (securityTypes.length > 0) {
      output.status = true;
      selectSecurityType = securityTypes[0];
    }
    output.securityTypes = securityTypes;
    output.selectSecurityType = selectSecurityType;
    this.securityServicesSet(output.securityTypes);
    return output;
  }

  /**
   * 安控選項
   * @param option
   *  reget: (DEFAULT) true (強制重取重設定),  false 允許取暫存
   *  biometric: false (強制關閉快速交易), (DEFAULT) true 允許快速交易
   * @return obj
   *  securityTypes 安控選單列表
   *  selectSecurityType 預設選項
   */
  getSecurityData(option?: object) {
    let securityTypes: any = [];

    securityTypes = this.securityServicesGet();
    this._logger.step('Security', 'getSecurityData', securityTypes);
    let reget = this._formateService.checkField(option, 'reget');
    if (!securityTypes || securityTypes.length <= 0 || !!reget) {
      this._logger.step('Security', 'epay security reget');
      // 沒有就重設定
      let securityData = this.getSecurityList('epay');
      securityTypes = securityData.securityTypes;
      this._logger.step('Security', 'reset', securityData);
    }

    // 特殊處理(強制刪除快速交易)
    let output_security = this._formateService.transClone(securityTypes);
    let biometric_flag = true;
    if (typeof option != 'undefined' && typeof option['biometric'] != 'undefined' && option['biometric']  === false) {
      biometric_flag = false;
    }

    if (biometric_flag === false) {
        let item_index: any;
        let new_output = [];
        for (item_index in output_security) {
          if (!output_security.hasOwnProperty(item_index)) {
            continue;
          }
          let item = output_security[item_index];
          if (!!item.key && item.key != 'Biometric') {
            new_output.push(item);
          }
        }
        output_security = new_output;
    }

    let pattern_flag = true;
    if (typeof option != 'undefined' && typeof option['pattern'] != 'undefined' && option['pattern']  === false) {
      pattern_flag = false;
    }

    if (pattern_flag === false) {
        let item_index: any;
        let new_output = [];
        for (item_index in output_security) {
          if (!output_security.hasOwnProperty(item_index)) {
            continue;
          }
          let item = output_security[item_index];
          if (!!item.key && item.key != 'Pattern') {
            new_output.push(item);
          }
        }
        output_security = new_output;
    }

    // Default Security modify
    let output = this.getDefaultSecurity(output_security);
    return output;
  }

  /**
   * 預設值選擇(請不要clon物件！！！！！)
   * @param output_security
   */
  getDefaultSecurity(output_security) {
    let selectSecurityType: any = null;

    let allow_security = this.auth.getAllowSecurity();
    let df_security = '';
    if (!!allow_security.default) {
      df_security = allow_security.default;
    }
    let df_obj = (this.localStorage.get('defaultType') !== null && this.localStorage.get('defaultType') !== '')
                        ? JSON.parse(this.localStorage.get('defaultType')) : null;
    if (!!df_obj && !!df_obj['key']) {
      df_security = df_obj['key'];
    }
    let have_bio;
    if (!!df_security) {
      let tk: any;
      for (tk in output_security) {
        if (!!output_security[tk]) {
          let tmp_security = this._formateService.checkField(output_security[tk], 'securityType');
          if (tmp_security == '4') {
            have_bio = tk;
          }
          if (tmp_security == df_security ) {
            selectSecurityType = output_security[tk];
            break;
          }
        }
      }
    }
    if (!selectSecurityType && output_security.length > 0 && !!output_security[0]) {
      selectSecurityType = output_security[0];
    }
    if (typeof have_bio != 'undefined' && !!output_security[have_bio]) {
      //  強制快速交易
      selectSecurityType = output_security[have_bio];
    }

    let output = {
      // allow
      securityTypes: output_security,
      // default
      selectSecurityType: selectSecurityType
    };
    return output;
  }

  /**
   * 檢查安控機制
   */
  checkSecuritySelect(selectSecurityType) {
    let output = {
      status: false,
      title: 'ERROR.TITLE',
      msg: 'EPAY.ERROR.NO_SECURITY', // 您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。
      type: 'dialog'
    };
    if (!selectSecurityType || !selectSecurityType.key) {
      output.msg = 'TRANS_SECURITY.CHECK.EMPTY'; // 請選擇目前您的轉帳機制。
      return output;
    }
    if (selectSecurityType.key === 'NONSET' && !this.auth.checkDownloadCA()) {
      output.msg = 'EPAY.ERROR.NO_SECURITY'; // 您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。
      return output;
    }

    output.status = true;
    output.msg = '';
    return output;
  }


  /**
   * 銷帳編號檢核
   */
  checkNoticeNbr(noticeNbr: string) {
    if (noticeNbr == '10000000000000000') {
      noticeNbr = '9999999999999999';
    }
    return noticeNbr;
  }

  /**
   * 檢查物件 (epay轉換)
   * @param set_data
   * @param set_key
   */
  checkIsEmpty(set_data, set_key: string) {
    let output: any;
    let check_data = this._formateService.checkObjectList(set_data, set_key);
    if (!!check_data) {
      if (typeof check_data != 'object' && check_data != '[object Object]') {
        output = check_data;
      }
    }
    return output;
  }



}
