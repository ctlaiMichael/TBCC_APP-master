import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/popup/alert/alert.service';
import { LoadingSpinnerService } from '@core/layout/loading/loading-spinner.service';
import { CommonUtil } from '@shared/util/common-util';
import { LeftMenuService } from '@core/layout/left-menu/left-menu.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CacheService } from '@core/system/cache/cache.service';
import { logger } from '@shared/util/log-util';
import { CacheData } from '@core/system/cache/cache-data';
@Component({
  selector: 'app-lazyload-page',
  templateUrl: './lazyload-page.component.html',
  styleUrls: ['./lazyload-page.component.css']
})
export class LazyloadPageComponent implements OnInit {

  menuOpened = false;
  param = {
    value: '多語系範例'
  };

  constructor(
    private alert: AlertService,
    private loading: LoadingSpinnerService,
    private leftMenu: LeftMenuService,
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private cache: CacheService
  ) {
    this.headerCtrl.setHeaderStyle('normal');
  }

  ngOnInit() {

  }

  /**
   * Alert使用範例
   */
  alertSample() {
    this.alert.show('hello').then((res) => { logger.log('close'); });
  }

  showLoading() {
    logger.log('showLoading');
    this.loading.show('test');
    CommonUtil.wait(3000).then(() => {
      this.loading.hide('test');
    });
  }

  clickMenu() {
    if (this.menuOpened) {
      this.leftMenu.close();
    } else {
      this.leftMenu.open();
    }
    this.menuOpened = !this.menuOpened;
  }

  clickRouting() {
    this.navgator.push('hello');
  }

  saveCache() {
    let d = { 'hello': 'kie' };
    let option = new CacheData();
    option.keepAlive = 'always';
    logger.log('儲存cache always有效', d, new Date());
    this.cache.save('test', d, option);
    let d2 = { 'd2': '123' };
    let d3 = { 'd3': '456' };
    let option2 = new CacheData();
    option2.keepAlive = 'login';
    logger.log('儲存cache login有效', d2, new Date());
    this.cache.save('test2', d2, option2);
    logger.log('儲存cache ', d3, new Date());
    this.cache.save('test3', d3);
  }

  loadCache() {
    logger.log('讀取cache', new Date());
    let d = this.cache.load('test');
    logger.log('test:', d);
    let d2 = this.cache.load('test2');
    logger.log('test2:', d2);
    let d3 = this.cache.load('test3');
    logger.log('test3:', d3);
  }

  cleanCache() {
    logger.log('刪除cache keepAlways');
    this.cache.clear('keepAlways');
  }
}
