import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonHomeComponent } from './lesson-home.component';

describe('LessonHomeComponent', () => {
  let component: LessonHomeComponent;
  let fixture: ComponentFixture<LessonHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
