import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarByNumberComponent } from './view-car-by-number.component';

describe('ViewCarByNumberComponent', () => {
  let component: ViewCarByNumberComponent;
  let fixture: ComponentFixture<ViewCarByNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCarByNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCarByNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
