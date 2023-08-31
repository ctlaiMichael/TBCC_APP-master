/**
 * 帳戶彙總資料
 * acctGroup: TW 台幣, FOREX 外幣, GOLD 黃金
 */
import { Component, Input, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ContentSummaryService } from './content-summary.service';

@Component({
    selector: 'app-content-summary',
    templateUrl: './content-summary.component.html',
    styleUrls: [],

})
export class ContentSummaryComponent implements OnChanges {
    /**
     * 參數處理
     */
    @Input() acctObj: {};
    @Input() itemData: {}; // 不發電文直接傳入data
    @Input() acctGroup: string; // 存款帳戶
    showContent = ''; // 是否顯示內容
    dataTime: string;
    data: any = {
        branch: '', // 帳務行(台幣存摺無此資料)
        branchName: '', // 帳務行名稱(台幣存摺無此資料)
        saveBookBalance: '', // 存款餘額(台幣存摺無此資料)
        realBalance: '', // 實質餘額
        usefulBalance: '', // 可用餘額
        saveBookBal: '', // 可用餘額
        todayCheckBalance: '', // 金交票金額
        tomCheckBalance: '', // 名交票金額
        icCard: '', // 消費圈存
        freezeBalance: '', // 凍結總額
        distrainBalance: '', // 扣押總額
        afterRunBalance: '', // 營業時間後提款及轉出
        afterRunPay: '', // 營業時間後存款及轉入
        _showFinance: true, // 顯示融資資料
        financeRate: '', // 融資利率
        financeAmount: '', // 融資額度
        financeStartDay: '', // 融資期間(起)
        financeEndDay: '', // 融資期間(訖)
        _showFD: false, // 顯示轉定存資料
        afterFDBalance: '', // 轉定存總存餘額
        toFDAmt: '', // 約定轉定存金額
        // 特殊欄位: (GOLD)
        realBalUS: '', // GD實質餘額公克數—美元
        usefulBalUS: '', // GD可用餘額公克數—美元
        saveBookBalUS: '' // GD存摺餘額公克數—美元
    };
    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _mainService: ContentSummaryService,
        private _handleError: HandleErrorService
    ) {
        this.dataTime = '';
    }


    ngOnChanges() {
        let reqObj: any = {};

        switch (this.acctGroup) {
            case 'TW': // 台幣存摺
                this.showContent = 'TW';
                reqObj['acctNo'] = this._formateService.checkField(this.acctObj, 'acctNo');
                reqObj['acctType'] = this._formateService.checkField(this.acctObj, 'acctType');
                this.getData(reqObj).then(
                    (jsonObj) => {
                        // 回傳資料整理
                        this._logger.log(this.data);
                        this._logger.log(this._formateService.transClone(jsonObj));
                        this.data = jsonObj['data'];
                        this.dataTime = jsonObj['dataTime'];
                    },
                    () => {}
                );
                break;
            case 'FOREX': // 外幣存摺
                if (typeof this.itemData === 'object') {
                    const isDemand = (this.itemData.hasOwnProperty('isDemand') && this.itemData['isDemand']) ? true : false;
                    this.data = this._formateService.checkField(this.itemData, 'data');
                    this.dataTime = this._formateService.checkField(this.itemData, 'dataTime');
                    if (isDemand === false) {
                        // 定存
                        this.showContent = 'FOREX_TIME';
                    } else {
                        // 活支存
                        this.showContent = 'FOREX';
                    }
                }
                break;
            case 'GOLD': // 黃金存摺
                this.showContent = 'GOLD';
                reqObj['account'] = this._formateService.checkField(this.acctObj, 'account');
                if (reqObj['account'] == '') {
                    reqObj['account'] = this._formateService.checkField(this.acctObj, 'acctNo');
                }
                this.getData(reqObj).then(
                    (jsonObj) => {
                        // 回傳資料整理
                        this.data = jsonObj['data'];
                        this.dataTime = jsonObj['dataTime'];
                    },
                    () => {}
                );
                break;
            default:
                this.showContent = 'GROUP_ERROR';
                break;
        }

    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
    private getData(req_data): Promise<any> {

        return this._mainService.getSummaryData(req_data).then(
            (result) => {
                return Promise.resolve(result);
            },
            (errorObj) => {
                this._logger.error('ContentDetailResult get error', errorObj);
                this.showContent = 'EMPTY';
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );
    }

}
