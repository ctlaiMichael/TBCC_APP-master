import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { DeviceService } from '@lib/plugins/device.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { FO000101ReqBody } from '@api/fo/fo000101/fo000101-req';
import { FO000101ApiService } from '@api/fo/fo000101/fo000101-api.service';
import { FO000102ReqBody } from '@api/fo/fo000102/fo000102-req';
import { FO000102ApiService } from '@api/fo/fo000102/fo000102-api.service';
import { FO000103ReqBody } from '@api/fo/fo000103/fo000103-req';
import { FO000103ApiService } from '@api/fo/fo000103/fo000103-api.service';
import { branchDetail, serviceLocation } from '@pages/location/location-search-page/locationobject';
import { MapService } from '../../../../shared/map/map.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class TakeNumLocationService {
  myFaveBranch: branchDetail[];     // 常用分行清單
  branchKey = 'faveBranch';         // localStorage 中，存放常用分行名稱
  serviceAddressesOriginal: branchDetail[] = [];    // 前一次分行查詢紀錄

  constructor(
    private _logger: Logger,
    private deviceService: DeviceService,
    private localStorageService: LocalStorageService,
    private fo000101: FO000101ApiService,
    private fo000102: FO000102ApiService,
    private fo000103: FO000103ApiService,
    private mapService: MapService,
    private alert: AlertService,
    private _handleError: HandleErrorService,
    private _formateService: FormateService,
  ) {
    // 由localStorage取得常用分行
    this.myFaveBranch = localStorageService.getObj(this.branchKey) || [];
   }

  /**
   * 設定前一次分行查詢紀錄
   */
  setServiceAddressesOriginal(data: branchDetail[]) {
    this.serviceAddressesOriginal = data;
  }

  /**
   * 設定前一次分行查詢紀錄
   */
  getServiceAddressesOriginal() {
    return this.serviceAddressesOriginal;
  }

  /**
   * 縣市區域查詢，發送fo000101API電文
   */
  getCountriesList(): Promise<any> {
    return new Promise((resolve, reject) => {
      let req_data = new FO000101ReqBody();

      this.fo000101.send(req_data).then(
        (res) => {
          this._logger.debug('fo000101_res:', res);
          if (res.info_data.rtnCode == '9000') {
            reject(res);
          } else {
            resolve(res);
          }
        },
        (err) => {
          this._logger.debug('fo000101_err:', err);
          reject(err);
        }
      );
    });
  }

  /**
   * 服務據點查詢，發送fo000102API電文
   * @data  查詢條件
   */
  getServiceLocationList(data: FO000102ReqBody): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fo000102.send(data).then(
        (res) => {
          this._logger.debug('fo000102_res:', res);
          if (res.info_data.rtnCode == '0000') {
            resolve(res);
          } else {
            reject(res);
          }
        },
        (err) => {
          this._logger.debug('fo000102_err:', err);
          reject(err);
        }
      );
    });
  }

   /**
   * 取得分行業務清單，發送fo000103API電文
   * type       固定為0，取得分行業務清單
   * @branchId  分行代碼
   */
  getBusinessList(branchId): Promise<any> {
    return new Promise((resolve, reject) => {
      let req_data = new FO000103ReqBody();
      req_data.type = '0';
      req_data.branchId = branchId;
      this.fo000103.send(req_data).then(
        (res) => {
          this._logger.debug('fo000103_0_res:', res);
          if (res.info_data.rtnCode == '0000') {
            resolve(res);
          } else {
            reject(res);
          }
        },
        (err) => {
          this._logger.debug('fo000103_0_err:', err);
          reject(err);
        }
      );
    });
  }

   /**
   * 取得分行業務號碼牌，發送fo000103API電文
   * type       固定為1，取得分行業務號碼牌
   * @data      分行代碼、業務代碼
   */
  getBusinessNumber(data: FO000103ReqBody): Promise<any> {
    return new Promise((resolve, reject) => {
      // 取得裝置識別碼
      this.deviceService.devicesInfo().then(
        (localdeviceInfo) => {

          data.type = '1';
          data.deviceId = localdeviceInfo.udid;

          this.fo000103.send(data).then(
            (res) => {
              this._logger.debug('fo000103_1_res:', res);
              if (res.info_data.rtnCode == '0000') {
                resolve(res);
              } else {
                reject(res);
              }
            },
            (err) => {
              this._logger.debug('fo000103_1_err:', err);
              reject(err);
            }
          );
        });
    });
  }

  /**
   * 取得localStorage中，我的最愛分行
   */
  getFaveBranch() {
    return this.myFaveBranch;
  }

  /**
   * 新增一個我的最愛分行至localStorage中
   * @data
   */
  addFaveBranchToLocal(data) {
    this.localStorageService.setObj(this.branchKey, data);
    this.checkBranchUpdate();
  }

  /**
   * 檢查常用分行(myFaveBranch)更新
   */
  checkBranchUpdate() {
    const orignialBranches = this.localStorageService.getObj(this.branchKey);
    this.myFaveBranch = orignialBranches;
    return this.myFaveBranch;
  }

  /**************************************************************************************
  * 初始化縣市區域清單
  ***************************************************************************************/
 initServiceLocation(data): Promise<any> {
  return new Promise((resolve, reject) => {

    const res = data;
    if (res['info_data']['rtnCode'] == '0000') {
      let countriesList = res['counties'];
      let countiesLen = countriesList.length;

      let serviceLocations = [
        {id: 0, countycode: '', name: '目前位置查詢' },
      ];

      // 整理獲取的縣市清單
      for (let count = 0; count < countiesLen; count++) {
        let tempLocation: serviceLocation = {
          id: count + 1,
          countycode: countriesList[count].countyCode,
          name: countriesList[count].countyName
        };

        serviceLocations.push(tempLocation);
      }
      res['serviceLocations'] = serviceLocations;
      resolve(res);
    } else {
      reject(res);
    }

  });
}

  /**
   * 分行據點整理
   * @param res fo000102 res
   * @param isEnabledGPS 是否啟用GPS
   * @param currentGpsPosition 取得經緯度
   */
  sortOutBranchList(res, isEnabledGPS, currentGpsPosition) {
    let serviceAddresses: branchDetail[] = [];
    const myFaveBranch = this.getFaveBranch(); // 常用分行清單
    for (let count = 0; count < res.branches.length; count++) {
      let branch: branchDetail = {
        active: false,
        branchId: res.branches[count].branchId,
        branchName: res.branches[count].branchName,
        branchAddr: res.branches[count].branchAddr,
        postalCode: res.branches[count].postalCode,
        telephone: res.branches[count].telephone,
        lon: res.branches[count].lon,
        lat: res.branches[count].lat,
        distance: 0
      };
      if (!!isEnabledGPS && isEnabledGPS == 'Y') {
        // 啟用GPS，計算兩者間之距離
        let position1 = {
          // user location
          longitude: Number(currentGpsPosition.lon),
          latitude: Number(currentGpsPosition.lat)
        };
        let position2 = {
          longitude: Number(branch.lon),
          latitude: Number(branch.lat)
        };
        // 距離最多以小數點後兩位呈現，單位KM
        let tempDistance = this.roundDecimal(this.mapService.getDistance(position1, position2), 2);
        branch['distance'] = tempDistance;
      }

      if (myFaveBranch.length > 0) {
        const result = myFaveBranch.filter( item => (item.branchId).toString().indexOf((branch['branchId']).toString()) > -1);
        if (result.length > 0) {
          branch['active'] = true;
        }
      }
      serviceAddresses.push(branch);
    } // end of for loop

    return serviceAddresses;
  }

  /**
   * 常用分行距離計算
   * @param myFave 常用分行清單
   * @param isEnabledGPS 是否啟用GPS
   * @param currentGpsPosition 取得經緯度
   */
  sortOutMyFaveBranchList(myFave, isEnabledGPS, currentGpsPosition) {
    let result: branchDetail[] = [];
    myFave.forEach(element => {
      // 啟用GPS，計算兩者間之距離
      let position1 = {
        // user location
        longitude: Number(currentGpsPosition.lon),
        latitude: Number(currentGpsPosition.lat)
      };
      let position2 = {
        longitude: Number(element.lon),
        latitude: Number(element.lat)
      };
      // 距離最多以小數點後兩位呈現，單位KM
      let tempDistance = this.roundDecimal(this.mapService.getDistance(position1, position2), 2);
      element['distance'] = tempDistance;
      result.push(element);
    });

    return result;
  }

  /**
   * 判斷是否為搜尋特定分行
   * @param serviceAddresses 分行據點清單
   * @param searchText       搜尋內容
   */
  searchCheck(serviceAddresses, searchText) {
    if (!!searchText) {
      const filterList = serviceAddresses.filter(item => {
        return item.branchName.indexOf(searchText) > -1 ||
               item.branchAddr.indexOf(searchText) > -1 ||
               item.telephone.indexOf(searchText) > -1;
      });
      if (filterList.length < 1 ) {
        this.alert.show('POPUP.LOCATION.NOT_FOUND');
        return serviceAddresses;
      } else {
        return serviceAddresses = filterList;
      }
    } else {
      return serviceAddresses;
    }
  }

  // 小數點四捨五入
  roundDecimal = function (val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
  };

}
