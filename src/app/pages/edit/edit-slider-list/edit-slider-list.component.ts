import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { MENU_SETTING } from '@conf/menu/main-menu';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
  selector: 'app-edit-slider-list',
  templateUrl: './edit-slider-list.component.html',
  styleUrls: ['./edit-slider-list.component.css']
})
export class EditSliderListComponent implements OnInit {
  menu: any[] = MENU_SETTING.ALL_SLIDER;
  savedMenu: any[];

  constructor(
    private navgator: NavgatorService,
    private headCtrl: HeaderCtrlService,
    private alert: AlertService
  ) {
    this.savedMenu = this.headCtrl.getSliderMenu();
    this.menu = this.checkMenuSelected(this.menu, this.savedMenu);
  }

  checkMenuSelected(menu: any[], selected: any[]) {
    if (!menu) { return; }
    menu.forEach(item => {
      const isSelected = selected.find(selectedItem => selectedItem.url === item.url);
      item.seleted = !!isSelected;
      if (!!item.subMenu) {
        item.subMenu = this.checkMenuSelected(item.subMenu, selected);
      }
    });
    return menu;
  }

  ngOnInit() {
  }

  toggleMenu(menu) {
    menu.expand = !menu.expand;
  }

  /**
   * 按下儲存
   */
  clickSave() {
    const selectedMenu: any[] = this.getSelectedMenu(this.menu);
    const newMenu = [];
    // 先保留原本就有的
    this.savedMenu.forEach(savedItem => {
      const item = selectedMenu.find(selected => savedItem.url === selected.url);
      if (!!item) {
        newMenu.push(item);
      }
    });
    // 加入新增的
    selectedMenu.forEach(selectedItem => {
      const item = newMenu.find(hasItem => selectedItem.url === hasItem.url);
      if (!item) {
        newMenu.push(selectedItem);
      }
    });
    if (newMenu.length > 16) {
      this.alert.show('TCBMSG_02_001');
      return;
    } else if (newMenu.length == 0) {
      this.alert.show('TCBMSG_02_002');
      return;
    }

    this.headCtrl.updateSliderMenu(newMenu);
    this.navgator.popTo('edit_slider');
  }


  /**
   * 取得已選取的清單
   */
  getSelectedMenu(menu) {
    const selectedMenu: any[] = [];
    menu.forEach(item => {
      if (item.seleted) {
        selectedMenu.push(item);
      }
      if (!!item.subMenu) {
        item.subMenu.forEach(subItem => {
          if (subItem.seleted) {
            selectedMenu.push(subItem);
          }
        });
      }
    });
    return selectedMenu;
  }


}
