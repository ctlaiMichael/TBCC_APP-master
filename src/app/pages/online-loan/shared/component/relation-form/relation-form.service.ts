/**
 *線上申貸 同一關係人(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { CheckService } from "@shared/check/check.service";
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';
import { FormateService } from "@shared/formate/formate.service";
import { UserCheckUtil } from "@shared/util/check/data/user-check-util";

@Injectable()

export class RelationFormService {

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private _allService: MortgageIncreaseService
    ) { }

    checkRequiredNum() {
        let output = 0;
        // 取得全部暫存資料
        let allData = this._allService.getAllData();
        // 判斷婚姻:結婚，血親欄位至少填一欄
        let marital = 0;
        let maritalStatus = this._formateService.checkField(allData, 'maritalStatus');
        let supportChildren = this._formateService.checkField(allData, 'supportChildren');
        if (maritalStatus == '2') {
            marital = 1;
        }
        // tslint:disable-next-line: radix 受撫養子女數 不是0
        let child = parseInt(supportChildren);
        if (!child) {
            child = 0;
        }

        // 必填數量
        output = marital + child;
        if (output >= 6) {
            output = 6;
        }
        return output;
    }

    /**
     * 新增 授信申請人配偶、二親等以內之血親
     */
    addFimary(setype: string, required?: boolean) {
        let output: any = {
            error: {
                name: '',
                idNo: '',
                title: ''
            },
            name: '',
            idNo: '',
            title: '',
            save_list: '',
            required: false
        };
        if (required) {
            output.required = true;
        }
        // switch (setype) {
        //     case 'family': // 授信申請人配偶、二親等以內之血親
        //         output['name'] = '';
        //         output['idNo'] = '';
        //         output['title'] = '';
        //         output['save_list'] = '';
        //         break;
        //     case 'company': // 授信申請人擔任負責人之企業
        //         break;
        //     case 'couple': // 填寫配偶負責人企業資料
        //         break;
        //     default:
        //         break;
        // }
        return output;
    }

    /**
     * 同一關係人檢核-授信申請人配偶、二親等以內之血親
     * @param data
     * name 姓名（20)
     * idNo 身分證
     * title 稱謂 (7)
     */
    checkRelationFamilyData(data: Array<any>) {
        let output = {
            status: true,
            msg: '檢核失敗',
            data: [],
            data_save: [],
            dataSaveStr: ''
        };
        let save_list = [];
        data.forEach((item: any) => {
            if (typeof item != 'object' || !item) {
                return false;
            }
            let required = (!!item['required']) ? true : false;
            let is_all_empty = 0;
            let error_list = [];
            item['error'] = {};
            item['save_list'] = '';
            // 身分證
            let idCheck = this._checkService.checkIdentity(item['idNo']);
            if (!idCheck.status) {
                item['error']['idNo'] = idCheck.msg;
                error_list.push(idCheck.msg);
                if (item['idNo'] == '' && !required) {
                    is_all_empty++;
                }
            }
            // 姓名
            let error_msg_name = '';
            let check_name_len = this._checkService.checkLength(item['name'], 50, 'max');
            if (!this._checkService.checkEmpty(item['name'], true)) {
                error_msg_name = '請輸入姓名';
                if (!required) {
                    is_all_empty++;
                }
            } else if (!check_name_len.status) {
                error_msg_name = check_name_len.msg;
            } else {
                let check_name = this._checkService.checkText(item['name']);
                if (!check_name.status) {
                    error_msg_name = check_name.msg;
                }
            }
            if (error_msg_name != '') {
                item['error']['name'] = error_msg_name;
                error_list.push(error_msg_name);
            }
            // 稱謂
            let error_msg_title = '';
            let check_title_len = this._checkService.checkLength(item['title'], 7, 'max');
            if (!this._checkService.checkEmpty(item['title'], true)) {
                error_msg_title = '請輸入稱謂';
                if (!required) {
                    is_all_empty++;
                }
            } else if (!check_title_len.status) {
                error_msg_title = check_title_len.msg;
            } else {
                let check_title = this._checkService.checkText(item['title']);
                if (!check_title.status) {
                    error_msg_title = check_title.msg;
                }
            }
            if (error_msg_title != '') {
                item['error']['title'] = error_msg_title;
                error_list.push(error_msg_title);
            }

            // end output
            if (is_all_empty == 3) {
                return;
            }
            if (error_list.length > 0) {
                output.status = false;
            } else {
                item['save_list'] = item['name'] + ',' + item['idNo'] + ',' + item['title'];
                save_list.push(item['save_list']);
            }
            output.data.push(item);
        });
        if (output.status) {
            output.msg = '';
            output.data_save = save_list;
            output.dataSaveStr = output.data_save.join(';');
        }

        return output;
    }

    /**
     * 同一關係人檢核-授信申請人擔任負責人之企業
     * @param data
     * name 企業名稱 (20)
     * idNo 統編
     * title 擔任職務 (7)
     */
    checkRelationCompanyData(data: Array<any>) {
        let output = {
            status: true,
            msg: '檢核失敗',
            data: [],
            data_save: [],
            dataSaveStr: ''
        };
        let save_list = [];
        data.forEach((item: any) => {
            if (typeof item != 'object' || !item) {
                return false;
            }
            let error_list = [];
            let is_all_empty = 0;
            item['error'] = {};
            item['save_list'] = '';
            let required = (!!item['required']) ? true : false;
            // 統編
            // let idCheck = this._checkService.checkNumber(item['idNo'], 'positive');
            let idCheck = UserCheckUtil.checkBusinessNo(item['idNo']);
            if (!idCheck.status) {
                // let err_msg = '請輸入統編';
                let err_msg = idCheck.msg;
                item['error']['idNo'] = err_msg;
                error_list.push(err_msg);
                if (item['idNo'] == '' && !required) {
                    is_all_empty++;
                }
            }
            // 企業名稱
            let error_msg_name = '';
            let check_name_len = this._checkService.checkLength(item['name'], 50, 'max');
            if (!this._checkService.checkEmpty(item['name'], true)) {
                error_msg_name = '請輸入企業名稱';
                if (!required) {
                    is_all_empty++;
                }
            } else if (!check_name_len.status) {
                error_msg_name = check_name_len.msg;
            } else {
                let check_name = this._checkService.checkText(item['name']);
                if (!check_name.status) {
                    error_msg_name = check_name.msg;
                }
            }
            if (error_msg_name != '') {
                item['error']['name'] = error_msg_name;
                error_list.push(error_msg_name);
            }
            // 擔任職務
            let error_msg_title = '';
            let check_title_len = this._checkService.checkLength(item['title'], 7, 'max');
            if (!this._checkService.checkEmpty(item['title'], true)) {
                error_msg_title = '請輸入擔任職務';
                if (!required) {
                    is_all_empty++;
                }
            } else if (!check_title_len.status) {
                error_msg_title = check_title_len.msg;
            } else {
                let check_title = this._checkService.checkText(item['title']);
                if (!check_title.status) {
                    error_msg_title = check_title.msg;
                }
            }
            if (error_msg_title != '') {
                item['error']['title'] = error_msg_title;
                error_list.push(error_msg_title);
            }

            // end output
            if (is_all_empty == 3) {
                return;
            }
            if (error_list.length > 0) {
                output.status = false;
            } else {
                item['save_list'] = item['name'] + ',' + item['idNo'] + ',' + item['title'];
                save_list.push(item['save_list']);
            }
            output.data.push(item);
        });
        if (output.status) {
            output.msg = '';
            output.data_save = save_list;
            output.dataSaveStr = output.data_save.join(';');
        }

        return output;
    }

}
