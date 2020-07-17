import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCarsByColorComponent } from './view-all-cars-by-color.component';

describe('ViewAllCarsByColorComponent', () => {
  let component: ViewAllCarsByColorComponent;
  let fixture: ComponentFixture<ViewAllCarsByColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllCarsByColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCarsByColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
