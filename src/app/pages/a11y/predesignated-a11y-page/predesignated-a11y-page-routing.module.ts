import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredesignatedTransferPageComponent } from './predesignated-transfer-page/predesignated-transfer-page.component';
import { PredesignatedConfirmPageComponent } from './predesignated-confirm-page/predesignated-confirm-page.component';
import { PredesignatedResultPageComponent } from './predesignated-result-page/predesignated-result-page.component';
import { HomeMemuA11yPageComponent } from '../home-memu-a11y-page/home-memu-a11y-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'a11ypredesignatedtransferkey', pathMatch: 'full' },
  {
    path: 'a11ypredesignatedtransferkey', // 設定根目錄為這一層
    component: PredesignatedTransferPageComponent
  },
  {
    path: 'a11ypredesignatedconfirmkey', // 
    component: PredesignatedConfirmPageComponent
  },
  {
    path: 'a11ypredesignatedresultkey', // 
    component: PredesignatedResultPageComponent
  },
  {
    path: 'a11yhomekey', // 
    component: HomeMemuA11yPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredesignatedA11yPageRoutingModule { }
