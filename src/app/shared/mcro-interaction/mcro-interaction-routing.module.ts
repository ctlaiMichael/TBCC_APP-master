import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { mcroInteractionComponent } from './mcro-interaction.component';
const routes: Routes = [{ path: '', redirectTo: '1', pathMatch: 'full' },
{
  path: 'mcroInteraction', // 設定根目錄為這一層
  component: mcroInteractionComponent
  // Product 包含的小組件們
  // children: [
  //   { path: '', component: LazyloadPageComponent },
  // ]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class mcroInteractionRoutingModule { }
