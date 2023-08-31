/**
 *線上申貸 證明文件上傳(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from "@shared/formate/formate.service";
import { CheckSecurityService } from "@shared/transaction-security/check-security/check-security.srevice";

@Injectable()

export class CardUploadService {
    private closeSecurity = false; //true:無安控(p4)
    loadStatus = ''; //上傳狀態：'0':稍後上傳，'1'：1~5張，'3':全部傳

    constructor(
        private _logger: Logger,
        private _formateService: FormateService
        , private _checkSecurityService: CheckSecurityService
    ) { }

}