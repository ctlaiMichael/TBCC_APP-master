import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOneComponent } from './edit-one.component';

describe('EditOneComponent', () => {
  let component: EditOneComponent;
  let fixture: ComponentFixture<EditOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
