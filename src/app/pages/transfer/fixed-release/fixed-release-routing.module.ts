import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixedReleasePageComponent } from './fixed-release-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'fixed-release', pathMatch: 'full' },
  {
    path: 'fixed-release'
    , component: FixedReleasePageComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixedReleaseRoutingModule { }
