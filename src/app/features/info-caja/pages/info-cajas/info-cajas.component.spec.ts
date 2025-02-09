import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCajasComponent } from './info-cajas.component';

describe('InfoCajasComponent', () => {
  let component: InfoCajasComponent;
  let fixture: ComponentFixture<InfoCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
