import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnscanComponent } from './onscan.component';

describe('OnscanComponent', () => {
  let component: OnscanComponent;
  let fixture: ComponentFixture<OnscanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnscanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
