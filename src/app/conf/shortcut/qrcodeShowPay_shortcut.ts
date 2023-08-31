/**
 * 出示付款碼-首頁捷徑設定檔
 */
import { QRCODESHOWPAY_ICON } from '@conf/shortcut/qrcodeShowPay_icon';

let settingInfo = {
    id: 'qrcodeShowPay',
    shortLabel: '出示付款碼',
    longLabel: '出示付款碼',
    iconBitmap: QRCODESHOWPAY_ICON,
    intent: {
        action: 'android.intent.action.RUN',
        flags: 67108865,
        data: 'iTCBMobileBank://qrcodeShowPayFromHome'
    }
};

export const QRCODESHOWPAY_SHORTCUT = settingInfo;
export const QRCODESHOWPAY_SHORTCUTS = [settingInfo];