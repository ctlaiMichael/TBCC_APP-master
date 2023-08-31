/**
 * Util Card Check
 * 信用卡檢查處理
 */
class CardReq {
    cardNo: string = '';
    date: string = '';
    code: string = '';
};
export const CardCheckUtil = {
    /**
     * 信用卡檢核
     * @param data 
     *  cardNo 信用卡號
     *  date: 到期日
     *  code： 檢查碼
     * @param option 檢查狀態
     *  date: true|false 到期日(預設檢查true)
     *  code： true|false 檢查碼(預設檢查true)
     */
    checkCard(data: CardReq) {
    // checkCard(data: CardReq, option?: any) {
        let output_data = {
            status: false,
            msg: 'sdfsdfsfsdf',
            error: {
                cardNo: '',
                date: '',
                code: ''
            },
            data: data
        };
        // let doCard = true;
        let doDate = true;
        let doCode = true;
        // if (typeof option === 'object') {
        //     // doCard = (option.hasOwnProperty('cardNo') && !option.cardNo) ? false : true;
        // }
        let check_error = false;
        let tmp_check: any;
        let date_check: any;
        let code_check: any;
        // card
        tmp_check = this.checkCardNum(data.cardNo);
        if (!tmp_check.status) {
            check_error = true;
            output_data.error['cardNo'] = tmp_check.msg;
        }
    
        if (doDate) {
            date_check = this.checkYmData(data.date);
            if(!date_check.status) {
                check_error = true;
                output_data.error['date'] = date_check.msg;
            }
        }

        if(doCode) {
            code_check = this.checkCardCode(data.code);
            if(!code_check.status) {
                check_error = true;
                output_data.error['code'] = code_check.msg;
            }
        }



        if (!check_error) {
            output_data.status = true;
            output_data.msg = '';
        }
        return output_data;
    },

    /**
    * [checkCardCode 檢查信用卡檢查碼]
    * @param  {string} str      [數字字串]
    * @return {obj}	{status:blooean,msg:'error msg'}
    */
    checkCardCode(str) {
        let data = {
            status: false,
            msg: 'CHECK.CARD.CARD_CHECK_CODE'
        };
        let res = /^[0-9]{3}$/;
        if (!res.test(str)) {
            return data;
        }
        data.status = true;
        data.msg = '';
        return data;
    },

    /**
     * [checkCardNum 檢查信用卡卡號]
    * @param  {string} str      [數字字串]
     * @return {obj}	{status:blooean,msg:'error msg'}
     */
    checkCardNum(str) {
        let data = {
            status: false,
            msg: 'CHECK.CARD.CARDNUM'
        };
        let res = /^[0-9]{16}$/;
        if (!res.test(str)) {
            return data;
        }
        if (str.length === str.match(new RegExp(str.substr(0, 1), "g")).length) {
            // 禁輸全一樣的值
            return data;
        }
        data.status = true;
        data.msg = '';
        return data;
    },

    /**
	 * [checkYmData 檢查有效年月]
	 * @param  {string} str      [數字字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
     checkYmData(str) {
        var data = {
            status: false,
            msg: "",
            data: {}
        };

        if (typeof str === 'undefined' || str === '') {
            data.msg = "請輸入有效年月";
            return data;
        }
        let cardM: any = 0;
        let cardY: any = 0;
        //假如找的到" / "
        if (str.indexOf('/') > -1) {
            let tmp = str.split('/');
            cardM = parseInt(tmp[0]);
            cardY = tmp[1].toString();
            //假如使用者直接輸入西元年，取後兩位
            if (cardY.length > 2) {
                cardY = cardY.substr(-2);
            }
            cardY = parseInt(cardY);
        } else {
            let tmp = str.replace('/', '');
            cardM = parseInt(tmp.substr(0, 2));
            cardY = parseInt(tmp.substr(2, 2));
        }

        if (!cardY || !cardM || cardY < 1 || cardM < 1 || cardM > 12) {
            data.msg = "Date error!";
            data.msg = "請輸入正確年月";
            return data;
        }
        cardM = ("0" + cardM).substr(-2);
        cardY = ("0" + cardY).substr(-2);
        let cardYearString = cardM + "" + cardY;

        //檢查有效年月長度
        let result;
        let res = /^[0-9]{4}$/;
        if (!res.test(cardYearString)) {
            // console.log('length:'+cardYearString);
            data.msg = "請輸入正確年月";
            return data;
        }
        data.status = true;
        data.msg = '';
        data.data = {
            string: cardYearString, //MMYY
            m: cardM,
            y: cardY,
            formate: cardM + '/' + cardY
        };
        return data;
    }



};
