/**
 * 已實現損益查詢
 * 
 * 
 * 
 *
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { FI000705ApiService } from '@api/fi/fi000705/fI000705-api.service';
import { FI000706ApiService } from '@api/fi/fI000706/fI000706-api.service';

@Injectable()

export class FundBalanceSetService {

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private fi000705: FI000705ApiService,
        private fi000706: FI000706ApiService
    ) {
    }

    //整理資料
    public mappingBalance(set_data) {
        let output = {
            fundData: set_data,
            selectedData: [], //設定過
            unselectData: [], //沒設定過
            hasSet: false //是否設定過，false全部都沒設定過
        };

        this._logger.log('into service mappingBalance()!!');
        set_data.forEach(item => {
            if (parseInt(item['incomePoint']) / 100 != 0 || parseInt(item['profitPoint']) / 100 != 0) {
                item['selected'] = true; //是否設定過，不是0設定過
                item['showCheck'] = false; //一開始不勾選
                item['showDelete'] = false; //一開始不勾選(刪除)

                //整理停損值，incomePoint：
                //算小數點前 00310 => 003 => 3.00
                let int_icp = parseFloat(item['incomePoint'].substring(0, 3));
                //算小數點後 00310 => 10 => 0.1
                let float_icp = parseFloat(item['incomePoint'].substring(3, item['incomePoint'].length)) / 100;
                this._logger.log('line 48 service int_icp:', int_icp);
                this._logger.log('line 49 service float_icp:', float_icp);
                //將整數 3.00 + 0.1 => 3.10
                item['incomePoint'] = (int_icp + float_icp).toString();
                this._logger.log("line 54 service item['incomePoint']:", item['incomePoint']);

                //整理獲利值，profitPoint：
                //算小數點前 00310 => 003 => 3.00
                let int_pfp = parseFloat(item['profitPoint'].substring(0, 3));
                //算小數點後 00310 => 10 => 0.1
                let float_pfp = parseFloat(item['profitPoint'].substring(3, item['profitPoint'].length)) / 100;
                this._logger.log('line 48 service int_pfp:', int_pfp);
                this._logger.log('line 49 service float_pfp:', float_pfp);
                //將整數 3.00 + 0.1 => 3.10
                item['profitPoint'] = (int_pfp + float_pfp).toString();
                this._logger.log("line 54 service item['profitPoint']:", item['profitPoint']);

                output.selectedData.push(item);
                output.hasSet = true; //只要有一筆設定過，就為true
            } else {
                item['selected'] = false;
                item['showCheck'] = false; //一開始不勾選
                item['showDelete'] = false; //一開始不勾選(刪除)
                item['profitPoint'] = '0';
                item['incomePoint'] = '0';
                output.unselectData.push(item);
            }
            this._logger.log('line 59 service item:', item);
        });
        return output;
    }

    //送結果前，整理資料，除去不需要的欄位
    public mappingReqData(set_data, info_data) {
        this._logger.log('line 84 set_data:', set_data);
        let outputData = {
            custId: '',
            trnsToken: '',
            details: {
                detail: [

                ]
            }
        };
        set_data.forEach(item => {
            let returnData = {
                trustAcnt: '',
                transCode: '',
                fundCode: '',
                capital: '',
                incomePoint: '',
                profitPoint: '',
                webNotice: '',
                emailNotice: '',
                code: '',
                investType: '',
                sLossCD:'',
                sProCD:'',
                autoRed:'',
                continue: '',
                // incomeState: ''
            };
            outputData['trnsToken'] = info_data['trnsToken']; //塞入trnsToken
            returnData['trustAcnt'] = item['trustAcnt'];
            returnData['transCode'] = item['transCode'];
            returnData['fundCode'] = item['fundCode'];
            returnData['capital'] = item['capital'];
            returnData['webNotice'] = item['webNotice'];
            returnData['emailNotice'] = item['emailNotice'];
            returnData['code'] = item['code'];
            returnData['investType'] = item['investType'];
            returnData['sLossCD'] = item['sLossCD'];
            returnData['sProCD'] = item['sProCD'];
            returnData['autoRed'] = item['autoRed'];
            returnData['continue'] = item['continue'];
            // returnData['incomeState'] = item['incomeState'];
            //如果不是要刪除的，刪除帶 '00000'
            if (item['incomePoint'] !== '00000' && item['profitPoint'] !== '00000') {
                //處理停損點值
                let incomePointLength = item['incomePoint'].length;
                returnData['incomePoint'] = this.appendZeroStr(incomePointLength) + item['incomePoint'] + "00";
                let profitPointLength = item['profitPoint'].length;
                returnData['profitPoint'] = this.appendZeroStr(profitPointLength) + item['profitPoint'] + "00";
                // let incomePoint = parseInt(item['incomePoint']);
                // let profitPoint = parseInt(item['profitPoint']);
                // this._logger.log('line 121 service incomePoint:', incomePoint);
                // this._logger.log('line 122 service profitPoint:', profitPoint);
                // //停損點
                // //ex: 3 => 3.00
                // returnData['incomePoint'] = incomePoint.toString() + '.00';
                // if (incomePoint == 0) {
                //     returnData['incomePoint'] = '0';
                // }

                // //獲利點
                // //ex: 3 => 3.00
                // returnData['profitPoint'] = profitPoint.toString() + '.00';
                // if (profitPoint == 0) {
                //     returnData['profitPoint'] = '0';
                // }
                // this._logger.log("line 98 returnData['incomePoint']:", returnData['incomePoint']);
                // this._logger.log("line 99 returnData['profitPoint']:", returnData['profitPoint']);

            } else {
                returnData['incomePoint'] = item['incomePoint'];
                returnData['profitPoint'] = item['profitPoint'];
            }
            outputData['details']['detail'].push(returnData);
        });
        this._logger.log("line 103 service outputData:", outputData);
        return outputData;
    }

    //補0處理停損停利值
    appendZeroStr(len) {
        //長度為1
        let appendZero = '';
        if (len == '1') {
            appendZero = '00';
        } else if (len == '2') {
            appendZero = '0';
        }
        return appendZero;
    }

    //檢核停利點
    public check_profitPoint(setData: string) {
        let output = {
            status: false,
            data: '',
            msg: ''
        }
        if (setData.length > 3 || setData == '' || setData.indexOf('.') != -1) {
            output['status'] = false;
            output['msg'] = 'CHECK.PROFITPOINT_CHECK';
            output['data'] = setData;
        } else if (!setData.match(/^[0-9]*$/)) {
            output['status'] = false;
            output['msg'] = 'CHECK.NUMBER.NUMBER_ZERO_TO_NINE';
            output['data'] = setData;
        }
        else {
            output['status'] = true;
            output['msg'] = 'success';
            output['data'] = setData;
        }
        return output;
    }

    //檢核停損點
    public check_incomePoint(setData: string) {
        let output = {
            status: false,
            data: '',
            msg: ''
        }
        if (parseInt(setData) > 100 || setData == '' || setData.indexOf('.') != -1) {
            output['status'] = false;
            output['msg'] = 'CHECK.INCOMEPOINT_CHECK';
            output['data'] = setData;
        } else if (!setData.match(/^[0-9]*$/)) {
            output['status'] = false;
            output['msg'] = 'CHECK.NUMBER.NUMBER_ZERO_TO_NINE';
            output['data'] = setData;
        }
        else {
            output['status'] = true;
            output['msg'] = 'success';
            output['data'] = setData;
        }
        return output;
    }

    public getBalanceQuery(set_type: any): Promise<any> {
        return this.fi000705.getData(set_type).then(
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

    public getBalanceResult(set_data: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        // let reqHeader = {
        //     header: security.securityResult.headerObj
        // };
        return this.fi000706.getData(set_data).then(
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
    //處理結果頁資料
    public mappingResult(setData) {
        let output = [];
        setData.forEach(item => {
            let balanceData = {
                fundCode: '',
                fundName: '',
                incomePoint: '', //停損點
                profitPoint: '',  //停利點
                webNotice: '',
                emailNotice: '',
                autoRed: '',
                continue: '',
                sLossCD: '', //停損點正負號
                sProCD: '' //獲利點正負號
            };
            if (item['incomePoint'] == '00000') {
                balanceData['incomePoint'] = '0';
            }
            if (item['profitPoint'] == '00000') {
                balanceData['profitPoint'] = '0';
            } 
            if (item['incomePoint'] !== '00000' && item['profitPoint'] !== '00000') {
                let incomePoint = parseInt(item['incomePoint']) / 100;
                let profitPoint = parseInt(item['profitPoint']) / 100;
                balanceData['incomePoint'] = incomePoint.toString();
                balanceData['profitPoint'] = profitPoint.toString();
            }
            balanceData['fundCode'] = item['fundCode'];
            balanceData['fundName'] = item['fundName'];
            balanceData['webNotice'] = item['webNotice'];
            balanceData['emailNotice'] = item['emailNotice'];
            balanceData['autoRed'] = item['autoRed'];
            balanceData['continue'] = item['continue'];
            balanceData['sLossCD'] = item['sLossCD'];
            balanceData['sProCD'] = item['sProCD'];
            output.push(balanceData);
        });
        this._logger.log("service output:", output);
        return output;
    }
}
