import { Injectable } from "@angular/core";
import { A11yConfirmService } from "@shared/popup/a11y/confirm/confirm.service";
import { NavgatorService } from "@core/navgator/navgator.service";

@Injectable()
export class LoanService {
  constructor(
    private a11yConfirmService: A11yConfirmService,
    private navgator: NavgatorService
  ) {}

  /**
   *
   * @param amount 金額 有無格式化皆可
   * @param prefix 前綴 ex:轉帳金額
   */
  twdTitle(amount: number | string, prefix?: string) {
    if (typeof amount != "string") {
      amount = amount.toString();
    }
    let returnStr: string = "新台幣/" + amount + "元";
    if (prefix != null) {
      returnStr = prefix + returnStr;
    }
    return returnStr;
  }

  dateTitle(date: string, prefix: string): string {
    return (
      prefix +
      date.split("/")[0] +
      "年" +
      date.split("/")[1] +
      "月" +
      date.split("/")[2] +
      "日"
    );
  }

  /**
   *
   * @param time hh:mm:ss
   */
  timeTitle(time: string): string {
    // time = time.split(":").join(""); // 消掉全部 :
    // alert(time.substr(3, 2));
    return (
      time.substr(0, 2) +
      "點" +
      time.substr(3, 2) +
      "分" +
      time.substr(6, 2) +
      "秒"
    );
  }
}
