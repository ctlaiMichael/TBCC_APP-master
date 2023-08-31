/**
 * 安控機制選項邏輯處理
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
// 數位信封加密 || 憑證簽章 介面 plugin 
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';
import { EmptyUtil } from '@shared/util/formate/string/empty-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { DeviceService } from '@lib/plugins/device.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { Base64Util } from '@shared/util/formate/modify/base64-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { F1000105ApiService } from '@api/f1/f1000105/f1000105-api.service';
import { CacheService } from '@core/system/cache/cache.service';



@Injectable()

export class A11yOtpSecurityService {
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
    otpObj: any;
    constructor(
        private _logger: Logger,
        private _tcbb: TcbbService,
        public _authService: AuthService,
		private _localStorage: LocalStorageService,
		private _deviceInfo: DeviceService,
		private _crypto: CryptoService,
        private handleError: HandleErrorService,
        private confirm: ConfirmService,
        private f1000105: F1000105ApiService
    ) { }

    public checkOTPauth(){
        let checkObj = {
            status:true,
            error:{
                message :'不允許OTP交易',
                content : '不允許OTP交易',
                type : 'message'
            }
        };
        if (!this._authService.checkSecurityOtp()) {
          
            checkObj.status = false;
        }
        return checkObj;
    }


    public sendOtpApi(req): Promise<any> {
        return new Promise((resolve, reject) => {
            if (req.hasOwnProperty('OutCurr') && req.hasOwnProperty('depositMoney') && req.hasOwnProperty('depositNumber')) {
                req['custId']= this._authService.getCustId();
            
                this.f1000105.send(req).then(
                    (f1000105res) => {
                        this._logger.log('105S', f1000105res);
                        resolve(f1000105res);
            
                    },(f1000105_error) => {                    
                        reject(f1000105_error);
                    }
                );

                   
            
            }else {
                this.resultObj.ERROR.status = false;
                this.resultObj.ERROR.message = '參數錯誤';
                this.resultObj.ERROR.content = '參數錯誤';
                this.resultObj.ERROR.type = 'message';
                    reject(this.resultObj.ERROR);
            }
        });
      }
    

    combindOtpHeader(otpObj): Promise<any> {
        // 檢核
        logger.error('into doSecurityNextStep, stepObj:', otpObj);
        this.otpObj = otpObj;
        this.resultObj.ca_protective_code = '';

        if (this.otpObj.hasOwnProperty('serviceId')) {
            // 轉小寫 不然憑證驗章會錯
            this.otpObj.serviceId = this.otpObj.serviceId.toLowerCase();
        }
        // let showCaptcha = false;
        // if (this.otpObj.hasOwnProperty('showCaptcha')) {
        //     showCaptcha = this.otpObj.showCaptcha;
        // }

        return new Promise((resolve, reject) => {
                // OTP
               logger.error('Epay','Security', 'otp', this.otpObj);
                // 欄位參數檢核

                this.do_crypto(otpObj['OTP_val'].toString()).then(
                    (crypto_S) => {
                        console.log('SecurityS',crypto_S);
                        this._logger.step('Security S2', crypto_S);
                        this.resultObj.ERROR.status = true;
                        this.resultObj.headerObj = {
                            SecurityType: '3',
                            SecurityPassword: crypto_S,
                            Acctoken: otpObj['accessToken']
                        };
                        // this.resultObj.Acctoken = S['accessToken'];
                        resolve(this.resultObj);
                    }, (crypto_F) => {
                        console.log('SecurityF',crypto_F);
                        this._logger.step('Security F2', crypto_F);
                        // error handle popup 加密失敗
                        reject(crypto_F);
                    }
                );


                  

        });

    }

  

    do_crypto(cryptoStr: string): Promise<any> {

        return new Promise((resolve, reject) => {
            console.log('do_crypto',cryptoStr);
            this._authService.digitalEnvelop(cryptoStr).then(
                (S) => {
                    console.log('加密成功回傳',S);
                    logger.error('加密成功回傳',S)
                    // 加密成功回傳
                    if (S.value) {
                        this.resultObj.ERROR.status = true;
                        // this.resultObj.SecurityType = this.stepObj.securityType;
                        // this.resultObj.SecurityPassword = S.value;
                        // this.resultObj.Signature = '';
                        // this.resultObj.cn = '';
                        // this.resultObj.certSN = '';
                        // this.resultObj.rquId = '';
                        // this.resultObj.Acctoken = '';
                    }
                    resolve(S.value);
                }, (F) => {
                    console.log('加密錯誤',F);
                    logger.error('加密錯誤',F)
                    // 加密錯誤
                    this.resultObj.ERROR.status = false;
                    this.resultObj.ERROR.title = '';
                    this.resultObj.ERROR.content = '加密錯誤';
                    this.resultObj.ERROR.message = '加密錯誤';
                    reject(this.resultObj);
                }
            );
        });
    }

   
   
}


