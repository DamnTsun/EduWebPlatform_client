import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestAttemptComponent } from './user-test-attempt.component';

describe('UserTestAttemptComponent', () => {
  let component: UserTestAttemptComponent;
  let fixture: ComponentFixture<UserTestAttemptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTestAttemptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTestAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
