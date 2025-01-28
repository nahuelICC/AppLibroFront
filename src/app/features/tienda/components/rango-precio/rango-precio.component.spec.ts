import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangoPrecioComponent } from './rango-precio.component';

describe('RangoPrecioComponent', () => {
  let component: RangoPrecioComponent;
  let fixture: ComponentFixture<RangoPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangoPrecioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangoPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
