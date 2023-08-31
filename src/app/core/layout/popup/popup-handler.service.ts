import { Injectable } from '@angular/core';

@Injectable()
export class PopupHandlerService {
  count: number;
  constructor() {
    this.count = 0;
  }
}
