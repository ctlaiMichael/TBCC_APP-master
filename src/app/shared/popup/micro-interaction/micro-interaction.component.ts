// 使用方法
// this.navgator.displaymicroBoxSubject.next({show: true, type: 'default'});
// show: true顯示 false 不顯示
// type 依照 micro-interaction-menu.ts 判斷使與哪一個類型

import { Component, OnInit, Input } from '@angular/core';
import { microInteractionOptions } from '../../../conf/menu/micro-interaction-menu';
import { NavgatorService } from '@core/navgator/navgator.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';

@Component({
  selector: 'app-micro-interaction',
  templateUrl: './micro-interaction.component.html',
  styleUrls: ['./micro-interaction.component.css']
})
// tslint:disable-next-line: class-name
export class microInteractionComponent implements OnInit {

  openFlag = false;
  showFlag = false;
  hiddenFlag = false;

  showMicroMenu = microInteractionOptions['default'];

  constructor(
    private microInteraction: MicroInteractionService,
    private navgator: NavgatorService
  ) {

  }

  ngOnInit() {
    this.microInteraction.displayMicroBoxSubject.subscribe((display: any = { show: true, type: 'default' }) => {
      this.showFlag = display.show;
      if (display.hasOwnProperty('type') && display.type !== '') {
        this.showMicroMenu = microInteractionOptions[display.type];
      } else {
        this.showMicroMenu = microInteractionOptions['default'];
      }
    });

    this.microInteraction.hiddenMicroBoxSubject.subscribe((value: boolean) => {
      this.hiddenFlag = value;
    });

    // 接收關閉微交互選單事件
    this.microInteraction.hideMicroMenuSubject.subscribe(() => {
      this.openFlag = false;
      delete sessionStorage.microMenuOpened;
    });
  }



  openMenu() {
    this.openFlag = !this.openFlag;
    if (!!this.openFlag) {
      sessionStorage.microMenuOpened = true;
    } else {
      delete sessionStorage.microMenuOpened;
    }
  }

  routing(routing_path: string) {
    this.openFlag = false;
    delete sessionStorage.microMenuOpened;
    this.navgator.push(routing_path);
  }
}
