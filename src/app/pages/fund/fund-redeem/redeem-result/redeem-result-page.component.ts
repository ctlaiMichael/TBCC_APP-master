/**
 * 基金贖回(結果頁)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundRedeemService } from '@pages/fund/shared/service/fund-redeem.service';
import { FormateService } from '@shared/formate/formate.service';


@Component({
    selector: 'app-redeem-result',
    templateUrl: './redeem-result-page.component.html',
    styleUrls: [],
    providers: [FundRedeemService]
})
export class RedeemResultPageComponent implements OnInit {
    @Input() reqData: any;
    @Input() e;
    @Input() nowToResver: boolean;
    // @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    // @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    info_data: any = {}; //fi000504存電文回傳
    data: any = []; //存fi000504電文回傳
    showData = false;
    resTitle = '';
    resContent = '';
    // trnsRsltCode = '';
    processing = true; // 處理中
    sucess = false; // 交易狀態
    // failed = false; //交易失敗
    // failed_x = false;
    // failed_1 = false;
    resultData: any;
    showClass = '';
    private class_list = {
        'success': '',
        'error': 'fault_active',
        'warning': 'exclamation_active'
    };

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
        , private _mainService: FundRedeemService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
    ) {
    }

    ngOnInit() {
        this._initEvent();
        this.sendData().then(
            (result) => {
                this.resultData = result;
                this.processing = false;
                this.info_data = result.info_data;
                this.sucess = (!!this.resultData.status) ? true : false;
                this.resTitle = result.title;
                this.resContent = this._formateService.checkField(result, 'msg');

                let classType = this._formateService.checkField(this.resultData, 'classType');
                if (this.class_list.hasOwnProperty(classType)) {
                    this.showClass = this.class_list[classType];
                } else {
                    this.showClass = this.class_list['success'];
                }
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }

    private _initEvent() {
        if (this.nowToResver == false) {
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'menu',
                style: 'result',
                'title': '基金贖回'
            });
        } else {
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'menu',
                style: 'result',
                'title': '基金贖回(預約)'
            });
        }
        // this._headerCtrl.setLeftBtnClick(() => {
        //     this.navgator.push('fund');
        // });
    }


    // 點擊確認
    onConfirm() {
        this.navgator.push('fund');
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------


    /**
     * 送出資料
     */
    private sendData(): Promise<any> {
        if (this.nowToResver == true) {
            return this._mainService.getRedeemEnd_resver(this.reqData, this.e);
        } else {
            // 非預約
            return this._mainService.getRedeemEnd(this.reqData, this.e);
        }
    }

}
