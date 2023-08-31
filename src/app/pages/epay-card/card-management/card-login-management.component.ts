import { EmvService } from '../shared/service/emv.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FQ000112ApiService } from '@api/fq/fq000112/fq000112-api.service';
import { FQ000112ReqBody } from '@api/fq/fq000112/fq000112-req';
import { FQ000113ApiService } from '@api/fq/fq000113/fq000113-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FormateService } from '@shared/formate/formate.service';
import { QRTpyeCardService } from '../shared/qrocdeType-card.service';
import { logger } from '@shared/util/log-util';
import { FQ000113ReqBody } from '@api/fq/fq000113/fq000113-req';
import { ConfirmCheckBoxService } from '@shared/popup/confirm-checkbox/confirm-checkbox.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CardSafePopupService } from '@shared/transaction-security/card-safe-popup/card-safe-popup.service';
@Component({
  selector: 'app-card-login-management',
  templateUrl: './card-login-management.component.html',
  styleUrls: ['./card-login-management.component.css'],
  providers: [ConfirmCheckBoxService]
})
export class CardLoginManagementComponent implements OnInit {

  cards: any = [];
  defaultCreditCard: any
  changeDefaultCardNo: any;
  defaultSelected: any;
  form: any;
  clickEvent: any;
  noBindCard = false;//目前無綁定
  delChgDefault = false;
  cardValue = {

  };
  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private navgator: NavgatorService,
    private localstorage: LocalStorageService,
    private confirm: ConfirmService,
    private confirmCheckbox: ConfirmCheckBoxService,
    private fq000112: FQ000112ApiService,
    private handleError: HandleErrorService,
    private _formateService: FormateService,
    private qrcodeService: QRTpyeCardService,
    private fq000113: FQ000113ApiService,
    private formateService: FormateService,
    private emvService: EmvService
    , private _headerCtrl: HeaderCtrlService
    , private cardSafePopupService :CardSafePopupService
  ) { }

  ngOnInit() {

    this._headerCtrl.setLeftBtnClick(() => {
      this.cancelEdit();
    });
    this._init();
  }

  /**
  * 放棄編輯
  */
  cancelEdit() {
    // this.confirm.cancelEdit({ type: 'edit' }).then(
    //   () => {
        this.navgator.push('epay-card');
    //   },
    //   () => {
    //     // no do
    //   }
    // );
  }
  _init() {

    // 判斷有無預設信用卡
    if (this.localstorage.get('nextAsk_aggreCard') !== '1' && this.localstorage.get('firstAggreCard') === '1') {
      this.confirmCheckbox.show('本人同意以快速交易作為交易密碼，並妥善保管。', { title: '注意事項', checkbox: '下次不要提醒我' }).then(
        (resConfirm) => {
          logger.error('confirm checkbox', resConfirm);
          if (resConfirm.checked) {
            this.localstorage.set('nextAsk_aggreCard', '1');
          } else {
            this.localstorage.set('nextAsk_aggreCard', '0');
          }
          this.link();
        },
        (errorConfirm) => {
          this.gotoEpay();
        }
      );
    } else {
      this.link();
    }
  }



  link() {
    this.form = new FQ000112ReqBody();
    this.form.custId = this.auth.getUserInfo().custId;
    this.fq000112.send(this.form)
      .then(
        (fq000112res) => {
          if (fq000112res.body.trnsRsltCode !== '0') {
            this.handleError.handleError({
              type: 'dialog',
              title: 'ERROR.TITLE',
              content: '(' + fq000112res.body.hostCode + ')' + fq000112res.body.hostCodeMsg
            });
            this.gotoEpay();
            return;
          }
          if (fq000112res.body.creditCards == null || fq000112res.body.creditCards.creditCard == null) {
            this.alert.show('未開通信用卡功能，請臨櫃申請').then(
              resAlert => {
                this.gotoEpay();
              }
            );
          }
          this.cards = fq000112res.body.creditCards.creditCard;
          this.defaultCreditCard = fq000112res.body.defaultCreditCard;
          this.defaultSelected = this.defaultCreditCard;
          this.cards = ObjectCheckUtil.modifyTransArray(fq000112res.body.creditCards.creditCard);
          for (let key in this.cards) {
            // 檢查是否為預設預設卡號
            if (this.cards[key].cardNo == fq000112res.body.defaultCreditCard) {
              this.cards[key].selected = true;
            } else {
              this.cards[key].selected = false;
            }
          }

          logger.error('檢查是否為預設預設卡號', this.cards)
          // 檢查是否為綁定卡號
          for (let i in this.cards) {
            this.cards[i].inputValue = false;
            if (this.cards[i].isBind == 'Y') {
              this.cards[i].checked = true;
            } else {
              this.cards[i].checked = false;
            }
          }
          if (this.cards.length == 0) {
            this.alert.show('未開通信用卡功能，請臨櫃申請').then(
              resAlert => {
                this.gotoEpay();
              }
            );
          }
          logger.debug('this.cards:', this.cards, this.cards.cardNo);
        }).catch(
          error => {
            logger.error(error);
            this.handleError.handleError({
              type: 'message',
              title: '',
              content: error.content
            });
          });
  }

  // 信用卡綁定與解除綁定
  cardCvcShow(card) {
    this.clickEvent = 'checkbox';
    logger.error('card', card);
    // card.checked = !card.checked;
    // card.checked = (card.checked == true) ? false : true;
    if (!card.checked) { //原本是未綁定
      // 未綁定成功開關關掉
      for (let i in this.cards) {
        if (this.cards[i].cardNo == card.cardNo && card.isBind == 'Y') {
          this.cards[i].checked == false ? false : true;
        }
      }
      card.inputValue = true;
    } else {            //原本是綁定
      card.inputValue = false;
      if (card.isBind == 'Y') {
        // 解除綁定確認提示
        this.confirm.show('是否解除綁定本張信用卡', { title: '信用卡解除綁定' }).then(
          (resconfirm) => {
            // 判斷是否有為預設
            logger.error('this.defaultCreditCard;',this.defaultCreditCard)
            let defaultCreditCardNo = this.defaultCreditCard;
            if (card.cardNo === defaultCreditCardNo) {
              // 檢查是否為綁定卡號
              let enterTime = 0;
              let aa = this._formateService.transArraySort(this.formateService.transClone(this.cards), { sort: 'cardNo', reverse: 'DESC' });
              logger.error('order', this.formateService.transClone(this.cards), { sort: 'cardNo', reverse: 'ASC' });
              for (let i in aa) {
                if (aa[i].isBind == 'Y' && aa[i].cardNo != defaultCreditCardNo) {
                  enterTime++;
                  this.changeDefaultCardNo = aa[i].cardNo;
                  logger.error('changedefaultcardNo', this.changeDefaultCardNo);
                  break;
                }
              }
              // 確認是否為最後一個綁定
              if (enterTime == 0) {
                this.alert.show('您目前已無綁定信用卡，請至「信用卡新增／變更」新增卡片').then(
                  res => {
                    this.noBindCard = true;
                    this.delChgDefault = false;
                    localStorage.setItem('lastTransaction', '1');
                    this.cardTelegram('D', card);
                    for(let i in this.cards){
                      if (this.cards[i] == card) {
                        this.cards[i].isBind='N'; //將最後一筆改為未綁定
                      }
                    }
                  }
                );
              } else {
                this.alert.show('自動預設卡號為' + '*' + this.changeDefaultCardNo.substr(-6, 6) + '，如需更改預設卡號，請至「信用卡新增／變更」變更').then(
                  res => {
                    this.delChgDefault = true;
                    this.cardTelegram('D', card);
                  }
                );
              }
            } else {
              this.delChgDefault = false;
              this.cardTelegram('D', card);
            }
            // 解除綁定預設拿掉
            for (let i in this.cards) {
              if (this.cards[i] == card) {
                this.cards[i].selected = false;
              }
              if(this.cards[i].isBind=='N'){
                this.cards[i].inputValue=false; //新增綁定視窗全部關閉
                this.cards[i].checked=false; //新增綁定視窗全部關閉
              }
            }
          },
          (errorconfirm) => {
            // $state.reload();
            // 檢查是否為綁定卡號
            for (let i in this.cards) {
              if (this.cards[i].isBind == 'Y') {
                this.cards[i].checked = true;
              } else {
                this.cards[i].checked = false;
              }
              this.cards[i].inputValue=false; //新增綁定視窗全部關閉
            }
          }
        );
      }
    }
  }

  // 綁定信用卡
  clickSubmit(card, expiredDate, checkId) {
    logger.error('33333', card, expiredDate, checkId);
    if (expiredDate === '') {
      this.alert.show('請輸入卡片有效月年');
      return;
    }
    if (checkId === '') {
      this.alert.show('卡片背面末三碼');
      return;
    }

    let isBindSum = 0;
    for (let i in this.cards) {
      if (this.cards[i].isBind === 'Y') {
        isBindSum++;
      }
    }
    card.expiredDate = expiredDate;
    card.checkId = checkId;
    // 判斷有沒有其他綁定的信用卡
    if (isBindSum > 0) {
      this.confirm.show('是否變更為預設信用卡號', { title: '信用卡預設設定' }).then(
        resconfirm => { //發送綁定信用卡並變更預設電文
          this.cardTelegram('A', card);
        },
        errorconfirm => { //發送綁定信用卡電文
          logger.error('bind card', errorconfirm);
          this.cardTelegram('B', card);
        }
      );
    } else {  //發送綁定信用卡並變更預設電文
      this.cardTelegram('A', card);
    }
    card.inputValue = false;
  }

  /**
    * 點選預設信用卡動作(設定為單選)
    */
  selectcard(card) {
    logger.error('default', this.defaultCreditCard, card);
    this.clickEvent = 'radio';
    let selectedCard = card;

    // 檢查是否為同樣
    if (selectedCard.cardNo == this.defaultCreditCard) {
      logger.error('same');
      return;
    }
    for (let i in this.cards) {
      if (this.cards[i] == selectedCard) {
        this.cards[i].selected = true;
        if (this.cards[i].isBind == 'Y') {
          this.confirm.show('是否變更為預設信用卡號', { title: '信用卡預設設定' }).then(
            (resconfirm) => { //發送變更預設電文
              this.cardTelegram('S', card);
            },
            (errorconfirm) => {//取消預約信用卡
              logger.error('chang reset radio?', this.defaultCreditCard, this.cards);
              this.defaultSelected = this.defaultCreditCard;
            }
          );
        }
      } else {
        this.cards[i].selected = false;
      }
      // this.cards[i].selected = (this.cards[i] == selectedCard);
    }
    // for (let i in this.cards) {
    //   if (this.cards[i].cardNo == selectedCard.cardNo) {
    //     if (this.cards[i].isBind == 'N') {  //是所選的 && 未綁定的
    //       for (let key in this.cards) { //再次循環沒綁定的
    //         // 檢查是否為預設預設卡號
    //         if (this.cards[key].cardNo == this.defaultCreditCard) {
    //           this.cards[key].selected = true;
    //         } else {
    //           this.cards[key].selected = false;
    //         }
    //       }
    //       return;
    //     }
    //   }
    // }
  }

  // 發電文綁定信用卡
  // 綁定卡片：B、設定預設卡片：S、解除綁定卡片  D、綁定+設定預設卡片：A
  cardTelegram(method, card) {
    let form2: any = {
      custId: this.form.custId,
      txnType: '',
      cardNo: '',
      cardType: '',
      expiredDate: '',
      checkId: '',
      defaultCreditCard: ''
    };

    if (method === 'B') { // 綁定卡片：B
      form2.txnType = 'B';
      form2.cardNo = card.cardNo;
      form2.cardType = card.cardType;
      form2.expiredDate = card.expiredDate;
      form2.checkId = card.checkId;

    } else if (method === 'S') { // 設定預設卡片：S
      form2.txnType = 'S';
      form2.defaultCreditCard = card.cardNo;
      // this.defaultCreditCard = card.cardNo;
    } else if (method == 'D') { // 解除綁定卡片  D
      form2.txnType = 'D';
      form2.cardNo = card.cardNo;
      if (this.changeDefaultCardNo == undefined || this.changeDefaultCardNo == null) {
        form2.defaultCreditCard = this.defaultCreditCard;
      } else {
        form2.defaultCreditCard = this.changeDefaultCardNo;
      }
    } else if (method == 'A') {
      form2.txnType = 'A';
      form2.cardNo = card.cardNo;
      form2.cardType = card.cardType;
      form2.expiredDate = card.expiredDate;
      form2.checkId = card.checkId;
      form2.defaultCreditCard = card.cardNo;
    }

    let reqObj = this.formateService.transClone(form2);
    logger.error('reqObj', reqObj);

    if (method == 'B' || method == 'A') {
      // const CA_Object = {
      //   securityType: '',
      //   serviceId: 'FQ000113',
      //   signText: form2,
      //   otpObj: {
      //     custId: '',
      //     fnctId: '',
      //     depositNumber: '',
      //     depositMoney: '',
      //     OutCurr: '',
      //     transTypeDesc: ''
      //   }
      // };
      // this.emvService.getSecurityInfo(CA_Object).then(
        // (resSecurityInfo) => {
      
        this.cardSafePopupService.show('', {}).then(
          (popsuc)=>{
            logger.error('pd popup show',popsuc);
            if(popsuc['PD_val']){ //有接收到密碼 數位信封加密
              let diapwd=popsuc['PD_val'];
              this.auth.digitalEnvelop(diapwd).then(
                (diasuc)=>{ //加密成功
                  let headerObj:any={
                      SecurityType: '6',
                      SecurityPassword: diasuc.value
                  };
                  let reqHeader = {
                    header: headerObj
                  };
                  //FQ000113
                  this.fq000113.send(reqObj, reqHeader).then(
                    (res) => {
                      logger.error('resSecurityInfo res', res);
                      // 預設交易方式
                      // this.localstorage.set('lastTransaction', '2');
                      // 綁定成功
                      let params = {
                        result: res
                      };
                      // 綁定成功
                      if (res.body.trnsRsltCode == '0') {
                        this.localstorage.set('lastTransaction', '2');
                        this.navgator.push('cardlogin-cardBinding', params);
                      } else {
                        this.handleError.handleError({
                          type: 'message',
                          title: '設定失敗',
                          content: res.body.hostCodeMsg
                        });
                      }
                    },
                    (error) => {
                      logger.error('resSecurityInfo error', error);
                      this.handleError.handleError({
                        type: 'message',
                        title: '設定失敗',
                        content: error.content
                      });
                      // this.gotoEpay();
                    });
                },
                (diafail)=>{ //加密失敗
                  logger.error('diafail',diafail);
                  this.handleError.handleError({
                    type: 'message',
                    title: '加密失敗',
                    content: diafail.content
                  });
                }
              );
            }
          },
          (popfail)=>{
            logger.error('pwd popup show false',popfail);
          }
        );
      
        // },
        // (errorSecurityInfo) => {
          //使用者取消
          if (this.clickEvent == 'radio') {
            for (let i in this.cards) {
              this.cards[i].selected = (this.cards[i].cardNo == this.defaultCreditCard);
              // card.selected = (card.selected == true) ? false : true;
            }
          } else if (this.clickEvent == 'checkbox') {
            logger.error('card', card.cardNo, card);
            for (let i in this.cards) {
              if (card.cardNo == this.cards[i].cardNo) {
                // this.cards[i].checked = false;
                card.checked = (card.checked == true) ? false : true;
              }
            }
          }
        // },
      // );
    } else {


      this.fq000113.send(reqObj).then(  //D and S
        (res) => {
          if (res.body.trnsRsltCode != '0') {
            this.handleError.handleError({
              type: 'message',
              title: '設定失敗',
              content: res.body.hostCodeMsg
            });
            return;
          }
          this.defaultCreditCard = form2.defaultCreditCard;
          logger.error('fq000113 success D S', this.defaultCreditCard, this.changeDefaultCardNo, form2.defaultCreditCard)

          // 預設交易方式
          // localStorage.setItem('lastTransaction', '2');
          // 綁定成功
          logger.debug('res:' + res);
          if (form2.txnType == 'D') {
            localStorage.setItem('firstAggreCard', '2');
            // this._init(); // reload
          }

          logger.error('this.cards', card, this.cards)
          if (this.clickEvent == 'radio') {
            this.defaultSelected = form2.defaultCreditCard;

            for (let i in this.cards) {
              this.cards[i].selected = (this.cards[i].cardNo == this.defaultCreditCard);
              // card.selected = (card.selected == true) ? false : true;
            }
          } else if (this.clickEvent == 'checkbox') {

            if (this.noBindCard) {
            this.defaultSelected='';
            } else {

              for (let i in this.cards) {
                if (card.cardNo == this.cards[i].cardNo) {
                  this.cards[i].isBind = 'N';
                  if (this.delChgDefault) { //解除綁定並且更改預設時
                    this.defaultSelected = form2.defaultCreditCard;
                  }
                  this.cards[i].checked == false ? false : true;
                  break;
                }
              }
            }
          }
        },
        (error) => {
          logger.error('resSecurityInfo error', error);
          this.handleError.handleError({
            type: 'message',
            title: '設定失敗',
            content: error.content
          });
        });

    }
  }

  gotoEpay() {
    this.navgator.push('epay-card');
  }

  /**
		* 點選取消
		*/
  clickCancel(card) {
    for (let i in this.cards) {
      if (this.cards[i].isBind == 'Y') {
        this.cards[i].checked = true;
      } else {
        this.cards[i].checked = false;
      }
    }
    card.inputValue = false;
  }

}
