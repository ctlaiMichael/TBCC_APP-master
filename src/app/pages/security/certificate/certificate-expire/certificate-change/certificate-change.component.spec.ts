import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateChangeComponent } from './certificate-change.component';

describe('CertificateChangeComponent', () => {
  let component: CertificateChangeComponent;
  let fixture: ComponentFixture<CertificateChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
