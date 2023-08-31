/**
 *本人帳戶繳費Service
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { F4000103ReqBody } from '@api/f4/f4000103/f4000103-req';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FH000203ReqBody } from '@api/fh/fh000203/fh000203-req';
import { FH000202ApiService } from '@api/fh/fh000202/fh000202-api.service';
import { FH000202ReqBody } from '@api/fh/fh000202/fh000202-req';

@Injectable()
export class BankService {
    constructor(
        private _logger: Logger,
        private _hitrustPipeService: FormateService,
        private f4000103: F4000103ApiService,
        private fh000203: FH000203ApiService,
        private fh000202: FH000202ApiService
    ) { }



    //銀行代碼查詢
    public getBankCode(): Promise<any> {
        let reqData = new F4000103ReqBody();
        return this.f4000103.send(reqData).then(
            (sucess) => {
                this._logger.log(sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed) => {
                this._logger.log(failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        );
    }

    //拿到中台回傳的(202模擬電文)
    public sendAccount(req_data): Promise<any> {
        let reqData = new FH000202ReqBody();
        reqData = req_data; //將帶進方法的參數傳給req物件
        return this.fh000202.send(reqData).then(
            (sucess) => {
                this._logger.log(sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed) => {
                this._logger.log(failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        );
    }

    public sendData(reqData): Promise<any> {
            // let req_data = {};
            // req_data = reqData;
            let resultAll = {
                info_data: {},
                data: [],
                status: false,
                msg: ''
            };
            return this.getToken().then(
                (result) => {
                    let tonken: string = '';
                    tonken = result.data;
                    this._logger.log("get token sucess!", tonken);
                    reqData['trnsToken'] = tonken;
                    //發去給中台的(取得202電文結果頁資料)
                    return this.sendAccount(reqData).then(
                        (sucess) => {
                            resultAll.info_data = sucess.info_data;
                            resultAll.data = sucess.data;
                            this._logger.log("resultAll.info_data:", resultAll.info_data);
                            this._logger.log("get result sucess!");
                            resultAll.status = true;
                            resultAll.msg = '';
                            return Promise.resolve(resultAll);
                        },
                        (error) => {
                            let error_msg = ""
                            if (typeof error === 'object') {
                                error['msg'] = error_msg;
                                resultAll.status = false;
                                resultAll.msg = 'Get resultAll error!'
                                return Promise.reject(error);
                            }
                        }
                    );
                },
                (errorObj) => {
                    let error_msg = "Error!"
                    if (typeof errorObj === 'object') {
                        errorObj['msg'] = error_msg;
                    }
                    return Promise.reject(errorObj);
                }
            );
    }


    //拿到203電文回傳的trnsToken
    public getToken(): Promise<any> {
        let reqData = new FH000203ReqBody();
        return this.fh000203.send(reqData).then(
            (sucess) => {
                this._logger.log(sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed) => {
                this._logger.log(failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        );
    }



    //取得結果頁資料
    // public getResultData(inputData): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let output = {
    //             info_data: {},
    //             data: [],
    //             msg: "",
    //             status: false
    //         }

    //         let telegram = {};
    //         telegram = {
    //             custId: "",
    //             hospitalId: "CGMH",
    //             branchId: "3",
    //             trnsRsltCode: "0",
    //             hostCode: "4001",
    //             hostCodeMsg: "交易成功",
    //             trnsDttm: "20120223105532",
    //             recordDate: "101/02/23",
    //             stan: "5254233",
    //             trnsNo: "100022300001",
    //             refNo: "HX31335100002",
    //             personId: "A123456789",
    //             trnsOutBank: "004",
    //             trnsOutBankName: "台灣銀行",
    //             trnsOutAcct: "0090046944932",
    //             totalCount: "2",
    //             totalAmount: "630",
    //             trnsFee: "10",
    //             sumAmount: "640",
    //             detailInfoURL: "",
    //             rdetails: {
    //                 detail: [
    //                     { accountId: "2013121717551", clinicDate: "2012/02/23 10:30:26", amount: "350" }
    //                     , { accountId: "2013121717552", clinicDate: "2012/02/23 10:30:26", amount: "280" }
    //                 ]
    //             }
    //         }

    //         output.status = true;
    //         output.info_data = telegram;
    //         if (telegram.hasOwnProperty("rdetails") && telegram['rdetails'].hasOwnProperty("detail")
    //             && typeof telegram['rdetails']['detail'] === 'object') {
    //             output.data = telegram['rdetails']['detail'];
    //             if (!(telegram['rdetails']['detail'] instanceof Array)) {
    //                 output.data = [];
    //                 output.data = telegram['rdetails']['detail'];
    //             }
    //             if (output.data.length <= 0) {
    //                 output.msg = "Empty!"
    //                 reject(output);
    //                 return false;
    //             }
    //             resolve(output);
    //             output.status = true;
    //         }
    //     });
    // }
}