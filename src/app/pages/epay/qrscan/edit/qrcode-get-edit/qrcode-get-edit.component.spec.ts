import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeGetEditComponent } from './qrcode-get-edit.component';

describe('QrcodeGetEditComponent', () => {
  let component: QrcodeGetEditComponent;
  let fixture: ComponentFixture<QrcodeGetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeGetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeGetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
