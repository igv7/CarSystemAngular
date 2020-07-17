import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllClientCarsByColorComponent } from './view-all-client-cars-by-color.component';

describe('ViewAllClientCarsByColorComponent', () => {
  let component: ViewAllClientCarsByColorComponent;
  let fixture: ComponentFixture<ViewAllClientCarsByColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllClientCarsByColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllClientCarsByColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
