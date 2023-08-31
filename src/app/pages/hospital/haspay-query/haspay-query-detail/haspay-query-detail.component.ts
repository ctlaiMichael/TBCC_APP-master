/**
 * 已繳醫療費查詢 --台大、童綜合(明細)
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
import { HOSPIATL_SQLITE } from '@conf/sqlite/hospital-sqlite';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-haspay-query-detail',
    templateUrl: 'haspay-query-detail.component.html',
    styleUrls: [],
    providers: [HasPayService]
})

export class HaspayQueryDetailPageComponent implements OnInit {
    @Input() listData: any;
    @Input() listInfoData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    genQRCode: any;

    private dbOptionSet = {
        name: HOSPIATL_SQLITE.dbName
    };
    //------------------------ sqlite用參數 ------------------------------
    //selectCount_table1參數:
    selectCount_table1 = {
        table_name: HOSPIATL_SQLITE.MainTable, //表格(主)
        type: '1'
    };
    //selectCount_table2參數:
    selectCount_table2 = {
        table_name: HOSPIATL_SQLITE.TreatmentTable, //表格(主)
        type: '2'
    };
    //create_table1參數:
    create_table1 = {
        table_name: HOSPIATL_SQLITE.MainTable, //表格(主)
        fied_id: '_id',
        field: [
            'trans_date', 'trans_person', 'trans_amount', 'qr_code', 'trnsNo', 'stan'
        ],
        foreignKey: "",
        type: '1'
    };
    //create_table1參數:
    create_table2 = {
        table_name: HOSPIATL_SQLITE.TreatmentTable, //表格(主)
        fied_id: '_id',
        field: [
            'trans_date', 'treatment_date', 'treatment_amount'
        ],
        foreignKey: "",
        type: '2'
    };
    //insert_table1參數:
    insert_table1 = {
        name: HOSPIATL_SQLITE.MainTable, // table name
        field: ['trans_date', 'trans_person', 'trans_amount', 'qr_code', 'trnsNo', 'stan'], // 欄位(放使用者選取的) table1
        type: '1'
    };
    //insert_table2參數:
    insert_table2 = {
        name: HOSPIATL_SQLITE.TreatmentTable, // table name
        field: ['trans_date', 'treatment_date', 'treatment_amount'], // 欄位(放使用者選取的) table2
        type: '2'
    };
    insert_values = ''; //table2
    table1_values = ''; //table1
    //check_insert參數,判斷有無儲存過的資料
    check_insert = {
        table_name: HOSPIATL_SQLITE.MainTable,
        field: 'trans_date',
        value: ''
    };

    check_close_flag = false; //判斷是否要關閉(執行完table2流程改為true)

    constructor(
        private _logger: Logger
        , private _mainService: HasPayService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private alert: AlertService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        logger.error("into haspay-detail!");
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '交易明細'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            logger.error("detail page leftBtn start!");
            this.onBackListPage({});
        });
        logger.error("listData:", this.listData);
        logger.error("listInData:", this.listInfoData);

        let detail_obj = this._mainService.checkCount(this.listData, this.listInfoData);
        this.insert_values = detail_obj['formate'];
        this.table1_values = detail_obj['formate_table1'];
        this.check_insert['value'] = this.listInfoData['trnsDttm'];

        // 處理一維二維條碼
        this.genQRCode = this.listInfoData.specialInfo;
        this.genQRCode = encodeURI(this.genQRCode);
        this._logger.error('this.genQRCode', this.genQRCode);
    }

    //點擊用藥資訊
    detailInfoURL() {
        this.navgator.push(this.listInfoData['detailInfoURL']);
    }

    //儲存qr code到手機
    onInsert() {
        //1.先判斷有無table
        this._mainService.getSelectCount(this.selectCount_table1, this.dbOptionSet).then(
            (count_result) => {
                logger.error("getSelectCount() success, count_result:", count_result);
                //無建立過
                if (count_result.data.rows.item(0)['count(*)'] == 0) {
                    logger.error("success into == 0");
                    //2.新建table
                    this._mainService.getCreate(this.create_table1, this.dbOptionSet).then(
                        (create_result) => {
                            logger.error("getCreate() success, create_result:", create_result);
                            //3.判斷有無儲存過
                            this._mainService.getCheckInsert(this.check_insert).then(
                                (check_success) => {
                                    logger.error("getCheckInsert(), check_success:", check_success);
                                    logger.error("getCheckInsert(), check_success.data.rows:", check_success.data.rows);
                                    logger.error("getCheckInsert(), check_success.data.rows.item(0):", check_success.data.rows.item(0));
                                    //成功判斷回傳比數，==0,新增 反之 不做事
                                    if (check_success.data.rows.item(0)['count(*)'] == 0) {
                                        //4.無儲存過，新增資料
                                        this._mainService.getInsert(this.table1_values, this.listInfoData['isMySelfPayment'], this.insert_table1).then(
                                            (insert_sussess) => {
                                                logger.error("getInsert() success, insert_sussess:", insert_sussess);
                                                //5.table1 insert成功，呼叫table2流程
                                                this.onInsert_table2();
                                            },
                                            (insert_errorObj) => {
                                                logger.error("getInsert() error, insert_errorObj:", insert_errorObj);
                                                this._handleError.handleError(insert_errorObj);
                                            }
                                        );
                                    } else {
                                        //有儲存過
                                        this.alert.show('此筆資料已存在', {
                                            title: '提醒您',
                                            btnTitle: '我知道了',
                                        }).then(

                                        );
                                        return false;
                                    }
                                },
                                (check_error) => {
                                    logger.error("getCheckInsert(), check_error:", check_error);
                                    this._handleError.handleError(check_error);
                                }
                            );

                        },
                        (create_errorObj) => {
                            logger.error("getCreate() error, create_errorObj:", create_errorObj);
                            this._handleError.handleError(create_errorObj);
                        }
                    );
                } else {
                    //有建過table
                    logger.error("success into > 0");
                    //3.判斷有無儲存過
                    this._mainService.getCheckInsert(this.check_insert).then(
                        (check_success) => {
                            logger.error("getCheckInsert(), check_success:", check_success);
                            if (check_success.data.rows.item(0)['count(*)'] == 0) {
                                //4.無儲存過，新增資料
                                this._mainService.getInsert(this.table1_values, this.listInfoData['isMySelfPayment'], this.insert_table1).then(
                                    (insert_sussess) => {
                                        logger.error("getInsert() success, insert_sussess:", insert_sussess);
                                        //5.table1 insert成功，呼叫table2流程
                                        this.onInsert_table2();
                                    },
                                    (insert_errorObj) => {
                                        logger.error("getInsert() error, insert_errorObj:", insert_errorObj);
                                        this._handleError.handleError(insert_errorObj);
                                    }
                                );
                            } else {
                                //有儲存過
                                this.alert.show('此筆資料已存在', {
                                    title: '提醒您',
                                    btnTitle: '我知道了',
                                }).then(

                                );
                                return false;
                            }
                        },
                        (check_error) => {
                            logger.error("getCheckInsert(), check_error:", check_error);
                            this._handleError.handleError(check_error);
                        }
                    );
                }
            },
            (count_errorObj) => {
                logger.error("getSelectCount() error, count_errorObj:", count_errorObj);
                this._handleError.handleError(count_errorObj);
            }
        );
    }


    //table1流程成功，呼叫此方法執行table2流程,其中一個階段錯誤，就必須刪除table新增的資料
    onInsert_table2() {
        logger.error("into process table2 function");
        //6.先判斷有無table2
        this._mainService.getSelectCount(this.selectCount_table2, this.dbOptionSet).then(
            (count_success) => {
                logger.error("getSelectCount() success, count_success:", count_success);
                //無建立過table2
                if (count_success.data.rows.item(0)['count(*)'] == 0) {
                    //7.建立table2
                    this._mainService.getCreate(this.create_table2, this.dbOptionSet).then(
                        (create_success) => {
                            logger.error("getCreate() success, create_success:", create_success);
                            //8.新增table2資料
                            this._mainService.getInsert(this.insert_values, this.listInfoData['isMySelfPayment'], this.insert_table2).then(
                                (insert_success) => {
                                    logger.error("getInsert() success, insert_success:", insert_success);
                                    //流程結束，關閉DB
                                    // this._mainService.getClose().then(
                                    //     (close_success) => {
                                    //         logger.error("getClose(), close_success:", close_success);
                                            //table2 insert成功show alert

                                            this.alert.show('資料儲存完畢', {
                                                title: '提醒您',
                                                btnTitle: '我知道了',
                                            }).then(

                                            );
                                    //     },
                                    //     (close_error) => {
                                    //         logger.error("getClose(), close_error:", close_error);
                                    //     }
                                    // );
                                },
                                (insert_errorObj) => {
                                    logger.error("getInsert() error, insert_errorObj:", insert_errorObj);
                                    logger.error("delete table1_data");
                                    //table2流程有錯，呼叫delete table1資料方法
                                    this._mainService.getDelete(this.listInfoData['trnsDttm']).then(
                                        (delete_success) => {
                                            logger.error("getDelete() success, delete_success:", delete_success);

                                        },
                                        (delete_erorr) => {
                                            logger.error("getDelete() error, delete_erorr:", delete_erorr);
                                        }
                                    );
                                    this._handleError.handleError(insert_errorObj);
                                }
                            );
                        },
                        (create_errorObj) => {
                            logger.error("getCreate() error, create_errorObj:", create_errorObj);
                            logger.error("delete table1_data");
                            //table2流程有錯，呼叫delete table1資料方法
                            this._mainService.getDelete(this.listInfoData['trnsDttm']).then(
                                (delete_success) => {
                                    logger.error("getDelete() success, delete_success:", delete_success);

                                },
                                (delete_erorr) => {
                                    logger.error("getDelete() error, delete_erorr:", delete_erorr);
                                }
                            );
                            this._handleError.handleError(create_errorObj);
                        }
                    );
                    //有建立過table2
                } else {
                    //8.新增table2資料
                    this._mainService.getInsert(this.insert_values, this.listInfoData['isMySelfPayment'], this.insert_table2).then(
                        (insert_success) => {
                            logger.error("getInsert() success, insert_success:", insert_success);
                            //流程結束，關閉DB
                            // this._mainService.getClose().then(
                            //     (close_success) => {
                            //         logger.error("getClose(), close_success:", close_success);
                                    //table2 insert成功show alert
                                    this.alert.show('資料儲存完畢', {
                                        title: '提醒您',
                                        btnTitle: '我知道了',
                                    }).then(

                                    );
                            //     },
                            //     (close_error) => {
                            //         logger.error("getClose(), close_error:", close_error);
                            //     }
                            // );
                        },
                        (insert_errorObj) => {
                            logger.error("getInsert() error, insert_errorObj:", insert_errorObj);
                            logger.error("delete table1_data");
                            //table2流程有錯，呼叫delete table1資料方法
                            this._mainService.getDelete(this.listInfoData['trnsDttm']).then(
                                (delete_success) => {
                                    logger.error("getDelete() success, delete_success:", delete_success);

                                },
                                (delete_erorr) => {
                                    logger.error("getDelete() error, delete_erorr:", delete_erorr);
                                }
                            );
                            this._handleError.handleError(insert_errorObj);
                        }
                    );
                }
            },
            (count_errorObj) => {
                logger.error("getSelectCount() error, count_errorObj:", count_errorObj);
                logger.error("delete table1_data");
                //table2流程有錯，呼叫delete table1資料方法
                this._mainService.getDelete(this.listInfoData['trnsDttm']).then(
                    (delete_success) => {
                        logger.error("getDelete() success, delete_success:", delete_success);
                    },
                    (delete_erorr) => {
                        logger.error("getDelete() error, delete_erorr:", delete_erorr);
                    }
                );
                this._handleError.handleError(count_errorObj);
            }
        );
    }


    /**
         * 返回上一層
         * @param item
         */

    onBackListPage(item?: any) {
        logger.error("detail page onback!");
        // 返回最新消息選單
        let output = {
            'page': 'haspay-detail',
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
