import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import {TakeNumberRoutingModule} from './take-number-routing.module';
import {TakeNumberSearchComponent} from './take-number-search/take-number-search.component';
import {BookmarkModule} from '@shared/template/select/bookmark/bookmark.module';
import {TakeNumberMapComponent} from './take-number-map/take-number-map.component';
// import {LocationService} from '@pages/location/shared/location.service';
import {GoogleMapService} from '@lib/plugins/googlemap.service';
import { TakeNumberOperateComponent } from './take-number-operate/take-number-operate.component';
import { TakeNumberMyBranchComponent } from './take-number-my-branch/take-number-my-branch.component';
import { TakeNumberTicketComponent } from './take-number-ticket/take-number-ticket.component';
import { NumberTicketComponent } from './shared/component/number-ticket/number-ticket.component';
import { TicketRecordQueryService } from './shared/service/ticket-record-query.service';
import { FO000104ApiService } from '@api/fo/fo000104/fo000104-api.service';
import { FO000101ApiService } from '@api/fo/fo000101/fo000101-api.service';
import { FO000102ApiService } from '@api/fo/fo000102/fo000102-api.service';
import { FO000103ApiService } from '@api/fo/fo000103/fo000103-api.service';
import { TakeNumLocationService } from './shared/service/take-num-location.service';
import { MapService } from '@shared/map/map.service';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    TakeNumberRoutingModule,
    BookmarkModule,
    FormsModule
  ],
  providers: [
    // LocationService,
    GoogleMapService,
    TicketRecordQueryService,
    FO000104ApiService,
    FO000101ApiService,
    FO000102ApiService,
    FO000103ApiService,
    TakeNumLocationService,
    MapService
  ],
  declarations: [
    TakeNumberSearchComponent,
    TakeNumberMapComponent,
    TakeNumberOperateComponent,
    TakeNumberMyBranchComponent,
    TakeNumberTicketComponent,
    NumberTicketComponent
  ]
})
export class TakeNumberModule {}
