import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePrecioComponent } from './detalle-precio.component';

describe('DetallePrecioComponent', () => {
  let component: DetallePrecioComponent;
  let fixture: ComponentFixture<DetallePrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePrecioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
