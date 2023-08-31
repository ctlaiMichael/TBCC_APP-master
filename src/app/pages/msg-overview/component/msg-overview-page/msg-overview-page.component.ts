import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';
import { PushService } from '@lib/plugins/push.service';
import { MsgOverviewService } from '@pages/msg-overview/shared/service/msg-overview.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { BookmarkService } from '@shared/template/select/bookmark/bookmark.service';
import { AuthService } from '@core/auth/auth.service';
import { LoginRequired } from '@core/auth/login-required.service';
import { DeviceService } from '@lib/plugins/device.service';
import { logger } from '@shared/util/log-util';

export interface SetReadObj {
  notRead: Array<number>;
  read?: Array<number>;
}

@Component({
  selector: 'app-msg-overview-page',
  templateUrl: './msg-overview-page.component.html',
  styleUrls: ['./msg-overview-page.component.css']
})
export class MsgOverviewPageComponent implements OnInit, OnDestroy {
  /**
     * 參數處理
     */
  @Input() editable: boolean = false;
  @Input() page: string | number = 1;
  @Input() showNewsInfo: boolean = true;
  @Input() isPublic: boolean = true; // true-合庫報報 false-個人訊息
  @Input() activeBookmark;
  @Input() activeBookmark2 = 0;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateReadEmit: EventEmitter<any> = new EventEmitter<SetReadObj>();
  data: Array<any> = [];
  messageType = [
    ['TCB_ACCOUNT_OTP', 'TCB_ACCOUNT_FEREMIT', 'TCB_ACCOUNT_FDREGULAR', 'TCB_ALERT_EXCHANGE', 'TCB_ALERT_FUND', 'TCB_PROMOTE'], // 0 - 全部
    ['TCB_ACCOUNT_OTP', 'TCB_ACCOUNT_FEREMIT', 'TCB_ACCOUNT_FDREGULAR'], // 1 - 帳務
    ['TCB_ALERT_EXCHANGE', 'TCB_ALERT_FUND'], // 2 - 提醒
    ['TCB_PROMOTE'] // 3 - 優惠
  ];
  subscriptionActiveBookmark2: any;
  editing = false;
  // editableSubscription: any;

  // selectAll: boolean = false; // 選擇全部input
  selectedMsg: Array<boolean> = [];
  isRead = [true, true, true, true];
  deviceOS='ios';
  constructor(
    private _logger: Logger,
    // private confirmService: ConfirmService,
    private msgOverviewService: MsgOverviewService,
    private pushService: PushService,
    private alert: AlertService,
    private handleError: HandleErrorService,
    private bookmarkService: BookmarkService,
    private navigator: NavgatorService
    , private auth: AuthService
    , private loginRequired: LoginRequired
    , private device: DeviceService
  ) { }

  ngOnInit() {
    logger.error('MsgOverviewPageComponent init');
    this.device.devicesInfo().then(
      (deviceInfo) => {
        if (deviceInfo.platform.toLowerCase() == 'android') {
          logger.error('android');
            this.deviceOS='android';
        } else if (deviceInfo.platform.toLowerCase() == 'ios') {
            this.deviceOS='ios';
            logger.error('ios');
        }
        logger.error('this.deviceOS', this.deviceOS);
        this._logger.log(`showNewsInfo = ${this.showNewsInfo}`);
        if (typeof this.page === 'undefined') {
          this.page = 1;
        } else {
          this.page = parseInt(this.page.toString());
        }
        this.subscriptionActiveBookmark2 = this.msgOverviewService.activeBookMark2Subject.subscribe(activebookmark2 => {
          this.changeData(activebookmark2);
          this.activeBookmark2 = activebookmark2;
          this.editing = false;
        });
        this.getData();
      },
      (fail) => {
      }
    );

    }
    ngAfterViewInit(){
    logger.error('this.deviceOS ngAfterViewInit', this.deviceOS);
    }
  // 更換子項目(全部、帳務、提醒、優惠)
  changeData(activebookmark: number) {
    this._logger.log(this.activeBookmark,'this.activeBookmark');
    const OtpUserInfo = this.auth.getOtpUserInfo();
    const check_apply = OtpUserInfo.checkBoundIDStatus();
    // 合庫抱抱不用更動內容
    if (this.isPublic) {
      return;
    }
    let viaAccount = this.messageType[activebookmark].join(',');
    this.data = []; // 避免plugin無回應顯示舊的data
    if((this.activeBookmark ==1 &&check_apply.bound_id === '4'&& this.loginRequired.checkLogin('msg-overview'))||this.activeBookmark ==0){
      this.pushService.getBroadcastList(viaAccount).then((res) => {
        this._logger.log(`getData res = ${JSON.stringify(res)}`);
        let modifyPluginObj = this.msgOverviewService.modifyPluginObj(res);
        if (typeof modifyPluginObj == 'string') {
          this.alert.show(modifyPluginObj);
          return;
        } else if (!!modifyPluginObj) {
          this.data = modifyPluginObj;
          this._logger.log('data.length',this.data.length);
          this.updateRead();
          this.transDataTime();
          this.resetSelectedMsg();
        }
      }).catch(err => {
        this._logger.error(err);
      });
    }
  }

