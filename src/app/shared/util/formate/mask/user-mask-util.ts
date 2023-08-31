/**
 * Util User Info Mask
 * 使用者個資資訊遮碼
 * 請依照客戶需求調整
 */
import { PadUtil } from '../string/pad-util';
export const UserMaskUtil = {

    /**
     * 身分證遮罩
     * @param identity 身分證
     * A12***6789
     */
    identity(identity: string): string {
        identity = identity.toLocaleUpperCase();
        return identity.substr(0, 3) + '***' + identity.substring(6, identity.length);
    },

    /**
     * 電子郵件遮罩
     * @param email 電子郵件
     * E-mail顯示：
     * @前第一個保留，其他以*遮蔽(長度一致):
     * @後全呈現
     * test@test.com => t*****@gmail.com
     */
    email(email: string): string {
        let tmp_list = email.split('@');
        if (typeof tmp_list[0] !== 'undefined' && tmp_list[0].length > 2) {
            const str_len = tmp_list[0].length;
            tmp_list[0] = tmp_list[0].substr(0, 1);
            tmp_list[0] = PadUtil.padRight(tmp_list[0], str_len, '*');
        }
        return tmp_list.join('@');
    },

    /**
     * 電話遮罩
     * @param tel 電話
     * (規則待確認)
     * 以*遮蔽: +852-1211-1178 => +852-12****78
     */
    tel(tel: string): string {
        let tmp_list = tel.split('-');
        const str_len = tel.length;
        const tmp_len = tmp_list.length;
        let tmp_data = [];
        if (tmp_len > 2) {
            // 有國碼
            tmp_data.push(tmp_list[0]);
            tmp_data.push(tmp_list[1].substr(0, 2));
        } else {
            tmp_data.push(tmp_list[0].substr(0, 2));
        }

        return tmp_data.join('-') + '****' + tel.substring((str_len - 2), str_len);
    },

    /**
     * 手機遮罩
     * @param tel 手機
     * (規則待確認)
     * 以*遮蔽: +886-0912345678 => +886-09****78
     */
    phone(tel: string): string {
        let tmp_list = tel.split('-');
        const str_len = tel.length;
        const tmp_len = tmp_list.length;
        let tmp_data = [];
        if (tmp_len > 2) {
            // 有國碼
            tmp_data.push(tmp_list[0]);
            tmp_data.push(tmp_list[1].substr(0, 2));
        } else {
            tmp_data.push(tmp_list[0].substr(0, 2));
        }

        return tmp_data.join('-') + '****' + tel.substring((str_len - 2), str_len);
    },
    /**
        * 帳號名稱
        * 常用約定帳號設定顯示
        * @前第一個以*遮蔽，其他保留(長度一致):
        * 陳大寶 => *大寶
        */
    acntName(name: string): string {
        let output:string;
        if (typeof name !== 'undefined' && name.length > 0) {
            const str_len = name.length;
            output=name.replace(name.substring(0,1),'*')
        }
        return output;
    },
};
