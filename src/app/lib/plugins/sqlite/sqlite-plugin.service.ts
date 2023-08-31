/**
 * SQL Lite介接
 * 一次僅允許一條連線
 */
import { Injectable } from '@angular/core';
import { logger } from '@shared/util/log-util';
import { environment } from 'environments/environment';
import { CordovaService } from '@base/cordova/cordova.service';
import { DatebaseOption } from '@lib/plugins/sqlite/datebase-option';
import { OpenDatabaseSimulation } from '@lib/plugins/sqlite/sqlite-simulation'; // 模擬
import { SelectDbOption } from '@lib/plugins/sqlite/select-db-option';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { Logger } from '@core/system/logger/logger.service';
import { resolve } from 'dns';
import { reject } from 'q';

declare var sqlitePlugin: any;


@Injectable()
export class SqlitePluginService extends CordovaService {

    private dbObj: any; // DB暫存物件
    private dbOnFlag: boolean; // DB狀態
    //點擊刪除鈕,table1資料
    delete_table1_data = {
        status: false,
        data: [],
        msg: '',
        errorCode: ''
    };
    db_Obj = null;

    constructor(
        private _logger: Logger,
    ) {
        super();
        this.dbObj = null;
        this.dbOnFlag = false;
    }

    /**
     * 檢查是否有連線
     */
    checkConnect(): boolean {
        logger.error("into checkConnect!");
        logger.error("checkConnect(), dbOnFlag:", this.dbOnFlag);
        logger.error("checkConnect(), dbObj:", this.dbObj);
        return (this.dbOnFlag && this.dbObj) ? true : false;
    }

