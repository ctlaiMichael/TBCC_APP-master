/**
 * 安控機制選項
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Injectable()
export class SelectSecurityService {
    /**
     * 參數處理
     */
    // 安控設定值 可改為設定檔
    securityList = {
        1: { name: 'SSL', securityType: '1', status: true, popObj: { message: '', showPopup: false } },
        2: { name: '憑證', securityType: '2', status: true, popObj: { message: '', showPopup: false } },
        3: { name: 'OTP', securityType: '3', status: true, popObj: { message: '', showPopup: false } },
        4: { name: '生物辨識', securityType: '4', status: false, popObj: { message: '', showPopup: false } }
    };
    userInfo: any;
    constructor(
        private _logger: Logger,
        private certService: CertService,
        private confirm: ConfirmService,
        private navgator: NavgatorService,
        private alert: AlertService,
    ) { }
    // 比對顯示可用安控機制
    doSelectOption(userInfo, transactionObj) {

        let canUseOption = []; // 顯示的安控項目
        let optionIndex = []; // 紀錄項目index
        let transSecurity = []; // 類型安控預設機制
        let customAuth = false;
        if (transactionObj.hasOwnProperty('customAuth')
            && !!(transactionObj['customAuth'] instanceof Array)
            && transactionObj['customAuth'].length > 0) {
            customAuth = true;
        }

        this.userInfo = userInfo;
        if (this.checkObj(userInfo, 'CategorySecuritys')
            && !!userInfo['CategorySecuritys']) {
            // 取得交易類別物件
            let authSecurity = this.userInfo.AuthType.split(',');
            let categorySecurity = this.userInfo['CategorySecuritys']['CategorySecurity'];

            // 根據交易類型取得對應的ARRAY順序
            let arrayCategoryId = (parseInt(transactionObj.categoryId, 10) - 1);
            // 根據轉入帳號違約轉非約轉取得設定安控機制

            if (!customAuth) {
                // 非指定交易權限
                if (transactionObj.transAccountType === '1') {
                    if (categorySecurity[arrayCategoryId]['DtxisSecurityOpen'] !== null) {
                        transSecurity = categorySecurity[arrayCategoryId]['DtxisSecurityOpen'].split(',');
                    }
                } else if (transactionObj.transAccountType === '2') {
                    if (categorySecurity[arrayCategoryId]['NdtxisSecurityOpen'] !== null) {
                        transSecurity = categorySecurity[arrayCategoryId]['NdtxisSecurityOpen'].split(',');
                    }
                }
            } else {
                // 客製交易權限
                transSecurity = transactionObj['customAuth'];
            }
            // 比對使用者與交易安控
            authSecurity.map(
                (val) => {
                  
                    val = val.toString();
                    // user 可用安控有在交易安控中
                    if (transSecurity.indexOf(val) > -1) {
                        this.checkOptionStatus(val);
                        if (this.securityList[val].status || this.securityList[val].popObj.showPopup) {
                            canUseOption.push(this.securityList[val]);
                            optionIndex.push(val);
                        }

                    }
                }
            );

        }
        // 如果有預設安控機制權限移至第一個順位
        let defaultIndex = optionIndex.indexOf(this.userInfo.DefAuthType);
        if (defaultIndex > -1) {
            let movedata = canUseOption[defaultIndex];
            canUseOption.splice(defaultIndex, 1);
            canUseOption.splice(0, 0, movedata);
        }

        optionIndex = [];
        let returnData = [canUseOption, this.securityList, transSecurity];

        return returnData;

    }

    checkObj(obj, index) {
        if (obj.hasOwnProperty(index)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 
     * @param Obj 
     * btnYesTitle
     * btnNoTitle
     * navgator
     * type ='confirm || alert'
     */
    checkSecurityErrorPopup(Obj) {
        if (!Obj.status && Obj.popObj.showPopup) {

            if (Obj.popObj.hasOwnProperty('type') && Obj.popObj['type'] === 'confirm') {
                let optionObj: any = {
                    title: Obj.popObj.hasOwnProperty('title') ? Obj.popObj['title'] : 'ERROR.INFO_TITLE',
                    btnYesTitle: Obj.popObj.hasOwnProperty('btnYesTitle') ? Obj.popObj['btnYesTitle'] : '確定',
                    btnNoTitle: Obj.popObj.hasOwnProperty('btnNoTitle') ? Obj.popObj['btnNoTitle'] : '取消'
                };
                this.confirm.show(Obj.popObj.message, optionObj).then(
                    (res) => {
                        if (Obj.popObj.hasOwnProperty('navgate')) {
                            this.navgator.push(Obj.popObj.navgate, {});
                        }
                    },
                    (error) => {
                        // _this.checkWarnMsg(data101);

                    });

            } else {
                this.alert.show(Obj.popObj.message).then(
                    (res) => {
                        // _this.navgator.push('home', {}); 
                    });

            }
            return false;
        }
        return true;


    }

    checkOptionStatus(type) {
        switch (type) {
            case '1':
                this.securityList[1].status = true;
                this.securityList[1].popObj.message = '';
                break;
            case '2':  // 憑證
                if ((this.userInfo.hasOwnProperty('cn') && this.userInfo.cn !== '')
                    && (this.userInfo.hasOwnProperty('serialNumber') && this.userInfo.serialNumber !== '')
                ) {
                    this.securityList[2].status = true;
                    this.securityList[2].popObj.message = '';
                } else {
                    this.securityList[2].status = false;
                    this.securityList[2].popObj.message = '無可使用的憑證，請洽各分行櫃檯辦理憑證';
                }
                break;
            case '3':  // OTP
                // error文案暫寫
                // 簡訊密碼申請狀態 1：未申請 2：已申請
                this.securityList[3].status = false;
                this.securityList[3].popObj.showPopup = true;
                if (this.userInfo.BoundID !== '4') {
                    this.securityList[3].popObj['type'] = 'confirm';
                    this.securityList[3].popObj['btnYesTitle'] = '立刻啟用';
                    this.securityList[3].popObj['btnNoTitle'] = '稍後啟用';
                    this.securityList[3].popObj['title'] = 'ERROR.INFO_TITLE';
                    this.securityList[3].popObj['navgate'] = 'device-bind';
                    this.securityList[3].popObj.message = '您的裝置尚未啟用認證完成，使用OTP進行交易必須啟用裝置認證。如欲啟用裝置認證，請您至行動網銀裝置綁定服務進行啟用裝置認證作業。';
                    break;
                }
                if (this.userInfo.OTPID === '1') {
                    this.securityList[3].popObj.message = 'OTP簡訊密碼尚未申請';
                    break;
                }
                // 事故狀態 1:停止 空白:未申請OTP
                if (this.userInfo.OtpSttsInfo.AuthStatus === '1') {
                    this.securityList[3].popObj.message = 'OTP已停止';
                    break;
                }
                if (this.userInfo.OtpSttsInfo.AuthStatus === '') {
                    this.securityList[3].popObj.message = '尚未申請OTP';
                    break;
                }
                // 密碼狀態  1:鎖定 空白:未申請OTP
                if (this.userInfo.OtpSttsInfo.PwdStatus === '1') {
                    this.securityList[3].popObj.message = 'OTP密碼已鎖定';
                    break;
                }
                if (this.userInfo.OtpSttsInfo.PwdStatus === '') {
                    this.securityList[3].popObj.message = '尚未申請OTP密碼';
                    break;
                }
                this.securityList[3].status = true;
                this.securityList[3].popObj.message = '';
                break;
        }
    }

}


