import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFromUserListComponent } from './message-from-user-list.component';

describe('MessageFromUserListComponent', () => {
  let component: MessageFromUserListComponent;
  let fixture: ComponentFixture<MessageFromUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageFromUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFromUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
