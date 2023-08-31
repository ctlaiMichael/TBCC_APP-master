import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForeignToTwdEditComponent } from './edit/foreign-to-twd-edit.component';
import { ForeignToTwdMainComponent } from './foreign-to-twd-main/foreign-to-twd-mainpage.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    {
        path: 'edit'
        , component: ForeignToTwdEditComponent
        // , data: {
        // }
    },
  {
        path: 'main'
      , component: ForeignToTwdMainComponent
        // , data: {
        // }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForeignToTwdRoutingModule { }
