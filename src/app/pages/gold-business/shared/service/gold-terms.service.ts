import { Injectable } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { FB000710ApiService } from '@api/fb/fb000710/fb000710-api.service';
import { FB000710ReqBody } from '@api/fb/fb000710/fb000710-req';
import { FB000711ApiService } from '@api/fb/fb000711/fb000711-api.service';
import { FB000711ReqBody } from '@api/fb/fb000711/fb000711-req';

@Injectable()
export class GoldTermsService {

  constructor(
    private authService: AuthService,
    private fb000710: FB000710ApiService,
    private fb000711: FB000711ApiService,
  ) { }

  getGoldtermsInfo(reqObj): Promise<any> {
    const form: FB000710ReqBody = {
      custId : this.authService.getCustId(),
      goldAccount : reqObj.goldAccount
    };
    return this.fb000710.send(form).then(
      (resObj) => {
        return Promise.resolve(resObj.body);
      },
      (errObj) => {
        return Promise.reject(errObj);
      }
    );
  }
  /**
   * 
   * @param reqObj
   * @param security {SecurityType:1-SSL,2-憑證, SecurityPassword: }
   */
  setGoldtermsInfo(reqObj, security): Promise<any> {
    if (typeof security.SecurityType == 'undefined') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }

    const form: FB000711ReqBody = {
      custId : this.authService.getCustId(),
      goldAccount : reqObj.goldAccount,
      trnsfrOutAccount : reqObj.trnsfrOutAccount,
      fixAmount6: reqObj.fixAmount6,
      fixAmount16: reqObj.fixAmount16,
      fixAmount26: reqObj.fixAmount26,
      fixFee: reqObj.fixFee,
      fixCloseDay: reqObj.fixCloseDay,
      pauseCode: reqObj.pauseCode,
      pauseBeginDay: reqObj.pauseBeginDay,
      pauseEndDay: reqObj.pauseEndDay,
      fixCode: reqObj.fixCode,
      trnsToken: reqObj.trnsToken
    };
    return this.fb000711.sendData(form, security).then(
      (resObj) => {
        return Promise.resolve(resObj.body);
      },
      (errObj) => {
        return Promise.reject(errObj);
      }
    );
  }

  // 日期換算
  dateFormate(period: string) {
    let dateOutput = {
      year: '',
      month: '',
      date: '',
      dateformate: '',
      today: ''
    };

    // 抓現年月日
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    // 前七天
    if (period == 'forWeek') {
      let before = +today - 1000 * 60 * 60 * 24 * 7;
      let beforeDate = new Date(before);
      // logger.debug('beforeDate:', beforeDate);
      dateOutput.year = this.dateTurn(beforeDate).year;
      dateOutput.month = this.dateTurn(beforeDate).month;
      dateOutput.date = this.dateTurn(beforeDate).date;
      dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
      dateOutput.today = this.dateTurn(today).dateformate;
      // 前一個月
    } else if (period == 'forMonth') {
      // 判斷大月
      if (month === 1 || 3 || 5 || 7 || 8 || 10 || 12) {
        let before = +today - 1000 * 60 * 60 * 24 * 31;
        let beforeDate = new Date(before);
        dateOutput.year = this.dateTurn(beforeDate).year;
        dateOutput.month = this.dateTurn(beforeDate).month;
        dateOutput.date = this.dateTurn(beforeDate).date;
        dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
        dateOutput.today = this.dateTurn(today).dateformate;
      }

      // 判斷小月
      if (month === 4 || 6 || 9 || 11) {
        let before = +today - 1000 * 60 * 60 * 24 * 30;
        let beforeDate = new Date(before);
        dateOutput.year = this.dateTurn(beforeDate).year;
        dateOutput.month = this.dateTurn(beforeDate).month;
        dateOutput.date = this.dateTurn(beforeDate).date;
        dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
        dateOutput.today = this.dateTurn(today).dateformate;
      }

      // 判斷是否為閏年
      if (month === 2 && date > 28) {
        // 閏年(29天)
        if ((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0)) {
          let before = +today - 1000 * 60 * 60 * 24 * 29;
          let beforeDate = new Date(before);
          // logger.debug(beforeDate);
          this.dateTurn(beforeDate);
          dateOutput.year = this.dateTurn(beforeDate).year;
          dateOutput.month = this.dateTurn(beforeDate).month;
          dateOutput.date = this.dateTurn(beforeDate).date;
          dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
          dateOutput.today = this.dateTurn(today).dateformate;
        } else {
          // 平年(28天)
          if ((year % 4 === 0) && (year % 100 !== 0) && (year % 400 === 0)) {
            let before = +today - 1000 * 60 * 60 * 24 * 28;
            let beforeDate = new Date(before);
            // logger.debug(beforeDate);
            this.dateTurn(beforeDate);
            dateOutput.year = this.dateTurn(beforeDate).year;
            dateOutput.month = this.dateTurn(beforeDate).month;
            dateOutput.date = this.dateTurn(beforeDate).date;
            dateOutput.dateformate = this.dateTurn(beforeDate).dateformate;
            dateOutput.today = this.dateTurn(today).dateformate;
          }
        }
      }

    } else if (period == 'nextDay') {
      let nextdt = +today + 1000 * 60 * 60 * 24 * 1;
      let nextDate = new Date(nextdt);
      // logger.debug('nextDate:', nextDate);
      dateOutput.year = this.dateTurn(nextDate).year;
      dateOutput.month = this.dateTurn(nextDate).month;
      dateOutput.date = this.dateTurn(nextDate).date;
      dateOutput.dateformate = this.dateTurn(nextDate).dateformate;
      dateOutput.today = this.dateTurn(today).dateformate;
      // 下一天
    }
    return dateOutput;
  }

  dateTurn(dateFormate: any) {
    let outDateData = {
      year: '',
      month: '',
      date: '',
      dateformate: '',
    };
    let month = dateFormate.getMonth() + 1;
    let date = dateFormate.getDate();

    outDateData.year = (dateFormate.getFullYear()).toString();
    if (date < 10) {
      outDateData.date = '0' + (date.toString());
    } else {
      outDateData.date = date.toString();
    }
    if (month < 10) {
      outDateData.month = '0' + month.toString();
    } else {
      outDateData.month = month.toString();
    }
    outDateData.dateformate = outDateData.year + '-' + outDateData.month + '-' + outDateData.date;
    return outDateData;
  }
}
