import { NgClass } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-slide-toggle',
  imports: [NgClass],
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.scss',
})
export class SlideToggle implements OnInit {
  /** Label for accessibility */
  id = input<string>('toggle-' + Math.random().toString(36).substring(2, 9));

  /** Initial checked state */
  checked = input.required<boolean>();
  // Internal signal to track state
  isChecked = signal<boolean>(false);
  label = input<string>('');

  styles = input<string>('');

  /** Emits when toggle changes */
  changed = output<boolean>();

  ngOnInit(): void {
    this.isChecked.set(this.checked());
  }
  toggle() {
    const newValue = !this.isChecked();
    this.isChecked.set(newValue);
    this.changed.emit(newValue);
  }
}
