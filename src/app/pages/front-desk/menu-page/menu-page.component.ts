import { Component, OnInit } from '@angular/core';
import { SUB_MENU } from '@conf/menu/sub-menu';
import { ActivatedRoute } from '@angular/router';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {
  setMenu = 'front-desk';
  constructor(
    private route: ActivatedRoute,
    private _headerCtrl: HeaderCtrlService
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      // 20191216 登入前後線上櫃台改相同
      // if (!!params['type'] && params['type'] == 'home') {
      //   this.setMenu = 'front-desk-home';
      // }
    });
  }

}
