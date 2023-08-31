import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NocardRecordRoutingModule } from './nocard-record-routing.module';
import { RecordListPageComponent } from './record-list/record-list-page.component';
import { RecordListPaginatorComponent } from './record-list/record-list-paginator/record-list-paginator.component';
import { RecordDetailPageComponent } from './record-detail/record-detail-page.component';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { RecordResultPageComponent } from './record-result/record-result-page.component';
import { FN000104ApiService } from '@api/fn/fn000104/fn000104-api.service';
import { FN000105ApiService } from '@api/fn/fn000105/fn000105-api.service';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    NocardRecordRoutingModule,
    PaginatorCtrlModule
  ],
  providers: [
    FN000104ApiService,
    FN000105ApiService
  ],
  declarations: [
    RecordListPageComponent,
    RecordListPaginatorComponent,
    RecordDetailPageComponent,
    RecordResultPageComponent
  ]
})
export class NocardRecordModule { }
