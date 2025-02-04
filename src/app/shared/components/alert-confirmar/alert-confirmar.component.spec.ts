import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertConfirmarComponent } from './alert-confirmar.component';

describe('AlertConfirmarComponent', () => {
  let component: AlertConfirmarComponent;
  let fixture: ComponentFixture<AlertConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertConfirmarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
