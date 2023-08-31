/**
 * 圖形驗證碼輸入框
 * 需要產生圖形驗證碼，請呼叫: captchaChange()
 * 需要驗證輸入的圖型驗證碼是否正確，請呼叫: checkCaptchaVal()
 */
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { CaptchaService } from './captcha.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';
// import { PopupService, CheckService, ConfigService } from 'app/shared/service/global';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {
  @Input() action: any;
  @Output() statusBak: EventEmitter<any> = new EventEmitter<any>();

  canvasWidth = '100';
  canvasHeight = '35';
  gotpErrorHide = false;
  captchaErrormsg: any = '';
  ulClass = 'captcha_input'
  // ==圖形驗證碼設定== //
  checkCaptchaData = {
    id: '',
    name: '',
    input: '',
    captcha: ''
  };
  rememberCom = '';

  // == 圖形驗證碼設定 == //
  private _captcha_length = 4; // 圖形驗證碼值長度
  // private canvas_pap_query = '.input_captcha a';
  private canvas_pap_query = '.input_captcha li';
  private canvas_query = '.input_captcha li canvas';
  private input_query = '.input_captcha input';

  constructor(
    private _logger: Logger,
    private selfElm: ElementRef,
    // private _popupService: PopupService,
    private _captchaServices: CaptchaService
  ) {
    
    // logger.warn('CA', 'Gotp constru');
  }
  ngOnInit() {
    // logger.warn('CA', 'Gotp init');
    this.captchaChange();
  }
  captchaChange() {
    // const _eleScrollBtn = this.selfElm.nativeElement.querySelector('.advice_user_edit');
    this.captchaErrormsg = '';
    // ==設定圖形驗證碼大小== //
    let captcha_set = {
      width: this.canvasWidth + 'px',
      height: this.canvasHeight + 'px'
    };

    let canvas_pap = this.selfElm.nativeElement.querySelector(this.canvas_pap_query);
    let canvas_obj = this.selfElm.nativeElement.querySelector(this.canvas_query);
    if (typeof canvas_obj === 'undefined') {
      this.captchaErrormsg = '圖形驗證碼產生失敗'; // 圖形驗證碼產生失敗
      this.ulClass = 'captcha_input active_warnning';
      return false;
    }
    // == 產圖前重新設定寬高[!!!!請不要亂動!!!!] == //
    canvas_obj.style.width = captcha_set.width;
    canvas_obj.style.height = captcha_set.height;
    if (typeof canvas_pap !== 'undefined') {
      canvas_pap.style.width = captcha_set.width;
      canvas_pap.style.height = captcha_set.height;
    }

    // 驗空值
    // this.check_method();

    // ==圖形驗證碼取得== //
    this.checkCaptchaData.input = '';
    this.checkCaptchaData.captcha = '';

    // ==取得圖形驗證碼(local產出)== //
    let check = this._captchaServices.captchaCreateCode(canvas_obj, this._captcha_length);
    if (!check) {
      this.captchaErrormsg = '圖形驗證碼產生失敗'; // 圖形驗證碼產生失敗
      this.ulClass = 'captcha_input active_warnning';
    }

    // == 透過API取得圖形驗證碼 == //
    // let success_method = (captcha) => {
    //   this.checkCaptchaData.captcha = captcha;
    //   // console.log(captcha.replace(/^"data:*/jpeg;base64,"/,''));
    //   // console.log(captcha.replace(/^data:image\//,''));
    //   // console.log(captcha.replace(/^(\w+)\s*,/,''));
    // }
    // error handel

    // let error_method = (jsonObj) => {
    //   // MainUiTool.openDialog(jsonObj.respCodeMsg);
    // }
    // fc000103Telegram.getData(success_method,error_method);
    // captchaServices.getData(iElm.find('#checkCode'),success_method,error_method);
    // captchaServices.createCode(iElm.find('#checkCode'),len=5,fontColor='Y',noiseColor='Y',noiseRate=0.15);

  }

  // == 檢核== //
  checkCaptchaVal() {
    this._logger.log(this.checkCaptchaData.input);
    let checkVal = false;
    let data: any;
    this.captchaErrormsg = '';
    const check_input = this.check_method();
    if (check_input) {
      data = this._captchaServices.checkCaptchaVal(this.checkCaptchaData.input);
      checkVal = data.status;
      this.captchaErrormsg = data.msg;
      if (checkVal) {
        this.ulClass = 'captcha_input';
      } else {
        this.captchaErrormsg = '圖形驗證碼錯誤';
        this.ulClass = 'captcha_input active_warnning';
      }


    }
    return checkVal;
  }

  /**
   * input檢核
   */
  private check_method() {
    if (this.checkCaptchaData.input == '') {
      this.captchaErrormsg = '請輸入圖形驗證碼'; // 請輸入圖形驗證碼
      this.ulClass = 'captcha_input active_warnning';
      return false;
    }
    return true;
  }


}
