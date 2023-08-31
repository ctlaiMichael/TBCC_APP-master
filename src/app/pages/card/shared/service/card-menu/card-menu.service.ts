/**
 * 信用卡選單
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CARD_MAIN_MENU } from '@conf/menu/card-menu';
import { CARD_AD } from '@conf/ad/card_ad';

@Injectable()

export class CardMenuService {
  /**
   * 參數處理
   */
  private sourceAdData = this._formateService.transClone(CARD_AD);
  private sourceMainMenu = this._formateService.transClone(CARD_MAIN_MENU);

  constructor(
    private _logger: Logger
    , private _formateService: FormateService
  ) {
  }

  /**
   * 取得信用卡首頁選單
   * 畫面採取雙層選單
   */
  getMainMenu() {
    let output = [];
    let item_menu = [];
    let row_nume = 3;
    // 每三個一列
    this.sourceMainMenu.forEach(item => {
      if (item.hasOwnProperty('enabled') && item.enabled === true) {
        item_menu.push(item);
        if (item_menu.length === row_nume) {
          output.push(item_menu);
          item_menu = []; // reset row
        }
      }
    });
    if (item_menu.length > 0) {
      output.push(item_menu);
    }

    return output;
  }


  /**
   * 廣告
   * @param type
   */
  getAd(type?: string) {
    let output: any;
    if (typeof type !== 'undefined') {
      output = (this.sourceAdData.hasOwnProperty(type)) ? this.sourceAdData[type] : undefined;
    } else {
      output = this._formateService.transClone(this.sourceAdData);
    }
    this._logger.log(this.sourceAdData, output);
    return output;
  }



  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}
