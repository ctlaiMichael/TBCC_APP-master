
import { NgModule } from '@angular/core';
// ---------------- API Start ---------------- //
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { TwdToForexInfo } from '@conf/terms/forex/twd-to-forex-info';
import { NavgatorService } from '@core/navgator/navgator.service';
import { NoAccountInfo } from '@conf/terms/forex/no-account-info';
import { ReservationInfo } from '@conf/terms/forex/reservation-info';
import { F5000102ReqBody } from '@api/f5/f5000102/f5000102-req';
import { F5000109ReqBody } from '@api/f5/f5000109/f5000109-req';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { F5000110ReqBody } from '@api/f5/f5000110/f5000110-req';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { F5000111ApiService } from '@api/f5/f5000111/f5000111-api.service';

/**
 * 模組清單
 */
const Provider = [
  F5000101ApiService,
  F5000102ApiService,
  F5000103ApiService,
  F5000105ApiService,
  InfomationService,
  TwdToForexInfo,
  NoAccountInfo,
  ReservationInfo,
  F5000102ReqBody,
  F5000109ReqBody,
  F5000109ApiService,
  F5000110ReqBody,
  F5000110ApiService,
  F5000111ApiService
];

@NgModule({
  imports: [
  ],
  providers: [
    ...Provider
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class TwdToForeignServiceModule { }

