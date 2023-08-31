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
// import { FI000407ApiService } from "@api/fi/fI000407/fI000407-api.service";
// import { FI000408ApiService } from '@api/fi/fi000408/fI000408-api.service';
import { FI000709ApiService } from '@api/fi/fI000709/fI000709-api.service';
import { FI000710ApiService } from '@api/fi/fI000710/fI000710-api.service';
import { logger } from '@shared/util/log-util';


@Injectable()

export class FundPurchaseRegularService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        // private fi000407: FI000407ApiService,
        // private fi000408: FI000408ApiService,
        private fi000709: FI000709ApiService,
        private fi000710: FI000710ApiService,
    ) {
    }

    //整理轉借人員資料
    public intro_sort(set_trust) {
        let introData = [];
        set_trust.forEach(intro_item => {
            let intro = intro_item['intro'].split(",");
            intro.forEach(intro_item2 => {
                let intro_info = {
                    introId: '', //轉借人員ID
                    introName: '' //轉借人員姓名
                };

                let tmp_intro = intro_item2.split("-");
                if (tmp_intro.length == 2) {
                    intro_info['introId'] = tmp_intro[0];
                    intro_info['introName'] = tmp_intro[1];
                    introData.push(intro_info);
                }
            });
        });
        this._logger.log("service show!! introData:", introData);
        return introData;
    }

    //整理銷售人員資料
    public sales_sort(set_trust) {
        let salesData = [];
        set_trust.forEach(sales_item => {
            let sales = sales_item['sales'].split(",");
            sales.forEach(sales_item2 => {
                let sales_info = {
                    salesId: '', //銷售人員ID
                    salesName: '' //銷售人員姓名
                };

                let tmp_sales = sales_item2.split("-");
                if (tmp_sales.length == 2) {
                    sales_info['salesId'] = tmp_sales[0];
                    sales_info['salesName'] = tmp_sales[1];
                    salesData.push(sales_info);
                }
            });
        });
        this._logger.log("service show!! salesData:", salesData);
        return salesData;
    }

    //抓今天日期
    public getToday() {
        let today = new Date();
        let y = (today.getFullYear() - 1911).toString();
        let m = (today.getMonth() + 1).toString();
        if (parseInt(m) < 10) {
            m = '0' + m;
        }
        let d = today.getDate().toString();
        if (parseInt(d) < 10) {
            d = '0' + d;
        }
        let enrollDate = y + m + d;
        this._logger.log("service enrollDate:", enrollDate);
        return enrollDate;
    }

    //發fi000407 基金小額申購申請(舊規格)
    // getFundPurchase(set_data): Promise<any> {
    //     this._logger.log("set_data:", set_data);
    //     return this.fi000407.getData(set_data).then(
    //         (sucess) => {
    //             this._logger.log(sucess);
    //             this._logger.log("SSSSSSSSSSSSSSS");
    //             return Promise.resolve(sucess);
    //         },
    //         (failed) => {
    //             this._logger.log(failed);
    //             this._logger.log("FFFFFFFFFFFFFFF");
    //             return Promise.reject(failed);
    //         }
    //     )
    // }

    //發fi000408 基金小額申購確認(舊規格)
    // getFundData(set_data: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
    //     let reqHeader = {
    //         header: security.securityResult.headerObj
    //     };
    //     this._logger.log("set_data:", set_data);
    //     return this.fi000408.getData(set_data, page, sort, reqHeader).then(
    //         (sucess) => {
    //             this._logger.log(sucess);
    //             this._logger.log("SSSSSSSSSSSSSSS");
    //             return Promise.resolve(sucess);
    //         },
    //         (failed) => {
    //             this._logger.log(failed);
    //             this._logger.log("FFFFFFFFFFFFFFF");
    //             return Promise.reject(failed);
    //         }
    //     )
    // }

    //發fi000709 基金小額申購申請(新規格)
    getPurchase_New(set_data): Promise<any> {
        this._logger.log("set_data:", JSON.parse(JSON.stringify(set_data)) );
        return this.fi000709.getData(set_data).then(
            (sucess) => {
                logger.error("service sucess:", sucess);
                return Promise.resolve(sucess);
            },
            (failed) => {
                logger.error("service failed:", failed);
                return Promise.reject(failed);
            }
        )
    }

    //發fi000710 基金小額申購確認新規格)
    getPurchase_Result(set_data: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        this._logger.log("set_data:", set_data);
        return this.fi000710.getData(set_data, page, sort, reqHeader).then(
            (sucess) => {
                this._logger.log("service sucess:", sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed) => {
                this._logger.log("service failed:", failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        )
    }
}