  ngOnDestroy() {
    this.subscriptionActiveBookmark2.unsubscribe();
  }

  edit() {
    this.editing = !this.editing;
  }

  // 已讀
  read() {
    if (this.isSelectNone()) {
      this.editing = false;
      return;
    }
    let chatId = '';
    chatId = this.getSelectedChatId();
    this.msgOverviewService.readMsg(chatId).then(res => { // TODO 中台未更新
      this._logger.log(`readMsg res = ${JSON.stringify(res)}`);
      if (!!res['errCode'] || !!res['errMsg']) {
        this.alert.show(`${res['errCode']} ${res['errMsg']}`);
      } else {
        // 直接已讀選取的項目，不重新取得broadcast list
        this.data.forEach((element, index) => {
          if (this.selectedMsg[index] && !!element['IsReadContent']) {
            element['IsReadContent'] = '1';
          }
        });
        // 更新parent component html
        this.updateRead();
      }
      this.editing = false;
      this.resetSelectedMsg();
    }).catch(err => {
      this.handleError.handleError(err);
    });
  }

  // 刪除
  delete() {
    if (this.isSelectNone()) {
      this.editing = false;
      return;
    }
    let strDelChatID = '';
    strDelChatID = this.getSelectedChatId();
    this.pushService.deleteMsg(strDelChatID).then(res => {
      this._logger.log(`delete !isSelectAll res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp);
      } else {
        this.getData();
      }
    });
    this.editing = false;
    this.resetSelectedMsg();
  }

  // 點擊全選
  onClickSelectAll() {
    if (this.isSelectAll()) { // 全選 -> 全不選
      this.selectedMsg.fill(false);
    } else { // 全不選 -> 全選
      this.selectedMsg.fill(true);
    }
    this._logger.log(`selectedMsg = ${this.selectedMsg}`)
  }

  /**
   * 初始化子項目已讀紅點(全部、帳務、提醒、優惠)
   */
  initRead() {
    if (this.activeBookmark2 == 0) {
      this.isRead = [true, true, true, true];
      this.data.forEach(item => {
        // 有未讀訊息
        if (item['IsReadContent'] === '0') {
          this.messageType.forEach((typeArray, messageTypeIndex) => {
            typeArray.forEach(typeString => {
              // 屬於 1(帳務)、2(提醒)、3(優惠)
              if (typeString.indexOf(item['ViaAccount']) >= 0) {
                this.isRead[messageTypeIndex] = false;
              } else {
                // 未知類別
                this.isRead[0] = false;
              }
            });
          });
        }
      });
      // 如果有未知類別未讀，this.isRead[0] = false
      this.isRead[0] = this.isRead[0] === false ?
        false : this.isRead[1] && this.isRead[2] && this.isRead[3]; // 全部子類別皆已讀 -> "全部"已讀
      let setReadObj: SetReadObj = {
        read: [],
        notRead: []
      };
      this.isRead.forEach((subTypeRead, index) => {
        if (subTypeRead) {
          setReadObj.read.push(index);
        } else {
          setReadObj.notRead.push(index);
        }
      });
      this.updateReadEmit.emit(setReadObj);
    } else {
      // 只針對個別項目(帳務、提醒、優惠)已讀判斷
      let setReadObj: SetReadObj = {
        read: [this.activeBookmark2],
        notRead: []
      };
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i]['IsReadContent'] === '0') {
          setReadObj = {
            read: [],
            notRead: [this.activeBookmark2]
          };
          break;
        }
      }
      this.updateReadEmit.emit(setReadObj);
    }
  }

  updateRead() {
    switch (this.activeBookmark2) {
      // 全部
      case 0:
        this.initRead();
        break;
      default:
        const setReadObj: SetReadObj = {
          read: this.isAllRead() ? [this.activeBookmark2] : [],
          notRead: this.isAllRead() ? [] : [this.activeBookmark2]
        };
        this.updateReadEmit.emit(setReadObj);
    }
  }

  /**
   * 顯示內容頁
   * @param item 內容頁資料
   */
  onContentEvent(item, index) {
    this._logger.log(`click item index = ${index}`);
    this._logger.log(`item = ${JSON.stringify(item)}`);
    if (this.isPublic && !!item.MessageID) {
      this.pushService.deviceGetMsgContent(item.MessageID).then(contentObj => {
        let modifyPluginObj = this.msgOverviewService.modifyPluginObj(contentObj);
        if (typeof modifyPluginObj == 'string') {
          this.alert.show(modifyPluginObj);
          return;
        }
        let output = {
          'page': 'list-item',
          'type': 'content',
          'data': modifyPluginObj
        };
        this._logger.log(`onContentEvent output = ${JSON.stringify(output)}`);
        this.backPageEmit.emit(output);
      })
    } else if (!this.isPublic && !!item.ChatID) {
      // this.data[index]['IsReadContent'] == '1';

      // 發送API至中台已讀該訊息
      this.msgOverviewService.readMsg(item['ChatID']).then(res => {
        this._logger.log(`readMsg res = ${JSON.stringify(res)}`);
      }).catch(err => {
        this._logger.error(`readMsg err = ${JSON.stringify(err)}`);
      });

      // 取得內容
      this.pushService.getBroadcastContent(item.ChatID).then(contentObj => {
        let modifyPluginObj = this.msgOverviewService.modifyPluginObj(contentObj);
        if (typeof modifyPluginObj == 'string') {
          this.alert.show(modifyPluginObj);
          return;
        }
        let output = {
          'page': 'list-item',
          'type': 'content',
          'data': modifyPluginObj
        };
        this._logger.log(`onContentEvent output = ${JSON.stringify(output)}`);
        this.backPageEmit.emit(output);
      })
    } else {
      this._logger.error(`cant get MessageID from item ${JSON.stringify(item)}`);
    }
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item) {
    let output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };

    this.backPageEmit.emit(output);
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    let output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };

    this.errorPageEmit.emit(output);
  }

  private getData() {
    if (this.isPublic) {
      this.pushService.deviceGetMsgList().then((res) => {
        this._logger.log('isPublic1',this.isPublic);
        this._logger.log(`getData res = ${JSON.stringify(res)}`);
        let modifyPluginObj = this.msgOverviewService.modifyPluginObj(res);
        if (typeof modifyPluginObj == 'string') {
          // 有錯誤訊息
          this.alert.show(modifyPluginObj).then(() => {
            this.navigator.push(''); // 首頁
          });
        } else if (!!modifyPluginObj) {
          // 取得資料
          this.data = modifyPluginObj;
          this.transDataTime();
          this.resetSelectedMsg();
        }
      }).catch(err => {
        this._logger.error(err);
      })
    } else {
      this._logger.log('isPublic2',this.isPublic);
      const OtpUserInfo = this.auth.getOtpUserInfo();
      const check_apply = OtpUserInfo.checkBoundIDStatus();
      if(this.loginRequired.checkLogin('msg-overview')&&check_apply.bound_id === '4'){
        let viaAccount = this.messageType[this.activeBookmark2].join(',');
        this.pushService.getBroadcastList(viaAccount).then((res) => {
          this._logger.log(`getData res = ${JSON.stringify(res)}`);
          let modifyPluginObj = this.msgOverviewService.modifyPluginObj(res);
          if (typeof modifyPluginObj == 'string') {
            // 有錯誤訊息
            this.alert.show(modifyPluginObj).then(() => {
              // 返回合庫抱抱
              this.bookmarkService.changeMenuDataSubject.next({ id: 'public', name: '合庫報報', sort: 0, data: false, default: "" });
            });
          } else if (!!modifyPluginObj) {
            // 取得資料
            this.data = modifyPluginObj;
            this.transDataTime();
            this.resetSelectedMsg();
            this.initRead();
          }
        }).catch(err => {
          this._logger.error(err);
        });
      }
    }
  }

  // 將取得的資料日期轉換 "2019/06/19 AM 11:08:33" -> "2019/06/19 11:08:33"
  private transDataTime() {
    this.data.forEach(element => {
      if (!!element.DataTime && typeof element.DataTime == 'string') {
        element.DataTime = String(element.DataTime).split(' ')[0] + ' ' + String(element.DataTime).split(' ')[2];
        // 去掉秒
        let length = String(element.DataTime).length;
        element.DataTime = String(element.DataTime).substr(0, length - 3);
      }
    });
    this.data=this.data.reverse();
    this._logger.log(`data after transDataTime = ${JSON.stringify(this.data)}`);
  }

  // 重置已選擇的訊息
  resetSelectedMsg() {
    this.selectedMsg = new Array(this.data.length);
    this.selectedMsg.fill(false);
  }

  isSelectAll(): boolean {
    return this.selectedMsg.every((item) => {
      return item == true;
    })
  }

  /**
   * 是否沒選擇任何資料
   */
  isSelectNone(): boolean {
    return this.selectedMsg.every((item) => {
      return item == false;
    })
  }

  /**
   * "chatId1,chatId3,chatId4"
   */
  getSelectedChatId(): string {
    let selectedChatId = [];
    for (let i = 0; i < this.selectedMsg.length; i++) {
      if (this.selectedMsg[i]) {
        selectedChatId.push(this.data[i].ChatID);
      }
    }
    return selectedChatId.join(',');
  }

  isAllRead(): boolean {
    return this.data.every((item) => {
      return item['IsReadContent'] == '1';
    });
  }
}
