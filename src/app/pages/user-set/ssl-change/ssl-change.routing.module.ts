import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SslChgPageComponent } from './ssl-change-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'sslChg', pathMatch: 'full' }
  , { path: 'sslChg', component: SslChgPageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SSLChgRoutingModule { }
