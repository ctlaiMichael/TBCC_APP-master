import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetacctComponent } from './setacct.component';

describe('SetacctComponent', () => {
  let component: SetacctComponent;
  let fixture: ComponentFixture<SetacctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetacctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetacctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
