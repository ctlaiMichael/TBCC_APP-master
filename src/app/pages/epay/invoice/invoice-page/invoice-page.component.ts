import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.css']
})
export class InvoicePageComponent implements OnInit {
  bookmarkData = []; // 頁籤設定
  nowPage = 'mobile'; // 指定頁面
  barcodeWidth = 1.8; // barcode寬度設定
  hasBarcode: boolean = false; // 有"雲端發票條碼"
  hasLoveCode: boolean = false; // 有"愛心碼"
  mobileBarcode: string = ''; // 雲端發票條碼
  loveCode: string = ''; // 愛心碼
  defaultBarcode: string = ''; // 預設頁面 1-手機條碼 2-愛心碼
  socialWelfareName: string = ''; // 愛心碼名稱
  showLove: boolean = false; // 是否在"捐贈碼"頁籤
  ShowList: string = "N"; // 顯示捐贈碼查詢結果 N Y
  keyword: string = ''; // 捐贈碼搜尋之關鍵字
  loveCodeCount: number; // 捐贈碼搜尋結果總筆數
  queryLV: any = {}; // 捐贈碼搜尋結果
  selectedLV: any = ''; // 選擇之捐贈碼
  constructor(
    private _logger: Logger,
    private navigator: NavgatorService,
    private epayService: InvoiceService,
    private alertService: AlertService,
    private headerCtrl: HeaderCtrlService,
    private confirmService: ConfirmService,
    private _handleError: HandleErrorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._initEvent();
  }

