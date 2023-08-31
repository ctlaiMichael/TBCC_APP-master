/**
 * 現金收益存入帳號異動-Service Module
 */
import { NgModule } from '@angular/core';
// ---------------- Service Start ---------------- //
import { FundDepositAccountService } from './fundDepositAccount.service';

// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000701ApiService } from '@api/fi/fi000701/fi000701-api.service';

/**
 * Pipe清單
 */
const ServiceList = [
    FundDepositAccountService
    // , FB000501ApiService
    // , FB000502ApiService
   , FI000701ApiService
];


@NgModule({
    exports: [
    ],
    declarations: [
    ],
    providers: [
        ...ServiceList
    ]
})
export class FundDepositAccountServiceModule { }
