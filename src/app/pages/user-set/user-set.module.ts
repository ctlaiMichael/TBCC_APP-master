import { NgModule, ModuleWithProviders } from '@angular/core';
import { UserSetRoutingModule } from './user-set-routing.module';
import { SharedModule } from '@shared/shared.module';
import { UserSetComponent } from './user-set.component';
import { Routes, RouterModule } from '@angular/router';

import { NetCodeChgPageComponent } from './netcode-change/netcode-change-page.component';


import { FG000101ApiService } from '@api/fg/fg000101/fg000101-api.service';
import { FG000201ApiService } from '@api/fg/fg000201/fg000201-api.service';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';


import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { UserSetCertifyModule } from './shared/component/popup/certify.module';
import { UserSetResultModule } from './shared/component/result/result.module';
// ---------------- Pages Start ---------------- //


// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule
    , MenuTempModule    //選單
    , UserMaskModule    //遮罩
    , UserSetRoutingModule  //此routh
    , UserSetCertifyModule  //憑證
    , UserSetResultModule   //結果頁
  ],
  providers: [
    // ---------------- Service Start ---------------- //
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    UserSetComponent
    
  ]
})
export class UserSetModule { }
