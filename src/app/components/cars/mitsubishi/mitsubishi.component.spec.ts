import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitsubishiComponent } from './mitsubishi.component';

describe('MitsubishiComponent', () => {
  let component: MitsubishiComponent;
  let fixture: ComponentFixture<MitsubishiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitsubishiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitsubishiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
