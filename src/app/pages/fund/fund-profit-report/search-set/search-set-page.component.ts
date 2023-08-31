/**
 * 投資設定組合
 */
import { Component, OnInit, Output, EventEmitter, Input, ElementRef, Renderer } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { FundGroupSetService } from '@pages/fund/shared/service/fund-group-set.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CacheService } from '@core/system/cache/cache.service';


@Component({
  selector: 'app-search-set',
  templateUrl: './search-set-page.component.html',
  styleUrls: [],
  providers: [FundGroupSetService]

})
export class SearchSetPageComponent implements OnInit {

  page = 'edit';           //目前頁面
  nowPageType: any = "0"; // 當前組合名稱
  oldPageType: any = "0"; // 紀錄用
  allSelect = false;
  showData = false;
  all_data: any = [
    {
      wishList: []
    },
    {
      wishList: []
    },
    {
      wishList: []
    }
  ];
  group_data: any = {};
  old_data: any = {};  //紀錄用


  req: any = {
    custId: '', //身分證字號
    investType: 'A', //交易別
    fundType: '', //交易別，判斷 A:單筆、B:小額(定期定額)、C:轉換、D:小額(定期不定額)
    selectfund: '', //是否精選
    compCode: '', //基金公司代碼
    fundCode: '' //轉出基金代碼
  }

  constructor(
    private _logger: Logger
    , private router: Router
    , private _mainService: FundGroupSetService
    , private _handleError: HandleErrorService
    , private confirm: ConfirmService
    , private _formateService: FormateService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private _cacheService: CacheService
  ) {
  }

  ngOnInit() {
    this._cacheService.removeGroup('fund-group-set');
    this.getData('1', '0');
  }

  /**
   * 取得清單
   * @param type 
   * @param setType 0=>首次
   */
  getData(type, setType?) {
    this.allSelect = false; // 清空全選
    this._mainService.getData(type, setType).then(
      (res) => {
        if (res['info_data'].hasOwnProperty('fundLists') && res['info_data']['fundLists'] && res.info_data.fundLists.hasOwnProperty('fundList') &&
          res.info_data.fundLists.fundList.length > 0) {
          this.all_data[parseInt(res.groupType) - 1].wishList = res.info_data.fundLists.fundList;
          this.showData = true;
        } else {
          this.all_data[parseInt(res.groupType) - 1].wishList =[];
          this.showData = false;
        }
        console.log('getData Res', res);
        this.group_data = this._formateService.transClone(this.all_data[parseInt(res.groupType) - 1]);
        this.old_data = this._formateService.transClone(this.group_data); //紀錄值以便下次比對
        this.nowPageType = parseInt(res.groupType) - 1;
        console.error('group_data',this.group_data);
      },
      (err) => {
        console.error('error', err);
        if (err['resultCode'] == 'F001') {
          this.group_data.wishList =[];
          this.old_data = this._formateService.transClone(this.group_data); //紀錄值以便下次比對
          this.showData=false;
        } else {
          err['type'] = 'message';
          this._handleError.handleError(err);
        }
      }
    );
  }


  //切換組合提醒
  chgGroup() {
    console.log('chgList, old', this.old_data.wishList, 'group', this.group_data.wishList);

    if (!this.isSameArr(this.old_data.wishList, this.group_data.wishList)) {
      this.confirm.show('您的資料尚未儲存，切換其他組合資料將會遺失，是否確認?', {
        title: '提醒您',
        btnYesTitle: '確定',
        btnNoTitle: '取消'
      }).then(
        () => {
          this.chgList();
        },
        () => {
          this.nowPageType = this.oldPageType;
        }
      );
    } else {
      this.chgList();
    }

  }
  //切換列表
  chgList() {
    console.log('nowPageType', this.nowPageType);
    this.getData((parseInt(this.nowPageType) + 1).toString());
    this.oldPageType = this._formateService.transClone(this.nowPageType); //換頁
    this.allSelect = false; //全選按鈕清空
  }

  //刪除選擇標的
  onDelSelect() {
    let count = 0;
    if (this.group_data.wishList.length > 0) {
      this.group_data.wishList.forEach(item => {
        if (item.showCheck) {
          count++;
        }
      })
      if (count > 0) {
        this.confirm.show('確認是否刪除?', {
          title: '提醒您',
          btnYesTitle: '確定',
          btnNoTitle: '取消'
        }).then(
          () => {
            this.group_data.wishList = this.group_data.wishList.filter(item => { //刪除所選擇
              return !item.showCheck;
            });

            if (this.group_data.wishList.length == 0) {
              this.allSelect = false;
            }
            console.log('group_data.wishList', this.group_data.wishList);
          },
          () => {
            // 選擇取消
          }
        );
      } else {
        this._handleError.handleError({
          type: 'dialog',
          title: '提醒您',
          content: "請勾選欲刪除的標的"
        });
        return false;
      }
    }
  }

