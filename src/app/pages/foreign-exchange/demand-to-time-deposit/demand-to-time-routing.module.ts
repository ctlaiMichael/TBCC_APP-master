import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandToTimePageComponent } from './demand-to-time-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  {
    path: 'edit'
    , component: DemandToTimePageComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandToTimeRoutingModule { }
