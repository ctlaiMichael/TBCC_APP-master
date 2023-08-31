/**
 * 臺北自來水費
 * F7000104-繳費交易約定轉出帳號查詢
 * F7001001-繳納臺北市自來水費
 *
 */
import { Injectable } from '@angular/core';
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service'
import { F7001001ApiService } from '@api/f7/f7001001/f7001001-api.service';
import { CheckService } from '@shared/check/check.service';
import { FormateService } from '@shared/formate/formate.service';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class TaipeiWaterService {
    /**
	 * 參數處理
	 */
    private CodeMapList = {
        ' ': '0',
        'C': '3',
        'F': '6',
        'I': '9',
        'L': '3',
        'O': '6',
        'R': '9',
        'U': '4',
        'X': '7',
        'A': '1',
        'D': '4',
        'G': '7',
        'J': '1',
        'M': '4',
        'P': '7',
        'S': '2',
        'V': '5',
        'Y': '8',
        'B': '2',
        'E': '5',
        'H': '8',
        'K': '2',
        'N': '5',
        'Q': '8',
        'T': '3',
        'W': '6',
        'Z': '9'
    };
    private checkNumberOneMutilpe = [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5];
    private checkNumberTwoMutilpe = [2, 0, 3, 0, 5, 0, 7, 0, 2, 0, 3, 0, 5, 0, 7, 0, 2, 0, 3, 0, 5, 0, 7, 0, 2, 0, 3];

    constructor(
        private f7000104: F7000104ApiService,
        private f7001001: F7001001ApiService,
        private _errorCheckService: CheckService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
    }

    /**
	 * F7000104-繳費交易約定轉出帳號查詢
	 */
    getData(): Promise<any> {
        return this.f7000104.saveData().then(
            (res) => {
                return Promise.resolve(res);
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    /**
	 * F7001001-繳納臺北市自來水費
	 * @param data 
	 * @param security 
	 */
    sendData(data, security): Promise<any> {
        let reqHeader = (typeof security === 'object' && security
            && security.hasOwnProperty('securityResult') && security.securityResult
            && security.securityResult.hasOwnProperty('headerObj')
        ) ? security.securityResult.headerObj : {};
        return this.f7001001.saveData(data, reqHeader).then(
            (res) => {
                return Promise.resolve(res);
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    /**
	 * 市水檢查
	 */
    checkData(check_data) {
        let output = {
            status: false,
            msg: '',
            error: {
                account: '',
                barcode1: '',
                barcode2: '',
                barcode3: '',
                waterNumber: '',
                payAmount: ''
            },
            error_list: []
        };
        let checkCode2Data: any;
        let checkCode3Data: any;

        let check_res: any;

        // account check
        let check_account = this._formateService.checkField(check_data, 'account');
        if (!this._errorCheckService.checkEmpty(check_account, true)) {
            output.error.account = 'PG_TAX.ERROR.TRNSFROUTACCNT';
            output.error_list.push(output.error.account);
        }

        // code 1
        let check_barcode1 = this._formateService.checkField(check_data, 'barcode1');
        check_res = this.checkBarcode1(check_barcode1);
        if (!check_res.status) {
            output.error.barcode1 = check_res.msg;
            output.error_list.push(output.error.barcode1);
        }


        // code 2
        let check_barcode2 = this._formateService.checkField(check_data, 'barcode2');
        checkCode2Data = this.checkBarcode2(check_barcode2);
        if (!checkCode2Data.status) {
            output.error.barcode2 = checkCode2Data.msg;
            output.error_list.push(output.error.barcode2);
        }


        // code 3
        let check_barcode3 = this._formateService.checkField(check_data, 'barcode3');
        checkCode3Data = this.checkBarcode3(check_barcode3);
        if (!checkCode3Data.status) {
            output.error.barcode3 = checkCode3Data.msg;
            output.error_list.push(output.error.barcode3);
        }

        // amount check
        let check_payAmount = this._formateService.checkField(check_data, 'payAmount');
        let check_money = this._errorCheckService.checkMoney(check_payAmount, { currency: 'TWD' });
        if (!check_money.status) {
            output.error.payAmount = '條碼輸入項目有誤，請再次確認輸入欄位';
            output.error_list.push(output.error.payAmount);
        } else if (!checkCode3Data || checkCode3Data.amount != check_payAmount) {
            output.error.payAmount = '條碼輸入項目有誤，請再次確認輸入欄位';
            output.error_list.push(output.error.payAmount);
        }

        let check_water = this._formateService.checkField(check_data, 'waterNumber');
        if (!this._errorCheckService.checkEmpty(check_water, true)) {
            output.error.waterNumber = '條碼輸入項目有誤，請再次確認輸入欄位';
            output.error_list.push(output.error.waterNumber);
        } else if (!checkCode2Data || check_water != checkCode2Data.waterNumber) {
            output.error.waterNumber = '條碼輸入項目有誤，請再次確認輸入欄位';
            output.error_list.push(output.error.waterNumber);
        // } else {
        //     // 保留但暫不開啟,網銀跟原系統都未檢核
        //     let checkWaterCode = this.checkWaterNumber(check_water);
        //     if (!checkWaterCode.status) {
        //         output.error.barcode2 = '條碼輸入項目有誤，請再次確認輸入欄位';
        //         output.error.waterNumber = checkWaterCode.msg;
        //         output.error_list.push(checkWaterCode.msg);
        //     }
        }

        if (output.error_list.length > 0) {
            output.status = false;
            output.msg = '輸入項目有誤，請再次確認輸入欄位。';
            return output;
        }

        // check right code
        let check_checkcode = this.checkBarcodeCheckNumber(check_barcode2, check_barcode3);
        if (!check_checkcode.status) {
            output.status = false;
            output.msg = check_checkcode.msg;
            output.error.barcode2 = output.msg;
            output.error.barcode3 = output.msg;
        } else {
            output.status = true;
            output.msg = '';
        }

        return output;
    }

    /**
     * barcode 檢查
     * @param check_barcode2
     * @param check_barcode3
     */
    checkBarcodeCheckNumber(check_barcode2, check_barcode3) {
        let output = {
            status: false,
            msg: ''
        };
        let codeData = this.checkInputTaipeiWateFee(check_barcode2, check_barcode3);
        let totalResult = codeData.totalResult;
        let checkNumber = codeData.checkNumber;
        let checkOneNumber = this.getCheckNumberByMutiple(totalResult, this.checkNumberOneMutilpe);
        let checkTwoNumber = this.getCheckNumberByMutiple(totalResult, this.checkNumberTwoMutilpe);
        // console.warn('checkNumber/checkOneNumber/checkTwoNumber', checkNumber, checkOneNumber, checkTwoNumber);
        let totalCheckNumber = checkOneNumber + checkTwoNumber;
        if (totalCheckNumber != checkNumber) {
            output.status = false;
            output.msg = '輸入項目有誤，請再次確認輸入欄位。';
        } else {
            output.status = true;
            output.msg = '';
        }
        return output;
    }


    /**
	* code 1 check
	* @param check_barcode
	*/
    checkBarcode1(check_barcode) {
        let output = {
            status: true,
            msg: '',
            payDueDate: '',
            delegateItem: ''
        };

        let check_length = this._errorCheckService.checkLength(check_barcode, 9, 'same');
        if (!check_length.status) {
            output.status = false;
            output.msg = 'PG_TAX.ERROR.ERROR_BARCODE_1';
        } else {
            output.payDueDate = check_barcode.substring(0, 6);
            output.delegateItem = check_barcode.substring(6, 9);
        }
        return output;
    }


    /**
	* code 2 check
	* @param check_barcode
	* 取得waterNumber
	*/
    checkBarcode2(check_barcode) {
        let output = {
            status: true,
            msg: '',
            sheetSerialNumber: '', // 分單序號
            serialNumber: '', // 序號
            category: '',
            waterNumber: '', // 水號(10碼)
            reocdeDate: '' // 抄表日dd(2碼)
        };

        let check_length = this._errorCheckService.checkLength(check_barcode, 16, 'same');
        if (!check_length.status) {
            output.status = false;
            output.msg = 'PG_TAX.ERROR.ERROR_BARCODE_2';
        } else {
            // 分單序號
            output.sheetSerialNumber = check_barcode.substring(2, 3);
            // 序號
            output.serialNumber = check_barcode.substring(3, 4);
            // 抄表日dd(2碼)
            output.reocdeDate = check_barcode.substring(4, 6);
            // 水號(10碼)
            output.waterNumber = check_barcode.substring(6, 16);
            // 水號(10碼)
            output.category = check_barcode.substring(0, 2);
        }
        return output;
    }


    /**
	* code 3 check
	* @param check_barcode
	* 取得payAmount
	*/
    checkBarcode3(check_barcode) {
        let output = {
            status: true,
            msg: '',
            amountCheck: '',
            amount: '',
            reocdeDateYearAndMonth: '', // 抄表日yymm(4碼)
            checkNumber: '' // 檢碼
        };

        let check_length = this._errorCheckService.checkLength(check_barcode, 15, 'same');
        if (!check_length.status) {
            output.status = false;
            output.msg = 'PG_TAX.ERROR.ERROR_BARCODE_3';
        } else {
            // 總金額
            output.amountCheck = check_barcode.substring(6, 15);
            output.amount = ReplaceUtil.baseSymbol(output.amountCheck);
            output.amount = ReplaceUtil.replaceLeftStr(output.amount);
            // 抄表日yymm
            output.reocdeDateYearAndMonth = check_barcode.substring(0, 4);
            // 檢碼
            output.checkNumber = check_barcode.substring(4, 6);
        }
        return output;
    }

    checkWaterNumber(str) {
        let output = {
            status: false,
            msg: '水號檢查錯誤'
        };
        const s1 = str.substring(0, 1).toLocaleUpperCase(); // 區碼(1)
        const s2 = str.substring(1, 3); // 中區(2)
        const s3 = str.substring(3, 9); // 戶號(6)
        const s4 = str.substring(9, 10); // 檢查碼(1)
        let s1_allow = [
            '1', '2', '3', '4'
            , 'A', 'B', 'C', 'D', 'E', 'F'
            , 'H', 'I', 'J', 'K', 'L'
            , 'M', 'N', 'P', 'S', 'T', 'U'
            , 'V', 'W', 'X', 'Y'
        ];
        if (s1_allow.indexOf(s1) <= -1) {
            this._logger.log('error', 's1');
            return output;
        }
        // tslint:disable-next-line: radix
        let check_s2 = parseInt(s2);
        if (check_s2 < 1 || check_s2 > 26) {
            this._logger.log('error', 's2');
            return output;
        }
        if (s2 == '26' && s1 != 'V') {
            this._logger.log('error', 's2+s1');
            return output;
        }
        let s3_allow = [2, 1, 2, 1, 2, 1];
        let i = 0;
        let max_lenght = s3.length;
        let checkOne = 0;
        for (i = 0; i < max_lenght; i++) {
            let item = s3.charAt(i);
            if (typeof s3_allow[i] != 'undefined' && item) {
                // tslint:disable-next-line: radix
                let temp = parseInt(item) * s3_allow[i];
                checkOne += temp;
            }
        }
        let checkCode = 10 - (checkOne % 10);
        if (checkCode == 10) {
            checkCode = 0;
        }
        if (s4 != checkCode.toString()) {
            this._logger.log('error', 's4', checkCode);
            return output;
        }
        output.status = true;
        output.msg = '';
        return output;
    }

    /**
	 * 	轉換
	 * @param check_barcode2
	 * @param check_barcode3
	 */
    private checkInputTaipeiWateFee(check_barcode2, check_barcode3) {
        let output = {
            totalResult: '',
            checkNumber: ''
        };

        // code 2
        let checkCode2Data = this.checkBarcode2(check_barcode2);
        // code 3
        let checkCode3Data = this.checkBarcode3(check_barcode3);
        if (!checkCode2Data.status || !checkCode3Data.status) {
            return output;
        }
        output.checkNumber = checkCode3Data.checkNumber;

        let tempAmount = checkCode3Data.amountCheck;
        let tempSheetSerialNumber = checkCode2Data.sheetSerialNumber;
        let tempSerialNumber = checkCode2Data.serialNumber;
        let tempReocdeDate = checkCode2Data.reocdeDate;
        let tempWaterNumber = checkCode2Data.waterNumber;
        let tempReocdeDateYearAndMonth = checkCode3Data.reocdeDateYearAndMonth;
        let checkCode: string = tempAmount
            + '' + tempSheetSerialNumber
            + '' + tempSerialNumber
            + '' + tempReocdeDate
            + '' + tempWaterNumber
            + '' + tempReocdeDateYearAndMonth;


        let checkString = checkCode.toLocaleUpperCase();
        // this._logger.log(
        //     'tempAmount/tempSheetSerialNumber/tempSerialNumber/tempReocdeDate/tempWaterNumber/tempReocdeDateYearAndMonth'
        //     ,
        //     tempAmount
        //     , tempSheetSerialNumber
        //     , tempSerialNumber
        //     , tempReocdeDate
        //     , tempWaterNumber
        //     , tempReocdeDateYearAndMonth
        // );
        // this._logger.log('checkInputTaipeiWateFee', checkString);
        let i = 0;
        const max_lenght = checkString.length;
        let chList = [];

        // 0,1,2,3,4,5,6,7,8,9
        // empty:0
        // A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9
        // J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9
        // S:2,T:3,U:4,V:5,W;6,X:7,Y:8,Z:9
        for (i = 0; i < max_lenght; i++) {
            let convert = checkString.charAt(i);
            if (typeof this.CodeMapList[convert] != 'undefined') {
                convert = this.CodeMapList[convert];
            } else if (convert == '' || convert == ' ') {
                convert = '0';
            }
            // this._logger.log('change', checkString.charAt(i), convert );
            chList.push(convert);
        }


        output.totalResult = chList.join('');
        return output;
    }

    /**
     * 第一碼循環: 7,6,5,4,3,2
     * 第二碼循環: 2,3,5,7
        // 第一碼總數 = 基數(1)*7 + 基數(2)*6 + 基數(3)*5 + 基數(4)*4 + 基數(5)*3 + 基數(6)*2
        // + 基數(7)*7 + 基數(8)*6 + 基數(9)*5 + 基數(10)*4 + 基數(11)*3 + 基數(12)*2
        // + 基數(13)*7 + 基數(14)*6 + 基數(15)*5 + 基數(16)*4 + 基數(17)*3 + 基數(18)*2
        // + 基數(19)*7 + 基數(20)*6 + 基數(21)*5 + 基數(22)*4 + 基數(23)*3 + 基數(24)*2
        // + 基數(25)*7 + 基數(26)*6 + 基數(27)*5
        // 第二碼總數 = 基數(1)*2 + 基數(3)*3 + 基數(5)*5 + 基數(7)*7
        // + 基數(9)*2 + 基數(11)*3 + 基數(13)*5 + 基數(15)*7
        // + 基數(17)*2 + 基數(19)*3 + 基數(21)*5 + 基數(23)*7
        // + 基數(25)*2 + 基數(27)*3
     * @param totalResult
     * @param mutilpe
     */
    private getCheckNumberByMutiple(totalResult, mutilpe) {
        let i = 0;
        let max_lenght = totalResult.length;
        let checkOne = 0;
        // this._logger.warn('getCheckNumberByMutiple', totalResult,  max_lenght, mutilpe);
        for (i = 0; i < max_lenght; i++) {
            let temp: any;
            let item = totalResult.charAt(i);
            if (typeof mutilpe[i] != 'undefined' && item) {
                // tslint:disable-next-line: radix
                temp = parseInt(item) * mutilpe[i];
                checkOne += temp;
            }
            // this._logger.log('checkOneNumber', item,  mutilpe[i], temp);
        }
        // 總數除以11取餘數
        checkOne = checkOne % 11;
        let checkOneNumber = '';
        // 若餘數為0搬"A"到檢查碼第一碼,否則檢查碼第一碼=11-"餘數",若餘數為1(11-1=10)檢查碼第一碼為0
        if (checkOne == 0) {
            checkOneNumber = 'A';
        } else if (checkOne == 1) {
            checkOneNumber = '0';
        } else {
            checkOneNumber = (11 - checkOne).toString();
        }
        // this._logger.warn('checkOneNumber', checkOneNumber, checkOne);
        return checkOneNumber;
    }

}
