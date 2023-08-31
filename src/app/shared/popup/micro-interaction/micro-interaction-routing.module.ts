import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { microInteractionComponent } from './micro-interaction.component';
const routes: Routes = [{ path: '', redirectTo: '1', pathMatch: 'full' },
{
  path: 'microInteraction', // 設定根目錄為這一層
  component: microInteractionComponent

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
// tslint:disable-next-line: class-name
export class microInteractionRoutingModule { }
