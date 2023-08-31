/**
 * 已繳醫療費查詢 --台大、童綜合(共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HasPayService } from '@pages/hospital/shared/service/haspay.service';
import { FormateService } from '@shared/formate/formate.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
import { CheckService } from '@shared/check/check.service';
import { SqlitePluginService } from '@lib/plugins/sqlite/sqlite-plugin.service';

@Component({
    selector: 'app-haspay-query',
    templateUrl: 'haspay-query-page.component.html',
    styleUrls: [],
    providers: [HasPayService,SqlitePluginService]
})

export class HaspayQueryPageComponent implements OnInit {
    @Input() inputData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

    hospitalName: string;
    nowPage = 'queryPage'; //目前頁面
    //ngModel綁定
    inp_data = {
        startDate: "",
        endDate: ""
    }

    //request
    reqData = {
        custId: "",
        hospitalId: "",
        branchId: "",
        startDate: "",
        endDate: ""
    }

    info_data: any = {};
    data = [];

    dateData = {
        year: '',
        month: '',
        date: '',
        dateformate: '',
        today: ''
    }
    endDate_error = ''; //查詢迄日error_msg
    endDate_error_flag = false; //查詢迄日(紅框)
    start_error = ''; //查詢起日error_msg
    start_error_flag = false; //查詢起日(紅框)

    maxDay = '';
    minDay = '';

    constructor(
        private _logger: Logger
        , private _mainService: HasPayService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _checkService: CheckService
    ) { }

    ngOnInit() {
        this.onWeek();
        const date_data = this._checkService.getDateSet({
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '6', // 查詢範圍限制
            rangeDate: '' // 比較日
        }, 'future');
        this.maxDay = date_data.maxDate;
        this.minDay = date_data.minDate;
        logger.error("into haspay-query");
        logger.error("nowPage:", this.nowPage);
        logger.error("inputData:", this.inputData);
        this.reqData.custId = this._formateService.checkField(this.inputData, 'custId');
        this.reqData.hospitalId = this._formateService.checkField(this.inputData, 'hospitalId');
        // this.reqData.branchId = this._formateService.checkField(this.inputData, 'branchId');
        this.reqData.branchId = 'T0';
        this.hospitalName = this._formateService.checkField(this.inputData, 'hospitalName');
        // if (this.reqData.hospitalId == '' || this.reqData.branchId == '') {
        //     this.onErrorBackEvent({
        //         title: 'ERROR.TITLE',
        //         content: 'ERROR.DATA_FORMAT_ERROR'
        //     });
        // } else {
        // --- 頁面設定 ---- //
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '已繳醫療費查詢'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            logger.error("query page leftBtn start!");
            this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.onBackMenuPage({});
                    // this.navgator.push('ntuh-menu');
                },
                () => {

                }
            );
        });
        // --- 頁面設定 End ---- //
        // }
    }



    //點擊開始查詢
    public onQuery() {
        //檢查查詢迄日
        let check_obj_end = this._mainService.check_date_end(this.inp_data.endDate);
        this.endDate_error = check_obj_end.msg;
        //檢查查詢起日
        let check_obj_start = this._mainService.check_date_start(this.inp_data.startDate);
        this.start_error = check_obj_start.msg;

        if (check_obj_end.status == true) {
            this.endDate_error_flag = false;
        } else {
            this.endDate_error_flag = true;
        }
        if (check_obj_start.status == true) {
            this.start_error_flag = false;
        } else {
            this.start_error_flag = true;
        }

        if (check_obj_end.status == true && check_obj_start.status == true) {
            logger.error("7777777777777inp_data:", this.inp_data);

            let mappingData = this._mainService.mappingDate(this.inp_data);
            this.reqData.startDate = mappingData.startDate;
            this.reqData.endDate = mappingData.endDate;

            logger.error('line 92 reqData:', this.reqData);
            this._mainService.getData(this.reqData).then(
                (result) => {
                    this.info_data = result.info_data;
                    this.data = result.data;
                    this.nowPage = 'listPage';
                },
                (errorObj) => {
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                }
            );
            logger.error("reqData:", this.reqData);
            logger.error("info_data:", this.info_data);
        } else {
            return false;
        }

    }

    //點擊最近一週
    public onWeek() {
        this.dateData = this._mainService.dateFormate('forWeek');
        logger.error("dateData:", this.dateData);
        this.inp_data.startDate = this.dateData.dateformate;
        this.inp_data.endDate = this.dateData.today;
    }

    //點擊最近一個月
    public onMonth() {
        this.dateData = this._mainService.dateFormate('forMonth');
        logger.error("dateData:", this.dateData);
        this.inp_data.startDate = this.dateData.dateformate;
        this.inp_data.endDate = this.dateData.today;
    }

    /**
     * 接收回傳
     * @param e 
     */
    onBackPage(e) {
        logger.error('onPageBackEvent', e);
        let page = '';
        let pageType = '';
        let tmp_data: any;
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
        }
        if (page == 'haspay-list') {
            logger.error("back query page success!");
            this.nowPage = 'queryPage'; //切換到查詢頁
            //重新設定一次header
            this._headerCtrl.updateOption({ 
                'leftBtnIcon': 'back',
                'title': '已繳醫療費查詢'
            })
            //點擊左側返回
            this._headerCtrl.setLeftBtnClick(() => {
                logger.error("query page leftBtn start!");
                this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                    title: '提醒您'
                }).then(
                    () => {
                        //確定
                        this.onBackMenuPage({});
                    },
                    () => {
    
                    }
                );
            });
        }
    }

    /**
     * 返回上一層
     * @param item
     */
    onBackMenuPage(item?: any) {
        logger.error("query page onback!");
        // 返回最新消息選單
        let output = {
            'page': 'haspay-query',
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
* 失敗回傳(分頁)
* @param error_obj 失敗物件
*/
    onErrorBackEvent(e) {
        this._logger.step('onErrorBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let errorObj: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                errorObj = e.data;
            }
        }
        // 列表頁：首次近來錯誤推頁
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
    }

}