import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForeignSavePageComponent } from './foreign-save-page.component';
import { ForeignSaveDetailPageComponent } from './foreign-save-detail-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main' , component: ForeignSavePageComponent},
  { path: 'detail' , component: ForeignSaveDetailPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignSavePageRoutingModule { }
