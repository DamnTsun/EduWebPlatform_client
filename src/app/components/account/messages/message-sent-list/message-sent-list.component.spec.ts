import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSentListComponent } from './message-sent-list.component';

describe('MessageSentListComponent', () => {
  let component: MessageSentListComponent;
  let fixture: ComponentFixture<MessageSentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
