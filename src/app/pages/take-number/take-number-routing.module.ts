import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TakeNumberSearchComponent} from '@pages/take-number/take-number-search/take-number-search.component';
import {TakeNumberMapComponent} from '@pages/take-number/take-number-map/take-number-map.component';
import {TakeNumberOperateComponent} from '@pages/take-number/take-number-operate/take-number-operate.component';
import {TakeNumberMyBranchComponent} from '@pages/take-number/take-number-my-branch/take-number-my-branch.component';
import {TakeNumberTicketComponent} from '@pages/take-number/take-number-ticket/take-number-ticket.component';
import { TakeNumberRequired } from '@core/auth/take-number-required.service';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search', // 設定根目錄為這一層
    component: TakeNumberSearchComponent,
    canActivate: [TakeNumberRequired]
  },
  {
    path: 'map', // 設定根目錄為這一層
    component: TakeNumberMapComponent
  },
  {
    path: 'operate',
    component: TakeNumberOperateComponent
  },
  {
    path: 'my-branch',
    component: TakeNumberMyBranchComponent
  },
  {
    path: 'ticket',
    component: TakeNumberTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TakeNumberRoutingModule { }
