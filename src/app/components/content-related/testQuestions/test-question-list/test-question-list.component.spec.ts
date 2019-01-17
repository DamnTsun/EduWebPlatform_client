import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionListComponent } from './test-question-list.component';

describe('TestQuestionListComponent', () => {
  let component: TestQuestionListComponent;
  let fixture: ComponentFixture<TestQuestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestQuestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
