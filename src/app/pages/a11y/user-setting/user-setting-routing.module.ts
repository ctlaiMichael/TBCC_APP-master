import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingMenuA11yPageComponent } from './setting-menu-a11y-page/setting-menu-a11y-page.component';
import { ChangeNameA11yPageComponent } from './change-name-a11y-page/change-name-a11y-page.component';
import { ChangePwdA11yPageComponent } from './change-pwd-a11y-page/change-pwd-a11y-page.component';
import { ChangeSslPwdA11yPageComponent } from './change-ssl-pwd-a11y-page/change-ssl-pwd-a11y-page.component';
import { DeviceBindA11yPageComponent } from './device-bind-a11y-page/device-bind-a11y-page.component';
import { UserSettingResultA11yPageComponent } from './user-setting-result-a11y-page/user-setting-result-a11y-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'a11ysettingmenutkey', pathMatch: 'full' },{
    path: 'a11ysettingmenutkey', // 設定根目錄為這一層
    component: SettingMenuA11yPageComponent
  },{
    path: 'a11ychangenamekey', // 設定根目錄為這一層
    component: ChangeNameA11yPageComponent
  },{
    path: 'a11ychangepwdkey', // 設定根目錄為這一層
    component: ChangePwdA11yPageComponent
  },{
    path: 'a11ychangesslpwdkey', // 設定根目錄為這一層
    component: ChangeSslPwdA11yPageComponent
  },{
    path: 'a11yresultkey', // 設定根目錄為這一層
    component: UserSettingResultA11yPageComponent
  },{
    path: 'a11yresultkey', // 設定根目錄為這一層
    component: UserSettingResultA11yPageComponent
  },{
    path: 'a11yDeviceBind', // 無障礙裝置綁定設定根目錄為這一層
    component: DeviceBindA11yPageComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingRoutingModule { }
