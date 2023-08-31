/**
 * 基金預約交易查詢-Service Module
 */
import { NgModule } from '@angular/core';
// ---------------- Service Start ---------------- //
import { ReserveCancelListService } from './ReserveCancelList.service';

// ---------------- API Start ---------------- //
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000601ApiService } from '@api/fi/fi000601/fi000601-api.service';

/**
 * Pipe清單
 */
const ServiceList = [
    ReserveCancelListService
    // , FB000501ApiService
    // , FB000502ApiService
   , FI000601ApiService
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
export class ReserveCancelListServiceModule { }
