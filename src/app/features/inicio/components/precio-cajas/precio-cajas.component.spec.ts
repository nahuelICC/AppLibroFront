import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioCajasComponent } from './precio-cajas.component';

describe('PrecioCajasComponent', () => {
  let component: PrecioCajasComponent;
  let fixture: ComponentFixture<PrecioCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecioCajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecioCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
