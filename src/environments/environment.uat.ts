// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  PRODUCTION: false,
  SERVER_URL: 'https://mbbank.tcb-test.com.tw/NMobileBank', // Server位置
  API_URL: '/mnbjsonrequest/command.rest',  // api入口(電文路徑)
  ONLINE: true, // 是否連線測試
  CERT_CHECK: true,
  NATIVE: true, // 是否build到手機上測試
  GOOGLE_MAP_API_KEY: 'AIzaSyBIp-p78B1drBVQ6Tb1EsY0MNJSfkp3jnE',
  AD_SLIDE_SPEED: 5000,
  AUTOLOGOUT_TIME: 600,  // 自動登出時間(秒)
  WARNING_BEFORE_LOGOUT_TIME: 60,  // 自動登出前提示時間(秒)
  // LOG level: OFF > ERROR > WARN > INFO > DEBUG > LOG
  // 當array時(開發用)，可吐出多種step('LOG_LEVEL allow string')
  LOG_LEVEL: ['ERROR', 'Cache', 'Telegram'],
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
  PUSH_URL: 'http://push.tcb-test.com.tw/STRING/',
  PUSH_ANDROID_APPID: 'TCB_Android_UAT',
  PUSH_IOS_APPID: 'TCB_iOS_UAT',
  // DirectUpdate檢查
  DIRECTUPDATE: true,
  // 財金交易入口服務網址
  FISC_URL: 'https://www.focas-test.fisc.com.tw/FOCAS_WS/API20/QRP/V2/'
};
