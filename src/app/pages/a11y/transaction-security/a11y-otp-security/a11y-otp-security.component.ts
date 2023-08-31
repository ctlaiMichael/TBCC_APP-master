import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { A11yOtpSecurityService } from './a11y-otp-security.srevice';
import { CheckService } from '@shared/check/check.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { Logger } from '@core/system/logger/logger.service';
import { NoPredesignatedTransferService } from '../../twd_transfer_no_predesignated/shared/no-predesignated.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Component({

  selector: 'app-a11y-oto-security',
  templateUrl: './a11y-otp-security.component.html',
  providers: [CheckService,NoPredesignatedTransferService],

})
export class a11yOtpSecurityComponent implements OnInit {

  @Input() transferObj: any;
  @Output() stepObj: EventEmitter<any> = new EventEmitter<any>();
  ulClass = 'inner_table_frame';

  checkTransOTP = true;
  trnsfrOTP=''; 
  TransOTPStr='請輸入OTP驗證碼';
  header:any;
  checkCode='';
  timeObj: any;
  limitTime:number;
  resData = {
    ERROR: {
      title: '',
      status: null,
      message: '',
      content: '',
      type: '',
      errorCode: ''
    },
    otp_sec: 0,
    checkCode: '',
    accessToken: '',
    OTP_val: ''
  };

  startTime: number;
  constructor(
    private _logger: Logger,
    private checkService: CheckService,
    private a11yOtpSecurityService: A11yOtpSecurityService,
    private headerCtrl: HeaderCtrlService,
    private noPredesignatedTransferService: NoPredesignatedTransferService,
    private handleError: HandleErrorService,
    
  ) {

  }

  ngOnInit() {
    
      if(this.a11yOtpSecurityService.checkOTPauth().status){
          this.a11yOtpSecurityService.sendOtpApi(this.transferObj['otpObj']).then(
            (S)=>{
              const dateTime = new Date().getTime();
              const timestamp = Math.floor(dateTime);
              this.startTime=timestamp;
                let arrayCheckCode=Array.from(S.checkCode);
                this.resData.checkCode=arrayCheckCode.join(' ');
                this.resData.otp_sec=S.OTP_SEC;
                this.resData.accessToken = S.accessToken;
                this.limitTime = this.resData.otp_sec;
                this.countTimer(this.resData.otp_sec);

            },
            (F)=>{
                F['type']='message';
                this.handleError.handleError(F);
            }
          );
      }else{
        
       
        
      }  

      this.headerCtrl.setLeftBtnClick(() => {
        this.back('confirm');
        // this.cancel();
      });
      this.headerCtrl.setBakBtnfocus(true);

    }


    // 檢查輸入的ＯＴＰ

    transOtpChange() {  
      let checkEmpty = this.checkService.checkEmpty(this.resData.OTP_val, true, false);
      if (!checkEmpty) {
        this.TransOTPStr = '請輸入OTP驗證碼';
        this.checkTransOTP=false;
        return ;
      }
      // 數值驗證
      let checkNumber = this.checkService.checkNumber(this.resData.OTP_val);
      if (!checkNumber.status) {
        this.TransOTPStr = '請輸入數值';
        this.checkTransOTP=false;
        return ;
      }
      // 長度檢核
      let check_min = this.checkService.checkLength(this.resData.OTP_val.toString(), 6, 'min');
      if (!check_min.status) {
        this.TransOTPStr = 'OTP碼長度必須為6位數字，請重新輸入';
        this.checkTransOTP=false;
        return ;
      }
      this.checkTransOTP=true;
    }
  
    cancel(){
      this.countTimerStop(this.timeObj);
      this.noPredesignatedTransferService.cancel();

    }

    back(pageName){

      this.countTimerStop(this.timeObj);
      this.transferObj['transferPage'] = pageName;
      this.stepObj.emit(this.transferObj);
    }

    doSubmitOtp(){
      // 驗ＯＴＰ＿ＶＡＬ
      this.transOtpChange();
      if(this.checkTransOTP){
        // OTP 確認發電文
        this.countTimerStop(this.timeObj);
        this.transferObj['otpObj']['OTP_val'] = this.resData['OTP_val'];
        this.transferObj['otpObj']['accessToken'] = this.resData['accessToken'];
        
        this.a11yOtpSecurityService.combindOtpHeader(this.transferObj['otpObj']).then(
          (getFinalHeader)=>{
            this.transferObj['securityResult']=getFinalHeader;
            this.transferObj['transferPage']='result';
            this.stepObj.emit(this.transferObj);
         
          },(getFail)=>{
            this.transferObj['securityResult']={};
            this.transferObj['errorObj']=getFail;
            getFail['type']='message';
            this.handleError.handleError(getFail);
          
          }
        );
     
       

      }
    }

    // 計時
  countTimer(time) {
    if (time) {
      this.timeObj = setTimeout(
        () => {
          if (this.resData.otp_sec > 0) {
            const dateTime = new Date().getTime();
            const timestamp = Math.floor(dateTime);
            let passAwayTime = Math.round(((timestamp - this.startTime)/1000));
            this.resData.otp_sec =  (this.limitTime - passAwayTime);
            this.countTimer(this.resData.otp_sec);
          }
        }, 1000);
    } else {
      // error handle popUP 逾時
      this.resData.ERROR.title = '';
      this.resData.ERROR.content = 'OTP 逾時';
      this.resData.ERROR.message = 'OTP 逾時';
      this.resData.ERROR.status = false;
      this.resData.ERROR.type = '';
      this.countTimerStop(this.timeObj);
      this.cancel();
      return;
    }
  }
  // 清除倒數
  countTimerStop(timeObj) {
    clearTimeout(timeObj);
    return;
  }

    
  }







