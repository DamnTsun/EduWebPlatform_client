import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectNewsEditorComponent } from './subject-news-editor.component';

describe('SubjectNewsEditorComponent', () => {
  let component: SubjectNewsEditorComponent;
  let fixture: ComponentFixture<SubjectNewsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectNewsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectNewsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
