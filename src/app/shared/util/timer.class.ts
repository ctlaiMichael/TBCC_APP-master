import { timer } from 'rxjs/observable/timer';

export class Timer {

  subscription: any;
  sec: number;
  callback: () => void;
  intervalCallback: (counter: number) => void;

  // State
  count = 0;
  running: boolean;

  constructor(sec: number, callback: () => void, intervalCallback?: (counter: number) => void) {
    this.sec = sec;
    this.callback = callback;
    this.intervalCallback = intervalCallback;
    this.ticktok();
  }

  setTime(t: number) {
    this.count = t;
  }

  getTime() {
    return this.count;
  }

  stop() {
    // if (this.running) {
      this.subscription.unsubscribe();
      this.running = false;
    // }
  }

  resume() {
    if (!this.running && this.count !== 0) {  // count !== 0 : solve for timeout -> stop -> resume
      this.ticktok();
    }
  }

  restart() {
    this.subscription.unsubscribe();
    this.count = 0;
    this.ticktok();
  }

  private reset() {
    this.count = 0;
    this.running = false;
  }

  private ticktok() {
    if (!this.running) {
      this.subscription = timer(0, 1000).subscribe(_ => {
        this.count++;
        // console.log('count: ', this.count);
        if (!!this.intervalCallback) {
          this.intervalCallback(this.count);
        }
        if (this.count === this.sec) {
          this.reset();
          this.subscription.unsubscribe();
          this.callback();
        }
      }
      );
    }
  }

}

