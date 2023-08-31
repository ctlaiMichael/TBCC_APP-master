import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';

/**
 * 帳戶彙總api整理
 */
export const ContentSummaryApiUtil = {
    /**
     * 台幣存摺整理
     *
     * @return object:
        {
            dataTime: '',
            data: {
                _showBranch: false,
                branch: '', // 帳務行(台幣存摺無此資料)
                branchName: '', // 帳務行名稱(台幣存摺無此資料)
                saveBookBalance: '', // 存款餘額(台幣存摺無此資料)
                realBalance: '', // 實質餘額
                usefulBalance: '', // 可用餘額
                todayCheckBalance: '', // 金交票金額
                tomCheckBalance: '', // 名交票金額
                icCard: '', // 消費圈存
                freezeBalance: '', // 凍結總額
                distrainBalance: '', // 扣押總額
                afterRunBalance: '', // 營業時間後提款及轉出
                afterRunPay: '', // 營業時間後存款及轉入
                _showFinance: true, // 顯示融資資料
                financeRate: '', // 融資利率
                financeAmount: '', // 融資額度
                financeStartDay: '', // 融資期間(起)
                financeEndDay: '', // 融資期間(訖)
                _showFD: false, // 顯示轉定存資料
                afterFDBalance: '', // 轉定存總存餘額
                toFDAmt: '', // 約定轉定存金額
            }
        }
     */
    modifyTW(resObj, apiId) {
        let output: any = {
            dataTime: '',
            data: {}
        };


        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = FieldUtil.checkField(jsonHeader, 'responseTime');

        output.data = ObjectUtil.clone(jsonObj);


        output.data['_showFinance'] = true;
        output.data['_showFD'] = false;
        output.data['_isPB'] = false;

        if (apiId === 'F2100106') {
            // 無融資資料，但有轉定存資料
            output.data['_showFinance'] = false;
            output.data['_showFD'] = true;
        }
        if (apiId === 'F2100103') {
            // 活存true顯示"融資"利率、額度、透支期間；支存顯示"透支"利率、額度、契約期間
            output.data['_isPB'] = true;
        }

        output.data['_showBranch'] = false;
        output.data['branch'] = ''; // 帳務行
        output.data['branchName'] = ''; // 帳務行名稱

        // 餘額處理
        output.data['saveBookBalance'] = ''; // 存摺餘額
        output.data['realBalance'] = FieldUtil.checkField(jsonObj, 'realBalance'); // 實質餘額
        output.data['usefulBalance'] = FieldUtil.checkField(jsonObj, 'usefulBalance'); // 可用餘額
        output.data['todayCheckBalance'] = FieldUtil.checkField(jsonObj, 'todayCheckBalance'); // 金交票金額
        output.data['tomCheckBalance'] = FieldUtil.checkField(jsonObj, 'tomCheckBalance'); // 名交票金額
        output.data['icCard'] = FieldUtil.checkField(jsonObj, 'icCard'); // 消費圈存
        output.data['freezeBalance'] = FieldUtil.checkField(jsonObj, 'freezeBalance'); // 凍結總額
        output.data['distrainBalance'] = FieldUtil.checkField(jsonObj, 'distrainBalance'); // 扣押總額
        output.data['afterRunBalance'] = FieldUtil.checkField(jsonObj, 'afterRunBalance'); // 營業時間後提款及轉出
        output.data['afterRunPay'] = FieldUtil.checkField(jsonObj, 'afterRunPay'); // 營業時間後存款及轉入

        // -- 顯示融資資料 -- //
        if (output.data._showFinance) {
            output.data['financeRate'] = FieldUtil.checkField(jsonObj, 'financeRate'); // 融資利率
            output.data['financeAmount'] = FieldUtil.checkField(jsonObj, 'financeAmount'); // 融資額度
            output.data['financeStartDay'] = FieldUtil.checkField(jsonObj, 'financeStartDay'); // 融資期間(起)
            output.data['financeEndDay'] = FieldUtil.checkField(jsonObj, 'financeEndDay'); // 融資期間(訖)
        } else {
            output.data['financeRate'] = '';
            output.data['financeAmount'] = '';
            output.data['financeStartDay'] = '';
            output.data['financeEndDay'] = '';
        }

        // -- 顯示轉定存資料 -- //
        if (output.data._showFD) {
            output.data['afterFDBalance'] = FieldUtil.checkField(jsonObj, 'afterFDBalance'); // 轉定存總存餘額
            output.data['toFDAmt'] = FieldUtil.checkField(jsonObj, 'toFDAmt'); // 約定轉定存金額
        } else {
            output.data['afterFDBalance'] = '';
            output.data['toFDAmt'] = '';
        }
        return output;
    },

    /**
     * 外幣存摺整理
        {
            dataTime: '',
            data: {
                _showBranch: false,
                branch: '', // 帳務行(台幣存摺無此資料)
                branchName: '', // 帳務行名稱(台幣存摺無此資料)
                saveBookBalance: '', // 存款餘額
                realBalance: '', // 實質餘額
                usefulBalance: '', // 可用餘額
                todayCheckBalance: '', // 金交票金額
                tomCheckBalance: '', // 名交票金額
                icCard: '', // 消費圈存
                freezeBalance: '', // 凍結總額
                distrainBalance: '', // 扣押總額
                afterRunBalance: '', // 營業時間後提款及轉出
                afterRunPay: '', // 營業時間後存款及轉入
                _showFinance: false, // 顯示融資資料
                financeRate: '', // 融資利率
                financeAmount: '', // 融資額度
                financeStartDay: '', // 融資期間(起)
                financeEndDay: '', // 融資期間(訖)
                _showFD: false, // 顯示轉定存資料
                afterFDBalance: '', // 轉定存總存餘額
                toFDAmt: '', // 約定轉定存金額
            }
        }
     */
    modifyForex(resObj, apiId) {
        let output = {
            isDemand: true,
            dataTime: '',
            data: {
                _showBranch: false,
                branch: '', // 帳務行(台幣存摺無此資料)
                branchName: '', // 帳務行名稱(台幣存摺無此資料)
                saveBookBalance: '', // 存款餘額
                realBalance: '', // 實質餘額
                usefulBalance: '', // 可用餘額
                todayCheckBalance: '', // 金交票金額
                tomCheckBalance: '', // 名交票金額
                icCard: '', // 消費圈存
                freezeBalance: '', // 凍結總額
                distrainBalance: '', // 扣押總額
                afterRunBalance: '', // 營業時間後提款及轉出
                afterRunPay: '', // 營業時間後存款及轉入
                _showFinance: false, // 顯示融資資料
                financeRate: '', // 融資利率
                financeAmount: '', // 融資額度
                financeStartDay: '', // 融資期間(起)
                financeEndDay: '', // 融資期間(訖)
                _showFD: false, // 顯示轉定存資料
                afterFDBalance: '', // 轉定存總存餘額
                toFDAmt: '', // 約定轉定存金額
            }
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = FieldUtil.checkField(jsonHeader, 'responseTime');
        output.data['_showFinance'] = false;
        output.data['_showFD'] = false;
        output.data['_showBranch'] = false;
        output.data['branch'] = '';
        output.data['branchName'] = '';

        output.data['saveBookBalance'] = FieldUtil.checkField(jsonObj, 'saveBookBal'); // 存摺餘額
        output.data['realBalance'] = FieldUtil.checkField(jsonObj, 'realBal'); // 實質餘額
        output.data['usefulBalance'] = FieldUtil.checkField(jsonObj, 'usefulBal'); // 可用餘額
        output.data['freezeBalance'] = FieldUtil.checkField(jsonObj, 'freezeBal'); // 凍結總額
        output.data['distrainBalance'] = FieldUtil.checkField(jsonObj, 'distrainBal'); // 扣押總額

        return output;
    },

    /**
     * 外幣存摺整理-定存
        {
            dataTime: '',
            data: {
                saveListNo: '', // 存單號碼
                saveListBalance: '', // 存單面額
                startInterestDay: '', // 起息日
                rateType: '', // 利率別
                depositDay: '', // 存款期間
                distrainBalance: '', // 扣押總額
                endAccountDay: '', // 到期日
                rate: '', // 存單利率
            }
        }
     */
    modifyForexTime(resObj, apiId) {
        let output = {
            isDemand: false,
            dataTime: '',
            data: {
                saveListNo: '', // 存單號碼
                saveListBalance: '', // 存單面額
                startInterestDay: '', // 起息日
                rateType: '', // 利率別
                depositDay: '', // 存款期間
                distrainBalance: '', // 扣押總額
                endAccountDay: '', // 到期日
                rate: '', // 存單利率
            }
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = FieldUtil.checkField(jsonHeader, 'responseTime');

        output.data['saveListNo'] = FieldUtil.checkField(jsonObj, 'saveListNo'); // 存單號碼
        output.data['saveListBalance'] = FieldUtil.checkField(jsonObj, 'saveListBal'); // 存單面額
        output.data['distrainBalance'] = FieldUtil.checkField(jsonObj, 'distrainBal'); // 扣押總額
        output.data['depositDay'] = FieldUtil.checkField(jsonObj, 'depositDay'); // 存款期間
        output.data['startInterestDay'] = FieldUtil.checkField(jsonObj, 'startInterestDay'); // 起息日
        output.data['endAccountDay'] = FieldUtil.checkField(jsonObj, 'endAccountDay'); // 到期日
        output.data['rateType'] = FieldUtil.checkField(jsonObj, 'rateType'); // 利率別
        output.data['rate'] = FieldUtil.checkField(jsonObj, 'rate'); // 存單利率

        return output;
    },

    /**
     * 黃金存摺整理
     *
     * @return object:
        {
            dataTime: '',
            data: {
                _showBranch: true,
                branch: '', // 帳務行
                branchName: '', // 帳務行名稱
                saveBookBalance: '', // 存款餘額
                realBalance: '', // 實質餘額
                usefulBalance: '', // 可用餘額
                todayCheckBalance: '', // 金交票金額
                tomCheckBalance: '', // 名交票金額
                icCard: '', // 消費圈存
                freezeBalance: '', // 凍結總額
                distrainBalance: '', // 扣押總額
                afterRunBalance: '', // 營業時間後提款及轉出
                afterRunPay: '', // 營業時間後存款及轉入
                _showFinance: true, // 顯示融資資料
                financeRate: '', // 融資利率
                financeAmount: '', // 融資額度
                financeStartDay: '', // 融資期間(起)
                financeEndDay: '', // 融資期間(訖)
                _showFD: false, // 顯示轉定存資料
                afterFDBalance: '', // 轉定存總存餘額
                toFDAmt: '', // 約定轉定存金額
                // 特殊欄位:
                realBalUS '', // GD實質餘額公克數—美元
                usefulBalUS '', // GD可用餘額公克數—美元
                saveBookBalUS '' // GD存摺餘額公克數—美元
            }
        }
     *
     */
    modifyGold(resObj) {
        let output = {
            dataTime: '',
            data: {}
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = FieldUtil.checkField(jsonHeader, 'responseTime');
        output.data = ObjectUtil.clone(jsonObj);

        output.data['_showFinance'] = false;
        output.data['_showFD'] = false;
        output.data['_showBranch'] = true;
        output.data['saveBookBalance'] = FieldUtil.checkField(jsonObj, 'saveBookBal'); // 存摺餘額
        output.data['realBalance'] = FieldUtil.checkField(jsonObj, 'realBal'); // 實質餘額
        output.data['usefulBalance'] = FieldUtil.checkField(jsonObj, 'usefulBal'); // 可用餘額
        output.data['todayCheckBalance'] = FieldUtil.checkField(jsonObj, 'todayCheckBal'); // 金交票金額
        output.data['tomCheckBalance'] = FieldUtil.checkField(jsonObj, 'tomCheckBal'); // 名交票金額
        // output.data['icCard'] = FieldUtil.checkField(jsonObj, 'icCard'); // 消費圈存
        output.data['freezeBalance'] = FieldUtil.checkField(jsonObj, 'freezeBal'); // 凍結總額
        output.data['distrainBalance'] = FieldUtil.checkField(jsonObj, 'distrainBal'); // 扣押總額
        output.data['afterRunBalance'] = FieldUtil.checkField(jsonObj, 'afterRunBal'); // 營業時間後提款及轉出
        output.data['afterRunPay'] = FieldUtil.checkField(jsonObj, 'afterRunPay'); // 營業時間後存款及轉入

        // _showBranch
        output.data['branch'] = FieldUtil.checkField(jsonObj, 'managementBranch'); // 帳務行
        output.data['branchName'] = FieldUtil.checkField(jsonObj, 'managementBranchName'); // 帳務行名稱

        // 特殊處理
        output.data['realBalUS'] = FieldUtil.checkField(jsonObj, 'realBalUS'); // GD實質餘額公克數—美元
        output.data['usefulBalUS'] = FieldUtil.checkField(jsonObj, 'usefulBalUS'); // GD可用餘額公克數—美元
        output.data['saveBookBalUS'] = FieldUtil.checkField(jsonObj, 'saveBookBalUS'); // GD存摺餘額公克數—美元

        return output;
    }
};
