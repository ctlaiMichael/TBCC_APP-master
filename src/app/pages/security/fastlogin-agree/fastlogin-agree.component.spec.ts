import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastloginAgreeComponent } from './fastlogin-agree.component';

describe('FastloginAgreeComponent', () => {
  let component: FastloginAgreeComponent;
  let fixture: ComponentFixture<FastloginAgreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastloginAgreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastloginAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
