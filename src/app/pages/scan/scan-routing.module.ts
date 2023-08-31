import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanComponent } from './scan/scan.component';
const routes: Routes = [{ path: '', redirectTo: '1', pathMatch: 'full' },
{
  path: 'scan', // 設定根目錄為這一層
  component: ScanComponent
  // Product 包含的小組件們
  // children: [
  //   { path: '', component: LazyloadPageComponent },
  // ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanRoutingModule { }
