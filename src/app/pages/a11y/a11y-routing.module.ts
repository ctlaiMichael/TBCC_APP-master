import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeMemuA11yPageComponent } from './home-memu-a11y-page/home-memu-a11y-page.component';
import { AccountSearchA11yPageComponent } from './account-search/account-search-a11y-page/account-search-a11y-page.component';
import { LoginA11yPageComponent } from './login-a11y-page/login-a11y-page.component';
import { GuideA11yPageComponent } from './guide-a11y-page/guide-a11y-page.component';
import { PredesignatedTransferPageComponent } from './predesignated-a11y-page/predesignated-transfer-page/predesignated-transfer-page.component';
import { SettingMenuA11yPageComponent } from './user-setting/setting-menu-a11y-page/setting-menu-a11y-page.component';
import { LoanA11yPageComponent } from './loan/loan-a11y-page/loan-a11y-page.component';
import { A11yResultPageComponent } from '@pages/a11y/resultPage/a11y-result-page.component';



const routes: Routes = [
  { path: '', redirectTo: 'a11yhomekey', pathMatch: 'full' }, {
    path: 'a11yhomekey', // 設定根目錄為這一層
    component: HomeMemuA11yPageComponent
  }, {
    path: 'a11yguidekey', // 功能導覽
    component: GuideA11yPageComponent
  }, {
    path: 'a11ysettingmenutkey', // 功能導覽
    component: SettingMenuA11yPageComponent
  }, {
    path: 'a11yaccountkey', // 設定根目錄為這一層
    component: AccountSearchA11yPageComponent
    // loadChildren: '@pages/a11y/account-search/account-search.module#AccountSearchModule'
    //loadChildren: './account-search/account-search.module#AccountSearchModule'


    // component: AccountSearchA11yPageComponent
  }, {
    path: 'a11yloginkey', // 設定根目錄為這一層
    component: LoginA11yPageComponent
  }, {
    path: 'a11ypredesignatedtransferkey', // 約定轉帳設定根目錄為這一層
    component: PredesignatedTransferPageComponent
  }, {
    path: 'a11yNoPredesignatedTransferkey', // 非約定轉帳
    loadChildren: './twd_transfer_no_predesignated/no-predesignated.module#NoPredesignatedModule'
    
  }, {
    path: 'a11yloankey',
    component: LoanA11yPageComponent
  },{
    path: 'a11yResultPage',
    component: A11yResultPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class A11yRoutingModule { }
