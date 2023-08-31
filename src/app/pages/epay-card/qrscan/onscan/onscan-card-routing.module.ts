/**
 * epay 主掃
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnscanCardComponent } from './onscan-card.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    path: 'main', component: OnscanCardComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnscanCardRoutingModule { }
