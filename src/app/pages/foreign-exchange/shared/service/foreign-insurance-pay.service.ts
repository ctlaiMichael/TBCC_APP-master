/**
 * 外幣繳保費
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { F5000201ApiService } from '@api/f5/f5000201/f5000201-api.service';
import { F5000202ApiService } from '@api/f5/f5000202/f5000202-api.service';
import { ForeignInsurancePay } from '@conf/terms/forex/foreign-insurance-pay-notice';

@Injectable()

export class ForeignInsurancePayService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private _infoService: InfomationService,
        private navgator: NavgatorService,
        private f5000201: F5000201ApiService,
        private f5000202: F5000202ApiService
    ) {
    }

    //外幣保費資料查詢 F5000201
    getInsData(reqObj: string): Promise<any> {
        return this.f5000201.getData(reqObj).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }

    //繳交外幣保費 F5000202
    getInsResult(reqObj: any,security: any): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.f5000202.getData(reqObj,reqHeader).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
}




  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------




