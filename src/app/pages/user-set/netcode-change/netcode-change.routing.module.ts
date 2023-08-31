import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetCodeChgPageComponent } from './netcode-change-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'netCodeChg', pathMatch: 'full' }
  , { path: 'netCodeChg', component: NetCodeChgPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetCodeChgRoutingModule { }
