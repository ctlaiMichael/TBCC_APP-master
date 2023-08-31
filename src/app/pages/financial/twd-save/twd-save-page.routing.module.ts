import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwdSavePageComponent } from './twd-save-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  { path: 'main' , component: TwdSavePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwdSavePageRoutingModule { }
