import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyadirLibroComponent } from './anyadir-libro.component';

describe('AnyadirLibroComponent', () => {
  let component: AnyadirLibroComponent;
  let fixture: ComponentFixture<AnyadirLibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnyadirLibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnyadirLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
