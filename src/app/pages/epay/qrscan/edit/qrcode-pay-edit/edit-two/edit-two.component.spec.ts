import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTwoComponent } from './edit-two.component';

describe('EditTwoComponent', () => {
  let component: EditTwoComponent;
  let fixture: ComponentFixture<EditTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
