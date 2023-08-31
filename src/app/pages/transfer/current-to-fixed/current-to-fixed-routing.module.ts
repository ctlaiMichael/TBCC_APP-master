import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentToFixedPageComponent } from './current-to-fixed-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'current-to-fixed', component: CurrentToFixedPageComponent }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentToFixedRoutingModule { }
