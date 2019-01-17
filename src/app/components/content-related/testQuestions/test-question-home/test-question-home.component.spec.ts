import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionHomeComponent } from './test-question-home.component';

describe('TestQuestionHomeComponent', () => {
  let component: TestQuestionHomeComponent;
  let fixture: ComponentFixture<TestQuestionHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestQuestionHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
