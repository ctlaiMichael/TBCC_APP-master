/**
 *信用卡檢核
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FH000203ReqBody } from '@api/fh/fh000203/fh000203-req';
import { FH000208ApiService } from '@api/fh/fh000208/fh000208-api.service';
import { FH000208ReqBody } from '@api/fh/fh000208/fh000208-req';
import { CardCheckUtil } from '@shared/util/check/data/card-check-util';

@Injectable()

export class CreditcardCheckService {
    constructor(
        private _logger: Logger,
        private _hitrustPipeService: FormateService,
        private fh000203: FH000203ApiService,
        private fh000208: FH000208ApiService
    ) { }

    /**
	 * [checkCardNum 檢查信用卡卡號]
	 * @param  {string} str      [數字字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
    public checkCardNum(data, error_data) {
        let output_data = {
            status: false,
            msg: 'ERROR.DATA_FORMAT_ERROR',
            error: error_data,
            data: data
        };

        let check_data = CardCheckUtil.checkCard(data);
        output_data.error = check_data.error;
        this._logger.log("output_data:", output_data);
        if (check_data.status) {
            output_data.status = true;
            output_data.msg = '';
        }



        return output_data;
        // return CardCheckUtil.checkCardCode;
        // var data = {
        //     status: false,
        //     msg: '',
        //     CardNo: ''
        // };
        // if (str === "" || typeof str === 'undefined') {
        //     data.msg = "請輸入信用卡卡號";
        //     return data;
        // }
        // var res = /^[0-9]{16}$/;
        // if (!res.test(str)) {
        //     data.msg = "請輸入正確卡號";
        //     return data;
        // }
        // if (str.length === str.match(new RegExp(str.substr(0, 1), "g")).length) {
        //     //禁輸全一樣的值
        //     data.msg = "請輸入正確卡號";
        //     return data;
        // }

        // data.status = true;
        // data.msg = '';
        // data.CardNo = str;
        // return data;
    }


    //     /**
    // 	 * [checkYmData 檢查有效年月]
    // 	 * @param  {string} str      [數字字串]
    // 	 * @return {obj}	{status:blooean,msg:'error msg'}
    // 	 */
    //     public checkYmData(str) {
    //         var data = {
    //             status: false,
    //             msg: "",
    //             data: {}
    //         };

    //         if (typeof str === 'undefined' || str === '') {
    //             data.msg = "請輸入有效年月";
    //             return data;
    //         }
    //         let cardM: any = 0;
    //         let cardY: any = 0;
    //         //假如找的到" / "
    //         if (str.indexOf('/') > -1) {
    //             let tmp = str.split('/');
    //             cardM = parseInt(tmp[0]);
    //             cardY = tmp[1].toString();
    //             //假如使用者直接輸入西元年，取後兩位
    //             if (cardY.length > 2) {
    //                 cardY = cardY.substr(-2);
    //             }
    //             cardY = parseInt(cardY);
    //         } else {
    //             let tmp = str.replace('/', '');
    //             cardM = parseInt(tmp.substr(0, 2));
    //             cardY = parseInt(tmp.substr(2, 2));
    //         }

    //         if (!cardY || !cardM || cardY < 1 || cardM < 1 || cardM > 12) {
    //             data.msg = "Date error!";
    //             data.msg = "請輸入正確年月";
    //             return data;
    //         }
    //         cardM = ("0" + cardM).substr(-2);
    //         cardY = ("0" + cardY).substr(-2);
    //         let cardYearString = cardM + "" + cardY;

    //         //檢查有效年月長度
    //         let result;
    //         let res = /^[0-9]{4}$/;
    //         if (!res.test(cardYearString)) {
    //             // this._logger.log('length:'+cardYearString);
    //             data.msg = "請輸入正確年月";
    //             return data;
    //         }
    //         data.status = true;
    //         data.msg = '';
    //         data.data = {
    //             string: cardYearString, //MMYY
    //             m: cardM,
    //             y: cardY,
    //             formate: cardM + '/' + cardY
    //         };
    //         return data;
    //     }


    //     /**
    //  * [checkCardCode 檢查信用卡檢查碼]
    //  * @param  {string} str      [數字字串]
    //  * @return {obj}	{status:blooean,msg:'error msg'}
    //  */
    //     public checkCardCode(str) {
    //         var data = {
    //             status: false,
    //             msg: '',
    //             code: ''
    //         };
    //         if (typeof str === 'undefined' || str === '') {
    //             data.msg = '請輸入信用卡驗證碼';
    //             return data;
    //         }
    //         var res = /^[0-9]{3}$/;
    //         if (!res.test(str)) {
    //             data.msg = '請輸入正確驗證碼';
    //             return data;
    //         }
    //         data.status = true;
    //         data.msg = '';
    //         data.code = str;
    //         return data;
    //     }


    public sendData(inputData): Promise<any> {
        let req_data = {};
        req_data = inputData;
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
                req_data['trnsToken'] = tonken;
                this._logger.log("check req_data:", req_data);
                //發去給中台的(取得208電文結果頁資料)
                return this.sendAccount(req_data).then(
                    (sucess) => {
                        // resultAll.info_data = sucess.info_data;
                        // resultAll.data = sucess.data;
                        // this._logger.log("get result sucess!");
                        // this._logger.log("resultAll.info_data:", resultAll.info_data);
                        // resultAll.status = true;
                        // resultAll.msg = '';
                        return Promise.resolve(sucess);
                    },
                    (error) => {
                        let error_msg = "SendAccount failed!"
                        this._logger.log("get result error!");
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


    //拿到中台回傳的(208模擬電文)
    public sendAccount(req_data): Promise<any> {
        // let reqData = new FH000208ReqBody();
        // reqData = req_data;
        return this.fh000208.getData(req_data).then(
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
}