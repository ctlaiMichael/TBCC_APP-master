import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { LoadingSpinnerService } from '@core/layout/loading/loading-spinner.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * @description
 * @author Amit Mahida
 * @export
 */
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoadingSpinnerComponent implements OnDestroy {

  _template = `<div class="ht-c-lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  _loadingText = '';
  _threshold = 500;
  _timeout = 0;
  _zIndex = 9999;

  @Input() public set zIndex(value: number) {
    this._zIndex = value;
  }
  public get zIndex(): number {
    return this._zIndex;
  }
  @Input()
  public set template(value: string) {
    this._template = value;
  }
  public get template(): string {
    return this._template;
  }
  @Input()
  public set loadingText(value: string) {
    this._loadingText = value;
  }
  public get loadingText(): string {
    return this._loadingText;
  }
  @Input()
  public set threshold(value: number) {
    this._threshold = value;
  }
  public get threshold(): number {
    return this._threshold;
  }
  @Input()
  public set timeout(value: number) {
    this._timeout = value;
  }
  @Input() fixed = true;
  public get timeout(): number {
    return this._timeout;
  }
  subscription: Subscription;
  showSpinner = true;

  constructor(
    private spinnerService: LoadingSpinnerService
  ) {
    this.createServiceSubscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  fixBody(t: Boolean) {
    // if (this.fixed) {
    //   if (t) {
    //     document.querySelector('body').style.overflow = 'hidden';
    //   } else {
    //     document.querySelector('body').style.overflow = 'visible';
    //   }
    // }
  }

  createServiceSubscription() {
    let thresholdTimer: any;
    let timeoutTimer: any;

    this.subscription =
      this.spinnerService.getMessage().subscribe(show => {
        if (show) {
          if (thresholdTimer) {
            return;
          }
          thresholdTimer = setTimeout(() => {
            // this.fixBody(true);
            thresholdTimer = null;
            this.showSpinner = show;

            if (this.timeout !== 0) {
              timeoutTimer = setTimeout(() => {
                // this.fixBody(false);
                timeoutTimer = null;
                this.showSpinner = false;
              }, this.timeout);
            }
          }, this.threshold);
        } else {
          if (thresholdTimer) {
            clearTimeout(thresholdTimer);
            thresholdTimer = null;
          }
          if (timeoutTimer) {
            clearTimeout(timeoutTimer);
          }
          timeoutTimer = null;
          this.showSpinner = false;
          // this.fixBody(false);
        }
      });
  }
}
