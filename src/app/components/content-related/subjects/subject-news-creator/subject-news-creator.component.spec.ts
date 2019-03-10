import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectNewsCreatorComponent } from './subject-news-creator.component';

describe('SubjectNewsCreatorComponent', () => {
  let component: SubjectNewsCreatorComponent;
  let fixture: ComponentFixture<SubjectNewsCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectNewsCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectNewsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
