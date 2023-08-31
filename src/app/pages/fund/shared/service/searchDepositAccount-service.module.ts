/**
 * 投資設定查詢-Service Module
 */
import { NgModule } from '@angular/core';
// ---------------- Service Start ---------------- //
import { SearchDepositAccountService } from './searchDepositAccount.service';

// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000702ApiService } from '@api/fi/fi000702/fi000702-api.service';

/**
 * Pipe清單
 */
const ServiceList = [
    SearchDepositAccountService
    // , FB000501ApiService
    // , FB000502ApiService
   , FI000702ApiService
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
export class SearchDepositAccountServiceModule { }
