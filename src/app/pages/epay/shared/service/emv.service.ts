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
import { logger } from '@shared/util/log-util';
@Injectable()

export class EmvService {
  PayType: any;
  emv = '0';
  returnObj: any;
  isTwpay: any;
  trnsfrOutCard: any;
  trnsfrOutCardType: any;
  fq000102Res: any;
  hasCards: any;
  securityServices: any;
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
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private handleError: HandleErrorService,
    private navigator: NavgatorService,
    private fh000203: FH000203ApiService,
    private check_security: CheckSecurityService,
    private biometricService: BiometricService,
    private scan: QrcodeService
  ) { }



  /**
    * 依安控機制取得相關資訊
    */
  getSecurityInfo(stepObj, securityType: any): Promise<any> {
    const end_data = {
      lock: false,
      data: {},
      msg: ''
    };
    logger.error('stepObj', stepObj);

    return new Promise((resolve, reject) => {
      let reqData = new FH000203ReqBody();
      return this.fh000203.send(reqData).then(
        (res) => {
          logger.error('res 477', securityType,res);

          if (securityType.key == 'NONSET') {	// NonSet憑證交易
            // 取得trnsToken
            stepObj.securityType = '2';
            // stepObj.signText.trnsToken = res.data;
            logger.error('stepObj', stepObj);
            this.check_security.doSecurityNextStep(stepObj).then(
              // tslint:disable-next-line: no-shadowed-variable
              res => {
                res.responseObj = stepObj;
                resolve(res);
              },
              error => {
                logger.error('errrrrrrrrrr');
                reject(error);
              }
            );
          } else if (securityType.key === 'OTP') {
            // 取得trnsToken
            stepObj.securityType = '3';
            stepObj.signText.trnsToken = res.data;
            if (stepObj.serviceId == 'FQ000105') {
              stepObj.signText.depositMoney = stepObj.signText.trnsAmount / 100;
            } else if (stepObj.serviceId == 'BI000101') {
              stepObj.signText.depositMoney = 0;
            } else if (stepObj.serviceId == 'FQ000107') {
              stepObj.signText.depositMoney = stepObj.signText.txnAmt / 100;
            } else if (stepObj.serviceId == 'FQ000117') {
              stepObj.signText.depositMoney = stepObj.signText.txnAmt / 100;
            } else if (stepObj.serviceId == 'FQ000110') {
              stepObj.signText.depositMoney = stepObj.signText.trnsfrAmount;
              if (stepObj.signText.trnsfrInAcct.length >= 4) {
                stepObj.signText.depositNumber = stepObj.signText.trnsfrInAcct.substr(-4, 4);
              }
            } else if (stepObj.serviceId == 'FQ000111') {
              stepObj.signText.depositMoney = stepObj.signText.trnsfrAmount;
              if (stepObj.signText.trnsfrOutAcct.length >= 4) {
                stepObj.signText.depositNumber = stepObj.signText.trnsfrOutAcct.substr(-4, 4);
              }
            } else if (stepObj.serviceId == 'FQ000302') {

              stepObj.signText.depositMoney = 0;
              if (stepObj.signText.trnsfrOutAcct.length >= 4) {
                stepObj.signText.depositNumber = stepObj.signText.trnsfrOutAcct.substr(-4, 4);
              }


            } else if (stepObj.serviceId == 'FQ000202') {
              stepObj.signText.depositMoney = stepObj.signText.trnsAmountStr;
            } else if (stepObj.serviceId == 'FQ000106') {
              stepObj.signText.depositMoney = stepObj.signText.trnsfrAmount;
            } else if (stepObj.serviceId == 'FQ000421') {
              stepObj.signText.depositMoney = 0;
              // localStorage.setItem('outbound', 'FQ000421');
            } else if (stepObj.serviceId == 'FQ000113') {
              stepObj.signText.depositMoney = 0;
              stepObj.signText.depositNumber='0000';
            } else if (stepObj.serviceId == 'FQ000114') {
              stepObj.signText.depositMoney = 0;
            }
            stepObj.signText.OutCurr = 'TWD';
            //設定otp值

            stepObj.otpObj.custId = this.auth.getUserInfo().custId;
            stepObj.otpObj.fnctId = stepObj.serviceId;
            stepObj.otpObj.depositNumber = stepObj.signText.depositNumber; //Check-security.service OTP檢核欄位為 otpObj
            stepObj.otpObj.depositMoney = stepObj.signText.depositMoney; //Check-security.service OTP檢核欄位為 otpObj
            stepObj.otpObj.OutCurr = stepObj.signText.OutCurr; //Check-security.service OTP檢核欄位為 otpObj
            stepObj.otpObj.transTypeDesc = '';


            this.check_security.doSecurityNextStep(stepObj).then(
              // tslint:disable-next-line: no-shadowed-variable
              (res) => {
                logger.error('res 546', res);
                res.responseObj = stepObj;
                resolve(res);
              },
              (err) => {
                logger.error('err', err);
                if (!!err.ERROR) {
                  reject(err.ERROR);
                } else {
                  reject(err);
                }
              });
          } else if (securityType.key == 'SSL') {
            // 取得trnsToken
            stepObj.securityType = '1';
            stepObj.signText.trnsToken = res.data;
            this.check_security.doSecurityNextStep(stepObj).then(
              // tslint:disable-next-line: no-shadowed-variable
              res => {
                res.responseObj = stepObj;
                resolve(res);
              }
            ).catch(err => reject(err));
          } else if (securityType.key == 'Biometric') { // NonSet憑證交易
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
            // 取得trnsToken
            stepObj.securityType = '4';
            stepObj.signText.trnsToken = res.data;
            // 取得Body的XML
            this.check_security.getXmlBody(stepObj.serviceId, stepObj.signText)
              .then(text => {
                // 做加密回傳
                // rquId + XMLbpdy本文
                let SignText = text[0] + text[1];
                let txData = this.auth.userInfo.custId + this.auth.userInfo.userId.toUpperCase();
                logger.debug('SignText', SignText);
                this.biometricService.requestBioService('請將您的指紋置於感應區域上', txData)
                  .then(resObj => {
                    this.resultObj.headerObj = {
                      rquId: text[0],
                      SecurityType: stepObj.securityType,
                      signature: resObj.mac_value, // 簽章值
                      plainText: SignText, // 憑證CN
                    };
                    this.resultObj['responseObj'] = stepObj;
                    resolve(this.resultObj);
                  })
                  .catch(err => reject(err));
              })
              .catch(err => reject(err));
          }
        });
    });
  }

  
}
