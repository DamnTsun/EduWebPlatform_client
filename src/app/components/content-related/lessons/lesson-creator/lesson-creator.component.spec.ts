import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCreatorComponent } from './lesson-creator.component';

describe('LessonCreatorComponent', () => {
  let component: LessonCreatorComponent;
  let fixture: ComponentFixture<LessonCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
