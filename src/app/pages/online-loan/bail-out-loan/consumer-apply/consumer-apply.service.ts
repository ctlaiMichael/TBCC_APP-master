/**
 *線上申貸 消費者貸款申請書(共用)
 */
import { Injectable, Output } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { CheckService } from "@shared/check/check.service";
import { TranslateService } from "@ngx-translate/core";
import { UserCheckUtil } from "@shared/util/check/data/user-check-util";
import { FormateService } from "@shared/formate/formate.service";

@Injectable()

export class ConsumerApplyService {

    constructor(
        private _logger: Logger
        , private checkService: CheckService
        , private translate: TranslateService
        , private _formateService: FormateService
    ) { }

    //判斷扶養子女數
    public checkChild(setData: string) {
        let output = {
            status: false,
            msg: '',
            data: setData
        };
        let checkNumber = this.checkService.checkNumber(setData);
        if (checkNumber['status'] == false) {
            output.status = false;
            output.msg = checkNumber['msg'];
            return output;
        }
        let checkTemp = parseInt(setData);
        if (setData != '' && typeof setData != 'undefined' && setData != null) {
            //為整數 && 不可為小數
            if (!isNaN(checkTemp) && setData.indexOf(".") < 0) {
                output.status = true;
                output.msg = '';
            } else {
                output.status = false;
                output.msg = '請輸入整數';
                return output;
            }
        } else {
            output.status = false;
            output.msg = '請輸入扶養子女數';
            return output;
        }
        return output;
    }

    //檢核郵遞區號
    public checkHomeCode(setData) {
        let output = {
            status: false,
            msg: '',
            data: setData
        };
        let checkNumber = this.checkService.checkNumber(setData, 'positive');
        if (checkNumber['status'] == false) {
            output.status = false;
            output.msg = checkNumber['msg'];
            return output;
        }
        if (setData.length < 3 || setData.length > 6) {
            this._logger.log("into length != 3");
            output.status = false;
            output.msg = '請輸入整數3~6位';
            return output;
        }
        let checkTemp = parseInt(setData);
        if (setData != '' && typeof setData != 'undefined' && setData != null) {
            //為整數 && 不可為小數
            if (!isNaN(checkTemp) && setData.indexOf(".") < 0) {
                output.status = true;
                output.msg = '';
            } else {
                output.status = false;
                output.msg = '請輸入整數';
            }
        } else {
            output.status = false;
            output.msg = '請輸入郵遞區號';
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
            output.msg = '請輸入本人年收入';
        }
        return output;
    }

    //取得性別
    public getSex(setData: string) {
        this._logger.log("getSex, setData:", setData);
        let output = {
            status: false,
            msg: '',
            data: '',
            type: ''
        };
        let key = setData.substring(1, 2);
        this._logger.log("key:", key);
        if (key == '1') {
            output.type = '1';
            output.data = '男';
            output.msg = 'success';
            output.status = true;
        } else if (key == '2') {
            output.type = '2';
            output.data = '女';
            output.msg = 'success';
            output.status = true;
        } else {
            output.type = '';
            output.data = '無';
            output.msg = 'error';
            output.status = false;
        }
        return output;
    }

    //檢核預計申請金額 5~100整數
    //type '1':房貸， '2':信貸
    public checkGiveAmt(setData: string, type) {
        let output = {
            status: false,
            msg: '',
            data: setData
        };
        if (type == '1') {
            if (parseInt(setData) < 10 || parseInt(setData) > 99999) {
                output.status = false;
                output.msg = '請輸入10-99999數字整數';
            } else {
                output.status = true;
                output.msg = '';
            }
        } else {
            if (parseInt(setData) < 1 || parseInt(setData) > 10) {
                output.status = false;
                output.msg = '請輸入1-10數字整數';
            } else {
                output.status = true;
                output.msg = '';
            }
        }
        return output;
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

    //計算中英文長度
    calcuLength(str: string, max) {
        this._logger.log("max:", max);
        this._logger.log("str:", str);
        this._logger.log("str.length:", str.length);
        let output = {
            status: false,
            msg: '',
            data: str
        };
        let chinese = 0;
        let english = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            if (parseInt(c) < 256) {
                english++;
            } else {
                chinese++;
            }
        }
        let len = chinese * 2 + english;
        this._logger.log("len:", len);
        //規則處理，字串長度不可大於110
        if (len > max) {
            this._logger.log("into len > max");
            output.status = false;
            output.msg = '輸入地址過長，請輸入正確資料';
        } else {
            this._logger.log("into checkLen success")
            output.status = true;
            output.msg = '';
        }
        return output;
    }

    //取得配偶年收入
    //配偶年收入: 家庭年收入扣掉個人年收入
    public getSpouseNt(personal, family) {
        let output = {
            status: false,
            msg: '',
            data: '' //配偶
        };
        let personal_Nt = parseInt(personal);
        let family_Nt = parseInt(family);
        if (personal == '' || personal == null || typeof personal == 'undefined') {
            personal_Nt = 0;
        }
        if (family == '' || family == null || typeof family == 'undefined') {
            family_Nt = 0;
        }
        let couple = family_Nt - personal_Nt;
        output.data = couple.toString();
        return output;
    }

    public getApplyBir(setData: string) {
        let output = {
            status: false,
            msg: '',
            data: ''
        };
        let str = parseInt(setData.substring(0, 3)) + 1911;
        let last = setData.substring(3, 7);
        output.data = str.toString() + last;
        return output;
    }

