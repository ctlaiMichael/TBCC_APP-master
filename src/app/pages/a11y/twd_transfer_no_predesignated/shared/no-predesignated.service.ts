import { Injectable } from "@angular/core";
import { A11yConfirmService } from "@shared/popup/a11y/confirm/confirm.service";
import { NavgatorService } from "@core/navgator/navgator.service";
import { ReplaceUtil } from "@shared/util/formate/string/replace-util";
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
@Injectable()
export class NoPredesignatedTransferService {

    constructor(
        private a11yConfirmService: A11yConfirmService,
        private navgator: NavgatorService,
        private f4000102: F4000102ApiService
    ) { }

    /**
     * 跳出確認視窗，返回至首頁
     */
    cancel() {
        this.a11yConfirmService.show('您是否放棄此次編輯?', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                this.navgator.push('a11yhomekey');
            },
            () => {
            }
        );
    }
    /**
     * 
     * @param amount 金額 有無格式化皆可
     * @param prefix 前綴 ex:轉帳金額
     */
    twdTitle(amount: number | string, prefix?: string) {
        if (typeof (amount) != 'string') {
            amount = amount.toString();
        }
        let returnStr: string = "新台幣/" + amount + "元";
        if (prefix != null) {
            returnStr = prefix + returnStr;
        }
        return returnStr;
    }

    /**
    * 帳戶遮碼(自行),小於13碼不補0、
    * dddd-ddd-dddddd
    * 超過13
    * dddd-ddd-dddddddddddd
    */
  accountNoFormateOnlyDash(str: string | number): string {
    if (typeof str === 'number') {
      str = str.toString();
    }
    if (typeof str !== 'string') {
      return str;
    }
    str = ReplaceUtil.baseSymbol(str, '');
    return str.substr(0, 4) + '-' + str.substr(4, 3) + '-' + str.substr(7);
  }


  
}
