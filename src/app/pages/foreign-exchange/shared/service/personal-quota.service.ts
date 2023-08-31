/**
 *外匯預約轉帳查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { F5000108ApiService } from '@api/f5/f5000108/f5000108-api.service';
import { F5000108ReqBody } from '@api/f5/f5000108/f5000108-req';
@Injectable()
export class PersonalQuotaService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger,
        private f5000108: F5000108ApiService
    ) { }

    /**
     *@param set_data
     * 向service取得資料
     */
    // 發電文 F5000108-外幣額度查詢
    getData(req): Promise<any> {

        return this.f5000108.getData(req).then(
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

}




