import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroProductoComponent } from './cuadro-producto.component';

describe('CuadroProductoComponent', () => {
  let component: CuadroProductoComponent;
  let fixture: ComponentFixture<CuadroProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
