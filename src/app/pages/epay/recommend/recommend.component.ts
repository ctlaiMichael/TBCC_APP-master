/**
 * 推薦人設定
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FQ000108ApiService } from '@api/fq/fq000108/fq000108-api.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { RecommendService } from '@pages/epay/shared/service/recommend.service';
@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  providers: [RecommendService]
})
export class RecommendComponent implements OnInit {
  /**
   * 參數處理
   */
  // --- step Bar --- //
  nowStep = '';
  stepMenuData = [
    {
      id: 'edit',
      name: 'STEP_BAR.EPAY.RECOMMEND.STEP1' // 填寫資料
    }
    , {
      id: 'result',
      name: 'STEP_BAR.EPAY.RECOMMEND.STEP2', // 結果
      // 執行此步驟時是否隱藏step bar
      hidden: true
    }
  ];
  private back_path = 'epay'; // epay選單

  result = {
    employNo: ''
  };
  errorMsg = {
    employNo: ''
  };
  maxNum = 6; // 最大輸入數
  resultData: any; // 結果

  constructor(
    private _logger: Logger,
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private fq000108: FQ000108ApiService,
    private handleError: HandleErrorService,
    private confirm: ConfirmService,
    private qrcodeService: QRTpyeService,
    private _mainService: RecommendService
  ) { }

  ngOnInit() {
    this._logger.step('EPAY', 'Recommend init');
    // --- 頁面設定 ---- //
    this._headerCtrl.setLeftBtnClick(() => {
        this.cancelEdit();
    });
    // --- 頁面設定 End ---- //
    // 預設取得推薦人編號
    this._mainService.getData().then(
      (resObj) => {
        this._logger.step('EPAY', 'get employNo', resObj);
        if (resObj.haveNo) {
          this.result.employNo = resObj.employNo;
        }
      },
      (errorObj) => {
        this.handleError.handleError(errorObj);
      }
    );
  }



  /**
   * 放棄編輯
   */
  cancelEdit() {
    this.confirm.cancelEdit({ type: 'edit' }).then(
      () => {
        this.navgator.push(this.back_path);
      },
      () => {
        // no do
      }
    );
  }

  /**
   * 變更步驟
   */
  onChangeStep(step) {
    this.nowStep = step;
  }


  /**
   * 設定
   */
  onClickSubmit() {
    // 推薦人編號檢查
    this._mainService.saveData(this.result).then(
      (resObj) => {
        let info_data = [];
        let errbt_msg='';
        if (resObj.status) {
          info_data.push({
            title: 'EPAY.RECOMMEND.FIELD.ID', // 推薦人編號
            content: this.result.employNo
          });
        }else{
          errbt_msg='返回推薦人設定交易';
        }
        
       
        this.resultData = {
            title: resObj.title, // 結果狀態
            content_params: { }, // 副標題i18n
            content: resObj.msg, // 結果內容
            classType: resObj.classType, // 結果樣式
            detailData: info_data,
            button: 'EPAY.FIELD.BACK_EPAY', // 返回合庫E Pay
            buttonPath: 'epay',
            err_btn:errbt_msg
        };
        this.onChangeStep('result');
      },
      (errorObj) => {
        // 請輸入推薦人編號(共6碼)
        if (errorObj.hasOwnProperty('type') && errorObj['type'] === 'dialog') {
          this.errorMsg.employNo = (errorObj.hasOwnProperty('msg')) ? errorObj['msg'] : 'EPAY.RECOMMEND.ERROR.EDIT_ERROR';
        } else {
          errorObj['title'] = 'EPAY.RECOMMEND.ERROR.EDIT_ERROR'; // 更新推薦人編號失敗
        }
        this.handleError.handleError(errorObj);
      }
    );
  }

  /**
   * 取消返回
   */
  onClickCancel() {
    this.cancelEdit();
  }

  /**
   * 
   */
  resultBack(){
    this.nowStep='edit';
    this._headerCtrl.setHeaderStyle('normal');
  }
}
