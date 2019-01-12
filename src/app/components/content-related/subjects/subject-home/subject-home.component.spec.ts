import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectHomeComponent } from './subject-home.component';

describe('SubjectHomeComponent', () => {
  let component: SubjectHomeComponent;
  let fixture: ComponentFixture<SubjectHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
