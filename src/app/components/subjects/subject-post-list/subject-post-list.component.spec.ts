import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPostListComponent } from './subject-post-list.component';

describe('SubjectPostListComponent', () => {
  let component: SubjectPostListComponent;
  let fixture: ComponentFixture<SubjectPostListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectPostListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
