export const environment = {
  PRODUCTION: true,
  SERVER_URL: 'https://mbbank.tcb-bank.com.tw/NMobileBank', // Server位置
  API_URL: '/mnbjsonrequest/command.rest',  // api入口(電文路徑)
  ONLINE: true, // 是否連線測試
  CERT_CHECK: true,
  NATIVE: true, // 是否build到手機上測試
  GOOGLE_MAP_API_KEY: 'AIzaSyDK0BA5ikFOsd-j9e0VLZxYfOOEkJBaJv4',
  AD_SLIDE_SPEED: 5000,
  AUTOLOGOUT_TIME: 600,  // 自動登出時間(秒)
  WARNING_BEFORE_LOGOUT_TIME: 60,  // 自動登出前提示時間(秒)
  LOG_LEVEL: 'OFF',        // LOG level: OFF > ERROR > WARN > INFO > DEBUG > LOG
  // 三段電文模組路徑
  HTTP_TIMEOUT: 180000,
  USE_INTERNEL_PUBLIC_KEY: false,
  REGISTER: '/mnb/challenge/register.rest',
  HAND_SHAKE: '/mnb/challenge/handshake.rest',
  EXCHANGE_KEY: '/mnb/challenge/exchange.rest',
  DOWNLOAD_PATCH: '/mnb/downloadpatch/*.rest?t=/*',
  AUTHORIZATION_KEY: 'hitrust_auth',
  AUTH_TOKEN_KEY: 'auth_token',
  // 模擬電文模擬秒數
  SIMULATION_TIME: 1000,
  // 智能客服
  ROBOT_URL: 'http://robot.tcb-test.com.tw:8080/wise?ch=app',
  // 大數據JS
  CELEBRUS_JS: 'lib/CelebrusInsert.js',
  // PUSH
  PUSH_URL: 'https://push.tcb-bank.com.tw/string/',
  PUSH_ANDROID_APPID: 'TCB_BankApp_Android',
  PUSH_IOS_APPID: 'TCB_BankApp_iOS',
  // DirectUpdate檢查
  DIRECTUPDATE: true,
  // 財金交易入口服務網址
  FISC_URL: 'https://www.focas.fisc.com.tw/FOCAS_WS/API20/QRP/V2/'
};
