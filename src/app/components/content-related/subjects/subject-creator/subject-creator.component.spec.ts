import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCreatorComponent } from './subject-creator.component';

describe('SubjectCreatorComponent', () => {
  let component: SubjectCreatorComponent;
  let fixture: ComponentFixture<SubjectCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
