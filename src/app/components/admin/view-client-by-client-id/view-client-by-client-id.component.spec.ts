import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientByClientIdComponent } from './view-client-by-client-id.component';

describe('ViewClientByClientIdComponent', () => {
  let component: ViewClientByClientIdComponent;
  let fixture: ComponentFixture<ViewClientByClientIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClientByClientIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientByClientIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
