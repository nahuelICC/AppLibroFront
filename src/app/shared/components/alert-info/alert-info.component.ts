import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  styleUrls: ['./alert-info.component.css']
})
export class AlertInfoComponent implements OnInit, OnChanges {
  @Input() message: string = '';
  @Input() type: AlertType = 'success';
  @Input() isVisible: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.autoCloseAlert();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Cambios en AlertInfoComponent:', changes);
  }

  private autoCloseAlert() {
    if (this.isVisible) {
      setTimeout(() => {
        this.isVisible = false;
        this.cdRef.detectChanges();
      }, 2000);
    }
  }
}
