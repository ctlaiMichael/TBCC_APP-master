import {Injectable} from '@angular/core';
import {DeviceService} from '@lib/plugins/device.service';
import {Logger} from '@core/system/logger/logger.service';
// API Service
import {FO000104ApiService} from '@api/fo/fo000104/fo000104-api.service';
// API Request
import {FO000104ReqBody} from '@api/fo/fo000104/fo000104-req';
// Page Structure Interface
import {branchDetail} from '@pages/location/location-search-page/locationobject';
import {TicketItem, NumberTicketInfo} from '@pages/take-number/shared/component/number-ticket/number-ticket.interface';

@Injectable()
export class TicketRecordQueryService {

  constructor(
    private logger: Logger,
    private device: DeviceService,
    private FO000104: FO000104ApiService
  ) {
  }

  /**
   * 取得取號查詢列表
   */
  getQueryTicketRecords(): Promise<{data: TicketItem[], updateTime: string}> {
    return new Promise((resolve, reject) => {
      this.device.devicesInfo()
        .then(deviceInfo => {
          const param = new FO000104ReqBody();
          param.deviceId = deviceInfo.udid;
          this.logger.debug('FO000104 REQ Form', JSON.stringify(param));

          return this.FO000104.send(param);
        })
        .then(result => {
          this.logger.debug('FO000104 RES Success', JSON.stringify(result));
          return resolve({data: this.getQueryTicketRecordsList(result), updateTime: result.updateTime});
        })
        .catch(error => {
          this.logger.error('FO000104 RES Error', JSON.stringify(error));
          return reject(error);
        });
    });
  }

  /**
   * 取號查詢列表轉置頁面結構
   * @param res FO000104 API 回應結果
   */
  getQueryTicketRecordsList(res) {
    const tempItemList: TicketItem[] = [];

    res.branches.forEach((item, index) => {
      let branchInfo: branchDetail = {
        id: index,
        branchId: item.branchId,
        branchName: item.branchName,
        branchAddr: item.branchAddr,
        postalCode: item.postalCode,
        telephone: item.telephone,
        lon: item.lon,
        lat: item.lat
      };

      item.numRecords.forEach(ticket => {
        let ticketInfo: NumberTicketInfo = {
          saleId: ticket.saleId,
          department: ticket.saleName,
          ticketNumber: ticket.callNo,
          currentNumber: ticket.nowNumber,
          waitingSequence: ticket.waitperson,
          isShowNumberPassed: ticket.overNo === 'Y',
        };

        tempItemList.push({branchInfo, ticketInfo});
      });
    });

    return tempItemList;
  }
}
