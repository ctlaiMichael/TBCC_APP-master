import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrefacePageComponent } from './preface-page/preface-page.component';
import { PatternLockSettingPageComponent } from './pattern-lock-setting-page/pattern-lock-setting-page.component';

const routes: Routes = [
  {
    // == 圖形碼設定 == //
    path: '', redirectTo: 'preface', pathMatch: 'full'
  },
  { path: 'preface', component: PrefacePageComponent },
  { path: 'setting', component: PatternLockSettingPageComponent },
  // { path: 'result', component: ResultPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatternLockRoutingModule { }
