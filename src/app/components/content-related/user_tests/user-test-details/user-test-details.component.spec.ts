import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestDetailsComponent } from './user-test-details.component';

describe('UserTestDetailsComponent', () => {
  let component: UserTestDetailsComponent;
  let fixture: ComponentFixture<UserTestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
