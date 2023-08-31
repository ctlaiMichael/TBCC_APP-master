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
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-haspay-query-list',
    templateUrl: 'haspay-query-list.component.html',
    styleUrls: [],
    providers: [HasPayService]
})

export class HaspayQueryListPageComponent implements OnInit {
    @Input() queryInfo: any;
    @Input() queryData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'list';
    reqData = {
        custId: '',
        trnsNo: ''
    };
    info_data: any = {};
    data: any = [];

    constructor(
        private _logger: Logger
        , private _mainService: HasPayService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
    ) { }

    ngOnInit() {
        logger.error("into haspay-list!");
        logger.error("nowPage:",this.nowPage);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '已繳醫療費查詢'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            logger.error("list page leftBtn start!");
            logger.error("into leftBtn");
            this.onBackQueryPage({});
        });
        logger.error("queryInfo:", this.queryInfo);
        logger.error("queryData:", this.queryData);
    }

    //點擊其中一筆，查詢該筆明細
    onDetail(item) {
        this.reqData.trnsNo = item.trnsNo;
        this._mainService.getDeatil(this.reqData).then(
            (result) => {
                this.info_data = result.info_data;
                this.data = result.data;
                logger.error("info_data:", this.info_data);
                logger.error("data:", this.data);
                this.nowPage = 'detail';
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
            }
        );
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
        if (page == 'haspay-detail') {
            logger.error("back list page success");
            this.nowPage = 'list'; //切換至表單頁
            //重新設定header
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '已繳醫療費查詢'
            });
            //點擊左側返回
            this._headerCtrl.setLeftBtnClick(() => {
                logger.error("list page leftBtn start!");
                logger.error("into leftBtn");
                this.onBackQueryPage({});
            });
        }
    }

    /**
         * 返回上一層
         * @param item
         */

        onBackQueryPage(item?: any) {
            logger.error("list page back!");
            // 返回最新消息選單
            let output = {
                'page': 'haspay-list',
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