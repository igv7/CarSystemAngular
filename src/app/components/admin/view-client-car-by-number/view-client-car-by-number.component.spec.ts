import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientCarByNumberComponent } from './view-client-car-by-number.component';

describe('ViewClientCarByNumberComponent', () => {
  let component: ViewClientCarByNumberComponent;
  let fixture: ComponentFixture<ViewClientCarByNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClientCarByNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientCarByNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
