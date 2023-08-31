/**
 * epay outbound
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { BoundAgreeComponent } from './bound-agree/bound-agree.component';
import { BoundDataComponent } from './bound-data/bound-data.component';
import { BoundResultComponent } from './bound-result/bound-result.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    path: 'term', component: BoundAgreeComponent, data: {
    }
  }
  , {
    path: 'edit', component: BoundDataComponent, data: {
    }
  }
  , {
    path: 'result', component: BoundResultComponent, data: {
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutboundRoutingModule { }
