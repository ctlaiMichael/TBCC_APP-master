import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultPageComponent } from './result-page/result-page.component'
import { from } from 'rxjs/observable/from';
const routes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  {
    path: 'resultError', // 設定根目錄為這一層
    component: ResultPageComponent,
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultRoutingModule { }
