import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubaruComponent } from './subaru.component';

describe('SubaruComponent', () => {
  let component: SubaruComponent;
  let fixture: ComponentFixture<SubaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
