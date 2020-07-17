import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllClientCarsByPriceUntilComponent } from './view-all-client-cars-by-price-until.component';

describe('ViewAllClientCarsByPriceUntilComponent', () => {
  let component: ViewAllClientCarsByPriceUntilComponent;
  let fixture: ComponentFixture<ViewAllClientCarsByPriceUntilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllClientCarsByPriceUntilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllClientCarsByPriceUntilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
