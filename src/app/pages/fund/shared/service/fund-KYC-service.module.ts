/**
 * 現金收益存入帳號異動-Service Module
 */
import { NgModule } from '@angular/core';
// ---------------- Service Start ---------------- //
import { FundKYCService } from './fund-KYC.service';

// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000603ApiService } from '@api/fi/fi000603/fi000603-api.service';
import { FI000604ApiService } from '@api/fi/fi000604/fi000604-api.service';

/**
 * Pipe清單
 */
const ServiceList = [
    FundKYCService
    // , FB000501ApiService
    // , FB000502ApiService
   , FI000603ApiService
   , FI000604ApiService
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
export class FundKYCServiceModule { }
