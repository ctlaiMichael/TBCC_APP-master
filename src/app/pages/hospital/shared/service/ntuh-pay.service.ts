/**
 *台大繳費
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FH000103ApiService } from '@api/fh/fh000103/fh000103-api.service';
import { FH000104ApiService } from '@api/fh/fh000104/fh000104-api.service';
import { SqlitePluginService } from "@lib/plugins/sqlite/sqlite-plugin.service";
import { HOSPIATL_SQLITE } from "@conf/sqlite/hospital-sqlite";
import { FH000104ReqBody } from "@api/fh/fh000104/fh000104-req";
import { AuthService } from "@core/auth/auth.service";
import { logger } from "@shared/util/log-util";

@Injectable()

export class NtuhPayService {

    error_msg = '';
    private dbOptionSet = {
        name: HOSPIATL_SQLITE.dbName
    };

    constructor(
        private _logger: Logger,
        private fh000103: FH000103ApiService,
        private fh000104: FH000104ApiService,
        private _sqliteService: SqlitePluginService,
        private authService: AuthService
    ) { }

    //fh000103
    getData(set_data): Promise<any> {

        return this.fh000103.getQuery(set_data).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }

    //生日轉為request格式 (YYYYMMDD)
    formate_birthday(set_data: string) {
        let output = {
            status: false,
            formate: '',
            data: set_data
        };
        let str = set_data.split('/');

        // logger.error("str:", str);
        // if (parseInt(str[1]) < 10) {
        //     str[1] = '0' + str[1];
        // }
        // if (parseInt(str[2]) < 10) {
        //     str[2] = '0' + str[2];
        // }
        output.formate = str[0] + str[1] + str[2];
        output.status = true;
        logger.error("output.formate:", output.formate);
        return output;
    }


    /**
* [checkIdentity 病歷號碼檢查]
* @param  {string} identity [病歷號碼檢查]
* @return {obj}	{status:blooean,msg:'error msg'}
*/

    //****病歷號碼尚未完成
    checkSickNumber(number) {
        let data = {
            status: false,
            msg: 'CHECK.SICK_NUMBER',
            data: ''
        };
        if (number === '') {
            data.status = false;
            return data;
        } else {
            number = number.toUpperCase();
            data.data = number;
            data.status = true;
            return data;
        }
    }


    //檢核isPayable值，是否會勾選(顯示)
    public checkData(set_data: any) {
        set_data.forEach(item => {
            let checkitem = false;
            let disabledItem = false;
            if (item['isPayable'] == 1 || 0) {
                checkitem = false;
                disabledItem = true;
            }
            if (item['isPayable'] == "") {
                this.error_msg = "Empty";
            }
            item['showCheck'] = checkitem;
            item['showDisabled'] = disabledItem;
        });
        return set_data;
    }

    //儲存需要臨櫃辦理的資料(列表)
    public notPayable(set_data) {
        let notPayData = [];
        set_data.forEach(item => {
            if (item.isPayable == '1') {
                notPayData.push(item);
            }
        });
        return notPayData;
    }


    /**
* [checkAmount 計算選取的帳單數]
* @param  {[type]} data [所有繳費清單]
* @param  {[type]} data_key  [指定資料]
* @return {[type]}      [description]
*/
    public checkAmount(set_data) {
        let amountData = {
            count: 0,
            amount: 0,
            list: []
        };
        set_data.forEach(item => {
            if (item.showCheck == true) {
                amountData.count++;
                amountData['amount'] += parseInt(item['patientOwnAmount']);
            }
        });
        return amountData;
    }

    //拿扣款帳號(先寫死)
    public accountSet() {
        let account = '0560766500639';
        return account;
    }

    //fh000104(結果頁)
    getResultData(set_data, security) {
        return this.fh000104.getQuery(set_data, security).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }

    //繳醫療費結果(憑證)
    /**
 * 送出資料
 * @param set_data 資訊
 */
    onSend(componentobj, security): Promise<any> {
        this._logger.log("into onSend!");
        this._logger.log("security:", security);
        let output = {
            info_data: {},
            msg: '',
            result: '',
            status: false
        };
        let reqHeader = {
            header: security.headerObj
        };
        return this.fh000104.getQuery(componentobj, reqHeader).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //更動成功
                    output.msg = '';
                    return Promise.resolve(jsonObj);
                } else {
                    output.status = false;
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        )
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

    /**
 * 刪除
 */
    // getDelete_table(item): Promise<any> {
    //     let option = {
    //         table_name: HOSPIATL_SQLITE.MainTable, //表格(主)
    //         fied: 'trans_date',
    //         date: item.trans_date, //選擇的交易日期
    //         amount: item.trans_amount //選擇的交易金額
    //     };
    //     return this._sqliteService.deleteDetailData(option, this.dbOptionSet).then(
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

    //檢查筆數
    //insert into table_1(Name,Adress,id)VALUES("Anson","33333","c123456789"),("Jeck","44444","d123456789");
    checkCount(detail, input_data, isMySelfPayment) {
        let output = {
            data: detail,
            formate: '',
            formate_table1: '',
            count: 0
        };
        let detail_obj = [];
        detail.forEach(item => {
            detail_obj.push("(" + '"' + input_data['trnsDttm'] + '",' + '"' + item['clinicDate'] + '",' + '"' + item['patientOwnAmount'] + '"' + ")");
            logger.error("checkCount(), detail_obj item:", detail_obj);
            output.count++;
        });
        logger.error("detail_obj:", detail_obj);
        output.formate = detail_obj.join() + ";";
        output.formate_table1 = "(" + '"' + input_data['trnsDttm'] + '",' + '"' + isMySelfPayment + '",' + '"' + input_data['totalAmount'] + '",'
            + '"' + input_data['specialInfo'] + '",' + '"' + input_data['trnsNo'] + '",' + '"' + input_data['stan'] + '");';
        logger.error("output.formate:", output.formate);
        return output;
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
    getCheckInsert(option: any = {}): Promise<any> {
        return this._sqliteService.checkInsertData(option, this.dbOptionSet).then(
            (success) => {
                logger.error("success");
                logger.error("getCheckInsert() service, success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                logger.error("failed");
                logger.error("getCheckInsert() service, failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    //全部流程完畢，執行close
    getClose(): Promise<any> {
        return this._sqliteService.closeData(this.dbOptionSet).then(
            (success) => {
                logger.error("success");
                logger.error("getCheckInsert() service, success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                logger.error("failed");
                logger.error("getCheckInsert() service, failed:", failed);
                return Promise.reject(failed);
            }
        );
    }
}