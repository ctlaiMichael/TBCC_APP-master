import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMainBlockComponent } from '@pages/edit/edit-main-block/edit-main-block.component';
import { EditHotKeyComponent } from '@pages/edit/edit-hot-key/edit-hot-key.component';
import { EditHotKeyListComponent } from '@pages/edit/edit-hot-key-list/edit-hot-key-list.component';
import { EditSliderComponent } from '@pages/edit/edit-slider/edit-slider.component';
import { EditSliderListComponent } from '@pages/edit/edit-slider-list/edit-slider-list.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'edit_mainBlock', pathMatch: 'full'
  }, {
    path: 'edit_mainBlock', component: EditMainBlockComponent
  }, {
    path: 'edit_hotKey', component: EditHotKeyComponent
  }, {
    path: 'edit_hotKey_list', component: EditHotKeyListComponent
  }, {
    path: 'edit_slider', component: EditSliderComponent
  }, {
    path: 'edit_slider_list', component: EditSliderListComponent
  }, {
    path: '**', // any other
    redirectTo: '1'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
