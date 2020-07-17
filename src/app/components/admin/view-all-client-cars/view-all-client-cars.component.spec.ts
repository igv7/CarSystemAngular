import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllClientCarsComponent } from './view-all-client-cars.component';

describe('ViewAllClientCarsComponent', () => {
  let component: ViewAllClientCarsComponent;
  let fixture: ComponentFixture<ViewAllClientCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllClientCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllClientCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