    /**
     * 電話檢查
     * @param str 
     * @param allow_mobile 
     */
    checkTel(str, allow_mobile?: boolean) {
        let output = {
            status: false,
            msg: '',
            data: str
        };
        if (allow_mobile != false) {
            allow_mobile = true;
        }

        let checkSuccess = false;
        let error_list = [];
        let reg = /^[0]{1}[1-8]{1}[1-9]{0,2}\d{7,8}$/;
        if (reg.test(str)) {
            checkSuccess = true;
        } else {
            error_list.push('CHECK.PHONE.LOANM10');
        }
        // let check_number = this.checkService.checkNumber(str, 'positive'); //家用
        // if (!check_number.status) {
        //     error_list.push('CHECK.PHONE.LOANM10');
        // } else {
        //     let check_applyTel = this.checkService.checkTel(str); //家用
        //     if (!check_applyTel.status) {
        //         //去除分機(訊息)
        //         if (check_applyTel['msg'] == 'CHECK.PHONE.CUSTOM09') {
        //             check_applyTel['msg'] = 'CHECK.PHONE.LOANM10';
        //         }
        //         error_list.push(check_applyTel.msg);
        //     } else {
        //         checkSuccess = true;
        //     }
        // }

        if (allow_mobile == true) {
            let check_applymobile = UserCheckUtil.checkMobile(str); //電話
            if (!check_applymobile.status) {
                //手機處理(訊息)
                if (check_applymobile['msg'] == 'CHECK.MOBILE') {
                    check_applymobile['msg'] = 'CHECK.PHONE.LOANM11';
                }
                error_list.push(check_applymobile.msg);
            } else {
                checkSuccess = true;
            }
        }


        if (checkSuccess) {
            output.status = true;
            output.msg = '';
        } else {
            // output.msg = error_list.join('or');
            let new_error = [];
            // new_error = error_list;
            error_list.forEach(item => {
                this.translate.get(item).subscribe((val) => {
                    new_error.push(val);
                });
            });
            output.msg = new_error.join(' 或 ');
        }

        return output;
    }

    //檢核員工人數
    checkApplyWorker(str) {
        let output = {
            status: false,
            data: str,
            msg: ''
        };
        let checkworker = this.checkService.checkNumber(str, 'positive');
        if (checkworker['status'] == false) {
            output.status = false;
            output.msg = checkworker['msg'];
            return output;
        } else {
            let checkNumber = parseInt(str);
            if (checkNumber <= 0 || checkNumber > 99999999) {
                output.status = false;
                output.msg = '請輸入正確人數';
                return output;
            } else {
                output.status = true;
                output.msg = '';
                return output;
            }
        }
    }

    //檢核出生年月日(預填單使用)
    checkResverBirth(str) {
        let output = {
            status: false,
            msg: '',
            data: ''
        };
        let checkEmpty = this.checkService.checkEmpty(str);
        if (checkEmpty['status'] == false) {
            output.status = false;
            output.msg = '請輸入正確日期格式';
            this._logger.log("into checkEmpty error, output:", output);
            return output;
        } else {
            this._logger.log("into checkEmpty success");
            let checkEight = /^[0-9]{8}$/;
            if (!checkEight.test(str)) {
                output.status = false;
                output.msg = '請輸入正確日期格式';
                this._logger.log("into checkEight error, output:", output);
                return output;
            }
        }
        this._logger.log("into checkEight success");
        let checkDate = this.checkDate(str);
        if (checkDate['status'] == false) {
            output.status = false;
            output.msg = checkDate['msg'];
            this._logger.log("into checkDate error, output:", output);
            return output;
        }
        this._logger.log("into success end, output:", output);
        return output;
    }

    /**
  * 日期檢查
  * @param str 日期
  */
    checkDate(str: string, return_flag?: any) {
        this._logger.log("into checkDate, str:", str);
        const data = {
            status: false,
            msg: 'CHECK.DATE.ERROR',
            // formate: '',
            // time: 0,
            // data_list: {},
            // date: {}
        };
        let date = this._formateService.transDate(str, 'date');
        this._logger.log("date:", date);
        let check = this.checkService.checkDate(date);
        if (check['status'] == true) {
            this._logger.log("into check['status']");
            data['status'] = true;
        } else {
            this._logger.log("into !check['status']");
            data['status'] = false;
        }
        // let setYear = str.substring(0, 4);
        // let setMonth = str.substring(4, 6);
        // let setDate = str.substring(6, 8);
        // this._logger.log("setYear:", setYear);
        // this._logger.log("setMonth:", setMonth);
        // this._logger.log("setDate:", setDate);
        // let birth = setYear + '/' + setMonth + '/' + setDate;
        // this._logger.log("birth:", birth);

        // const dt = new Date(birth);
        // const timestamp = dt.getTime();
        // if (timestamp) {
        //     const month = dt.getMonth() + 1;
        //     const day = dt.getDate();
        //     const year = dt.getFullYear();
        //     data.status = true;
        //     data.msg = '';
        //     data.formate = year + '/' + month + '/' + day;
        //     data.time = timestamp;
        //     data.data_list = {
        //         'y': year,
        //         'm': month,
        //         'd': day,
        //         'h': dt.getHours(),
        //         'i': dt.getMinutes(),
        //         's': dt.getSeconds()
        //     };
        //     data.date = dt;
        // }
        return data;
    }
}
