import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCreatorComponent } from './test-creator.component';

describe('TestCreatorComponent', () => {
  let component: TestCreatorComponent;
  let fixture: ComponentFixture<TestCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
