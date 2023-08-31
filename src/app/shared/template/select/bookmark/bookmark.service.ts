import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BookmarkService {
  changeMenuDataSubject: Subject<any> = new Subject<any>();
  constructor() { }

}
