/**
 * 基金申購(單筆)結果頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundPurchaseSingleService } from '@pages/fund/shared/service/fund-purchase-single.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-purchase-single-result',
    templateUrl: './purchase-single-result-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseSingleService]
})
export class PurchaseSingleResultPageComponent implements OnInit {
    /**
      * 參數處理
      */
    // @Input() purchaseInfo: any; //fi000404 資訊,確認頁顯示用
    @Input() setData: any;
    @Input() resvertype: boolean;
    @Input() e;
    @Input() balanceData: any; //前一頁傳來，停損停利資訊
    @Input() setInfo: any; //因404、406 api 新增欄位從401取得，branchName、unitCall
    @Input() resver_info: any; // fi000401 資訊(預約)
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    processing = true; //處理中
    sucess = false; //交易成功
    failed = false; //交易失敗
    failed_x = false; // 異常
    failed_1 = false; //失敗
    info_data: any = {};
    resTitle = '';
    trnsRsltCode = '';
    reqData = {
        custId: '',
        trustAcnt: '',
        fundCode: '',
        fundType: '',
        amount: '',
        payAcnt: '',
        salesId: '',
        salesName: '',
        introId: '',
        introName: '',
        enrollDate: '',
        effectDate: '',
        currency: '',
        baseRate: '',
        favorRate: '',
        serviceFee: '',
        trnsToken: ''
    };
    showBalanceLoss = '';
    showBalancePros = '';

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private navgator: NavgatorService
        , private _mainService: FundPurchaseSingleService
    ) {

    }

    ngOnInit() {
        if (this.resvertype == false) {
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '基金單筆申購'
            });
        } else {
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '基金單筆申購(預約)'
            });
        }

        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('fund');
        });
        this._logger.log("2. setData:", this._formateServcie.transClone(this.setData));
        this._logger.log("3. setInfo:", this._formateServcie.transClone(this.setInfo));
        this._logger.log("4. setData:", this._formateServcie.transClone(this.setData));

        if (this.resvertype == false) {
            this.setData['branchName'] = this.setInfo['branchName'];
            this.setData['unitCall'] = this.setInfo['unitCall'];
            this._mainService.getFundData(this.setData, this.e).then(
                (result) => {
                    logger.error('result', result);
                    this.processing = false;
                    this.sucess = true;
                    this.failed = false;
                    this.info_data = result.info_data;
                    this.resTitle = result.hostCodeMsg;
                    this.trnsRsltCode = result.trnsRsltCode;
                    if (this.info_data['trnsRsltCode'] == '1' || this.info_data['trnsRsltCode'] == 'X') {
                        this.resTitle = result.hostCodeMsg;
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu'
                        });
                        this.sucess = false;
                        this.failed = true;
                        if (this.info_data['trnsRsltCode'] == 'X') {
                            this._headerCtrl.updateOption({
                                'leftBtnIcon': 'menu'
                            });
                            this.failed_x = true;
                        } else {
                            this.failed_1 = true;
                        }
                        // this._handleError.handleError({
                        //     type: 'message',
                        //     content: result.hostCodeMsg
                        // });

                    }
                    //處理停損停利點
                    this.formateLossPros();
                },
                (errorObj) => {
                    logger.error('errorObj', errorObj)
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                }
            );
        } else {
            this.setData['branchName'] = this.resver_info['branchName'];
            this.setData['unitCall'] = this.resver_info['unitCall'];
            this._mainService.getResverEnd(this.setData, this.e).then(
                (result) => {
                    this.processing = false;
                    this.sucess = true;
                    this.failed = false;
                    this.info_data = result.info_data;
                    this.resTitle = result.hostCodeMsg;
                    this.trnsRsltCode = result.trnsRsltCode;
                    if (this.info_data['trnsRsltCode'] == '1' || this.info_data['trnsRsltCode'] == 'X') {
                        this.resTitle = result.hostCodeMsg;
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu'
                        });
                        this.sucess = false;
                        this.failed = true;
                        if (this.info_data['trnsRsltCode'] == 'X') {
                            this._headerCtrl.updateOption({
                                'leftBtnIcon': 'menu'
                            });
                            this.failed_x = true;
                        } else {
                            this.failed_1 = true;
                        }
                    }
                    //處理停損停利點
                    this.formateLossPros();
                },
                (errorObj) => {
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                }
            );
        }

    }

    //處理停損停利點
    formateLossPros() {
        let sLossCD = this._formateServcie.checkField(this.info_data, 'sLossCD');
        let sProCD = this._formateServcie.checkField(this.info_data, 'sProCD');
        let sLoss = this._formateServcie.checkField(this.info_data, 'sLoss');
        let sPro = this._formateServcie.checkField(this.info_data, 'sPro');
        //處理用於畫面顯示之停損停利值
        this.showBalanceLoss = '';
        if (sLoss != '') {
            if (sLossCD != '-') {
                this.showBalanceLoss = '+';
            } else {
                this.showBalanceLoss = '-';
            }
            this.showBalanceLoss += sLoss;
        } else {
            this.showBalanceLoss = '--';
        }

        this.showBalancePros = '';
        if (sPro != '') {
            if (sProCD != '-') {
                this.showBalancePros = '+';
            } else {
                this.showBalancePros = '-';
            }
            this.showBalancePros += sPro;
        } else {
            this.showBalancePros = '--';
        }
    }

    //點擊確認
    sucessEnd() {
        this.navgator.push('fund');
    }

    //交易失敗，回網銀
    onHome() {
        this.navgator.push('home');
    }

    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let fundStatus: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                tmp_data = e.data;
            }
            if (e.hasOwnProperty('fundStatus')) {
                fundStatus = e.fundStatus;
            }
        }
        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);
        this._logger.log("fundStatus:", fundStatus);
    }



    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'purchase-tag',
            'type': 'back',
            'data': item
        };
        if (item.hasOwnProperty('page')) {
            output.page = item.page;
        }
        if (item.hasOwnProperty('type')) {
            output.type = item.type;
        }
        if (item.hasOwnProperty('data')) {
            output.data = item.data;
        }
        this.backPageEmit.emit(output);
    }

    /**
 * 失敗回傳
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(error_obj) {
        const output = {
            'page': 'result',
            'type': 'error',
            'data': error_obj
        };
        this.errorPageEmit.emit(output);
    }

    // // --------------------------------------------------------------------------------------------
    // //  ____       _            _         _____                 _
    // //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    // //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    // //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    // //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // // --------------------------------------------------------------------------------------------

}
