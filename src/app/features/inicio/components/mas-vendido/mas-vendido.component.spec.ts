import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasVendidoComponent } from './mas-vendido.component';

describe('MasVendidoComponent', () => {
  let component: MasVendidoComponent;
  let fixture: ComponentFixture<MasVendidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasVendidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasVendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
