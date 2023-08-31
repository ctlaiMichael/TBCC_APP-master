/**
 * 基金單筆申購
 * 
 * 
 * 
 *
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000403ApiService } from '@api/fi/fI000403/fI000403-api.service';
import { FI000404ApiService } from '@api/fi/fI000404/fI000404-api.service';
import { FI000405ApiService } from '@api/fi/fI000405/fI000405-api.service';
import { FI000406ApiService } from '@api/fi/fI000406/fI000406-api.service';
import { DateService } from '@core/date/date.service';

@Injectable()

export class FundPurchaseSingleService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000403: FI000403ApiService,
        private fi000404: FI000404ApiService,
        private fi000405: FI000405ApiService,
        private fi000406: FI000406ApiService,
        private dateService: DateService
    ) {
    }

    //整理轉借人員資料
    public intro_sort(set_trust) {
        let introData = [];
        set_trust.forEach(intro_item => {
            let intro = intro_item['intro'].split(',');
            intro.forEach(intro_item2 => {
                let intro_info = {
                    introId: '', //轉借人員ID
                    introName: '' //轉借人員姓名
                };

                let tmp_intro = intro_item2.split('-');
                if (tmp_intro.length == 2) {
                    intro_info['introId'] = tmp_intro[0];
                    intro_info['introName'] = tmp_intro[1];
                    introData.push(intro_info);
                }
            });
        });
        return introData;
    }

    //整理銷售人員資料
    public sales_sort(set_trust) {
        let salesData = [];
        set_trust.forEach(sales_item => {
            let sales = sales_item['sales'].split(',');
            sales.forEach(sales_item2 => {
                let sales_info = {
                    salesId: '', //銷售人員ID
                    salesName: '' //銷售人員姓名
                };

                let tmp_sales = sales_item2.split('-');
                if (tmp_sales.length == 2) {
                    sales_info['salesId'] = tmp_sales[0];
                    sales_info['salesName'] = tmp_sales[1];
                    salesData.push(sales_info);
                }
            });
        });
        return salesData;
    }

    public setDate(date) {

    }

    //預設日期為當天
    public setToday(setdate) {
        let today = new Date;
        let y = (today.getFullYear()).toString(); //西元年
        let m = (today.getMonth() + 1).toString();
        let month = parseInt(m);
        if (month < 10) {
            m = '0' + month;
        }
        let d = today.getDate().toString();
        let enrollDate;
        if (setdate == 'resver') {
            let date = parseInt(d);
            if (date < 10) {
                d = '0' + date.toString();
            } else {
                d = date.toString();
            }
            enrollDate = y + '-' + m + '-' + d;
            enrollDate=this.dateService.getNextBussDay(enrollDate);
        } else {
            let date = parseInt(d);
            if (date < 10) {
                d = '0' + date;
            }
            enrollDate = y + '-' + m + '-' + d;
        }


        return enrollDate;
    }

    /**
     * 
     * 預約申購轉換
     */
    check_date_resver(set_date) {
        let output = {
            status: false, //是否轉預約
            data: set_date,
            msg: ''
        };
        if (set_date == '') {
            output.status = false;
            output.msg = '請選擇申購日期';
        } else {
            let date = set_date + ' 00:00:00';
            let secondsTime = new Date(date).getTime(); //畫面上選擇的時間轉毫秒數
            let today = new Date().getTime(); //今天時間轉毫秒數
            let today_date = new Date().getDate(); //今天日期
            let today_month = new Date().getMonth() + 1; //今月份
            let today_year = new Date().getFullYear(); //今年
            let check_today = ''; // 傳進來的
            if (set_date.indexOf('-') != -1) {
                check_today = set_date.split('-'); // 傳進來的
            } else if (set_date.indexOf('/') != -1) {
                check_today = set_date.split('/'); // 傳進來的
            } else {
                check_today = set_date; // 傳進來的
            }
            let check_today_year = parseInt(check_today[0]);
            let check_today_month = parseInt(check_today[1]);
            let check_today_date = parseInt(check_today[2]);

            //選擇日期大於今天(轉預約)
            if (secondsTime > today) {
                output.status = true;
                output.msg = 'on resver';
            }
            //選擇日期小於今天
            if (secondsTime < today) {
                output.status = false;
                output.msg = '請選擇正確申購日期';
            }
            //選擇得日期為今天
            if (check_today_year == today_year && check_today_month == today_month
                && check_today_date == today_date) {
                output.status = false;
                output.msg = 'today';
            }
        }
        return output;
    }

    /**
     * 
     * mapping 時間欄位，送給request
     */
    mappingDate_req(set_date) {
        let output = {
            status: false,
            data: '',
            msg: ''
        };
        if (set_date !== '') {
            let dateObj = set_date.split('/');
            let year = parseInt(dateObj[0]) - 1911;
            let month = parseInt(dateObj[1]);
            let date = parseInt(dateObj[2]);
            if (month < 10) {
                dateObj[1] = '0' + month;
            }
            if (date < 10) {
                dateObj[2] = '0' + date;
            }
            output.data = year.toString() + dateObj[1] + dateObj[2];
            output.status = true;
            output.msg = '';
        } else {
            output.status = false;
            output.msg = 'set_date is empty';
        }
        return output;
    }

    //發fi000403 基金單筆申購申請
    getFundPurchase(set_data): Promise<any> {
        return this.fi000403.getData(set_data).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }

    //發fi000404 基金單筆申購確認
    getFundData(set_data: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.fi000404.getData(set_data, page, sort, reqHeader).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }

    //發fi000405 基金單筆申購(預約)申請
    getResverPurchase(set_data): Promise<any> {
        return this.fi000405.getData(set_data).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }

    //發fi000406 基金單筆申購(預約)確認
    getResverEnd(set_data: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.fi000406.getData(set_data, page, sort, reqHeader).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }
}
