import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllClientCarsByTypeComponent } from './view-all-client-cars-by-type.component';

describe('ViewAllClientCarsByTypeComponent', () => {
  let component: ViewAllClientCarsByTypeComponent;
  let fixture: ComponentFixture<ViewAllClientCarsByTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllClientCarsByTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllClientCarsByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
