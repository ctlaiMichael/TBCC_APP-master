import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NocardMenuComponent } from '../nocard-menu/nocard-menu-page.component';
import { RecordListPageComponent } from './record-list/record-list-page.component';
import { RecordDetailPageComponent } from './record-detail/record-detail-page.component';
import { RecordResultPageComponent } from './record-result/record-result-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  // 交易紀錄查詢
  { path: 'nocard-transaction-record', component: RecordListPageComponent },
  // 交易紀錄查詢-交易明細
  { path: 'nocard-transaction-detail', component: RecordDetailPageComponent },
  // 交易紀錄查詢-結果頁
  { path: 'nocard-transaction-result', component: RecordResultPageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NocardRecordRoutingModule { }
