import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MercedesComponent } from './mercedes.component';

describe('MercedesComponent', () => {
  let component: MercedesComponent;
  let fixture: ComponentFixture<MercedesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MercedesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MercedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
