import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NocardMenuComponent } from './nocard-menu/nocard-menu-page.component';
import { NocardResultComponent } from './nocard-result/nocard-result-page.component';

const routes: Routes = [
  {
    path: 'menu',  // 設定根目錄為這一層
    component: NocardMenuComponent
  },
  {
    path: 'nocardresultkey', // 共用結果頁面
    component: NocardResultComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NocardRoutingModule { }
