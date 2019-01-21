import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSentToUserListComponent } from './message-sent-to-user-list.component';

describe('MessageSentToUserListComponent', () => {
  let component: MessageSentToUserListComponent;
  let fixture: ComponentFixture<MessageSentToUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSentToUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSentToUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
