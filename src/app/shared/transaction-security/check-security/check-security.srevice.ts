/**
 * 安控機制選項邏輯處理
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
// 數位信封加密 || 憑證簽章 介面 plugin 
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { AuthService } from '@core/auth/auth.service';
import { CaService } from '../ca-popup/ca.service';
import { OtpService } from '../otp-popup/otp.service';
import { logger } from '@shared/util/log-util';
import { EmptyUtil } from '@shared/util/formate/string/empty-util';
import { PatternService } from '../pattern-popup/pattern.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { DeviceService } from '@lib/plugins/device.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { Base64Util } from '@shared/util/formate/modify/base64-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CacheService } from '@core/system/cache/cache.service';



@Injectable()

export class CheckSecurityService {
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
    stepObj: any;
	maxPatterLockError: number = 5; // 圖形鎖最多錯誤次數
    constructor(
        private _logger: Logger,
        private _tcbb: TcbbService,
        private _certService: CertService,
        public _authService: AuthService,
        private _caService: CaService,
        private _otpService: OtpService,
		private _patternService: PatternService,
		private _localStorage: LocalStorageService,
		private _deviceInfo: DeviceService,
		private _crypto: CryptoService,
        private handleError: HandleErrorService
        , private confirm: ConfirmService
		, private cacheService: CacheService
    ) { }

    doSecurityNextStep(stepObj): Promise<any> {
        logger.error('into doSecurityNextStep, stepObj:', stepObj);
        this.stepObj = stepObj;
        this.resultObj.ca_protective_code = '';
        if (this.stepObj.hasOwnProperty('serviceId')) {
            // 轉小寫 不然憑證驗章會錯
            this.stepObj.serviceId = this.stepObj.serviceId.toLowerCase();
        }
        let showCaptcha = false;
        if (this.stepObj.hasOwnProperty('showCaptcha')) {
            showCaptcha = this.stepObj.showCaptcha;
        }

        return new Promise((resolve, reject) => {
            if (this.stepObj.securityType === '1') {
                // SSL 加密
                this.do_crypto('SSL', this.stepObj.SSL_val).then(
                    (S) => {
                        this._logger.step('Security', S);
                        this.resultObj.headerObj = {
                            SecurityType: this.stepObj.securityType,
                            SecurityPassword: S
                        };
                        resolve(this.resultObj);
                    }, (F) => {
                        reject(F);
                    }
                );
            } else if (
                this.stepObj.securityType === '2'
                && (this.stepObj.hasOwnProperty('signText') && this.stepObj.signText)) {
                // CA
                // [TODO:]LOCK
                if (this._tcbb.checkCertLock()) {
                    logger.log('lockCheck');
                    let option = {
                        type: 'dialog',
                        title: 'ERROR.INFO_TITLE',
                        msg: '憑證已被鎖'
                    };
                    this.handleError.handleError(option).then(
                        () => {
                            reject(option);
                        }
                    );
                    return false;
                }

                return this._caService.show('', { transAccountType: this.stepObj.transAccountType, showCaptcha:showCaptcha }).then(
                    (S) => {
                        this._logger.step('Security', this.stepObj);
                        let signText = this.stepObj.signText;
                        if (S['CA_val']) {
                            // 組成憑證本文
                            this.getXmlBody(this.stepObj.serviceId, signText).then(
                                (text) => {
                                    // 做加密回傳
                                    // rquId + XMLbody本文
                                    let SignText = text[0] + text[1];
                                    this._logger.step('Security', "SignText", SignText);
                                    // 取得憑證資訊
                                    let userInfo = this._authService.getUserInfo();
                                    if (userInfo.hasOwnProperty('cn') && userInfo.cn) {
                                        // 取得CN
                                        this._tcbb.doCGUMethod('PureSign', S['CA_val'], SignText).then(
                                            (PureSignData) => {
                                                this._logger.step('Security', "本文簽章SignText", PureSignData);
                                                this.resultObj.ERROR.status = true;
                                                this.resultObj.ca_protective_code = S['CA_val'];
                                                this.resultObj.headerObj = {
                                                    rquId: text[0],
                                                    SecurityType: this.stepObj.securityType,
                                                    plainText: SignText,
                                                    signature: PureSignData.value, // 簽章值
                                                    cn: userInfo.cn, // 憑證CN
                                                    certSN: userInfo.serialNumber // 憑證序號
                                                };
                                                resolve(this.resultObj);
                                            }, (F3) => {
                                                if (typeof F3['plugin_back_type'] != 'undefined'
                                                    &&  F3['plugin_back_type'] == 'success_method'
                                                ) {
                                                    let option = {
                                                        title: F3.hasOwnProperty('title') ? F3['title'] : 'ERROR.INFO_TITLE',
                                                        btnYesTitle: F3.hasOwnProperty('btnYesTitle') ? F3['btnYesTitle'] : '重新輸入',
                                                        btnNoTitle: F3.hasOwnProperty('btnNoTitle') ? F3['btnNoTitle'] : 'BTN.CANCEL'
                                                    };
                                                    this.handleError.handleError({
                                                        type: 'alert',
                                                        title: option.title,
                                                        content: F3.msg
                                                    }).then(
                                                        (res) => {
                                                            // _this.checkWarnMsg(data101);
                                                            reject(F3);
                                                            return false;
                                                        });
                                                    // this.confirm.show(F3.msg, option).then(
                                                    //     (res) => {
                                                    //         this.doSecurityNextStep(stepObj);
                                                    //     },
                                                    //     (error) => {
                                                    //         // _this.checkWarnMsg(data101);
                                                    //         reject(F3);
                                                    //         return false;
                                                    //     });

                                                } else {
                                                    // 原機制
                                                    reject(F3);
                                                }
                                            }
                                        );
                                    } else {
                                        let ERROR = {
                                            'message': '無法取得憑證資訊',
                                            'content': '無法取得憑證資訊',
                                            'type': 'message',
                                            'status': false
                                        };
                                        reject(ERROR);
                                    }

                                }, (F2) => {
                                    reject(F2);
                                }
                            );
                        }
                    },
                    (F) => {
                        this._logger.step('Security', "F", F);
                        reject(F);
                    }
                );

            } else if (this.stepObj.securityType === '3') {
                // OTP
               logger.error('Epay','Security', 'otp', this.stepObj);
                // 欄位參數檢核

                if (!this._authService.checkSecurityOtp()) {
                    this.resultObj.ERROR.status = false;
                    this.resultObj.ERROR.message = '不允許OTP交易';
                    this.resultObj.ERROR.content = '不允許OTP交易';
                    this.resultObj.ERROR.type = 'message';
                    reject(this.resultObj);
                    return false;
                }


                if (this.stepObj.hasOwnProperty('otpObj')
                    && this.stepObj.otpObj.hasOwnProperty('OutCurr')
                    && this.stepObj.otpObj.hasOwnProperty('depositMoney')
                    && this.stepObj.otpObj.hasOwnProperty('depositNumber')
                ) {
                    // 有正常參數
                    this._otpService.show('', { reqData: this.stepObj.otpObj, transAccountType: this.stepObj.transAccountType, showCaptcha:showCaptcha }).then(
                        (S) => {
                            this._logger.step('Security', S);
                            // OTP 確認發電文
                            if (S.hasOwnProperty('OTP_val') && S.hasOwnProperty('accessToken')) {
                                this.do_crypto('OTP', S['OTP_val']).then(
                                    (S2) => {
                                        this._logger.step('Security S2', S2);
                                        this.resultObj.ERROR.status = true;
                                        this.resultObj.headerObj = {
                                            SecurityType: this.stepObj.securityType,
                                            SecurityPassword: S2,
                                            Acctoken: S['accessToken']
                                        };
                                        // this.resultObj.Acctoken = S['accessToken'];
                                        resolve(this.resultObj);
                                    }, (F2) => {
                                        this._logger.step('Security F2', F2);
                                        // error handle popup 加密失敗
                                        reject(F2);
                                    }
                                );

                            } else {
                                // error handle popup 發送電文無指定參數
                                this.resultObj.ERROR.status = false;
                                this.resultObj.ERROR.message = '回傳電文參數錯誤';
                                this.resultObj.ERROR.content = '回傳電文參數錯誤';
                                this.resultObj.ERROR.type = 'message';
                                reject(this.resultObj);
                            }

                        }, (F) => {
                            // alert('F:' + JSON.stringify(F));
                            this._logger.step('Security', 'F', F);
                            reject(F);
                        }
                    );
                } else {
                    this.resultObj.ERROR.status = false;
                    this.resultObj.ERROR.message = '參數錯誤';
                    this.resultObj.ERROR.content = '參數錯誤';
                    this.resultObj.ERROR.type = 'message';
                    reject(this.resultObj);
                }

			  } else if (
				this.stepObj.securityType === '5'
				&& (this.stepObj.hasOwnProperty('signText') && this.stepObj.signText)) {
				// Pattern
				logger.error('Security', 'Pattern', this.stepObj);

				return this._patternService.show('', {}).then(
				  (S) => {
					this._logger.step('Security', 'Pattern S', S);
					let pattenMAC = '';
					if (S['Pattern_val']) {
					  this.getPatternMac(S['Pattern_val'])
						.then((obj) => {
						  // this._logger.step('Security', 'getPatternMac obj', obj);
						  pattenMAC = obj;
						  return this.keepPatternLock(pattenMAC);
						})
						.then((keepPatternLockRes) => {
						  let tmpKeepPatternLock = this._localStorage.getObj('keepPatternLock');
						  let tempRem = this._localStorage.getObj('Remember');
						  // logger.error('Security', 'keep Pattern', tmpKeepPatternLock);
						  // logger.error('Security', 'now  Pattern', keepPatternLockRes);
						  if (Number(tempRem.ftlogin.patterLoginErrorCount) < Number(this.maxPatterLockError)) {
							// tslint:disable-next-line:max-line-length
							if (!!tmpKeepPatternLock && tmpKeepPatternLock !== '' && (tmpKeepPatternLock !== keepPatternLockRes)) {
							  logger.error('Security', 'Pattern', 'tmpKeepPatternLock !== keepPatternLockRes');
							  // tslint:disable-next-line:max-line-length
							  tempRem.ftlogin.patterLoginErrorCount = (Number(tempRem.ftlogin.patterLoginErrorCount) + 1).toString();
							  if (Number(tempRem.ftlogin.patterLoginErrorCount) < 5) {
								this._localStorage.setObj('Remember', tempRem);
								// 您輸入的圖形密碼錯誤，如錯誤累積五次將自動解除圖形密碼綁定。
								let ERROR = {
								  'message': 'ERROR.LOGIN.PATTERN_ERROR',
								  'content': 'ERROR.LOGIN.PATTERN_ERROR',
								  'type': 'dialog',
								  'status': false
								};
								return Promise.reject(ERROR);
							  } else {
								// epay cache強制清除
								this.cacheService.removeGroup('epay-security');
								this.patternDisable(tempRem);
								// 您輸入密碼的錯誤次數已達五次，系統將解除您的圖形密碼綁定，請改用一般登入。
								let ERROR = {
								  'message': 'ERROR.LOGIN.PATTERN_DISABLE',
								  'content': 'ERROR.LOGIN.PATTERN_DISABLE',
								  'type': 'dialog',
								  'status': false
								};
								return Promise.reject(ERROR);
							  }
							} else {
							  logger.error('Security', 'Pattern', 'tmpKeepPatternLock === keepPatternLockRes');
							  tempRem.ftlogin.patterLoginErrorCount = '0';
							  this._localStorage.setObj('Remember', tempRem);
							  return this.getXmlBody(this.stepObj.serviceId, this.stepObj.signText);
							}
						  } else {
							this.patternDisable(tempRem);
							// 您輸入密碼的錯誤次數已達五次，系統將解除您的圖形密碼綁定，請改用一般登入。
							let ERROR = {
							  'message': 'ERROR.LOGIN.PATTERN_DISABLE',
							  'content': 'ERROR.LOGIN.PATTERN_DISABLE',
							  'type': 'dialog',
							  'status': false
							};
							return Promise.reject(ERROR);
						  }
						})
						.then((text) => {
						  this._logger.step('Security', 'Pattern text', JSON.stringify(text));
						  // pattenMAC + rquId + XMLbpdy本文
						  let SignText = pattenMAC + text[0] + text[1];
						  this._logger.step('Security', 'Pattern SignText', SignText);
						  this._authService.digitalEnvelop(SignText).then((digitalEnvelopeRes) => {
							let resultObj = {
							  headerObj: {
								rquId: text[0],
								plainText: '', // 憑證CN
								SecurityType: this.stepObj.securityType,
								signature: digitalEnvelopeRes.value, // 簽章值
								cn: '',
								certSN: ''
							  }
							};
							resolve(resultObj);
						  });
						})
						.catch(err => reject(err));
					}
				  },
				  (F) => {
					this._logger.step('Security', 'Pattern F', F);
					reject(F);
				  }
				);

			  }
        });


    }

    /**
     * 產生加密過後的header
     * @param stepObj
     * @param protectCode 憑證保護密碼
     */
    do_generate_header(stepObj, protectCode: string): Promise<any> {
        this.stepObj = stepObj;
        this.resultObj.ca_protective_code = '';
        if (this.stepObj.hasOwnProperty('serviceId')) {
            // 轉小寫 不然憑證驗章會錯
            this.stepObj.serviceId = this.stepObj.serviceId.toLowerCase();
        }
        return new Promise((resolve, reject) => {
            if (this.stepObj.securityType === '2' && !!this.stepObj.signText) {    // CA
                this.getXmlBody(this.stepObj.serviceId, this.stepObj.signText).then(
                    (text) => {
                        let signText = text[0] + text[1];
                        let userInfo = this._authService.getUserInfo();
                        if (userInfo.hasOwnProperty('cn') && userInfo.cn && userInfo.hasOwnProperty('serialNumber') && userInfo.serialNumber) {
                            this._tcbb.doCGUMethod('PureSign', protectCode, signText).then(
                                (pureSignData) => {
                                    this._logger.step('Security', "本文簽章SignText", pureSignData);
                                    this.resultObj.ERROR.status = true;
                                    this.resultObj.ca_protective_code = protectCode;
                                    this.resultObj.headerObj = {
                                        rquId: text[0],
                                        SecurityType: this.stepObj.securityType,
                                        signature: pureSignData.value, // 簽章值
                                        cn: userInfo.cn, // 憑證CN
                                        certSN: userInfo.serialNumber // 憑證序號
                                    };
                                    resolve(this.resultObj.headerObj);
                                }, (error) => {
                                    // 簽章失敗
                                    // this.resultObj.ERROR.message = "簽章失敗";
                                    // this.resultObj.ERROR.content = "簽章失敗";
                                    // this.resultObj.ERROR.type = "message";
                                    // this.resultObj.ERROR.status = false;
                                    reject(error);
                                })
                        }
                    }
                ).catch(
                    (resultObj) => {
                        reject(resultObj);
                    })
            } else {
                reject('驗證模式錯誤或reqBody為空');
            }
        });
    }


    do_crypto(type: string, cryptoStr: string): Promise<any> {

        if (type === 'SSL') {
            cryptoStr = this.padRight(cryptoStr, 16);
        } else if (type === 'OTP') {
		} else if (type === 'Pattern') {

        } else if (type === 'CA') { }


        return new Promise((resolve, reject) => {
            this._authService.digitalEnvelop(cryptoStr).then(
                (S) => {
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

    padRight(str, length) {
        let strLength = str.length;
        let newStr = str;
        if (length > strLength) {
            let addTimes = (length - strLength);
            for (let i = 0; i < addTimes; i++) {
                newStr = newStr + ' ';
            }
            return newStr;
        } else {
            return str;
        }
    }


    getXmlBody(serviceId, form): Promise<any> {
        return new Promise((resolve, reject) => {
            // let signText = serviceId + xmlBody;
            let reqId = this.getRquId(serviceId);
            this._logger.step('Security', 'reqId', reqId);
            let xml = this.getXML(serviceId, form);
            let xmlBody = xml.substring(xml.indexOf('<co:body'), xml.indexOf('</co:MNBRequest>'));

            if (xmlBody !== '' && xmlBody !== null && xmlBody !== undefined) {
                this._logger.step('Security', 'xmlBody', xmlBody);
                let final_xmlBody = [reqId, xmlBody];
                this._logger.step('Security', 'finalXmlBody', final_xmlBody);

                resolve(final_xmlBody);
            } else {
                //
                this.resultObj.ERROR.status = false;
                this.resultObj.ERROR.message = '憑證本文格式錯誤';
                this.resultObj.ERROR.content = '憑證本文格式錯誤';
                this.resultObj.ERROR.type = 'message';
                reject(this.resultObj);
            }
        });
    }



    /**
	 * [getXML 取得Req電文XML]
	 * @param  {[type]} telegramName [電文名稱]
	 * @param  {[type]} reqBody       [上行電文Body]
	 * @param  {[type]} xmlCallBack       [description]
	 * @return {[type]}              [description]
	 */
    getXML(telegramName, reqBody) {
        let data = reqBody;
        if (typeof reqBody !== 'object') {
            reqBody = {};
        }
        data = this.modifyReqTeltgram(telegramName, data); // 物件轉換TCB_Json格式
        let xml = this.toXML(data); // 轉XML格式
        return xml;
    }

    /// 0422 for ca 本文BODY

    getRquId(serviceId) {
        return this.generateGUID() + '-' + serviceId;
    }

    /**
     * [generateGUID 產出GUID] => reqId不可超出40字元
     * @return {[type]} [description]
     */
    generateGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4();
        // return s4() + s4()  + s4()  + s4() + s4()  + s4() + s4() + s4();
    }

    parseTag(jsonObj) {
        let xml = '';
        for (let tagKey in jsonObj) {
            if (tagKey.indexOf('@') == 0) {
                xml += ' ' + tagKey.replace('@', '') + '="' + jsonObj[tagKey] + '"';
            }
        }

        return xml;
    }

    LF = '';
    // var SP = '        ';
    SP = '\t';
    parseJsonObjToXML(jsonObj, prefix?) {
        let xml = '';
        if (prefix == null) {
            prefix = '';
        }
        for (let key in jsonObj) {
            if (key.indexOf('@') == -1) {
                if (typeof (jsonObj[key]) == 'object' && jsonObj[key] != null && Object.keys(jsonObj[key]).length > 0) {
                    if (Object.prototype.toString.call(jsonObj[key]) === '[object Array]') {
                        this._logger.step('Security', '[object Array]', key, ',', jsonObj[key]);
                        // Array 特殊處理
                        let sub_key;
                        for (sub_key in jsonObj[key]) {
                            this._logger.step('Security', 'sub_key', sub_key);
                            if (typeof jsonObj[key][sub_key] === 'undefined') {
                                continue;
                            }
                            xml += prefix + '<' + key + this.parseTag(jsonObj[key]) + '>' + this.LF;
                            xml += this.parseJsonObjToXML(jsonObj[key][sub_key], prefix + this.SP);
                            xml += prefix + '</' + key + '>' + this.LF;
                            this._logger.step('Security', 'xmlxml', xml);
                        }
                    } else {
                        xml += prefix + '<' + key + this.parseTag(jsonObj[key]) + '>' + this.LF;
                        xml += this.parseJsonObjToXML(jsonObj[key], prefix + this.SP);
                        xml += prefix + '</' + key + '>' + this.LF;
                    }
                } else {
                    //判斷空白or多個空白
                    let trimObj = jsonObj[key];
                    if (jsonObj[key] == null || typeof jsonObj[key] == 'undefined'
                        || (typeof jsonObj[key] == 'object' && Object.keys(jsonObj[key]).length <= 0)
                    ) {
                        trimObj = '';
                    } else {
                        let empty_check = EmptyUtil.done(jsonObj[key], 'all');
                        if (empty_check == '' || empty_check ==' ') {
                            trimObj = '';
                        }
                    }
                    this._logger.step('Security', 'www.else:', prefix, this.LF, this.SP);
                    xml += prefix + '<' + key + '>';
                    xml += trimObj
                    xml += '</' + key + '>' + this.LF;
                }
            }
        }
        return xml;
    }


    
    // parseJsonObjToXML = function (jsonObj, prefix?) {
    //     var xml = '';
    //     if (prefix == null) {
    //         prefix = '';
    //     }
    //     for (var key in jsonObj) {
    //         this._logger.step('Security', 'var key in jsonObj，jsonObj[key]：　', jsonObj[key], Object.prototype.toString.call(jsonObj[key]));
    //         if (key.indexOf('@') == -1) {
    //             if (typeof (jsonObj[key]) == 'object') {
    //                 if (Object.prototype.toString.call(jsonObj[key]) === '[object Array]') {
    //                     this._logger.step('Security', '[object Array]', key, ',', jsonObj[key]);
    //                     // Array 特殊處理
    //                     var sub_key;
    //                     for (sub_key in jsonObj[key]) {
    //                         this._logger.step('Security', 'sub_key',sub_key);
    //                         if (typeof jsonObj[key][sub_key] === 'undefined') {
    //                             continue;
    //                         }
    //                         xml += prefix + '<' + key + this.parseTag(jsonObj[key]) + '>' + this.LF;
    //                         xml += this.parseJsonObjToXML(jsonObj[key][sub_key], prefix + this.SP);
    //                         xml += prefix + '</' + key + '>' + this.LF;
    //                         this._logger.step('Security', 'xmlxml',xml);
    //                     }
    //                 } else {
    //                     xml += prefix + '<' + key + this.parseTag(jsonObj[key]) + '>' + this.LF;
    //                     xml += this.parseJsonObjToXML(jsonObj[key], prefix + this.SP);
    //                     xml += prefix + '</' + key + '>' + this.LF;
    //                 }
    //             } else {
    //                 this._logger.step('Security', 'www.else:', prefix, this.LF, this.SP);
    //                 xml += prefix + '<' + key + '>';
    //                 xml += jsonObj[key];
    //                 xml += '</' + key + '>' + this.LF;
    //             }
    //         }
    //     }
    //     return xml;
    // }
    toXML(jsonObj) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += this.parseJsonObjToXML(jsonObj);
        this._logger.step('Security', 'www.toXML: ', xml);
        return xml;
    }


    /** reqobj 加上特殊格EX 'co:custId':'123123123'
     * [modifyReqTeltgram 修正ReqTelegram]
     * @param  {[type]} serviceId [電文編號]
     * @param  {[type]} jsonObj   [內容]
     * @param  {[type]} jsonObj   [header]
     * @return {[type]}           [description]
     */
    modifyReqTeltgram(serviceId, jsonObj) {
        this._logger.step('Security', 'www.jsonObjjsonObj', jsonObj);
        if (typeof jsonObj !== 'object') {
            jsonObj = {};
        }
        let heq_header = {};
        let heq_body = {
            '@xsi:type': serviceId + 'BodyType'
        };

        let tmp_value, sub_value;

        let tmp_specail_list = ['custId', 'paginator', 'pageSize', 'pageNumber', 'sortColName', 'sortDirection'];
        //==body==//
        for (let key in jsonObj) {

            tmp_value = jsonObj[key];
            this._logger.step('Security', 'tmp_value', key, ':', tmp_value, typeof tmp_value === 'object');
            if (typeof tmp_value === 'object') {
                sub_value = {};

                for (let subkey in tmp_value) {
                    if (tmp_specail_list.indexOf(subkey) > -1) {
                        sub_value['co:' + subkey] = tmp_value[subkey];
                    } else {
                        sub_value[subkey] = tmp_value[subkey];
                    }
                }
                tmp_value = sub_value;
                this._logger.step('Security', 'tmp_value:', tmp_value);
            }
            if (tmp_specail_list.indexOf(key) > -1) {
                key = 'co:' + key;
            }
            heq_body[key] = tmp_value;
        }

        jsonObj = {
            'co:MNBRequest': {
                '@xmlns': 'http://mnb.hitrust.com/service/schema/' + serviceId,
                '@xmlns:co': 'http://mnb.hitrust.com/service/schema',
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'co:reqHeader': heq_header,
                'co:body': heq_body
            }
        };
        // this._logger.step('Security', jsonObj);

        this._logger.step('Security', 'www.jsonObjjsonObj', jsonObj);
        return jsonObj;
    }

    /**
	   * 取得圖形密碼加密字串
	   * @param patternPwd 圖形密碼字串 ex.123654
	   */
	  getPatternMac(patternPwd: string): Promise<string> {
		return this._deviceInfo.devicesInfo().then(
		  (deviceInfo) => {
			// this._logger.step('Security', 'getPatternMac deviceInfo', deviceInfo);
			let custId = this._authService.getCustId();
			// 圖形鎖簽章
			// 1.圖形密碼對映數值序列。
			// 2.Device唯一碼。
			// 3.註冊時間資訊：於註冊流程會存取至APP的localStroage，APP刪除後會消失。目前用秒數
			// 4.custId
			const tempRem = this._localStorage.getObj('Remember');
            // tslint:disable-next-line:max-line-length
            let patternDeviceId = (typeof tempRem.ftlogin.patternDeviceId === 'undefined' || (typeof tempRem.ftlogin.patternDeviceId === 'string' && tempRem.ftlogin.patternDeviceId === '')) ?
                deviceInfo.udid : tempRem.ftlogin.patternDeviceId;
            let signText = patternPwd + patternDeviceId;
			// tslint:disable-next-line:max-line-length
			if (!!tempRem && tempRem.hasOwnProperty('userData') && tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
			  signText = signText + tempRem.ftlogin.patternLockRegisterTime;
			  signText = signText + custId;
			} else {
			  return Promise.reject(null);
			}
			// this._logger.step('Security', 'getPatternMac signText', signText);
			return this._crypto.SHA256(signText)
			  .then((SHA256res) => {
				// this._logger.step('Security', 'getPatternMac SHA256res', SHA256res);
				// this._logger.step('Security', 'getPatternMac Base64Util', Base64Util.encode(SHA256res.value).value);
				return Promise.resolve(Base64Util.encode(SHA256res.value).value);
			  })
			  .catch(err => {
				this.handleError.handleError(err);
				return Promise.reject(err);
			  });
		  }
		);
	  }

	  /**
	   * 圖形密碼base64 > SHA256 > AES_Encrypt
	   * epay使用圖形密碼時比對之用
	   * type==1, 圖形密碼啟用快速登入使用
	   */
	  keepPatternLock(base64Value: string, type?: string): Promise<any> {
		return this._crypto.SHA256(base64Value).then(
		  (toSHA256res) => {
			// this._logger.step('Security', 'keepPatternLock toSHA256res', toSHA256res);
			if (type === '1') {
			  // 圖形密碼啟用快速登入
			  this._localStorage.setObj('keepPatternLock', toSHA256res.value);
			}
			return Promise.resolve(toSHA256res.value);
		  }
		).catch((err) => {
		  logger.debug('keepPatternLock catch err:' + err);
		  return Promise.reject(err);
		});
	  }

	  /**
	   * PATTERN_DISABLE
	   */
	  patternDisable(tempRem: any) {
		logger.error('Security', 'Pattern', 'maxPatterLockError >= 5');
		// 不發取消圖形鎖電文，只更改local storageftlogin (ref:login-page.component.ts)
		tempRem.ftlogin.fastlogin = '0';
		tempRem.ftlogin.hasPatternLock = '0';
		tempRem.ftlogin.type = 'pwdlogin';
		tempRem.ftlogin.patterLoginErrorCount = '0';
		tempRem.ftlogin.payPattern = '0';
        if (typeof tempRem.ftlogin.patternDeviceId === 'undefined') {
            tempRem.ftlogin['patternDeviceId'] = '';
        } else {
            tempRem.ftlogin.patternDeviceId = '';
        }
		delete localStorage['keepPatternLock'];
		this._localStorage.setObj('Remember', tempRem);
	  }
}


