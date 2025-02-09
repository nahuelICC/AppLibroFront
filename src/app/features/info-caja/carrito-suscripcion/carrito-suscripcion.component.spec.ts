import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoSuscripcionComponent } from './carrito-suscripcion.component';

describe('CarritoSuscripcionComponent', () => {
  let component: CarritoSuscripcionComponent;
  let fixture: ComponentFixture<CarritoSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoSuscripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
