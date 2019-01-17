import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionCreatorComponent } from './test-question-creator.component';

describe('TestQuestionCreatorComponent', () => {
  let component: TestQuestionCreatorComponent;
  let fixture: ComponentFixture<TestQuestionCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestQuestionCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
