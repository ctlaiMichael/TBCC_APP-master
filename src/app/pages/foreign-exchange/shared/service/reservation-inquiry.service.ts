/**
 *外匯預約轉帳查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { F5000106ApiService } from '@api/f5/f5000106/f5000106-api.service';
import { F5000107ApiService } from '@api/f5/f5000107/f5000107-api.service';
import { F5000106ReqBody } from '@api/f5/f5000106/f5000106-req';
// import { F6000402ApiService } from '@api/f6/f6000402/f6000402-api.service';
// import { F6000403ApiService } from '@api/f6/f6000403/f6000403-api.service';
// import { ElectricityResultPageComponent } from '@pages/taxes/electricity/electricity-result-page.component';
// import { F6000403ReqBody } from '@api/f6/f6000403/f6000403-req';
// import { HitrustPipeService } from '@share_pipe/hitrustPipe';
@Injectable()
export class ReservationInquiryService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger,
        private f5000106: F5000106ApiService,
        private f5000107: F5000107ApiService
        
    ) { }


    /**
     *@param set_data
     * 向service取得資料
     */
    // 發電文 F5000106-外幣活存預約轉帳查詢
    getData(req): Promise<any> {

        // let form = new F5000106ReqBody;
        //     form.exchangeType = req.exchangeType;
        //     form.startDate = req.startDate;
        //     form.endDate = req.endDate;
        //     form.trnsfrOutAccnt = req.trnsfrOutAccnt;

        return this.f5000106.getData(req).then(
            (output) => {
                if (output.status) {
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(output);
                }
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }



    // let reqHeader = {
    //     header: security.securityResult.headerObj
    // };
    // return this.f6000403.getData(reqObj, reqHeader).then(
    //     (jsonObj) => {
    //         if (jsonObj.hasOwnProperty('status') && jsonObj.status == true && jsonObj.hasOwnProperty('info_data')) {
    //             output.info_data = jsonObj.info_data;
    //             output.status = true;
    //             return Promise.resolve(output);
    //         } else {
    //             return Promise.reject(output);
    //         }
    //     },
    //     (error_obj) => {
    //         return Promise.reject(error_obj);
    //     }
    // );

    getResult(reqObj: object, securityResult: any): Promise<any> {

        let reqHeader = {
            header: securityResult.headerObj
        };
        return this.f5000107.getData(reqObj, reqHeader).then(

            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
}




