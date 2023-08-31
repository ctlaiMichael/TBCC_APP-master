/**
 * 台大醫院-服務條碼儲存區
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { SqlitePluginService } from '@lib/plugins/sqlite/sqlite-plugin.service';
import { QrCodeSaveService } from '@pages/hospital/shared/service/qr-code-save.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-qr-code-save',
    templateUrl: 'qr-code-save.component.html',
    styleUrls: [],
    providers: [SqlitePluginService, QrCodeSaveService]
})

export class QrCodeSavePageComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'list';
    data = []; //儲存select all 資料
    detail_data: any = {}; //回傳第二table
    choice_detail: any; //上一頁選擇的那筆資料
    delete_result: any; //刪除回傳
    genQRCode: any;
    t1_type = '1';
    t2_type = '2';

    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _headerCtrl: HeaderCtrlService,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private navgator: NavgatorService,
        private _qrcodeService: QrCodeSaveService,
        private confirm: ConfirmService,
        private alert: AlertService
    ) { }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '服務條碼儲存區'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            if (this.nowPage == 'list') {
                this.navgator.push('ntuh-menu');
            } else if (this.nowPage == 'detail') {
                this.nowPage = 'list';
            }
        });
        this.onSelect();
    }

    //service一個function對應一組sqlite程式

    //查詢
    public onSelect(): Promise<any> {
        return this._qrcodeService.getSelect().then(
            (select_success) => {
                logger.error("onSelect(), select_success:", select_success);
                logger.error("onSelect(), select_success['data']['rows']:", select_success['data']['rows']);
                this.data = this._qrcodeService.formate_array(select_success['data']['rows']);
                //若有建DB但無資料
                if (this.data == [] || this.data.length == 0) {
                    this.alert.show('查無資料', {
                        title: '提醒您',
                        btnTitle: '我知道了',
                    }).then(
                        () => {
                            this.navgator.push('ntuh-menu');
                        }
                    );
                }
                logger.error("data:", this.data);
            },
            (select_error) => {
                logger.error("select_error", select_error);
                this._handleError.handleError(select_error);
                this.navgator.push('ntuh-menu');
            }
        );
    }

    /**
     * 
     * 新建table
     */
    // onCreate(): Promise<any> {
    //     return this._qrcodeService.getCreate().then(
    //         (result) => {
    //             logger.error("result success", result);
    //             return Promise.resolve(result);
    //         },
    //         (errorObj) => {
    //             logger.error("errorObj failed", errorObj);
    //             return Promise.resolve(errorObj);
    //         }
    //     );
    // }

    //點擊其中一筆(查詢)
    onDetail(item) {
        this.choice_detail = item;
        this._qrcodeService.getQueryDetail(this.choice_detail).then(
            (result) => {
                logger.error("onDetail(), result success:", result);
                logger.error("onDetail(), result['data']['rows']:", result['data']['rows']);
                this.detail_data = this._qrcodeService.formate_array(result['data']['rows']);
                logger.error("detail_data:", this.detail_data);
                this.nowPage = 'detail';
            },
            (errorObj) => {
                logger.error("errorObj failed", errorObj);
                this._handleError.handleError(errorObj);
            }
        );

        // 處理一維二維條碼
        this.genQRCode = this.choice_detail.qr_code;
        this.genQRCode = encodeURI(this.genQRCode);
        this._logger.error('this.genQRCode', this.genQRCode);
    }

    //點擊刪除此筆
    onDelete() {
        this.confirm.show('您是否要刪除此筆資料', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                logger.error('click yes');
                // this._qrcodeService.getDelete(this.choice_detail).then(
                //     (result) => {
                //         logger.error("qr-code component, delete data success");
                //         logger.error("result success:", result);
                //         this.delete_result = result;
                //         //刪除成功
                //         this.alert.show('刪除成功', {
                //             title: '提醒您',
                //             btnTitle: '我知道了',
                //         }).then(
                //             // this._logger.log('刪除後確認');
                //         );
                //     },
                //     (errorObj) => {
                //         logger.error("errorObj:", errorObj);
                //         this._handleError.handleError(errorObj);
                //     }
                // );


                //----------------------  此段為修改  --------------------------
                //1.刪除table1
                this._qrcodeService.getDelete(this.choice_detail, this.t1_type).then(
                    (result) => {
                        logger.error("qr-code component, delete data success");
                        logger.error("result success:", result);
                        this.delete_result = result;
                        //2.刪除table2
                        this._qrcodeService.getDelete(this.choice_detail, this.t2_type).then(
                            (table2_success) => {
                                logger.error("table2_success:", table2_success);
                                //刪除成功
                                this.alert.show('刪除成功', {
                                    title: '提醒您',
                                    btnTitle: '我知道了',
                                }).then(
                                    () => {
                                        this.navgator.push('ntuh-menu');
                                    }
                                );
                            },
                            (table2_error) => {
                                logger.error("table2_error:", table2_error);
                                this._handleError.handleError(table2_error);
                            }
                        );
                    },
                    (errorObj) => {
                        logger.error("errorObj:", errorObj);
                        this._handleError.handleError(errorObj);
                    }
                );
                //------------------------------------------------
            },
            () => {
                logger.error('cancel');
            }
        );
    }

    /**
    * 返回上一層
    * @param item
    */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'qr-code-save',
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
}