import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroCarritoComponent } from './cuadro-carrito.component';

describe('CuadroCarritoComponent', () => {
  let component: CuadroCarritoComponent;
  let fixture: ComponentFixture<CuadroCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroCarritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
