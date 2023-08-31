import { environment } from '@environments/environment';


// test: com.tcb.mATMTest
let app_option = {
    ios: {
        uri: 'TCBmATM://',
        storeUrl: 'https://itunes.apple.com/app/id785902900'
    },
    android: {
        uri: 'com.tcb.mATM',
        storeUrl: 'market://details?id=com.tcb.mATM'
    },
    title: '',  // popup的標題 沒值會帶預設
    context: '' // popup內容 有值就會顯示
    , other:{
        debit: 'TCBmATM://fShop_2?CardBillRq='
    }
};
// if (!environment.PRODUCTION) {
//     app_option = {
//         ios: {
//             uri: 'TCBmATM://',
//             storeUrl: 'https://itunes.apple.com/app/id785902900'
//         },
//         android: {
//             uri: 'com.tcb.mATMTest',
//             storeUrl: 'market://details?id=com.tcb.mATMTest'
//         },
//         title: '',  // popup的標題 沒值會帶預設
//         context: '' // popup內容 有值就會顯示
//         , other:{
//             debit: 'TCBmATM://fShop_2?CardBillRq='
//         }
//     };
// }
export const debitcard = app_option;
// // 金融卡繳費=2
// export const matm_2 = {
//     ios: {
//         uri: '',
//         storeUrl: 'TCBmATM://fShop_2?CardBillRq=%@'
//     },
//     android: {
//         uri: 'com.tcb.mATM',
//         storeUrl: 'TCBmATM://fShop_2?CardBillRq=%s'
//     }
// };
// // 繳費單繳費=4
// export const matm_4 = {
//     ios: {
//         uri: 'TCBmATM://',
//         storeUrl: 'TCBmATM://fShop_4?CardBillRq=%@'
//     },
//     android: {
//         uri: 'com.tcb.mATM',
//         storeUrl: 'TCBmATM://fShop_4?CardBillRq=%s'
//     }
// };
