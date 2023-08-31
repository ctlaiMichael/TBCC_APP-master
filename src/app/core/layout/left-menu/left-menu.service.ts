import { Injectable } from '@angular/core';
import { HeaderCtrlService } from '../header/header-ctrl.service';
import { MicroInteractionService } from '../micro-interaction.service';

@Injectable()
export class LeftMenuService {
  public isOpened: boolean;
  public setOpened: boolean;
  constructor(
    private microInteraction: MicroInteractionService,
    private headerCtrl: HeaderCtrlService
  ) {
    this.isOpened = false;
    this.setOpened = false;
  }

  open() {
    this.isOpened = true;
    this.headerCtrl.displayNavSliderFrame(true);
    document.body.classList.add('menu_open');
    this.microInteraction.hideMicroBox(true);
  }

  close() {
    this.isOpened = false;
    this.headerCtrl.displayNavSliderFrame(false);
    document.body.classList.remove('menu_open');
    this.microInteraction.hideMicroBox(false);
  }

  toggle() {
    if (this.isOpened) {
      this.close();
    } else {
      this.open();
    }
  }

  headerSetOpen() {
    this.setOpened = true;
  }

  headerSetClose() {
    this.setOpened = false;
  }
}
