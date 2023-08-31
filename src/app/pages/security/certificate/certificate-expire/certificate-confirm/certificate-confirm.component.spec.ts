import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateConfirmComponent } from './certificate-confirm.component';

describe('CertificateConfirmComponent', () => {
  let component: CertificateConfirmComponent;
  let fixture: ComponentFixture<CertificateConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
