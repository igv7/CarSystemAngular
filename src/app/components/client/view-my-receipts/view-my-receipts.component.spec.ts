import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyReceiptsComponent } from './view-my-receipts.component';

describe('ViewMyReceiptsComponent', () => {
  let component: ViewMyReceiptsComponent;
  let fixture: ComponentFixture<ViewMyReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMyReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMyReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
