import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicHomeComponent } from './topic-home.component';

describe('TopicHomeComponent', () => {
  let component: TopicHomeComponent;
  let fixture: ComponentFixture<TopicHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
