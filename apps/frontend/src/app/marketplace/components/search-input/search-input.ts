import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.html',
  styleUrls: ['./search-input.scss'],
})
export class SearchInput {
  @Input() placeholder = 'Search...';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() searchInput = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<void>(); // Renamed to avoid DOM event name

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  onSearch() {
    this.searchInput.emit(this.value);
  }

  onFocus() {
    this.inputFocus.emit();
  }
}
