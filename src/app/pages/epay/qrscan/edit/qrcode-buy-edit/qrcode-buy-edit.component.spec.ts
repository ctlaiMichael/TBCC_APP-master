import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeBuyEditComponent } from './qrcode-buy-edit.component';

describe('QrcodeBuyEditComponent', () => {
  let component: QrcodeBuyEditComponent;
  let fixture: ComponentFixture<QrcodeBuyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeBuyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeBuyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