  //單選
  selectChg() {
    let count = 0;
    setTimeout(() => {
      this.group_data.wishList.forEach(item => {
        if (!item.showCheck) {
          this.allSelect = false;
        } else {
          count++;
        }
      });
      console.log('LIST', this.group_data.wishList.length, count);
      if (count == this.group_data.wishList.length) {
        this.allSelect = true;
      }
    }, 100)

  }
  // 全選
  selectAll() {
    console.log('group', this.group_data);
    let count = 0;
    this.group_data.wishList.forEach(item => {
      if (item.showCheck) {
        count++;
      }
    });

    if (count == this.group_data.wishList.length) {
      this.group_data.wishList.forEach(item => {
        item.showCheck = false;
      });
    } else {
      this.group_data.wishList.forEach(item => {
        item.showCheck = true;
      });
    }
  }

  isSameArr(a, b) {
    if (a == b) { // null || undefined
      return true;
    }
    if (a.length !== b.length) {
      return false;
    } else {
      for (let i = 0; i < a.length; i++) {
        if (!this.isSameObj(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }
  isSameObj(a, b) {
    let props1 = Object.getOwnPropertyNames(a); // {a:1,b:2}=>[a,b]
    let props2 = Object.getOwnPropertyNames(b);
    if (props1.indexOf('showCheck') > -1) {
      props1.splice(props1.indexOf('showCheck'), 1);
    }
    if (props2.indexOf('showCheck') > -1) {
      props2.splice(props2.indexOf('showCheck'), 1);
    }
    if (props1.length != props2.length) {
      console.log('propsLength', props1, props2);
      return false;
    }
    if (props1.toString() != props2.toString()) {
      console.log('props', props1, props2);
      return false;
    }
    for (let i = 0, max = props1.length; i < max; i++) {
      let propName = props1[i];
      if (a[propName] !== b[propName] && propName != 'showCheck') {
        console.log('propName', propName, i);
        return false;
      }
    }
    return true;
  }
  //新增標的
  onAddFund() {
    if (this.group_data && this.group_data.wishList &&
      this.group_data.wishList.length == 10) {
      this._handleError.handleError({
        type: 'dialog',
        title: '提醒您',
        content: "同一組上限為10個標的"
      });
      return false;
    } else {
      this.page = 'add';
    }
  }

  //儲存新增標的
  onSave() {
    let set_data = {
      group: '',
      fundCodes: ''
    };
    let saveArr = [];
    console.log('group_data', this.group_data.wishList);
    this.group_data.wishList.forEach(item => {
      if (item) {
        saveArr.push(item.fundCode);
      }
    });
    set_data.group = (parseInt(this.nowPageType) + 1).toString();
    set_data.fundCodes = saveArr.toString();
    console.error('802req', set_data);
    this._mainService.updateData(set_data).then(
      (res) => {
        console.log('updateDate Res', res);
        if (res.status) {
          this.old_data.wishList = this.group_data.wishList
          this._handleError.handleError({
            type: 'dialog',
            content: '儲存成功！！'
          });
          this._cacheService.removeGroup('fund-group-set');
          this.getData(set_data.group);
          // 儲存完返回離開不詢問
          this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('fund');
          });
        }
      },
      (err) => {
        err['type'] = 'dialog';
        this._handleError.handleError(err);
      }
    )
  }
  //取消變更
  onCancel() {
    this.confirm.show('您確定要取消變更嗎?', {
      title: '提醒您',
      btnYesTitle: '確定',
      btnNoTitle: '取消'
    }).then(
      () => {
        this.navgator.push('fund');
      },
      () => {
        // 選擇取消
      }
    );
  }
  onPageBackEvent(e) {
    console.error('e', e);
    console.error(' group_data.wishList', this.group_data.wishList)
    if (this.group_data.wishList == undefined || this.group_data.wishList == null) {
      this.group_data.wishList = [];
    }
    if (e.hasOwnProperty('data') && e['data'].hasOwnProperty('fundCode') && e['data'].hasOwnProperty('fundName')) {
      this.group_data.wishList.unshift({
        fundCode: e.data.fundCode ? e.data.fundCode : '',
        fundName: e.data.fundName ? e.data.fundName : '',
        netValue: e.data.netValue ? e.data.netValue : '',
        modify: true
      });
      this.allSelect = false;
      this.showData = true;
      this.page = 'edit';
      this._headerCtrl.setLeftBtnClick(() => {
        this.onCancel();
      });
    } else {
      if (this.page == 'add') {
        this.page = 'edit';
        this._headerCtrl.setLeftBtnClick(() => {
          this.navgator.push('fund');
        });
      } else if (this.page == 'edit') {
        console.error('edit');
        this.navgator.push('fund');
      }

    }
  }

  //清空組合 
  // onDelGroup() {
  //   this.confirm.show('確認是否清除該組內容的資料?', {
  //     title: '提醒您',
  //     btnYesTitle: '確定',
  //     btnNoTitle: '取消'
  //   }).then(
  //     () => {
  //       this.group_data.wishList = [];
  //       this.allSelect = false;
  //     },
  //     () => {
  //       // 選擇取消
  //     }
  //   );
  // }
}
