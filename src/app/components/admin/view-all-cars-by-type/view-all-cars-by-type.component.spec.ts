import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCarsByTypeComponent } from './view-all-cars-by-type.component';

describe('ViewAllCarsByTypeComponent', () => {
  let component: ViewAllCarsByTypeComponent;
  let fixture: ComponentFixture<ViewAllCarsByTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllCarsByTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCarsByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
