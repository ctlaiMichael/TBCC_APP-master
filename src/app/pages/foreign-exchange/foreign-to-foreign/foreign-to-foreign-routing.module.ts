import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForeignToForeignEditComponent } from './edit/foreign-to-foreign-edit.component';
import { ForeignToForeignMainComponent } from './foreign-to-foreign-main/foreign-to-foreign-mainpage.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    {
        path: 'edit'
        , component: ForeignToForeignEditComponent
        // , data: {
        // }
    },
  {
        path: 'main'
      , component: ForeignToForeignMainComponent
        // , data: {
        // }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForeignToForeignRoutingModule { }
