import { Component, OnInit } from '@angular/core';
import { EditService } from '@pages/edit/shared/edit.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SortablejsOptions } from 'angular-sortablejs';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-edit-main-block',
  templateUrl: './edit-main-block.component.html',
  styleUrls: ['./edit-main-block.component.css']
})
export class EditMainBlockComponent implements OnInit {
  menuOrder: number[];
  normalOptions: SortablejsOptions = {
    // group: 'normal-group',
    handle: ".drag_img"
  };
  defaultMenu = [
    { id: 0, title: 'HOME.MAIN.TITLE_FOREX_RATE' },
    { id: 1, title: 'HOME.MAIN.TITLE_GOLD' },
    { id: 2, title: 'HOME.MAIN.TITLE_CARD' }
  ];

  constructor(
    private logger: Logger,
    private editService: EditService,
    private navgator: NavgatorService,
    private headCtrl: HeaderCtrlService
  ) {
    let sliderSetting = this.editService.getSetting('mainBlock');
    this.menuOrder = sliderSetting || this.defaultMenu;
  }

  ngOnInit() {
    this.headCtrl.setLeftBtnClick(
      () => {
        this.go('user-home');
      }
    );
  }

  save() {
    this.editService.setSetting('mainBlock', this.menuOrder);
    this.navgator.popTo('user-home');
  }

  go(path) {
    this.logger.log(path);
    this.editService.setSetting('mainBlock', this.menuOrder);
    this.navgator.push(path);
  }

}
