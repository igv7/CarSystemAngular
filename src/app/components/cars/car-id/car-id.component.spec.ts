import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarIdComponent } from './car-id.component';

describe('CarIdComponent', () => {
  let component: CarIdComponent;
  let fixture: ComponentFixture<CarIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
