/**
 *台大繳費
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { SqlitePluginService } from "@lib/plugins/sqlite/sqlite-plugin.service";
import { HOSPIATL_SQLITE } from "@conf/sqlite/hospital-sqlite";
import { logger } from "@shared/util/log-util";

@Injectable()

export class QrCodeSaveService {

    private dbOptionSet = {
        name: HOSPIATL_SQLITE.dbName
    };

    constructor(
        private _logger: Logger,
        private _sqliteService: SqlitePluginService
    ) { }

    /**
     * 列表查詢(交易時間、對象、金額)
     */
    getSelect(): Promise<any> {
        let option = {
            name: HOSPIATL_SQLITE.MainTable, // table name
            fields: '*', // 欄位
            order: 'trans_date DESC' // 排序
        };
        this._logger.log("into service select!");
        return this._sqliteService.selectData(option, this.dbOptionSet).then(
            (success) => {
                this._logger.log("success!");
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed!");
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    //sqlite qr_code儲存區 （select用)
    public formate_array(set_data: any) {
        let output = [];
        for (let i = 0; i < set_data.length; i++) {
            // output.push(set_data[i].item(i));
            output.push(set_data.item(i));
        }
        logger.error("qr-code service, formate_array() ,output:",output);
        return output;
    }


    /**
     * 內容查詢(看診時間、金額)
     */
    getContent(set_date: string): Promise<any> {
        let option = {
            name: HOSPIATL_SQLITE.TreatmentTable // table name
            , fields: '*' // 欄位
            , order: 'trans_date DESC' // 排序
        };
        return this._sqliteService.selectData(option, this.dbOptionSet).then(
            (success) => {
                this._logger.log("success!");
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed!");
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 明細((foreign key為trans_date交易日期))
     */
    getQueryDetail(item): Promise<any> {
        let option = {
            table1_name: HOSPIATL_SQLITE.MainTable, //表格(主)
            table2_name: HOSPIATL_SQLITE.TreatmentTable, //表格
            fields: ['trans_date', 'treatment_amount'], //欄位
            order: 'trans_date DESC', //排序
            foreign_key: 'trans_date',
            date: item.trans_date, //選擇的交易日期
            amount: item.trans_amount //選擇的交易金額
        };
        return this._sqliteService.selectWithJoinData(option, this.dbOptionSet).then(
            (success) => {
                this._logger.log("success!");
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed!");
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );

    }

    /**
     * 刪除
     */
    getDelete(item,type): Promise<any> {
        let option = {
            table1_name: HOSPIATL_SQLITE.MainTable, //表格(主)
            table2_name: HOSPIATL_SQLITE.TreatmentTable, //表格
            fields: ['treatment_date', 'treatment_amount'], //欄位
            foreign_key: 'trans_date',
            date: item.trans_date, //選擇的交易日期
            amount: item.trans_amount //選擇的交易金額
        };
        logger.error("into getDelete()");
        logger.error("getDelete(), type:",type);
        return this._sqliteService.deleteDetailData(option, this.dbOptionSet,type).then(
            (success) => {
                logger.error("success!");
                logger.error("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                logger.error("failed!");
                logger.error("failed:", failed);
                return Promise.reject(failed);
            }
        );

    }


    /**
     * 新增qr code
     */
    getInsert(): Promise<any> {
        let option = {
            name1: HOSPIATL_SQLITE.MainTable,
            name2: HOSPIATL_SQLITE.TreatmentTable, // table name
            fields1: [], //table1 欄位
            values1: [], //table1 value
            fields2: [], //table2 欄位
            values2: [] //table2 value
        };
        return this._sqliteService.insertData(option, this.dbOptionSet, 'aaa').then(
            (success) => {
                this._logger.log("success!");
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed!");
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    // //需帶入 table名稱, 欄位
    // getCreate(): Promise<any> {
    //     let option = {
    //         table1_name: HOSPIATL_SQLITE.MainTable, //表格(主)
    //         table2_name: HOSPIATL_SQLITE.TreatmentTable, //表格
    //         fied_id: '_id',
    //         field1: [
    //             'trans_date', 'trans_person', 'trans_amount', 'qr_code', 'trnsNo', 'stan'
    //         ],
    //         field2: [
    //             'trans_date', 'treatment_date', 'treatment_amount'
    //         ],
    //         foreignKey: ""
    //     };
    //     return this._sqliteService.onCreateData(option, this.dbOptionSet).then(
    //         (success) => {
    //             this._logger.log("success!");
    //             this._logger.log("success:", success);
    //             return Promise.resolve(success);
    //         },
    //         (failed) => {
    //             this._logger.log("failed!");
    //             this._logger.log("failed:", failed);
    //             return Promise.reject(failed);
    //         }
    //     );
    // }

    //修改(帶入table_name)
    getUpdate(table: string, item): Promise<any> {
        let option = {
            table_name: table, //表格(主)
            fields: ['treatment_date'], //欄位
            date: item.trans_date, //選擇的交易日期
        };
        return this._sqliteService.onUpdateData(option, this.dbOptionSet).then(
            (success) => {
                this._logger.log("success!");
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed!");
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );

    }

    //--------------------------- 假設中台回傳資料 -----------------------------------
    //查詢MainTable全部*
    getMainTableAll() {
        let output = {
            "details": {
                "detail": [
                    {
                        "trans_date": "20120223105302", //交易日期
                        "trans_person": "本人", //交易對象
                        "trans_amount": "350", //交易金額
                        "qr_code": "", //QR_Code
                        "trnsNo": "A1122552325", //單據列印序號
                        "stan": "B8856545912", //交易序號
                    },
                    {
                        "trans_date": "20120312125302", //交易日期
                        "trans_person": "本人", //交易對象
                        "trans_amount": "550", //交易金額
                        "qr_code": "", //QR_Code
                        "trnsNo": "A1166252325", //單據列印序號
                        "stan": "B8829545912", //交易序號
                    },
                    {
                        "trans_date": "20120315105302", //交易日期
                        "trans_person": "本人", //交易對象
                        "trans_amount": "550", //交易金額
                        "qr_code": "", //QR_Code
                        "trnsNo": "A1126752325", //單據列印序號
                        "stan": "B8833675912", //交易序號
                    },
                    {
                        "trans_date": "20120323105302", //交易日期
                        "trans_person": "本人", //交易對象
                        "trans_amount": "1000", //交易金額
                        "qr_code": "", //QR_Code
                        "trnsNo": "A1125596325", //單據列印序號
                        "stan": "B891266945", //交易序號
                    },
                    {
                        "trans_date": "20120321105302", //交易日期
                        "trans_person": "非本人", //交易對象
                        "trans_amount": "560", //交易金額
                        "qr_code": "", //QR_Code
                        "trnsNo": "A1122948325", //單據列印序號
                        "stan": "B8856637512", //交易序號
                    },
                ]
            }
        };
        return output;
    }

    //查詢TreatmentTable全部
    getTreatment_specific() {
        let output = {
            "details": {
                "detail": [
                    {
                        "trans_date": "20120320103056",
                        "treatment_date": "20120320103056",
                        "treatment_amount": "1000"
                    },
                    {
                        "trans_date": "20120322113056",
                        "treatment_date": "20120322113056",
                        "treatment_amount": "1200"
                    },
                    {
                        "trans_date": "20120324123056",
                        "treatment_date": "20120324123056",
                        "treatment_amount": "1400"
                    },
                    {
                        "trans_date": "20120326093056",
                        "treatment_date": "20120326093056",
                        "treatment_amount": "1500"
                    },
                    {
                        "trans_date": "20120328073056",
                        "treatment_date": "20120328073056",
                        "treatment_amount": "1200"
                    },
                ]
            }
        };
        return output;
    }
}