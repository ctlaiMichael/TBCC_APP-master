/**
 *線上申貸 取得往來分行(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FC000104ApiService } from "@api/fc/fc000104/fc000104-api.service";
import { FC000104ReqBody } from "@api/fc/fc000104/fc000104-req";

@Injectable()

export class FundSelectBranchService {

    constructor(
        private _logger: Logger,
        private fc000104: FC000104ApiService
    ) { }
    mainData = {};
    restObject = [];

    //查詢分行
    public getBranch(): Promise<any> {
        this._logger.log("into getBranchCode()");
        let reqData = new FC000104ReqBody();
        return this.fc000104.getData(reqData).then(
            (success) => {
                this._logger.log("success:", success);
                // this.mainData['list'] = success.data;
                let modify_data = this.formateBranch(success.data);
                success['_modify'] = modify_data;
                this.mainData = modify_data;
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 
     * @param setData
     */
    public formateBranch(setData) {
        let city_list = [];
        let branch = {};
        let city_branch = {};
        let branch_id = {};

        let tmp = {};
        let subkey;
        setData.forEach(item => {
            tmp = item;
            subkey = (typeof tmp['branchId'] !== 'undefined' && tmp['branchId'] !== '')
                ? tmp['branchId']
                : 'error_' + tmp;
            tmp['branchOldName'] = tmp['branchName'];
            tmp['branchName'] = tmp['branchName'].replace(tmp['branchId'], '').replace(/\(|\)/g, "");
            //新追加: 為分行(兩字)，則自行加入代碼
            if (tmp['branchName'] == '分行') {
                tmp['branchName'] = tmp['branchId'] + tmp['branchName'];
            }
            branch[subkey] = tmp;
            if (typeof item['city'] !== 'undefined') {
                if (typeof city_branch[item.city] == 'undefined') {
                    this._logger.log("into tmp['city'] ==undefined");
                    city_list.push(tmp['city']);
                    city_branch[item['city']] = [];
                }
                city_branch[item.city].push(item['branchName']);
            }
            if (typeof branch_id[item.branchName] == 'undefined') {
                branch_id[item.branchName] = [];
            }
            branch_id[item.branchName].push(item['branchId']);
        });
        let output: any = {};
        // output['city'] = city_list;
        output['city'] = this.modifyCity(city_list);
        output['branch'] = branch;
        output['city_branch'] = city_branch;
        output['branchId'] = branch_id;
        this._logger.log("output:", output);
        return output;
    }

    /**
     * 
     * @param cityTemp
     */
    private modifyCity(cityTemp: Array<any>) {
        let newList = [];
        this._logger.log("cityTemp:", cityTemp);
        //整理縣市順序
        let cityList = ['基隆市', '台北市', '臺北市', '新北市', '桃園市', '桃園縣', '新竹市', '新竹縣', '苗栗縣', '台中市', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '臺南市', '高雄市', '屏東縣', '台東縣', '臺東縣', '花蓮縣', '宜蘭縣', '澎湖縣', '金門縣', '連江縣'];
        let indexList = [];
        cityList.forEach(item => {
            let tmp_index = cityTemp.indexOf(item);
            if (tmp_index > -1) {
                this._logger.log("into has city");
                newList.push(item);
                indexList.push(tmp_index);
            }
        });
        if (newList.length < cityTemp.length) {
            // miss
            cityTemp.forEach((item, item_index) => {
                if (indexList.indexOf(item_index) <= -1) {
                    newList.push(item);
                }
            });
        }
        return newList;

        // let other_list = [];
        // cityTemp.forEach((item, item_index) => {
        //     let tmp_index = cityList.indexOf(item);
        //     if (tmp_index > -1) {
        //         newList[tmp_index] = item;
        //     } else {
        //         other_list.push(item);
        //     }
        // });
        // //merge兩個Array   array1.concat(array2)
        // newList = newList.concat(other_list);
        // return newList;
    }

}
