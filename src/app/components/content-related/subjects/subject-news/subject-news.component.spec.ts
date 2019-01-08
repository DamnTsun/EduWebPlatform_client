import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectNewsComponent } from './subject-news.component';

describe('SubjectNewsComponent', () => {
  let component: SubjectNewsComponent;
  let fixture: ComponentFixture<SubjectNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
