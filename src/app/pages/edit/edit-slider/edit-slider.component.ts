import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

import { EditService } from '@pages/edit/shared/edit.service';
import { MENU_SETTING } from '@conf/menu/main-menu';

@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.css']
})
export class EditSliderComponent implements OnInit {
  menuSlider: any; // menu動態資料
  normalOptions: SortablejsOptions = {
    // group: 'normal-group',
    handle: ".drag_img"
  };

  constructor(
    private editService: EditService,
    private navigator: NavgatorService,
    private headCtrl: HeaderCtrlService
  ) { }

  ngOnInit() {
    this.headCtrl.updateOption({
      'style': 'normal',
      'title': '編輯版面',
      'backPath': 'user-home'
    });

    let sliderSetting = this.editService.getSetting('sliderSetting');
    this.menuSlider = sliderSetting || MENU_SETTING.SLIDER;
    this.headCtrl.setLeftBtnClick(
      () => {
        this.go('user-home');
      }
    );
  }

  saveSlider(obj) {
    this.headCtrl.updateSliderMenu(obj);
    this.navigator.popTo('user-home');
  }

  go(path) {
    this.headCtrl.updateSliderMenu(this.menuSlider);
    this.navigator.push(path);
  }
}
