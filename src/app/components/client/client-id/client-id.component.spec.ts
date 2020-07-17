import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIdComponent } from './client-id.component';

describe('ClientIdComponent', () => {
  let component: ClientIdComponent;
  let fixture: ComponentFixture<ClientIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
