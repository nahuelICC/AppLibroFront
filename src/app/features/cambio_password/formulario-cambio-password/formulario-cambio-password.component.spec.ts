import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCambioPasswordComponent } from './formulario-cambio-password.component';

describe('FormularioCambioPasswordComponent', () => {
  let component: FormularioCambioPasswordComponent;
  let fixture: ComponentFixture<FormularioCambioPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCambioPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioCambioPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
