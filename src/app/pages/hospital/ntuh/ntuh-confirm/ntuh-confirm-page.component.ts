/**
 * 台大醫院-繳費確認
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { NtuhPayService } from '@pages/hospital/shared/service/ntuh-pay.service';
import { Logger } from '@core/system/logger/logger.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-ntuh-confirm',
    templateUrl: 'ntuh-confirm-page.component.html',
    styleUrls: [],
    providers: [NtuhPayService]
})

export class NtuhConfirmPageComponent implements OnInit {
    @Input() inputData: any;
    @Input() notPayData: any; //需臨櫃繳
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    isMySelfPayment = ''; //本人、非本人
    info_data: any = {};
    deatil_data:any = [];
    reqData = {
        custId: '',
        hospitalId: '',
        branchId: '',
        personId: '',
        queryTimeFlag: '',
        trnsAcctNo: '',
        totalCount: '',
        totalAmount: '',
        businessType: '',
        trnsToken: '',
        isMySelfPayment: '',
        details: {

        }
    };
    data = {};
    goResult = false; //前往結果頁

    //安控
    popFlag = false;   //popup辨別

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }

    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _headerCtrl: HeaderCtrlService,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _mainService: NtuhPayService,
        private _confirm: ConfirmService,
        private _checkSecurityService: CheckSecurityService,
        private _authService: AuthService
    ) { }

    ngOnInit() {
        logger.error("inputData:", this.inputData);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '繳費確認'
        });

        this._headerCtrl.setLeftBtnClick(() => {
            this._confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.onBackPageData({});
                },
                () => {

                }
            );
        });

        if (this.inputData['isMySelfPayment'] == '0') {
            this.isMySelfPayment = '本人';
        } else if (this.inputData['isMySelfPayment'] == '1') {
            this.isMySelfPayment = '非本人';
        }
        logger.error("isMySelfPayment:", this.isMySelfPayment);
        logger.error("data:", this.data);
        this.reqData.custId = this.inputData.custId;
        this.reqData.hospitalId = this.inputData.hospitalId;
        this.reqData.branchId = this.inputData.branchId;
        this.reqData.personId = this.inputData.personId;
        this.reqData.queryTimeFlag = this.inputData.queryTimeFlag;
        this.reqData.trnsAcctNo = this.inputData.trnsAcctNo;
        this.reqData.totalCount = this.inputData.totalCount;
        this.reqData.totalAmount = this.inputData.totalAmount;
        this.reqData.businessType = this.inputData.businessType;
        this.reqData.trnsToken = this.inputData.trnsToken;
        this.reqData.isMySelfPayment = this.inputData.isMySelfPayment;
        this.reqData.details = this.inputData['details'];
        logger.error("reqData:", this.reqData);
    }

    //點選取消
    public onCancel() {
        this.onBackPageData({});
    }

    //點擊確認
    public onConfirm(e) {
        this.popFlag = true;
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.inputData.SEND_INFO
        }

        //USER_SAFE 憑證跳popup
        // if (this.userAddress.USER_SAFE == '2') {
        //     this.popFlag = true;
        // } else {
        //     // this.checkEvent();
        //     this.onSend(e);
        // }
    }

    // this._mainService.getResultData(this.reqData).then(
    //     (result) => {
    //         this.info_data = result.info_data;
    //         this.data = result.data;
    //         logger.error("info_data:", this.info_data);
    //         this.goResult = true;
    //     },
    //     (errorObj) => {
    //         errorObj['type'] = 'dialog';
    //         this._handleError.handleError(errorObj);
    //     });

    // //監聽憑證回傳之output
    // onVerifyResult(e) {
    //     if (e) {
    //         this.popFlag = false;
    //         // this.checkEvent();
    //         this.onSend(e);
    //     }
    // }

    stepBack(e) {
        
        if (e.status) {
            if (e.securityType === '2') {
                e.signText = {
                    'custId': this._authService.getUserInfo().custId,
                    'hospitalId': this.reqData.hospitalId,
                    'branchId': this.reqData.branchId,
                    'personId': this.reqData.personId,
                    'queryTimeFlag': this.reqData.queryTimeFlag,
                    'trnsAcctNo': this.reqData.trnsAcctNo,
                    'totalCount': this.reqData.totalCount,
                    'totalAmount': this.reqData.totalAmount,
                    'businessType': this.reqData.businessType,
                    'trnsToken': this.reqData.trnsToken,
                    'isMySelfPayment': this.reqData.isMySelfPayment,
                    'details': this.reqData.details
                };
                logger.error("line 177 e.signText:",e.signText);
            } 
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    logger.error("into Security success!");
                    this.onSend(this.reqData,S);
                }, (F) => {
                    logger.error("into Security error!");
                    this._handleError.handleError(F);
                }
            );
        } else {
            return false;
        }
    }

    /**
  * 送電文
  */
    onSend(set_data,security) {
        this._mainService.onSend(set_data, security).then(
            (res) => {
                logger.error("onSend(),success res:",res);
                    this.info_data = res.info_data;
                    if(this.reqData.hasOwnProperty('details')) {
                        this.deatil_data = this.reqData['details']['detail'];
                    } 
                    logger.error("info_data:", this.info_data);
                    this.goResult = true;
            },
            (errorObj) => {
                logger.error("onSend(),error errorObj:",errorObj);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                
            });
    }

    /**
 * 重新設定page data
 * @param item 
 */
    onBackPageData(item) {
        let output = {
            'page': 'ntuh-confirm',
            'type': 'back',
            'data': item
        };

        this.backPageEmit.emit(output);
    }


}