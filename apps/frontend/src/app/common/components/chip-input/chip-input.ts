import { Component, effect, input, signal, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chip-input',
  imports: [ReactiveFormsModule],
  templateUrl: './chip-input.html',
  styleUrl: './chip-input.scss',
})
export class ChipInput {
  /** Inputs & Outputs */
  values = input<string[]>([]);
  chipsChange = output<string[]>();

  /** Local reactive state */
  chips = signal<string[]>([]);
  inputControl = new FormControl('');

  constructor() {
    // Sync when parent input changes
    effect(() => {
      this.chips.set([...(this.values() ?? [])]);
    });
  }
  addChip() {
    const value = this.inputControl.value?.trim();
    if (value && !this.chips().includes(value)) {
      this.chips.update((arr) => [...arr, value]);
      this.emitChips();
    }
    this.inputControl.reset();
  }

  removeChip(index: number) {
    const updated = [...this.chips()];
    updated.splice(index, 1);
    this.chips.set(updated);
    this.emitChips();
  }

  private emitChips() {
    this.chipsChange.emit(this.chips());
  }
}
