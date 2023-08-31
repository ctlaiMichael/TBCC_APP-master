import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FO000101ReqBody } from './fo000101-req';
import { FO000101ResBody } from './fo000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FO000101ApiService extends ApiBase<FO000101ReqBody, FO000101ResBody> {

  constructor(
    public _authService: AuthService,
    private _formateService: FormateService,
    public telegram: TelegramService<FO000101ResBody>,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FO000101');
    }

  send(data: FO000101ReqBody): Promise<any> {

    return super.send(data).then(
      (fo000101res) => {
        let output = {
          info_data: {},
          isBusinessDate: '',
          counties: [],
          updateTime: ''
        };

        let jsonObj = (fo000101res.hasOwnProperty('body')) ? fo000101res['body'] : {};
        let jsonHeader = (fo000101res.hasOwnProperty('header')) ? fo000101res['header'] : {};

        output.info_data = this._formateService.transClone(jsonObj);
        output.isBusinessDate = jsonObj.isBusinessDate;
        if (jsonHeader.hasOwnProperty('responseTime')) {
          output.updateTime = this._formateService.transDate(jsonHeader.responseTime);
        }

        // 縣市別整理
        let check_county = this.checkObjectList(jsonObj, 'counties.county');
        if (typeof check_county !== 'undefined') {
          output.counties = this.modifyTransArray(check_county);
          delete output.info_data['counties'];

          // 行政區整理
          output.counties.forEach((item, index) => {
            output.counties[index].regions = this.modifyTransArray(this._formateService.transClone(item.regions.region));
          });

          // 2020/03/10 客戶需求
          // 縣市須按照特定排序規則
          output.counties.map((item, index) => {
            let orderNumber = CountyOrder.indexOf(item.countyName);

            if (orderNumber > -1) {
              output.counties[index].order = orderNumber;
            } else {
              output.counties[index].order = 99;
            }
          });

          output.counties.sort(function (a: CountyDataSet, b: CountyDataSet) {
            return a.order - b.order;
          });
        }

        return Promise.resolve(output);
      },
      (fo000101err) => {
        return Promise.reject(fo000101err);
      }
    );
  }


}

// 2020/03/10 客戶需求
// 縣市須按照特定排序規則

// 縣市資料模板
export interface CountyDataSet {
  countyCode: string;
  countyName: string;
  regions?: any[];
  order?: number;
}

// 縣市順序別
export const CountyOrder = [
  '基隆市',
  '臺北市',
  '台北市',
  '新北市',
  '桃園市',
  '新竹縣',
  '新竹市',
  '新竹縣市',
  '苗栗縣',
  '臺中市',
  '台中市',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '嘉義市',
  '嘉義縣市',
  '臺南市',
  '台南市',
  '高雄市',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '臺東縣',
  '台東縣',
  '澎湖縣',
  '金門縣',
  '連江縣'
];
