import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchSetPageComponent } from './search-set-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  
  { path: '', redirectTo: 'search-set', pathMatch: 'full' },
  {
    path: 'search-set', component: SearchSetPageComponent
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchSetRoutingModule { }
