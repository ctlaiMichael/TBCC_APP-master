import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchSetListPageComponent } from './search-set-list-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  
  { path: '', redirectTo: 'search-set-list', pathMatch: 'full' },
  {
    path: 'search-set-list', component: SearchSetListPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchSetListRoutingModule { }
