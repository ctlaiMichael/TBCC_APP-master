import { Injectable } from '@angular/core';

import { LocalStorageService } from '@lib/storage/local-storage.service';

@Injectable()
export class EditService {
  constructor(private localStorage: LocalStorageService) { }

  getSetting(key: string) {
    return this.localStorage.getObj(key);
  }

  setSetting(key: string, obj: Object) {
    this.localStorage.setObj(key, obj);
  }
}
