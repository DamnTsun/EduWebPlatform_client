import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicCreatorComponent } from './topic-creator.component';

describe('TopicCreatorComponent', () => {
  let component: TopicCreatorComponent;
  let fixture: ComponentFixture<TopicCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
