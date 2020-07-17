import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceiptsByClientComponent } from './view-receipts-by-client.component';

describe('ViewReceiptsByClientComponent', () => {
  let component: ViewReceiptsByClientComponent;
  let fixture: ComponentFixture<ViewReceiptsByClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReceiptsByClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReceiptsByClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
