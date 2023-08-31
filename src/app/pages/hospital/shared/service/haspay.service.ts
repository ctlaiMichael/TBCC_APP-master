/**
 *已繳醫療費查詢
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FH000105ApiService } from '@api/fh/fh000105/fh000105-api.service';
import { FH000106ApiService } from "@api/fh/fh000106/fh000106-api.service";
import { HOSPIATL_SQLITE } from "@conf/sqlite/hospital-sqlite";
import { SqlitePluginService } from "@lib/plugins/sqlite/sqlite-plugin.service";
import { logger } from "@shared/util/log-util";

@Injectable()

export class HasPayService {
    constructor(
        private _logger: Logger,
        private fh000105: FH000105ApiService,
        private fh000106: FH000106ApiService,
        private _sqliteService: SqlitePluginService
    ) { }

    private dbOptionSet = {
        name: HOSPIATL_SQLITE.dbName
    };

    //已繳交醫療費查詢
    getData(set_data): Promise<any> {
        this._logger.log("set_data:", set_data);
        return this.fh000105.getData(set_data).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }

    //已繳交醫療費明細查詢
    getDeatil(set_data): Promise<any> {
        return this.fh000106.getData(set_data).then(
            (success) => {
                return Promise.resolve(success);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }

    //轉換日期，送結果前
    mappingDate(set_data) {
        let outputData = {
            startDate: '',
            endDate: ''
        }
        set_data['startDate'] = set_data['startDate'].split('-');
        outputData['startDate'] = set_data['startDate'][0] + set_data['startDate'][1] + set_data['startDate'][2];
        set_data['endDate'] = set_data['endDate'].split('-');
        outputData['endDate'] = set_data['endDate'][0] + set_data['endDate'][1] + set_data['endDate'][2];
        return outputData;
    }

    //日期換算
    public dateFormate(period: string) {
        let dateOutput = {
            year: '',
            month: '',
            date: '',
            dateformate: '',
            today: ''
        }

        //抓現年月日
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();

        //前七天
        if (period == 'forWeek') {
            let before = +today - 1000 * 60 * 60 * 24 * 7;
            let beforeDate = new Date(before);
            dateOutput.year = this.dateTurn(beforeDate).year;
            dateOutput.month = this.dateTurn(beforeDate).month;
            dateOutput.date = this.dateTurn(beforeDate).date;
            dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
            dateOutput.today = this.dateTurn(today).dateformate;

            //前一個月
        } else if (period == 'forMonth') {
            this._logger.log("into forMonth!");
            //判斷大月
            if (month == 1 || 3 || 5 || 7 || 8 || 10 || 12) {
                let before = +today - 1000 * 60 * 60 * 24 * 31;
                let beforeDate = new Date(before);
                dateOutput.year = this.dateTurn(beforeDate).year;
                dateOutput.month = this.dateTurn(beforeDate).month;
                dateOutput.date = this.dateTurn(beforeDate).date;
                dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
                dateOutput.today = this.dateTurn(today).dateformate;
                //判斷小月  
            } else if (month == 4 || 6 || 9 || 11) {
                let before = +today - 1000 * 60 * 60 * 24 * 30;
                let beforeDate = new Date(before);
                dateOutput.year = this.dateTurn(beforeDate).year;
                dateOutput.month = this.dateTurn(beforeDate).month;
                dateOutput.date = this.dateTurn(beforeDate).date;
                dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
                dateOutput.today = this.dateTurn(today).dateformate;
            }

            //判斷是否為閏年
            if (month == 2 && date > 28) {
                //閏年(29天)
                if ((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0)) {
                    let before = +today - 1000 * 60 * 60 * 24 * 29;
                    let beforeDate = new Date(before);
                    this.dateTurn(beforeDate);
                    dateOutput.year = this.dateTurn(beforeDate).year;
                    dateOutput.month = this.dateTurn(beforeDate).month;
                    dateOutput.date = this.dateTurn(beforeDate).date;
                    dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
                    dateOutput.today = this.dateTurn(today).dateformate;
                } else {
                    //平年(28天)
                    if ((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0)) {
                        let before = +today - 1000 * 60 * 60 * 24 * 28;
                        let beforeDate = new Date(before);
                        this.dateTurn(beforeDate);
                        dateOutput.year = this.dateTurn(beforeDate).year;
                        dateOutput.month = this.dateTurn(beforeDate).month;
                        dateOutput.date = this.dateTurn(beforeDate).date;
                        dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
                        dateOutput.today = this.dateTurn(today).dateformate;
                    }
                }
            }

        }
        return dateOutput;
    }

    public dateTurn(dateFormate: any) {
        let outDateData = {
            year: '',
            month: '',
            date: '',
            dateformate: '',
        }
        let month = dateFormate.getMonth() + 1;
        let date = dateFormate.getDate();

        outDateData.year = (dateFormate.getFullYear()).toString();
        if (date < 10) {
            outDateData.date = '0' + (date.toString());
        } else {
            outDateData.date = date.toString();
        }
        if (month < 10) {
            // outDateData.month = '0'+(dateFormate.getMonth()).toString();
            outDateData.month = '0' + month.toString();
        } else {
            outDateData.month = month.toString();
        }
        outDateData.dateformate = outDateData.year + "-" + outDateData.month + "-" + outDateData.date;
        return outDateData;
    }

    //檢查時間(迄日)
    check_date_end(set_date) {
        let output = {
            status: false,
            data: set_date,
            msg: ''
        };
        if (set_date == '') {
            output.status = false;
            output.msg = '請選擇查詢迄日';
        } else {
            let date = set_date + ' 00:00:00';
            let secondsTime = new Date(date).getTime();
            let today = new Date().getTime();
            if (secondsTime > today) {
                output.status = false;
                output.msg = '查詢迄日不可高於今日';
            } else {
                output.status = true;
                output.msg = '';
            }
        }
        return output;
    }

    //檢查時間(起日)
    check_date_start(set_date) {
        let output = {
            status: false,
            data: set_date,
            msg: ''
        };
        if (set_date == '') {
            output.status = false;
            output.msg = '請選擇查詢起日';
        } else {
            output.status = true;
            output.msg = '';
        }
        return output;
    }

        //檢查筆數
    //insert into table_1(Name,Adress,id)VALUES("Anson","33333","c123456789"),("Jeck","44444","d123456789");
    checkCount(detail,input_data) {
        let output = {
            data: detail,
            formate: '',
            formate_table1:'',
            count: 0
        };
        let detail_obj = [];
        detail.forEach(item => {
            detail_obj.push("(" + '"'+ input_data['trnsDttm'] + '",' + '"' + item['clinicDate'] + '",' + '"' + item['patientOwnAmount'] + '"' + ")");
            logger.error("checkCount(), detail_obj item:",detail_obj);
            output.count++;
        });
        logger.error("detail_obj:",detail_obj);
        output.formate = detail_obj.join() + ";";
        output.formate_table1 = "(" + '"' + input_data['trnsDttm'] + '",' + '"' + input_data['isMySelfPayment'] + '",' + '"' + input_data['totalAmount'] + '",'
        + '"' + input_data['specialInfo'] + '",' + '"' + input_data['trnsNo'] + '",' + '"' + input_data['stan'] + '");';
        logger.error("output.formate:",output.formate);
        return output;
    }

    // /**
    //  * sqlite 新增function
    //  */
    // getInsert(): Promise<any> {
    //     let option = {
    //         name: HOSPIATL_SQLITE.TreatmentTable, // table name
    //         fields: '', // 欄位(放使用者選取的)
    //         values: ''
    //     };
    //     return this._sqliteService.insertData(option,this.dbOptionSet,'aaa').then(
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

    //----------------------------  sqlite function  -----------------------------------

    //判斷筆數，0:table不存在，1:table存在
    getSelectCount(option, dbOptionSet): Promise<any> {
        return this._sqliteService.selectCountData(option, dbOptionSet).then(
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


    //需帶入 table名稱, 欄位
    getCreate(option, dbOptionSet): Promise<any> {
        // let option = {
        //     table1_name: HOSPIATL_SQLITE.MainTable, //表格(主)
        //     table2_name: HOSPIATL_SQLITE.TreatmentTable, //表格
        //     fied_id: '_id',
        //     field1: [
        //         'trans_date', 'trans_person', 'trans_amount', 'qr_code', 'trnsNo', 'stan'
        //     ],
        //     field2: [
        //         'trans_date', 'treatment_date', 'treatment_amount'
        //     ],
        //     foreignKey: ""
        // };
        return this._sqliteService.onCreateData(option, dbOptionSet).then(
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
    * qr code insert
    */
    /**
 * 新增qr code
 */
    getInsert(table_data, trans_person: string, option: any = {}): Promise<any> {
        // let option = {
        //     name1: HOSPIATL_SQLITE.MainTable, // table name
        //     fields1: ['trans_date', 'trans_person', 'trans_amount', 'qr_code', 'trnsNo', 'stan'], // 欄位(放使用者選取的) table1
        //     // fields2: ['trans_date','treatment_date','treatment_amount'], //table2
        //     values1: [], //table1
        // };

        // option.values.push(table_data['trnsDttm']);
        // option.values.push(trans_person);
        // option.values.push(table_data['totalAmount']);
        // option.values.push(table_data['specialInfo']);
        // option.values.push(table_data['trnsNo']);
        // option.values.push(table_data['stan']);
        this._logger.log("option.values:", option.values1);
        return this._sqliteService.insertData(option, this.dbOptionSet, table_data).then(
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


    //刪除，之前新增的資料(table2流程出錯呼叫)
    getDelete(item): Promise<any> {
        let option = {
            table_name: HOSPIATL_SQLITE.MainTable, //表格(主)
            fied: 'trans_date',
            date: item.trnsDttm, //選擇的交易日期
        };
        return this._sqliteService.deleteTable1_data(option, this.dbOptionSet).then(
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

    //新增前先檢查是否有此筆資料(用trans_date)
    getCheckInsert(option: any = {}):Promise<any> {
        return this._sqliteService.checkInsertData(option, this.dbOptionSet).then(
            (success) => {
                logger.error("success");
                logger.error("getCheckInsert() service, success:",success);
                return Promise.resolve(success);
            },
            (failed) => {
                logger.error("failed");
                logger.error("getCheckInsert() service, failed:",failed);
                return Promise.reject(failed);
            }
        );
    }

    //全部流程完畢，執行close
    getClose():Promise<any> {
        return this._sqliteService.closeData(this.dbOptionSet).then(
            (success) => {
                logger.error("success");
                logger.error("getCheckInsert() service, success:",success);
                return Promise.resolve(success);
            },
            (failed) => {
                logger.error("failed");
                logger.error("getCheckInsert() service, failed:",failed);
                return Promise.reject(failed);
            }
        );
    }
}