import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent} from './login-page/login-page.component';
import { LogoutRequired } from '@core/auth/logout-required.service';
const routes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  {
    path: '1', // 設定根目錄為這一層
    component: LoginPageComponent
    , canActivate: [LogoutRequired]
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
