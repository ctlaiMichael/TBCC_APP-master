import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateChangepwdComponent } from './certificate-changepwd.component';

describe('CertificateChangepwdComponent', () => {
  let component: CertificateChangepwdComponent;
  let fixture: ComponentFixture<CertificateChangepwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateChangepwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateChangepwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
