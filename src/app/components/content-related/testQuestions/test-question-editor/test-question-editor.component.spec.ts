import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionEditorComponent } from './test-question-editor.component';

describe('TestQuestionEditorComponent', () => {
  let component: TestQuestionEditorComponent;
  let fixture: ComponentFixture<TestQuestionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestQuestionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
