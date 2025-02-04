import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasarelaPagoComponent } from './pasarela-pago.component';

describe('PasarelaPagoComponent', () => {
  let component: PasarelaPagoComponent;
  let fixture: ComponentFixture<PasarelaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasarelaPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasarelaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