  /**
   * 頁籤回傳
   * @param e
   */
  onBookMarkBack(e) {
    this._logger.step('Epay', 'onBookMarkBack', e);
    let page = '';
    let set_data: any;
    let set_id: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('data')) {
        set_data = e.data;
        if (set_data.hasOwnProperty('id')) {
          set_id = set_data.id;
        }
      }
    }

    this.onChangePage(set_id);
  }


  /**
   * 查詢手機條碼
   */
  clickQuery() {
    this.navigator.push('invoicequerymobilebckey');
  }

  /**
   * 註冊手機條碼
   */
  clickReg() {
    this.confirmService.show("資訊將會發送到財政部電子發票整合服務平台進行註冊，相關服務請參閱財政部平台說明。").then(
      () => {
        this.navigator.push('invoicebcregedit');
      },
      () => { }
    );
  }

  // 確定 - 新增手機條碼
  clickSubmit() {
    if (this.mobileBarcode.length != 8) {
      this.alertService.show('手機條碼長度需等於 8 碼');
      return;
    }
    if (this.mobileBarcode.substring(0, 1) != "/") {
      this.alertService.show('手機條碼第1碼須為 / ');
      return;
    }
    var checkStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-.";
    for (var i = 1; i < this.mobileBarcode.length; i++) {
      if (checkStr.indexOf(this.mobileBarcode.substring(i, i + 1)) == -1) {
        this.alertService.show('手機條碼格式錯誤');
        return;
      }
    }
    let reqObj = {
      'mobileBarcode': this.mobileBarcode,
      'loveCode': '',
      'socialWelfareName': '',
      'defaultBarcode': '1' // 發票預設值 =1為雲端發票條碼，發票預設值 = 2為捐贈愛心碼
    };
    this.epayService.sendFQ000301(reqObj).then( // 手機載具註冊
      (resObj) => {
        this.alertService.show("手機條碼設定成功").then(
          () => {
            this.epayService.sendFQ000101('E').then( // 重新查詢手機條碼
              (resObj2) => {
                if (!!resObj2['mobileBarcode']) {
                  this.mobileBarcode = resObj2['mobileBarcode'];
                  this.hasBarcode = true;
                  this.defaultBarcode = '1';
                }
              },
              (errObj) => {
                this._handleError.handleError(errObj);
              }
            );
          }
        );
      },
      () => {
        this.alertService.show("手機條碼設定失敗");
      }
    );
  }

  // 確定(選擇查詢之捐贈碼)
  clickSubmitLv() {
    if ((typeof this.selectedLV == 'undefined') || (this.selectedLV == '')) {
      this.alertService.show("請選擇捐贈碼喔！");
      return;
    }

    //關閉查詢清單
    this.ShowList = "N";

    //儲存捐贈碼到中台
    let reqObj = {
      'mobileBarcode': this.mobileBarcode,
      'loveCode': this.queryLV[this.selectedLV].LoveCode,
      'socialWelfareName': this.queryLV[this.selectedLV].SocialWelfareName,
      'defaultBarcode': this.defaultBarcode === "" ? "2" : this.defaultBarcode
    };

    this.selectedLV = ''; // 重置已選擇捐贈碼
    this.epayService.sendFQ000305(reqObj).then(
      (resObj) => {
        if (!!resObj && resObj['trnsRsltCode'] == '0') {
          this.alertService.show('捐贈碼儲存成功').then(
            () => {
              this.refresh('2');
            }
          );
        } else {
          this.alertService.show('捐贈碼儲存失敗');
          return; // 停留原頁
        }
      },
      (errObj) => {
        this._handleError.handleError(errObj);
      }
    );
  }

  /**
   * 更改預設頁籤
   */
  changeDefaultCode(defaultBarcode: string) {
    // 如果預設頁籤已在指定頁籤則不做事
    if (this.defaultBarcode == defaultBarcode) {
      return;
    }
    let reqObj = {
      'mobileBarcode': this.mobileBarcode,
      'loveCode': this.loveCode,
      'socialWelfareName': this.socialWelfareName,
      'defaultBarcode': defaultBarcode
    };
    this.epayService.sendFQ000301(reqObj).then(
      (resObj) => {
        if (!!resObj && resObj['trnsRsltCode'] === "0") {
          this.defaultBarcode = defaultBarcode;
          return;
        } else if (!!resObj['hostCodeMsg']) {
          this.alertService.show(resObj['hostCodeMsg']);
        }
        // 更改預設頁籤失敗的話，要將預設頁籤改回原本的(不變動) 
        this.defaultBarcode = (Number(defaultBarcode) * (-1) + 3).toString(); // 1 -> 2，2 -> 1
        this.onChangePage(this.defaultBarcode);
      },
      (errObj) => {
        this._handleError.handleError(errObj);
      }
    );
  }

  /**
   * 修改手機條碼
   */
  termBarcode() {
    this.navigator.push('invoiceeditbarcodekey', this.mobileBarcode);
  }

  /**
   * 刪除手機條碼
   */
  deleteBarcode() {
    this.confirmService.show("是否刪除手機條碼").then(
      () => {
        let reqObj = {
          "mobileBarcode": "",
          "loveCode": this.loveCode,
          "socialWelfareName": this.socialWelfareName,
          "defaultBarcode": (this.loveCode !== "" ? "2" : "")
        };
        this.epayService.sendFQ000301(reqObj).then(
          (res) => {
            if (!!res && res['trnsRsltCode'] === "0") {
              this.hasBarcode = false;
              this.mobileBarcode = "";
              this.changeDefaultCode('2'); // 更換預設頁籤為"捐贈碼"
            } else if (!!res['hostCodeMsg']) {
              this.alertService.show(res['hostCodeMsg']);
            } else {
              this.alertService.show("刪除失敗");
            }
          },
          (errObj) => {
            this._handleError.handleError(errObj);
          }
        );
      },
      () => { }
    );
  } // 記得換預設頁籤

  // 修改捐贈碼
  clickGoToLoveCode() {
    let url_params = {
      socialWelfareName: '',
      orgLoveCode: '',
      defaultBarcode: '',
      mobileBarcode: ''

    };
    url_params['socialWelfareName'] = this.socialWelfareName;
    url_params['orgLoveCode'] = this.loveCode;
    url_params['defaultBarcode'] = this.defaultBarcode;
    url_params['mobileBarcode'] = this.mobileBarcode;
    this.navigator.push('invoicelovecodeedit', {}, url_params);
  }

  // 刪除捐贈碼
  deleteLoveCode() {
    this.confirmService.show("是否刪除捐贈碼").then(
      () => {
        const reqObj = {
          "mobileBarcode": this.mobileBarcode,
          "loveCode": "",
          "socialWelfareName": "",
          "defaultBarcode": (this.mobileBarcode !== "" ? "1" : "")
        };
        this.epayService.sendFQ000305(reqObj).then(
          (resObj) => {
            if (resObj && resObj['trnsRsltCode'] === "0") {
              this.hasLoveCode = false;
              this.loveCode = "";
              this.defaultBarcode = "1";
              this.changeDefaultCode('1'); // 將預設頁籤設為手機條碼
            } else if (!!resObj['hostCodeMsg']) {
              this.alertService.show(resObj['hostCodeMsg']);
            } else {
              this.alertService.show("刪除失敗");
            }
          },
          (errObj) => {
            this._handleError.handleError(errObj);
          }
        );
      },
      () => { } // confirm按取消
    );
  }

  /**
   * 隱藏查詢結果
   */
  hideLvList() {
    this.ShowList = "N";
  }

  // 查詢捐贈碼
  toLoveCodeSearch() {
    this.selectedLV = "";
    // 檢核關鍵字
    if (typeof this.keyword !== 'string' || this.keyword.length <= 0) {
      this.alertService.show("請輸入關鍵字");
      return;
    } else {
      this.epayService.sendFQ000406(this.keyword).then(
        (resObj) => {
          if (!!resObj) {
            let newres = this.epayService.convertRes(resObj);
            if (typeof newres == "string") {
              this.alertService.show(newres);
              return;
            } else {
              //開啟查詢清單
              this.ShowList = "Y";

              if (typeof newres.details == 'undefined' || newres.details == null) {
                this.loveCodeCount = 0;
              } else {
                this.loveCodeCount = newres.details.length;
              }
              if (this.loveCodeCount > 0) {
                this.queryLV = {};
                this.queryLV = newres.details.map(function (inp) {
                  let newinp = {};
                  newinp['rowNum'] = String(inp.rowNum);
                  newinp['SocialWelfareBAN'] = inp.SocialWelfareBAN;
                  newinp['LoveCode'] = inp.LoveCode;
                  newinp['SocialWelfareName'] = inp.SocialWelfareName;
                  newinp['SocialWelfareAbbrev'] = inp.SocialWelfareAbbrev;
                  newinp['lvClassType'] = inp.rowNum % 2 == 0 ? 'invest' : 'invest2'
                  return newinp;
                });
              }
            }
          } else {
            this.alertService.show("搜尋失敗");
            return;
          }
        },
        (errObj) => {
          this._handleError.handleError(errObj);
        }
      )
    }
  }

  // 點選捐贈碼
  selectLV(LV) {
    this.selectedLV = LV;
  }

  /**
   * 重新整理此頁
   * @param active_type 預設顯示
   */
  refresh(active_type?: string) {
    this.keyword = '';
    this.selectedLV = '';
    this.showLove = false; // 預設頁籤在"手機條碼"
    this.epayService.sendFQ000101('E').then( // E:電子發票設定
      resObj => {
        // 下行電文有"雲端發票條碼"
        if (!!resObj['mobileBarcode']) {
          this.mobileBarcode = resObj['mobileBarcode'];
          this.hasBarcode = true;
        }

        // 下行電文有"愛心碼"
        if (!!resObj['loveCode']) {
          this.loveCode = resObj['loveCode'];
          this.socialWelfareName = resObj['socialWelfareName'];
          this.hasLoveCode = true;
        }

        // 預設頁籤在"捐贈碼"
        let df_code = resObj['defaultBarcode'];
        if (!!active_type) {
          df_code = active_type;
        }
        if (df_code == '2') {
          this.onChangePage('love');
          this.defaultBarcode = '2'; // 如果預設頁面為"愛心碼"，進入頁面就幫使用者勾選"愛心碼"
        } else { // 預設頁籤在"手機條碼"
          this.defaultBarcode = '1';
          this.onChangePage('mobile');
        }

      },
      errObj => {
        this._handleError.handleError(errObj);
        this.navigator.push('epay'); // 返回epay menu
      }
    );
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------
  private _initEvent() {
    let navigateWord = '';
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('changeDefaultCode') && params['changeDefaultCode'] != ''){
        navigateWord = params.changeDefaultCode;
      }
    });

    this.bookmarkData = [
      {
        id: 'mobile',
        name: '手機條碼', // 手機條碼
        sort: 1
      }
      , {
        id: 'love',
        name: '捐贈碼', // 捐贈碼
        sort: 2
      }
    ];

    // 返回 epay menu
    this.headerCtrl.setLeftBtnClick(
      () => {
        this.navigator.push('epay');
      }
    );
    this.refresh(navigateWord);
  }


  /**
  * 頁面切換
  * @param pageType 頁面切換判斷參數
  *        'apply' : 申請綁定頁
  *        'bind' : 裝置綁定頁
  * @param pageData 其他資料
  */
  private onChangePage(pageType: string, pageData?: any) {
    let set_page = pageType;
    switch (pageType) {
      case '2':
      case 'love': // 捐贈碼
        set_page = 'love';
        this.showLove = true;
        break;
      case '1':
      case 'mobile': // 手機條碼
      default:
        set_page = 'mobile';
        this.showLove = false;
        break;
    }
    this.nowPage = set_page;
  }

}
