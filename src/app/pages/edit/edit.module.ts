import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoutingModule } from './edit-routing.module';

import { SharedModule } from "@shared/shared.module";

import { SortablejsModule } from 'angular-sortablejs';

import { EditService } from '@pages/edit/shared/edit.service'
import { EditMainBlockComponent } from '@pages/edit/edit-main-block/edit-main-block.component'
import { EditHotKeyComponent } from '@pages/edit/edit-hot-key/edit-hot-key.component';
import { EditHotKeyListComponent } from '@pages/edit/edit-hot-key-list/edit-hot-key-list.component';
import { EditSliderComponent } from '@pages/edit/edit-slider/edit-slider.component';
import { EditSliderListComponent } from '@pages/edit/edit-slider-list/edit-slider-list.component';

const Components = [
  EditMainBlockComponent,
  EditHotKeyComponent,
  EditHotKeyListComponent,
  EditSliderComponent,
  EditSliderListComponent
];

@NgModule({
  imports: [
    CommonModule,
    EditRoutingModule,
    SharedModule,
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [
    EditService    
  ],
  declarations: [
    ...Components
  ]
})
export class EditModule { }
