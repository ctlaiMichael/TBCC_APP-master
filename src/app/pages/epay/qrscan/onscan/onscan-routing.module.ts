/**
 * epay 主掃
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnscanComponent } from './onscan.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    path: 'main', component: OnscanComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnscanRoutingModule { }
