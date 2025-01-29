import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenaComponent } from './resena.component';

describe('ResenaComponent', () => {
  let component: ResenaComponent;
  let fixture: ComponentFixture<ResenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
