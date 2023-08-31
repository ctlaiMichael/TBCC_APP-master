
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000706ApiService } from '@api/fb/fb000706/fb000706-api.service';
import { CheckService } from '@shared/check/check.service';
import { FormateService } from '@shared/formate/formate.service';
import { FB000707ApiService } from '@api/fb/fb000707/fb000707-api.service';
import { logger } from '@shared/util/log-util';
@Injectable()

export class GoldDetailService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private _checkService: CheckService,
        private fb000707: FB000707ApiService,
        private fb000706: FB000706ApiService,
        private fb000705: FB000705ApiService,
        private _formateService: FormateService
    ) { }
    /**
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    public getData(): Promise<any> {
        // let reqData = new fb000705ReqBody();
        // reqData.custId = '';
        // logger.debug("reqData:", reqData);
        const obj = {
            queryType: '1',
        };
        return this.fb000705.getData(obj).then(
            (sucess) => {
                logger.debug(sucess);
                logger.debug("FB000705 SUCCESS");
                return Promise.resolve(sucess);
            },
            (failed) => {
                logger.debug(failed);
                logger.debug("FB000705 FAIL");
                return Promise.reject(failed);
            }
        );
    }

    public getGoldListData(obj): Promise<any> {
        // let reqData = new fb000706ReqBody();
        // reqData.custId = '';
        // logger.debug("reqData:", reqData);
        // const obj = {
        //     queryType: '0',
        //     acctTrnsType: ''

        // };
        // alert(JSON.stringify(this.setDateCheck('1M')));
        return this.fb000706.getData(obj).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }

    public getGoldListOverview(obj): Promise<any> {
        // let reqData = new fb000706ReqBody();
        // reqData.custId = '';
        // logger.debug("reqData:", reqData);
        // const obj = {
        //     queryType: '0',
        //     acctTrnsType: ''

        // };
        return this.fb000707.getData(obj).then(

            (sucess) => {
                logger.debug(sucess);
                logger.debug("SSSSSSSSSSSSSSS707");
                return Promise.resolve(sucess);
            },
            (failed) => {
                logger.debug(failed);
                logger.debug("FFFFFFFFFFFFFFF707");
                return Promise.reject(failed);
            }
        );
    }













    /**
         * 取得日期設定條件
         * @param set_key 日期條件編號
         */
    getDateSet(set_key: string): Object {
        if (this.dateCheckList.hasOwnProperty(set_key)) {
            return this._formateService.transClone(this.dateCheckList[set_key]);
        } else {
            return {};
        }
    }


    public setDateCheck(set_key: string) {
        //alert('imhere1');
        // 最多只可查詢本月與前2個月
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '5', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '01' // 當rangeType為自訂時，的基礎日期
        };
        switch (set_key) {
            case '1D': // 前一日
                // search(now=2019/04/22): 2019/04/21~2019/04/21
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case 'today': // 本日
                // search(now=2019/04/22): 2019/04/22~2019/04/22
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '0';
                set_obj['rangeBaseDate'] = '';
                break;
            case '7D': // 最近1周
                // search(now=2019/04/22): 2019/04/15~2019/04/22
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '7';
                set_obj['rangeBaseDate'] = '';
                break;
            case '1M': // 最近1月
                // search(now=2019/04/22): 2019/03/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';

                break;
        }

        const dateType = 'strict';
        const date_data = this._checkService.getDateSet(set_obj, dateType);

        let output = {
            startDate: '',
            endDate: ''
        };
        if (set_key !== 'custom') {
            output.startDate = date_data.minDate;
            output.endDate = date_data.maxDate;
        }
        this.dateCheckList[set_key] = date_data;
        return output;
    }


}