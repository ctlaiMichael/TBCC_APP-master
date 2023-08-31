/**
 * 扣款(常用)帳號設定 --台大、童綜合(共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { AccountSetService } from '@pages/hospital/shared/service/account-set.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-account-set',
    templateUrl: 'account-set-page.component.html',
    styleUrls: [],
    providers: [AccountSetService, ConfirmService]
})

export class AccountSetPageComponent implements OnInit {
    @Input() inputData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

    info_data = {}; //存fh000101回傳的body
    data = []; //存fh000101回傳的trnsOutAccts[]

    info_data2 = {};  //存fh000102回傳的body
    //送request的物件(fh000101)
    reqData = {
        custId: '',
    };
    //送request的物件(fh000102)
    requData2 = {
        custId: '',
        account: ''
    }

    //回傳給繳費頁面要帶的url參數物件
    returnBillParams = {
        hospitalId: '',
        branchId: '',
        type: '',
        branchName: ''
    }


    showData = true; //是否顯示view資料

    choseAccount = '';

    constructor(
        private _logger: Logger,
        private _mainService: AccountSetService,
        private confirm: ConfirmService,
        private _handleError: HandleErrorService,
        private navgator: NavgatorService,
        private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {
        // --- 頁面設定 ---- //
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '扣款帳號設定'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.onBackPageData({},'');
                },
                () => {

                }
            );
        });

        logger.error("inputData33333:", this.inputData);
        // this.reqData.custId = this.inputData.custId;
        //發送fh000101電文 => 取得所有扣款帳號
        this._mainService.getData(this.reqData).then(
            (result) => {
                this.info_data = result.info_data;
                this.data = result.data;
                // if (typeof this.data[0] !== 'undefined') {
                //     this.choseAccount = this.data[0];
                // }
                for(let i = 0; i<this.data.length ; i++) {
                    if(this.info_data['trnsAcctNo'] == this.data[i]['acctNo']) {
                        this.choseAccount = this.data[i];
                    }
                }

                logger.error("info_data:", this.info_data);
                logger.error("data", this.data);
            },
            (errorObj) => {
                this.showData = false;
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }

    onChose(item) {
        this.choseAccount = item;
        logger.error("item:", item);
        logger.error("choseAccount:", this.choseAccount);
    }

    //點擊取消
    onCancel() {
        this.onBackPageData({},'');
    }

    //點擊確定
    onConfirm() {
        this.confirm.show('您設定的轉出帳號為' + this.choseAccount['acctNo'], {
            title: '繳交' + this.inputData.hospitalName + '費帳號設定'
        }).then(
            () => {
                //確定(popup) 
                //發fh000102 => 扣款帳號設定
                this.requData2['custId'] = this.info_data['custId'];
                this.requData2['account'] = this.choseAccount['acctNo'];
                logger.error("requData2!!:", this.requData2);
                this._mainService.getAccountSet(this.requData2).then(
                    (result) => {
                        this.info_data2 = result.info_data;
                        logger.error("info_data2:", this.info_data2);
                        //1-設定失敗
                        if (this.info_data2['result'] == '1') {
                            let _error = {
                                type: ''
                            }
                            _error.type = 'message';
                            this._handleError.handleError(_error);

                            //0-設定成功 
                        } if (this.info_data2['result'] == '0') {
                            this.confirm.show('您已經完成帳號設定，請問你要立即進行醫療繳費嗎?', {
                                title: '帳號設定完成',
                                btnYesTitle: '回醫療服務',
                                btnNoTitle: '前往繳費'
                            }).then(
                                () => {
                                    //回醫療服務(popup)內層
                                    this.navgator.push('hospital');
                                },
                                () => {
                                    //前往繳費(popup)內層
                                    if (this.inputData.hospitalId == 'NTUH') {
                                        this.onBackPageData({},'goto-pay');
                                    } else if (this.inputData.hospitalId == 'TUNG') {
                                        this.returnBillParams.hospitalId = this.inputData.hospitalId;
                                        this.returnBillParams.branchId = this.inputData.branchId;
                                        this.returnBillParams.type = '1';
                                        this.returnBillParams.branchName = this.inputData.hospitalName;
                                        this.navgator.push('hospital-bill', {}, this.returnBillParams);
                                    }
                                }
                            );
                        }
                    },
                    (errorObj) => {
                        this.showData = false;
                        errorObj['type'] = 'message';
                        this._handleError.handleError(errorObj);
                    });
            },
            () => {
                //取消(popup)
            }
        );
    }




    /**
     * 重新設定page data
     * @param item 
     */
    onBackPageData(item,gopage?) {
        let output = {
            'page': 'account-set',
            'type': 'back',
            'data': item
        };
        if(gopage !== '') {
            logger.error("into goto-pay");
            output.page = 'goto-pay';
        }
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'haspay-query',
            'type': 'error',
            'data': error_obj
        };

        this.errorPageEmit.emit(output);
    }

}