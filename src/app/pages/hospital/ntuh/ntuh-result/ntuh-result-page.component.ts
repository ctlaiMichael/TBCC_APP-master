/**
 * 台大醫院-繳費結果
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { Logger } from '@core/system/logger/logger.service';
import { NtuhPayService } from '@pages/hospital/shared/service/ntuh-pay.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
import { HOSPIATL_SQLITE } from '@conf/sqlite/hospital-sqlite';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-ntuh-result',
    templateUrl: 'ntuh-result-page.component.html',
    styleUrls: [],
    providers: []
})

export class NtuhResultPageComponent implements OnInit {
    @Input() inputData: any;
    @Input() notPayData: any; //需臨櫃繳
    @Input() detail: any;
    @Input() isMySelfPayment: string;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    info_data = {};
    data = [];
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

    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _headerCtrl: HeaderCtrlService,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private navgator: NavgatorService,
        private _mainService: NtuhPayService,
        private _confirm: ConfirmService,
        private alert: AlertService
    ) { }

    ngOnInit() {
        logger.error("inputData88888888:", this.inputData);
        logger.error("isMySelfPayment:", this.isMySelfPayment);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '繳費結果'
        });

        this._headerCtrl.setLeftBtnClick(() => {
            this._confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.navgator.push('hospital');
                },
                () => {

                }
            );
        });

        let detail_obj = this._mainService.checkCount(this.detail, this.inputData, this.isMySelfPayment);
        this.insert_values = detail_obj['formate'];
        this.table1_values = detail_obj['formate_table1'];
        this.check_insert['value'] = this.inputData['trnsDttm'];

        // 處理一維二維條碼
        this.genQRCode = this.inputData.specialInfo;
        this.genQRCode = encodeURI(this.genQRCode);
        this._logger.error('this.genQRCode', this.genQRCode);
        // this.data = this.inputData['rdetails']['detail'];
    }

    backHospital() {
        this.navgator.push('hospital');
    }

    //點擊用藥資訊
    detailInfoURL() {
        this.navgator.push(this.inputData['detailInfoURL']);
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
                                    //成功判斷回傳比數，==0,新增 反之 不做事
                                    if (check_success.data.rows.item(0)['count(*)'] == 0) {
                                        //4.無儲存過，新增資料
                                        this._mainService.getInsert(this.table1_values, this.isMySelfPayment, this.insert_table1).then(
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
                                this._mainService.getInsert(this.table1_values, this.isMySelfPayment, this.insert_table1).then(
                                    (insert_sussess) => {
                                        logger.error("getInsert() success, insert_sussess:", insert_sussess);
                                        //table1 insert成功，呼叫table2流程
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
                            this._mainService.getInsert(this.insert_values, this.isMySelfPayment, this.insert_table2).then(
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
                                    this._mainService.getDelete(this.inputData['trnsDttm']).then(
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
                            this._mainService.getDelete(this.inputData['trnsDttm']).then(
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
                    this._mainService.getInsert(this.insert_values, this.isMySelfPayment, this.insert_table2).then(
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
                            this._mainService.getDelete(this.inputData['trnsDttm']).then(
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
                this._mainService.getDelete(this.inputData['trnsDttm']).then(
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

    // onDelete_table1() {
    //     this._mainService.getDelete_table().then()
    // }

    /**
     * 
     * 新建table
     */
    // onCreate(): Promise<any> {
    //     return this._mainService.getCreate().then(
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

    /**
* 重新設定page data
* @param item 
*/
    onBackPageData(item) {
        let output = {
            'page': 'ntuh-result',
            'type': 'back',
            'data': item
        };
        this.backPageEmit.emit(output);
    }
}