    /**
     * DB 連線
     * @param db_option
     */
    connectDB(db_option: any = {}): Promise<any> {
        logger.error("into connectDB!");
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: {}
        };
        return new Promise((resolve, reject) => {
            let df_option = new DatebaseOption();
            let db_set = { ...df_option, ...db_option };
            //----------------------------------------
            if (this.checkConnect()) {
                logger.error("into checkConnect true!");
                resolve(true);
            } else {
                this.openDatabase(db_set).then(
                    (resObj) => {
                        logger.error("into openDatabase success");
                        logger.error("sqlite plugin connectDB() 65, resObj:", resObj);
                        this.dbObj = resObj;
                        this.dbOnFlag = true;
                        resolve(true);
                    },
                    () => {
                        logger.error("into openDatabase failed");
                        reject(false);
                    }
                );
            }
        });
    }
    /**
     * 全部流程結束才close
     */
    closeData(db_option) {
        logger.error("into plugin function onCreateData!");
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                let successCallback = (resObj) => {
                    logger.error("closeData(), closeDB successCallback");
                    output.status = true;
                    output.msg = 'DB close success';
                    output.data = resObj;
                    this.dbObj = null; 
                    this.dbOnFlag = false;
                    return Promise.resolve(output);
                }
                let errorCallback = (errorObj) => {
                    logger.error("closeData(), closeDB errorCallback");
                    output.status = false;
                    output.data = errorObj;
                    return Promise.reject(output);
                }
                logger.error("connectDB success!");
                this.dbObj.close(successCallback,errorCallback);
                this.dbObj = null;
                this.dbOnFlag = false;
                output.status = true;
                output.msg = 'DB close success';
                this.dbObj = null; 
                this.dbOnFlag = false;
                logger.error("closeData(), close end");
                return Promise.resolve(output);
            },
            () => {
                logger.error("connectDB failed!");
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
    }

    /**
     * DB 連線 Close
     */
    closeDB(): Promise<any> {
        logger.error("into closeDB!");
        return new Promise((resolve, reject) => {
            if (!this.checkConnect()) {
                logger.error("closeDB(), into !this.checkConnect() false");
                // db物件已消失
                resolve(true);
                return false;
            } else {
                logger.error("closeDB(), into this.checkConnect() true");
                // 成功回傳
                let successCalback = () => {
                    logger.error("closeDB(), successCalback");
                    this.dbObj = null;
                    this.dbOnFlag = false;
                    resolve(true);
                };
                // 失敗回傳
                let errorCalback = (err?: any) => {
                    logger.error('[ERROR] SqlitePlugin', 'closeDB', 'error close', err);
                    this.dbObj = null;
                    this.dbOnFlag = false;
                    reject(err);
                };

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'close');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'closeDB'
                            , 'miss close', typeof this.dbObj.close);
                        resolve(false);
                        return false;
                    }
                    this.dbObj.close(successCalback, errorCalback);
                } else {
                    successCalback();
                }
            }
        }).then(
            (checkDB) => {
                if (!checkDB) {
                    logger.error('[ERROR] SqlitePlugin', 'closeDB', 'not real close');
                }
                // 無論成功失敗都關閉
                this.dbObj = null;
                this.dbOnFlag = false;
                return Promise.resolve();
            }
        );
    }

    /**
     * 新建table(先檢查連線)
     * @param option 
     * @param db_option 
     */
    onCreateData(option: any = {}, db_option: any = {}) {
        logger.error("into plugin function onCreateData!");
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                logger.error("connectDB success!");
                return this.onCreate(option).then(
                    (resObj) => {
                        logger.error("create function success!");
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        logger.error("create function error!");
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.error("connectDB failed!");
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );
    }

    /**
     * 新建table
     * @param option 
     * @param db_option 
     */
    onCreate(option: any = {}) {
        logger.error("into plugin function onCreate!")
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                logger.error("checkConnect == true!");
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.table_name === '') {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.table_name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }

                //新建table1的欄位
                let field = '';
                if (typeof db_set.field !== 'string') {
                    field = db_set.field.join();
                    logger.error("column is array");
                } else {
                    field = db_set.field;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }

                // //新建table2的欄位
                // let field2 = '';
                // if (typeof db_set.field2 !== 'string') {
                //     field2 = db_set.field2.join(',');
                //     logger.error("column is array");
                // } else {
                //     field2 = db_set.field2;
                //     logger.error("column is string");
                // }
                // if (field2 === '') {
                //     field2 = '*';
                //     logger.error("column is empty");
                // }

                //ex: CREATE TABLE IF NOT EXISTS QrCodeStore (_id INTEGER primary key autoincrement, trans_date,trans_person,trans_amount,qr_code,trnsNo,stan);
                //create table1
                let sqlstr = "CREATE TABLE IF NOT EXISTS " + db_set.table_name + " (" + db_set.fied_id +
                    " INTEGER primary key autoincrement, " + field + ");";
                //string test
                // let sqlstr = "CREATE TABLE IF NOT EXISTS mitakeQrCodeStore ('_id INTEGER primary key autoincrement, trans_date, trans_person, trans_amount, qr_code, trnsNo, stan');"

                //ex: CREATE TABLE IF NOT EXISTS treatmentTable (_id INTEGER primary key autoincrement, trans_date,treatment_date,treatment_amount, FOREIGN KEY(trans_date) REFERENCES QrCodeStore(trans_date))
                //create table2
                let sqlstr2 = "CREATE TABLE IF NOT EXISTS " + db_set.table_name + " (" + db_set.fied_id +
                    " INTEGER primary key autoincrement, " + field + ", FOREIGN KEY(trans_date) REFERENCES QrCodeStore(trans_date));";
                //string test2
                // let sqlstr2 = "CREATE TABLE IF NOT EXISTS treatmentTable ('_id INTEGER primary key autoincrement, trans_date, treatment_date, treatment_amount, FOREIGN KEY(' trans_date ') REFERENCES mitakeQrCodeStore('trans_date')');"
                logger.error("sqlstr:", sqlstr);
                logger.error("sqlstr2:", sqlstr2);

                logger.step('SqlitePlugin', 'select sql', sqlstr);

                let successCalback = (resObj) => {
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                    if (typeof resObj === 'object' && resObj.hasOwnProperty('rows')) {
                        output.data = resObj;
                        output.status = true;
                        output.msg = '';
                        output.errorCode = '';
                        resolve(output);
                    } else {
                        logger.error('resObj not object or not has rows');
                        output.msg = 'ERROR.RSP_FORMATE_ERROR';
                        output.errorCode = 'RSP_FORMATE_ERROR';
                        reject(output);
                    }
                };

                let errorCallback = (errorObj) => {
                    output.msg = '新建資料失敗';
                    output.status = false;
                    output.errorCode = 'RSP_FORMATE_ERROR';
                    reject(output);
                }

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    if (db_set['type'] == '1') {
                        logger.error("onCreate() type == 1, executeSql(sqlstr)");
                        this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);
                    } else if (db_set['type'] == '2') {
                        logger.error("onCreate() type == 2, executeSql(sqlstr2)");
                        this.dbObj.executeSql(sqlstr2, [], successCalback, errorCallback);
                    }

                    // this.dbObj.executeSql(sqlstr2, [], successCalback);
                } else {
                    successCalback({
                        rows: [

                        ]
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    /**
     * Select_Count
     * @param option 
     * @param db_option 
     */
    selectCountData(option: any = {}, db_option: any = {}) {
        logger.error("into plugin function selectCountData!");
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                logger.error("connectDB success!");
                return this.selectCount(option).then(
                    (resObj) => {
                        logger.error("select function success!");
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        logger.error("select function error!");
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.error("connectDB failed!");
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );
    }

    /**
     * 檢查筆數
     * @param option 
     */
    selectCount(option: any = {}) {
        logger.error("sqlite plugin selectCount() 355, into plugin function selectCount!")
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                logger.error("sqlite plugin checkConnect() 365, checkConnect == true!");
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.table_name === '') {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.table_name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }

                let sqlstr = 'SELECT count(*) FROM sqlite_master WHERE type="table" AND name=' + '"' + db_set.table_name + '";';
                logger.step('SqlitePlugin', 'selectCount sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                    output.msg = '';
                    output.errorCode = '';
                    output.data = resObj;
                    // this.dbObj.close();
                    // if (output.data.rows.length == 0) {
                    //     output.status = true;
                    //     output.msg = '尚未建立資料,請先建立資料';
                    //     resolve(output);
                    //     return false;
                    // }
                    resolve(output);

                    // let tmp_data = ObjectCheckUtil.checkObjectList(resObj, 'rows.item');
                    // logger.error("selectCount(), tmp_data:",tmp_data);
                    // if (tmp_data) {
                    //     logger.error("into tmp_data true, checkObjectList function success");
                    //     output.status = true;
                    //     output.msg = '';
                    //     output.errorCode = '';
                    //     output.data = ObjectUtil.clone(tmp_data);
                    //     resolve(output);
                    // } else {
                    //     logger.error("into tmp_data false, checkObjectList function failed");
                    //     output.msg = 'ERROR.RSP_FORMATE_ERROR';
                    //     output.errorCode = 'RSP_FORMATE_ERROR';
                    //     reject(output);
                    // }
                };

                let errorCallback = (errorObj) => {
                    logger.error('sqlite plugin select() into errorCallback! 444, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '您尚未建立資料';
                    output.data = errorObj;
                    reject(errorObj);
                }

                if (environment.NATIVE) {
                    logger.error("NATIVE");
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);
                } else {
                    logger.error("Not NATIVE");
                    successCalback({
                        rows: [
                            { 'count(*)': 0 }
                        ]
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }


    /**
     * 
     * @param option 
     * @param db_option 
     */


    /**
     * 尋找資料(連線成功才查詢)
     * 尋找完就坐關閉
     */
    selectData(option: any = {}, db_option: any = {}): Promise<any> {
        logger.error("into plugin function selectData!");
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                logger.error("connectDB success!");
                return this.select(option).then(
                    (resObj) => {
                        logger.error("select function success!");
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        logger.error("select function error!");
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.error("connectDB failed!");
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );

    }


    /**
	 * 尋找資料
     * (請先執行connectDB)
	 */
    select(option: any = {}): Promise<any> {
        logger.error("sqlite plugin select() 362, into plugin function select!")
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                logger.error("sqlite plugin checkConnect() 372, checkConnect == true!");
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.name === '') {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }

                let field = '';
                if (typeof db_set.fields !== 'string') {
                    field = db_set.fields.join(',');
                    logger.error("column is array");
                } else {
                    field = db_set.fields;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }

                let order = '';
                if (typeof db_set.order !== 'string') {
                    order = db_set.order.join(',');
                    logger.error("order is array");
                } else {
                    order = db_set.order;
                    logger.error("order is string");
                }

                let sqlstr = 'SELECT ' + field + ' FROM ' + db_set.name;
                if (order !== '') {
                    sqlstr += ' ORDER BY ' + order;
                }

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                    output.data = resObj;
                    output.status = true;
                    output.msg = '';
                    output.errorCode = '';
                    resolve(output);

                    if (output.data.length == 0) {
                        logger.step("output.data is empty!");
                        output.msg = ''
                        return Promise.reject({
                            title: 'ERROR.TITLE',
                            content: 'ERROR.EMPTY'
                        });
                    }
                };

                let errorCallback = (errorObj) => {
                    logger.error('sqlite plugin select() into errorCallback! 444, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '尚未建立資料,請先建立資料';
                    reject(output);
                }

                if (environment.NATIVE) {
                    logger.error("NATIVE");
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);
                } else {
                    logger.error("Not NATIVE");
                    successCalback({
                        rows: {
                            item: [
                                {
                                    trans_date: '20160626143746',
                                    trans_person: '本人',
                                    trans_amount: '1000',
                                    qr_code: 'iahasdsdkxkzlzx',
                                    trnsNo: '100022300010',
                                    stan: '8786544'
                                },
                                {
                                    trans_date: '20160628153850',
                                    trans_person: '非本人',
                                    trans_amount: '1500',
                                    qr_code: 'iaaaxdshhjkzlzx',
                                    trnsNo: '100066300552',
                                    stan: '8786566'
                                },
                                {
                                    trans_date: '20160630153946',
                                    trans_person: '本人',
                                    trans_amount: '1300',
                                    qr_code: 'iahasdsdkxkzlzx',
                                    trnsNo: '100031300090',
                                    stan: '8786685'
                                }
                            ],
                            length: 2
                        }
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    //新增(連線成功才新增)
    insertData(option: any = {}, db_option: any = {}, table_data: string): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                logger.error("1. connectDB success!");
                return this.insert(option, table_data).then(
                    (resObj) => {
                        logger.error("2. insert function success!");
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        logger.error("insert function error!");
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.error("connectDB failed!");
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         logger.error("3. into close");
        //         logger.error("totalRes:",totalRes);
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         logger.error("totalError:",totalError)
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );
    }

    /**
 * 新增資料
 * (請先執行connectDB)
 */
    insert(option: any = {}, table_data: string): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.name === '') {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }
                // if (db_set.name2 === '') {
                //     logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.name);
                //     output.msg = 'ERROR.DATA_FORMAT_ERROR';
                //     output.errorCode = 'DATA_FORMAT_ERROR';
                //     reject(output);
                //     return false;
                // }

                let field = ''; //table1 欄位
                let value = ''; //table1 值
                //欄位:
                if (typeof db_set.field !== 'string') {
                    logger.error("db_set.field:", db_set.field);
                    field = db_set.field.join();
                    logger.error("column field is array");
                    logger.error("field:", field);
                    logger.error("typeof field:", typeof field);
                } else {
                    field = db_set.field;
                    logger.error("column field is string");
                }
                // if(typeof db_set.fields2 !== 'string') {
                //     field2 = db_set.fields2.join();
                //     logger.error("column fields2 is array");
                // } else {
                //     field2 = db_set.fields2;
                //     logger.error("column fields2 is string");
                // }
                if (field === '') {
                    field = '*';
                    logger.error("column field is empty");
                }

                // let sqlstr = 'INSERT INTO ' + db_set.name + "(" + db_set.fields + ")" + ' VALUES' + "('" + db_set.values + "')";
                let sqlstr = 'INSERT INTO ' + db_set.name + "(" + db_set.field + ")" + ' VALUES' + table_data;
                let sqlstr2 = 'INSERT INTO ' + db_set.name + "(" + db_set.field + ")" + ' VALUES' + table_data;
                // let sqlstr2 = 'INSERT INTO ' + db_set.name2 + "(" + db_set.fields + ")" + ' VALUES' + "('" + db_set.values + "')";

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    output.data = resObj;
                    output.status = true;
                    output.msg = '';
                    output.errorCode = '';
                    resolve(output);
                };

                let errorCallback = (errorObj) => {
                    logger.error('sqlite plugin insert() into errorCallback! 778, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '新增資料失敗';
                    reject(output);
                }

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    if (db_set['type'] == '1') {
                        logger.error("insert() type == 1, executeSql(sqlstr)");
                        this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);
                    } else if (db_set['type'] == '2') {
                        logger.error("insert() type == 2, executeSql(sqlstr2)");
                        this.dbObj.executeSql(sqlstr2, [], successCalback, errorCallback);
                    }

                } else {
                    successCalback({
                        rows: {
                            item: [

                            ]
                        },
                        length: 0
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    /**
   * 尋找資料join table(連線成功才查詢)
   * 尋找完就坐關閉
   */
    selectWithJoinData(option: any = {}, db_option: any = {}): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                return this.selectWithJoin(option).then(
                    (resObj) => {
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );

    }

    /**
 * 尋找資料 join table
 * (請先執行connectDB)
 */
    selectWithJoin(option: any = {}): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.table1_name === '' && db_set.table2_name) {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }


                let field = '';
                if (typeof db_set.fields !== 'string') {
                    field = db_set.fields.join(',');
                    logger.error("column is array");
                } else {
                    field = db_set.fields;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }


                let order = '';
                if (typeof db_set.order !== 'string') {
                    order = db_set.order.join(',');
                    logger.error("order is array");
                } else {
                    order = db_set.order;
                    logger.error("order is string");
                }

                let sqlstr = 'SELECT * FROM ' + db_set.table1_name + ' a INNER JOIN ' + db_set.table2_name + ' b ON a.' +
                    db_set.fields[0] + ' = b.' + db_set.fields[0] + ' WHERE b.' + db_set.fields[0] + " = '" + db_set.date + "' ORDER BY " + db_set.fields[0] + ' DESC';

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                    output.data = resObj;
                    output.status = true;
                    output.msg = '';
                    output.errorCode = '';
                    resolve(output);

                    if (output.data.length == 0) {
                        output.msg = ''
                        return Promise.reject({
                            title: 'ERROR.TITLE',
                            content: 'ERROR.EMPTY'
                        });
                    }
                };

                let errorCallback = (errorObj) => {
                    logger.error('sqlite plugin selectWithJoin() into errorCallback! 946, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '資料查詢失敗';
                    reject(output);
                }

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);
                } else {
                    successCalback({
                        rows: [
                            {
                                trans_date: '20160626143746',
                                treatment_date: '20160415153746',
                                treatment_amount: '1000'
                            },
                            {
                                trans_date: '20160628154052',
                                treatment_date: '20160416095625',
                                treatment_amount: '1200'
                            },
                            {
                                trans_date: '20160629093832',
                                treatment_date: '20160417124221',
                                treatment_amount: '1350'
                            }
                        ]

                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    /**
   * 刪除其中一筆
   * 尋找完就坐關閉
   */
    deleteDetailData(option: any = {}, db_option: any = {},type:string): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            (s) => {
                logger.error("connectDB(111), s");
                return this.deleteDetail(option,type).then(
                    (resObj) => {
                        logger.error("deleteDetailData(), sussess");
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        logger.error("deleteDetailData(), error");
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );
    }

    // /**
	//  * 刪除其中一筆
    //  * (請先執行connectDB)
	//  */
    // deleteDetail(option: any = {},type:string): Promise<any> {
    //     let output: any = {
    //         status: false,
    //         // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
    //         msg: 'ERROR.DEFAULT',
    //         errorCode: 'DEFAULT',
    //         data_1: [],
    //         data_2: []
    //     };
    //     return new Promise((resolve, reject) => {
    //         // if (this.checkConnect()) {
    //             let df_option = new SelectDbOption();
    //             let db_set = { ...df_option, ...option };

    //             if (db_set.table1_name === '' || db_set.table2_name === '') {
    //                 logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.name);
    //                 output.msg = 'ERROR.DATA_FORMAT_ERROR';
    //                 output.errorCode = 'DATA_FORMAT_ERROR';
    //                 reject(output);
    //                 return false;
    //             }

    //             let field = '';
    //             if (typeof db_set.fields !== 'string') {
    //                 field = db_set.fields.join(',');
    //                 logger.error("column is array");
    //             } else {
    //                 field = db_set.fields;
    //                 logger.error("column is string");
    //             }
    //             if (field === '') {
    //                 field = '*';
    //                 logger.error("column is empty");
    //             }

    //             // let sqlstr = 'DELETE FROM ' + db_set.table1_name + ' WHERE ' + db_set.fields[0] + ' = ' + db_set.date + ' AND ' + db_set.fields[1] + ' = ' + db_set.amount;
    //             // let sqlstr = 'DELETE FROM ' + table + " '" + db_set.date + "'";
    //             let sqlstr = 'DELETE FROM ' + db_set.table1_name + ' WHERE ' + "trans_date = '" + db_set.date + "';";
    //             let sqlstr2 = 'DELETE FROM ' + db_set.table2_name + ' WHERE ' + "trans_date = '" + db_set.date + "';";

    //             logger.step('SqlitePlugin', 'select sql', sqlstr);
    //             logger.error("sqlstr:", sqlstr);
    //             logger.error("sqlstr2:", sqlstr2);

                

    //             if (environment.NATIVE) {
    //                 let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
    //                 if (!check_method.status) {
    //                     logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
    //                     reject(output);
    //                     return false;
    //                 }
    //                 //執行刪除sql指令(先刪table1資料，再刪table2資料)
    //                 this.onDeleteExecuteSql(sqlstr).then(
    //                     (dtable1_success) => {
    //                         logger.error("onDeleteExecuteSql success:", dtable1_success);
    //                         //table1值刪除成功，再刪除table2值
    //                         let successCalback = (resObj) => {
    //                             logger.error("delete table2 data success");
    //                             logger.error('SqlitePlugin', 'successCalback', resObj);
    //                                 output.data_2 = resObj;
    //                                 output.data_1 = this.delete_table1_data.data;
    //                                 output.status = true;
    //                                 output.msg = '';
    //                                 output.errorCode = '';
    //                                 resolve(output);
    //                         };
            
    //                         let errorCallback = (errorObj) => {
    //                             logger.error("delete table2 data error");
    //                             logger.error('sqlite plugin deletetable1() into errorCallback! 1253, errorObj:', errorObj);
    //                             output.status = false;
    //                             output.msg = '資料刪除失敗';
    //                             reject(output);
    //                         }
    //                         this.dbObj.executeSql(sqlstr2, [], successCalback, errorCallback);
    //                     },
    //                     (dtable1_failed) => {
    //                         logger.error("onDeleteExecuteSql failed:", dtable1_failed);
    //                         output.status = false;
    //                         output.msg = '刪除資料失敗';
    //                         output.errorCode = 'RSP_FORMATE_ERROR';
    //                         reject(output);
    //                     }
    //                 );


    //                 // this.dbObj.executeSql(sqlstr, [], successCalback).then(
    //                 //     (success) => {
    //                 //         this.dbObj.executeSql(sqlstr2, [], successCalback);   
    //                 //     },
    //                 //     (error) => {

    //                 //     }
    //                 // );

    //             } else {
    //                 logger.error("not native return");
    //                 //  successCalback({
    //                 //     rows: {
    //                 //         item: []
    //                 //     }
    //                 // });
    //             }
    //         // } else {
    //         //     logger.step('SqlitePlugin', 'DB error');
    //         //     // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
    //         //     output.msg = 'ERROR.SQLITE_DB_ERROR';
    //         //     output.errorCode = 'MISS_DB';
    //         //     reject(output);
    //         // }
    //     });
    // }

    deleteTable1_data(option: any = {}, db_option: any = {}): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                return this.deletetable1(option).then(
                    (resObj) => {
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );
    }

    deletetable1(option): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.table_name === '') {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.table_name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }

                let field = '';
                if (typeof db_set.fied !== 'string') {
                    field = db_set.fied.join(',');
                    logger.error("column is array");
                } else {
                    field = db_set.fied;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }

                let sqlstr = 'DELETE FROM ' + db_set.table_name + ' WHERE ' + "trans_date = '" + db_set.date + "';";

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                    if (typeof resObj === 'object' && resObj.hasOwnProperty('rows')) {
                        output.data = resObj;
                        output.status = true;
                        output.msg = '';
                        output.errorCode = '';
                        resolve(output);
                    } else {
                        logger.error('resObj not object or not has rows');
                        output.msg = 'ERROR.RSP_FORMATE_ERROR';
                        output.errorCode = 'RSP_FORMATE_ERROR';
                        reject(output);
                    }
                };

                let errorCallback = (errorObj) => {
                    logger.error('sqlite plugin deletetable1() into errorCallback! 1253, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '資料刪除失敗';
                    reject(output);
                }

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);

                } else {
                    successCalback({
                        rows: {
                            item: []
                        }
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    //----------------------------- 此段為修改  -------------------------------------
        /**
	 * 刪除其中一筆
     * (請先執行connectDB)
	 */
    deleteDetail(option: any = {},type:string): Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            // if (this.checkConnect()) {
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                let field = '';
                if (typeof db_set.fields !== 'string') {
                    field = db_set.fields.join(',');
                    logger.error("column is array");
                } else {
                    field = db_set.fields;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }

                let sqlstr = 'DELETE FROM ' + db_set.table1_name + ' WHERE ' + "trans_date = '" + db_set.date + "';";
                let sqlstr2 = 'DELETE FROM ' + db_set.table2_name + ' WHERE ' + "trans_date = '" + db_set.date + "';";

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);
                logger.error("sqlstr2:", sqlstr2);

                let successCalback = (resObj) => {
                    logger.error("delete table data success");
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                        output.data = resObj;
                        output.status = true;
                        output.msg = '';
                        output.errorCode = '';
                        resolve(output);
                };

                let errorCallback = (errorObj) => {
                    logger.error("delete table data error");
                    logger.error('sqlite plugin deletetable1() into errorCallback! 1253, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '資料刪除失敗';
                    reject(output);
                }

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    //執行刪除table1
                    if(type=='1') {
                        logger.error("deleteDetail(), executeSql delete table1");
                        this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);
                    //執行刪除table2
                    } else {
                        logger.error("deleteDetail(), executeSql delete table2");
                        this.dbObj.executeSql(sqlstr2, [], successCalback, errorCallback);
                    }

                } else {
                    logger.error("not native return data");
                }
        });
    }
    //------------------------------------------------------------------------------

    onDeleteExecuteSql(sqlstr): Promise<any> {
        //執行刪除table1的欄位值
        logger.error("into function onDeleteExecuteSql");
        let successCallback_1 = (resObj) => {
            logger.error("SqlitePlugin", 'successCallback_1', resObj);
            this.delete_table1_data.data = resObj;
            this.delete_table1_data.status = true;
            this.delete_table1_data.msg = '';
            this.delete_table1_data.errorCode = '';
            return Promise.resolve(resObj);
        };

        let errorCallback_1 = (errorObj) => {
            logger.error("SqlitePlugin", 'errorCallback_1', errorObj);
            this.delete_table1_data.status = false;
            this.delete_table1_data.msg = '刪除資料失敗';
            this.delete_table1_data.errorCode = '';
            return Promise.reject(errorObj);
        };

        return this.dbObj.executeSql(sqlstr, [], successCallback_1, errorCallback_1);
    }

    //判斷有無儲存過資料
    checkInsertData(option: any = {}, db_option: any = {}) {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                return this.checkInsert(option).then(
                    (resObj) => {
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }     
        );
        // .then(
        //     (totalRes) => {
        //         this.closeDB();
        //         return Promise.resolve(totalRes);
        //     },
        //     (totalError) => {
        //         this.closeDB();
        //         return Promise.reject(totalError);
        //     }
        // );
    }

    //判斷有無儲存過資料
    checkInsert(option):Promise<any> {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.table_name === '') {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.table_name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }

                let field = '';
                if (typeof db_set.field !== 'string') {
                    field = db_set.field.join(',');
                    logger.error("column is array");
                } else {
                    field = db_set.field;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }

                let sqlstr = 'SELECT ' + db_set.field + ', count(*) FROM ' + db_set.table_name + ' WHERE ' + db_set.field + '="'+ db_set.value +'"';

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    logger.error('SqlitePlugin', 'successCalback', resObj);
                        output.data = resObj;
                        output.status = true;
                        output.msg = '';
                        output.errorCode = '';
                        resolve(output);
                };

                let errorCallback = (errorObj) => {
                    logger.error('sqlite plugin deletetable1() into errorCallback! 1253, errorObj:', errorObj);
                    output.status = false;
                    output.msg = '資料刪除失敗';
                    reject(output);
                }

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    this.dbObj.executeSql(sqlstr, [], successCalback, errorCallback);

                } else {
                    successCalback({
                        rows: {
                            item: []
                        }
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    onUpdateData(option: any = {}, db_option: any = {}) {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return this.connectDB(db_option).then(
            () => {
                return this.onUpdate(option).then(
                    (resObj) => {
                        return Promise.resolve(resObj);
                    },
                    (errorObj) => {
                        return Promise.reject(errorObj);
                    }
                );
            },
            () => {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                return Promise.reject(output);
            }
        ).then(
            (totalRes) => {
                this.closeDB();
                return Promise.resolve(totalRes);
            },
            (totalError) => {
                this.closeDB();
                return Promise.reject(totalError);
            }
        );
    }

    /**
     * 
     * @param option 修改
     * @param table 
     */
    onUpdate(option: any = {}) {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: []
        };
        return new Promise((resolve, reject) => {
            if (this.checkConnect()) {
                let df_option = new SelectDbOption();
                let db_set = { ...df_option, ...option };

                if (db_set.table1_name === '' && db_set.table2_name) {
                    logger.error('[ERROR] SqlitePlugin', 'miss table', db_set.name);
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    output.errorCode = 'DATA_FORMAT_ERROR';
                    reject(output);
                    return false;
                }

                let field = '';
                if (typeof db_set.fields !== 'string') {
                    field = db_set.fields.join(',');
                    logger.error("column is array");
                } else {
                    field = db_set.fields;
                    logger.error("column is string");
                }
                if (field === '') {
                    field = '*';
                    logger.error("column is empty");
                }

                let order = '';
                if (typeof db_set.order !== 'string') {
                    order = db_set.order.join(',');
                    logger.error("order is array");
                } else {
                    order = db_set.order;
                    logger.error("order is string");
                }

                let sqlstr = 'UPDATE ' + db_set.table_name + "SET trans_date = '" + db_set.date + "'";

                if (order !== '') {
                    sqlstr += ' ORDER BY ' + order;
                }

                logger.step('SqlitePlugin', 'select sql', sqlstr);
                logger.error("sqlstr:", sqlstr);

                let successCalback = (resObj) => {
                    logger.step('SqlitePlugin', 'successCalback', resObj);

                    let tmp_data = ObjectCheckUtil.checkObjectList(resObj, 'rows.item');
                    if (tmp_data) {
                        output.status = true;
                        output.msg = '';
                        output.errorCode = '';
                        output.data = ObjectUtil.clone(tmp_data);
                        resolve(output);
                    } else {
                        output.msg = 'ERROR.RSP_FORMATE_ERROR';
                        output.errorCode = 'RSP_FORMATE_ERROR';
                        reject(output);
                    }
                };

                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(this.dbObj, 'executeSql');
                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'miss executeSql', typeof this.dbObj.executeSql);
                        reject(output);
                        return false;
                    }
                    this.dbObj.executeSql(sqlstr, [], successCalback);
                } else {
                    successCalback({
                        rows: {
                            item: []
                        }
                    });
                }
            } else {
                logger.step('SqlitePlugin', 'DB error');
                // 很抱歉，資料連線異常！請聯絡系統管理員，謝謝！
                output.msg = 'ERROR.SQLITE_DB_ERROR';
                output.errorCode = 'MISS_DB';
                reject(output);
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private checkMethodExist(obj, methodName: string) {
        let output: any = {
            status: false,
            // 很抱歉，發生未預期的錯誤，請聯絡系統管理員，謝謝！
            msg: 'ERROR.DEFAULT',
            errorCode: 'DEFAULT',
            data: {}
        };
        if (!obj) {
            // 很抱歉，必要元件無法執行或異常，請聯絡系統管理員，謝謝！
            output.msg = 'ERROR.PLUGIN_ERROR';
            output.errorCode = 'MISS_DB';
            logger.error('[ERROR] SqlitePlugin', 'miss method', typeof obj);
        } else if (typeof obj[methodName] !== 'function') {
            // 很抱歉，必要元件無法執行或異常，請聯絡系統管理員，謝謝！
            output.msg = 'ERROR.PLUGIN_ERROR';
            output.errorCode = 'MISS_DB_METHOD';
            logger.error('[ERROR] SqlitePlugin', 'miss method', typeof obj[methodName]);
        } else {
            output.status = true;
            output.msg = '';
            output.errorCode = '';
            logger.step('SqlitePlugin', 'method exist', methodName);
        }
        return output;
    }



    /**
     * 取得db物件
     * @param option
     */
    private openDatabase(option: DatebaseOption): Promise<any> {
        return new Promise((resolve, reject) => {
            logger.error('sqlite plugin openDatabase() 1211, into openDatabase!');
            this.onDeviceReady.then(() => {
                let callbackEvent = (db) => {
                    if (db) {
                        logger.step('SqlitePlugin', 'openDatabase success');
                        resolve(db);
                    } else {
                        // 執行失敗
                        logger.error('[ERROR] SqlitePlugin', 'openDatabase', 'call back error', db);
                        reject(false);
                    }
                };
                if (environment.NATIVE) {
                    let check_method = this.checkMethodExist(sqlitePlugin, 'openDatabase');

                    if (!check_method.status) {
                        logger.error('[ERROR] SqlitePlugin', 'openDatabase'
                            , 'miss sqlitePlugin.openDatabase', typeof sqlitePlugin.openDatabase);
                        reject(false);
                        return false;
                    }
                    if (option.name === '') {
                        logger.error('[ERROR] SqlitePlugin', 'openDatabase', 'miss db name', option.name);
                        reject(false);
                        return false;
                    }
                    let errorCallBack =
                        (errorObj) => {
                            logger.error("sqlite plugin openDatabase() 1246, into openError");
                            reject(errorObj);
                        };

                    let successCallBack =
                        (successObj) => {
                            logger.error("sqlite plugin openDatabase() 1255, into openSuccess");
                            if (successObj) {
                                logger.error("sqlite plugin openDatabase() 1257, resolve(db_object.openargs)!");
                                resolve(this.db_Obj);
                            }
                        };


                    // let db_object = sqlitePlugin.openDatabase({
                    //     name: option.name,
                    //     location: option.location,
                    //     androidDatabaseProvider: option.androidDatabaseProvider
                    // }, successCallBack, errorCallBack);

                    this.db_Obj = sqlitePlugin.openDatabase({
                        name: option.name,
                        location: option.location,
                        androidDatabaseProvider: option.androidDatabaseProvider
                    }, successCallBack, errorCallBack);

                    //----------- 此段為修改 ----------------
                    // logger.error('sqlite plugin openDatabase() 1243, db_object:', db_object);
                    logger.error("sqlite plugin openDatabase() 1262, end");
                    // db_object(arg,succ,err);
                    // callbackEvent(db_object);
                    //--------------------------------

                    //舊版直接callback ------
                    // callbackEvent(db_object);
                    //-----------------------

                } else {
                    // 模擬
                    let simulate_db = new OpenDatabaseSimulation();
                    callbackEvent(simulate_db);
                }

            });
        });
    }

}
