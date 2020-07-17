import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyBalanceComponent } from './view-my-balance.component';

describe('ViewMyBalanceComponent', () => {
  let component: ViewMyBalanceComponent;
  let fixture: ComponentFixture<ViewMyBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMyBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMyBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
