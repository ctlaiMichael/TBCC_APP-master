export const CommonUtil = {
    /**
     * 檢查物件中是否有key值
     * @param obj 物件
     */
    isEmptyObject: (obj: object) => {
        for (const k in obj) {
            if (!!k) {
                return false;
            }
        }
        return true;
    },
    /**
     * 等待
     * @param number ms
     */
    wait: (delay: number) => {
        return new Promise(resolve => setTimeout(resolve, delay));
    },
    /**
     * 欄位檢核
     * @param data 檢查的物件
     * @param field 確認的欄位
     */
    checkFieldExist: (data: object, field: string | number) => {
        if (typeof data === 'object' && data.hasOwnProperty(field)) {
            return true;
        }
        return false;
    },
    /**
     * 回傳物件
     * @param data 
     * @param return_type 
     */
    modifyReturn: (data: any, return_type: boolean) => {
        if (return_type) {
            return data.status;
        } else {
            if (data.hasOwnProperty('msg') && data.msg !== '') {
                // i18n轉換
                // data.msg = this._langTransService.instant(data.msg);
            }
            return data;
        }
    },
    /**
     * 將uri參數轉物件
     */
    uriToJson: (uri: string) => {
        return JSON.parse('{"' + decodeURI(uri.replace(/&/g, '\",\"').replace(/=/g, '\":\"')) + '"}');
    }
};
