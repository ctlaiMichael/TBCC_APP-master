/**
 * 基金申購(預約)結果頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundPurchaseSingleService } from '@pages/fund/shared/service/fund-purchase-single.service';

@Component({
    selector: 'app-purchase-resver-single-result',
    templateUrl: './purchase-resver-single-result-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseSingleService]
})
export class PurchaseResverSingleResultPageComponent implements OnInit {
    /**
      * 參數處理
      */
    // @Input() purchaseInfo: any; //fi000404 資訊,確認頁顯示用
    @Input() setData: any;
    @Input() e;
    @Input() balanceData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

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
    processing = true; //處理中
    sucess = false; //交易成功
    failed = false; //交易失敗
    failed_x=false;
    failed_1=false;
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
        this._logger.log("line 62 setData:", this.setData);
        this._logger.log("line 63 balanceData:", this.balanceData);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu',
            'title': '基金單筆申購(預約)'
        });
    
        this._mainService.getResverEnd(this.setData, this.e).then(
            (result) => {
                this.processing = false;
                this.sucess = true;
                this.failed = false;
                this.info_data = result.info_data;
                this.resTitle = result.title;
                this.trnsRsltCode = result.trnsRsltCode;
                if (this.info_data['trnsRsltCode'] == '1' || this.info_data['trnsRsltCode'] == 'X') {
                    this.resTitle = result.hostCodeMsg;
                    this._headerCtrl.updateOption({
                        'leftBtnIcon': 'menu',
                        'title': '交易失敗'
                    });
                    if(this.info_data['trnsRsltCode'] == 'X'){
                        this._headerCtrl.updateOption({
                            'title': '交易異常'
                        });
                        this.failed_x=true;
                    }else{
                        this.failed_1=true;
                    }
                    this.sucess = false;
                    this.failed = true;
                }
                this._logger.log("line 73 info_data:", this.info_data);
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
                this.navgator.push('fund');
            }
        );
    }

    //點擊確認
    sucessEnd() {
        this.navgator.push('fund');
    }

    //點擊返回行動網銀
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