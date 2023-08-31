/**
 * 基金贖回
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000501ApiService } from '@api/fi/fI000501/fI000501-api.service';
import { FI000502ApiService } from '@api/fi/fI000502/fI000502-api.service';
import { FI000503ApiService } from '@api/fi/fI000503/fI000503-api.service';
import { FI000504ApiService } from '@api/fi/fI000504/fI000504-api.service';
import { FI000505ApiService } from '@api/fi/fI000505/fI000505-api.service';
import { FI000506ApiService } from '@api/fi/fI000506/fI000506-api.service';
import { DateService } from '@core/date/date.service';
import { CacheService } from '@core/system/cache/cache.service';

@Injectable()

export class FundRedeemService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000501: FI000501ApiService,
        private fi000502: FI000502ApiService,
        private fi000503: FI000503ApiService,
        private fi000504: FI000504ApiService,
        private fi000505: FI000505ApiService,
        private fi000506: FI000506ApiService,
        private dateService: DateService
        , private _cacheService: CacheService
    ) {
    }

    /**
     * 預設日期為當天
     * @param setdate
     */
    setToday(setdate) {
        let today = new Date();
        this._logger.log('service today:', today);
        let y = (today.getFullYear()).toString(); // 西元年
        let m = (today.getMonth() + 1).toString();
        // tslint:disable-next-line:radix
        let month = parseInt(m , 10);
        if ( month < 10) {
            m = '0' + month;
        }
        let d = today.getDate().toString();
        let date = parseInt(d , 10);
        if (date < 10) {
            d = '0' + date;
        }
        let enrollDate;
        if (setdate == 'resver') {
            // tslint:disable-next-line:radix
            enrollDate = y + '-' + m + '-' + d;
            enrollDate = this.dateService.getNextBussDay(enrollDate);
        } else {
            // tslint:disable-next-line:radix
            enrollDate = y + '-' + m + '-' + d;
        }


        return enrollDate;
    }


    /**
     * 刪除cache
     * fund-redeem: 基金贖回
     */
    removeAllCache(type?: string) {
        if (typeof type == 'undefined' || !type) {
            type = 'fund-redeem';
        }
        this._cacheService.removeGroup(type);
    }


    /**
     *
     * @param set_date
     */
    check_date_resver(set_date) {
        let output = {
            status: false, // 是否轉預約
            data: set_date,
            msg: ''
        };
        if (set_date == '') {
            output.status = false;
            output.msg = '請選擇贖回日期';
        } else {
            let date = set_date + ' 00:00:00';
            let secondsTime = new Date(date).getTime(); // 畫面上選擇的時間轉毫秒數
            let today = new Date().getTime(); // 今天時間轉毫秒數
            let today_date = new Date().getDate(); // 今天日期
            let today_month = new Date().getMonth() + 1; // 今月份
            let today_year = new Date().getFullYear(); // 今年
            let check_today = ''; // 傳進來的
            if (set_date.indexOf('-') != -1) {
                check_today = set_date.split('-'); // 傳進來的
            } else if (set_date.indexOf('/') != -1) {
                check_today = set_date.split('/'); // 傳進來的
            } else {
                check_today = set_date; // 傳進來的
            }
            // tslint:disable-next-line:radix
            let check_today_year = parseInt(check_today[0]);
            // tslint:disable-next-line:radix
            let check_today_month = parseInt(check_today[1]);
            // tslint:disable-next-line:radix
            let check_today_date = parseInt(check_today[2]);

            // 選擇日期大於今天(轉預約)
            if (secondsTime > today) {
                output.status = true;
                output.msg = 'on resver';
            } else if (secondsTime < today) {
                // 選擇日期小於今天
                output.status = false;
                output.msg = '請選擇正確贖回日期';
            } else if (check_today_year == today_year && check_today_month == today_month
                && check_today_date == today_date
            ) {
                // 選擇得日期為今天
                output.status = false;
                output.msg = 'today';
            }
        }
        return output;
    }

    /**
     * 基金贖回查詢(即期/預約)
     * @param req 即期 1/預約 2
     * @param set_data
     */
    getAccount(req: any, page?: number, option?: Object): Promise<any> {
        this._logger.log('set_data/req', page, req);
        let cache_main_key = 'fund-redeem';
        let cache_sub_key = [req];
        const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, page, [], {}, null, {sub_key: cache_sub_key});
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        return this.fi000501.getData(req, page).then(
            (sucessObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, sucessObj, cache_option);
                return Promise.resolve(sucessObj);
            },
            (failed) => {
                this._logger.error('getAccount failed:', failed);
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 贖回轉換約定帳號查詢
     * @param set_data
     */
    getRedeemAct(set_data): Promise<any> {
        // this._logger.log('set_data:', set_data);
        return this.fi000502.getData(set_data).then(
            (sucess) => {
                // this._logger.log(sucess);
                // this._logger.log('SSSSSSSSSSSSSSS');
                return Promise.resolve(sucess);
            },
            (failed) => {
                // this._logger.log(failed);
                // this._logger.log('FFFFFFFFFFFFFFF');
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 基金贖回申請
     * @param set_data
     */
    getRedeemAppli(set_data): Promise<any> {
        this._logger.log('set_data:', set_data);
        return this.fi000503.getData(set_data).then(
            (sucess) => {
                // this._logger.log(sucess);
                // this._logger.log('SSSSSSSSSSSSSSS');
                return Promise.resolve(sucess);
            },
            (failed) => {
                // this._logger.log(failed);
                // this._logger.log('FFFFFFFFFFFFFFF');
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 基金贖回確認
     * @param set_data
     * @param security
     * @param page
     * @param sort
     */
    getRedeemEnd(set_data: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        this._logger.log('set_data:', set_data);
        return this.fi000504.getData(set_data, page, sort, reqHeader).then(
            (sucess) => {
                // this._logger.log(sucess);
                // this._logger.log('SSSSSSSSSSSSSSS');
                this.removeAllCache('fund-redeem');
                return Promise.resolve(sucess);
            },
            (failed) => {
                // this._logger.log(failed);
                // this._logger.log('FFFFFFFFFFFFFFF');
                this.removeAllCache('fund-redeem');
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 基金贖回申請(預約)
     * @param set_data
     */
    getRedeemAppli_resver(set_data): Promise<any> {
        this._logger.log('set_data:', set_data);
        return this.fi000505.getData(set_data).then(
            (sucess) => {
                // this._logger.log(sucess);
                // this._logger.log('SSSSSSSSSSSSSSS');
                return Promise.resolve(sucess);
            },
            (failed) => {
                // this._logger.log(failed);
                // this._logger.log('FFFFFFFFFFFFFFF');
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 基金贖回確認
     * @param set_data
     * @param security
     * @param page
     * @param sort
     */
    getRedeemEnd_resver(set_data, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        this._logger.log('set_data:', set_data);
        return this.fi000506.getData(set_data, page, sort, reqHeader).then(
            (sucess) => {
                // this._logger.log(sucess);
                // this._logger.log('SSSSSSSSSSSSSSS');
                this.removeAllCache('fund-redeem');
                return Promise.resolve(sucess);
            },
            (failed) => {
                // this._logger.log(failed);
                // this._logger.log('FFFFFFFFFFFFFFF');
                this.removeAllCache('fund-redeem');
                return Promise.reject(failed);
            }
        );
    }
}
