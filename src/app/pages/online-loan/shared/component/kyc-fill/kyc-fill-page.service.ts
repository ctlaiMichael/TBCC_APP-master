/**
 *線上申貸 kyc表單(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000405ApiService } from "@api/f9/f9000405/f9000405-api.service";
import { CheckService } from "@shared/check/check.service";
import { F9000100ApiService } from "@api/f9/f9000100/f9000100-api.service";
import { F9000100ReqBody } from "@api/f9/f9000100/f9000100-req";

@Injectable()

export class KycFillPageService {

    constructor(
        private _logger: Logger,
        private f9000405: F9000405ApiService,
        private f9000100: F9000100ApiService,
        private _checkService: CheckService,
        private checkService: CheckService
    ) { }
    mainData = {};
    //查最近兩年
    public getRecentYear() {
        let output = [];
        let today = new Date();
        this._logger.log("service today:", today);
        let year = today.getFullYear() - 1911;
        let year2 = year - 1;
        this._logger.log("service year:", year);
        this._logger.log("service year2:", year2);
        output.push(year.toString());
        output.push(year2.toString());
        this._logger.log("service output year:", output);
        return output;
    }
    //取得年齡(民國年)
    public getAge(birth: string) {
        //birth: 生日民國年
        let birthYear = birth.substring(0, 3);
        let today = new Date();
        let year = today.getFullYear() - 1911; //現在民國年
        let age = (year - parseInt(birthYear)).toString();
        return age;
    }

    //儲存kyc資料
    public getSaveKyc(setData): Promise<any> {
        return this.f9000405.getData(setData).then(
            (success) => {
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    //檢核預計申請金額 5~100整數
    //type '1':房貸， '2':信貸
    public checkGiveAmt(setData: string, type) {
        let output = {
            status: false,
            msg: '',
            data: setData
        };
        let checkM = this._checkService.checkMoney(setData, { currency: 'TWD' });
        if (checkM['status'] == false) {
            output.status = false;
            output.msg = checkM['msg'];
        } else {
            if (type == '1') {
                if (parseInt(setData) < 10 || parseInt(setData) > 99999) {
                    output.status = false;
                    output.msg = '請輸入10-99999數字整數';
                } else {
                    output.status = true;
                    output.msg = '';
                }
            } else {
                if (parseInt(setData) < 5 || parseInt(setData) > 200) {
                    output.status = false;
                    output.msg = '請輸入5-200數字整數';
                } else {
                    output.status = true;
                    output.msg = '';
                }
            }
        }
        return output;
    }


    //檢核學生、農林漁牧、無業、家管、退休人員
    public checkSpecialJob(setData: string) {
        let output = {
            status: false,
            msg: '',
            data: setData
        };
        let checkJob = /^[0-9]*$/; //只能輸入數字
        if (setData != '' && typeof setData != 'undefined' && setData != null) {
            if (checkJob.test(setData)) {
                output.status = true;
                output.msg = 'success';
            } else {
                output.status = false;
                output.msg = '請輸入數字';
            }
        } else {
            output.status = false;
            output.msg = '請輸入個人年收入';
        }
        return output;
    }

    //檢核 原貸款總金額需大於等於 貸款餘額
    /** 
     * total:原貸款總金額，remain:餘額
    */
    public checKycElmo(total, remain) {
        let output = {
            status: false,
            data: {
                original: total,
                total: remain
            },
            msg: ''
        };
        let t_money = parseInt(total);
        let r_money = parseInt(remain);
        if (t_money < r_money) {
            output.status = false;
            output.msg = '請輸入正確金額';
        } else {
            output.status = true;
            output.msg = '';
        }
        return output;
    }

    public getClose(): Promise<any> {
        this._logger.log("into getClose()");
        let reqData = new F9000100ReqBody();
        return this.f9000100.getData(reqData).then(
            (success) => {
                this._logger.log("success:", success);
                // this.mainData['list'] = success.data;
                // let modify_data = this.formateBranch(success.data);
                let modify_data = success.data;
                success['_modify'] = modify_data;
                this.mainData = modify_data;
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    /**
 * 文字檢查
 * @param str 字串
 * @param len 長度
 * @param empty 是否可以為空(true 可為空)
 */
    checkText(str: string, len?: number, empty?: boolean) {
        this._logger.log("into 1. checkText service");
        let output = {
            status: false,
            msg: ''
        };
        if (typeof empty == 'undefined' || !empty) {
            let checkEmpty = this.checkService.checkEmpty(str);
            if (checkEmpty['status'] == false) {
                this._logger.log("return checkEmpty error");
                output.msg = '請輸入資料';
                return output;
            }
        }
        let check_len = this.checkService.checkLength(str, len, 'max');
        if (!check_len.status) {
            this._logger.log("return checkLength error");
            output.msg = check_len.msg;
            return output;
        }
        let check_tex = this.checkService.checkText(str, 'base_symbol');
        if (!check_tex.status) {
            this._logger.log("return checkText error");
            output.msg = check_tex.msg;
            return output;
        }
        output.status = true;
        output.msg = '';
        return output;
    }

    //檢核張數
    checkTicket(setData) {
        let output = {
            status: false,
            msg: '',
            data: setData
        };
        let checkTicket = this._checkService.checkNumber(setData,'positive');
        if (checkTicket['status'] == false) {
            output.status = false;
            output.msg = checkTicket['msg'];
            return output;
        }
        let mass = parseInt(setData);
        if (mass < 1 || mass > 999) {
            output.status = false;
            output.msg = '請輸入正確數量';
            return output;
        } else {
            output.status = true;
            output.msg = '';
            return output;
        }
    }
}